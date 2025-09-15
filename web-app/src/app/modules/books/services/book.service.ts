import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book, BookCreateRequest, BookUpdateRequest, LegacyBook } from '../models/book.model';
import { AuthorService } from '../../authors/services/author.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly STORAGE_KEY = 'book_tracking_books';
  private booksSubject = new BehaviorSubject<Book[]>([]);

  constructor(private authorService: AuthorService) {
    this.loadBooksFromStorage();
  }

  // Observable for components to subscribe to
  get books$(): Observable<Book[]> {
    return this.booksSubject.asObservable();
  }

  // Get all books with author names populated
  getBooks(): Book[] {
    return this.booksSubject.value.map(book => this.populateAuthorNames(book));
  }

  // Get book by ID with author names populated
  getBookById(id: number): Book | null {
    const book = this.booksSubject.value.find(b => b.id === id);
    return book ? this.populateAuthorNames(book) : null;
  }

  // Get books by author ID
  getBooksByAuthor(authorId: number): Book[] {
    return this.booksSubject.value
      .filter(book => book.authorIds.includes(authorId))
      .map(book => this.populateAuthorNames(book));
  }

  // Get books by status
  getBooksByStatus(status: string): Book[] {
    return this.booksSubject.value
      .filter(book => book.status === status)
      .map(book => this.populateAuthorNames(book));
  }

  // Create new book
  createBook(bookData: BookCreateRequest): Book {
    const books = this.booksSubject.value;
    const newId = this.generateId();
    
    const newBook: Book = {
      ...bookData,
      id: newId,
      dateAdded: new Date().toISOString(),
    };

    const updatedBooks = [...books, newBook];
    this.saveBooksToStorage(updatedBooks);
    this.booksSubject.next(updatedBooks);
    
    return this.populateAuthorNames(newBook);
  }

  // Update existing book
  updateBook(bookData: BookUpdateRequest): Book | null {
    const books = this.booksSubject.value;
    const index = books.findIndex(b => b.id === bookData.id);
    
    if (index === -1) {
      return null;
    }

    const updatedBook: Book = {
      ...books[index],
      ...bookData,
    };

    const updatedBooks = [...books];
    updatedBooks[index] = updatedBook;
    
    this.saveBooksToStorage(updatedBooks);
    this.booksSubject.next(updatedBooks);
    
    return this.populateAuthorNames(updatedBook);
  }

  // Delete book
  deleteBook(id: number): boolean {
    const books = this.booksSubject.value;
    const filteredBooks = books.filter(b => b.id !== id);
    
    if (filteredBooks.length === books.length) {
      return false; // Book not found
    }

    this.saveBooksToStorage(filteredBooks);
    this.booksSubject.next(filteredBooks);
    return true;
  }

  // Search books by title or author name
  searchBooks(searchTerm: string): Book[] {
    const term = searchTerm.toLowerCase();
    return this.booksSubject.value
      .filter(book => {
        const titleMatch = book.title.toLowerCase().includes(term);
        const authorMatch = this.getAuthorNames(book.authorIds)
          .some(name => name.toLowerCase().includes(term));
        return titleMatch || authorMatch;
      })
      .map(book => this.populateAuthorNames(book));
  }

  // Get books by genre
  getBooksByGenre(genre: string): Book[] {
    return this.booksSubject.value
      .filter(book => book.genres.includes(genre))
      .map(book => this.populateAuthorNames(book));
  }

  // Get all unique genres from books
  getAllGenres(): string[] {
    const allGenres = this.booksSubject.value
      .flatMap(book => book.genres);
    return [...new Set(allGenres)].sort();
  }

  // Get books statistics
  getBookStats() {
    const books = this.booksSubject.value;
    const totalBooks = books.length;
    const readBooks = books.filter(b => b.status === 'Read').length;
    const currentlyReading = books.filter(b => b.status === 'Reading').length;
    const wantToRead = books.filter(b => b.status === 'Want to Read').length;
    const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0);
    const averageRating = books
      .filter(b => b.rating)
      .reduce((sum, book, _, arr) => sum + (book.rating || 0) / arr.length, 0);

    return {
      totalBooks,
      readBooks,
      currentlyReading,
      wantToRead,
      totalPages,
      averageRating: Number(averageRating.toFixed(1))
    };
  }

  // Migration helper: Convert legacy books to new format
  migrateLegacyBook(legacyBook: LegacyBook): Book {
    // Try to find matching author by name, or create placeholder
    const authors = this.authorService.getAuthors();
    let authorIds: number[] = [];

    // Simple name matching (in real app, you might want more sophisticated matching)
    const matchingAuthor = authors.find(author => 
      author.name.toLowerCase() === legacyBook.author.toLowerCase()
    );

    if (matchingAuthor && matchingAuthor.id) {
      authorIds = [matchingAuthor.id];
    } else {
      // Create new author for unknown authors
      const newAuthor = this.authorService.addAuthor({
        name: legacyBook.author,
        biography: `Author migrated from legacy book: ${legacyBook.title}`
      });
      if (newAuthor.id) {
        authorIds = [newAuthor.id];
      }
    }

    return {
      ...legacyBook,
      authorIds,
      authorNames: [legacyBook.author]
    };
  }

  // Private helper methods
  private populateAuthorNames(book: Book): Book {
    return {
      ...book,
      authorNames: this.getAuthorNames(book.authorIds)
    };
  }

  private getAuthorNames(authorIds: number[]): string[] {
    const authors = this.authorService.getAuthors();
    return authorIds
      .map(id => authors.find(author => author.id === id)?.name)
      .filter(name => name !== undefined) as string[];
  }

  private generateId(): number {
    const books = this.booksSubject.value;
    return books.length > 0 ? Math.max(...books.map(b => b.id || 0)) + 1 : 1;
  }

  private loadBooksFromStorage(): void {
    try {
      const storedBooks = localStorage.getItem(this.STORAGE_KEY);
      if (storedBooks) {
        const books: Book[] = JSON.parse(storedBooks);
        this.booksSubject.next(books);
      } else {
        // Initialize with sample data
        this.initializeSampleData();
      }
    } catch (error) {
      console.error('Error loading books from storage:', error);
      this.initializeSampleData();
    }
  }

  private saveBooksToStorage(books: Book[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books));
    } catch (error) {
      console.error('Error saving books to storage:', error);
    }
  }

  private initializeSampleData(): void {
    // Get some author IDs from the author service
    const authors = this.authorService.getAuthors();
    const sampleBooks: Book[] = [];

    if (authors.length > 0) {
      sampleBooks.push(
        {
          id: 1,
          title: 'Atomic Habits',
          authorIds: authors.filter(a => a.name === 'James Clear').map(a => a.id!),
          genres: ['Self-help', 'Non-Fiction'],
          pages: 320,
          status: 'Read',
          rating: 5,
          dateAdded: new Date('2024-01-15').toISOString(),
          cover: 'assets/images/product-not-found.png'
        },
        {
          id: 2,
          title: 'The Fellowship of the Ring',
          authorIds: authors.filter(a => a.name.includes('Tolkien')).map(a => a.id!),
          genres: ['Fantasy', 'Adventure'],
          pages: 479,
          status: 'Reading',
          rating: 4,
          dateAdded: new Date('2024-02-01').toISOString(),
          cover: 'assets/images/product-not-found.png'
        }
      );
    }

    this.booksSubject.next(sampleBooks);
    this.saveBooksToStorage(sampleBooks);
  }
}
