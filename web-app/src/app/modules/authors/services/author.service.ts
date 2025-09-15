import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Author, AuthorStats, AuthorCreateRequest, AuthorUpdateRequest } from '../models/author.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private authorsSubject = new BehaviorSubject<Author[]>([
    // Some default authors
    {
      id: 1,
      name: 'J.K. Rowling',
      biography: 'British author best known for the Harry Potter fantasy series.',
      photoUrl: '',
      birthDate: new Date('1965-07-31'),
      nationality: 'British',
      website: 'https://www.jkrowling.com',
      socialLinks: {
        twitter: '@jk_rowling',
        goodreads: 'https://www.goodreads.com/author/show/1077326.J_K_Rowling'
      },
      genres: ['Fantasy', 'Young Adult', 'Children'],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      name: 'Patrick Rothfuss',
      biography: 'American fantasy author known for The Kingkiller Chronicle series.',
      photoUrl: '',
      birthDate: new Date('1973-06-06'),
      nationality: 'American',
      website: 'https://www.patrickrothfuss.com',
      socialLinks: {
        twitter: '@PatrickRothfuss',
        goodreads: 'https://www.goodreads.com/author/show/108424.Patrick_Rothfuss'
      },
      genres: ['Fantasy', 'Epic Fantasy'],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 3,
      name: 'Frank Herbert',
      biography: 'American science fiction author, best known for the novel Dune and its sequels.',
      photoUrl: '',
      birthDate: new Date('1920-10-08'),
      deathDate: new Date('1986-02-11'),
      nationality: 'American',
      genres: ['Science Fiction', 'Space Opera'],
      isActive: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 4,
      name: 'James Clear',
      biography: 'American author and speaker focused on habits, decision making, and continuous improvement.',
      photoUrl: '',
      birthDate: new Date('1986-01-01'),
      nationality: 'American',
      website: 'https://jamesclear.com',
      socialLinks: {
        twitter: '@JamesClear',
        goodreads: 'https://www.goodreads.com/author/show/7327369.James_Clear'
      },
      genres: ['Self-help', 'Non-Fiction', 'Psychology'],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ]);

  private storageKey = 'bookTracking_authors';

  constructor() {
    this.loadFromStorage();
  }

  // Observable for components to subscribe to
  get authors$(): Observable<Author[]> {
    return this.authorsSubject.asObservable();
  }

  // Get current authors value
  getAuthors(): Author[] {
    return this.authorsSubject.value;
  }

  // Get author options for dropdowns
  getAuthorOptions(): { label: string; value: number }[] {
    return this.authorsSubject.value.map((author) => ({
      label: author.name,
      value: author.id!,
    }));
  }

  // Get author by ID
  getAuthorById(id: number): Author | undefined {
    return this.authorsSubject.value.find((author) => author.id === id);
  }

  // Get author by name
  getAuthorByName(name: string): Author | undefined {
    return this.authorsSubject.value.find(
      (author) => author.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Search authors
  searchAuthors(query: string): Author[] {
    const searchTerm = query.toLowerCase();
    return this.authorsSubject.value.filter(
      (author) =>
        author.name.toLowerCase().includes(searchTerm) ||
        author.biography?.toLowerCase().includes(searchTerm) ||
        author.nationality?.toLowerCase().includes(searchTerm) ||
        author.genres?.some(genre => genre.toLowerCase().includes(searchTerm))
    );
  }

  // Add new author
  addAuthor(authorData: AuthorCreateRequest): Author {
    const existingAuthor = this.getAuthorByName(authorData.name);
    if (existingAuthor) {
      throw new Error(`Author "${authorData.name}" already exists`);
    }

    const currentAuthors = this.authorsSubject.value;
    const newId = Math.max(...currentAuthors.map((a) => a.id || 0), 0) + 1;

    const newAuthor: Author = {
      id: newId,
      ...authorData,
      name: authorData.name.trim(),
      totalBooks: 0,
      averageRating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedAuthors = [...currentAuthors, newAuthor];
    this.authorsSubject.next(updatedAuthors);
    this.saveToStorage();

    return newAuthor;
  }

  // Update author
  updateAuthor(authorData: AuthorUpdateRequest): boolean {
    const currentAuthors = this.authorsSubject.value;
    const authorIndex = currentAuthors.findIndex((author) => author.id === authorData.id);

    if (authorIndex === -1) {
      return false;
    }

    // Check if new name already exists (excluding current author)
    const existingAuthor = currentAuthors.find(
      (author) =>
        author.id !== authorData.id && 
        author.name.toLowerCase() === authorData.name.toLowerCase()
    );

    if (existingAuthor) {
      throw new Error(`Author "${authorData.name}" already exists`);
    }

    const updatedAuthors = [...currentAuthors];
    updatedAuthors[authorIndex] = {
      ...updatedAuthors[authorIndex],
      ...authorData,
      name: authorData.name.trim(),
      updatedAt: new Date(),
    };

    this.authorsSubject.next(updatedAuthors);
    this.saveToStorage();
    return true;
  }

  // Remove author
  removeAuthor(id: number): boolean {
    const currentAuthors = this.authorsSubject.value;
    const updatedAuthors = currentAuthors.filter((author) => author.id !== id);

    if (updatedAuthors.length !== currentAuthors.length) {
      this.authorsSubject.next(updatedAuthors);
      this.saveToStorage();
      return true;
    }

    return false;
  }

  // Check if author exists
  authorExists(name: string, excludeId?: number): boolean {
    return this.authorsSubject.value.some(
      (author) => 
        author.name.toLowerCase() === name.toLowerCase() && 
        (!excludeId || author.id !== excludeId)
    );
  }

  // Get authors by genre
  getAuthorsByGenre(genre: string): Author[] {
    return this.authorsSubject.value.filter(
      (author) => author.genres?.includes(genre)
    );
  }

  // Get active/inactive authors
  getActiveAuthors(): Author[] {
    return this.authorsSubject.value.filter((author) => author.isActive !== false);
  }

  getInactiveAuthors(): Author[] {
    return this.authorsSubject.value.filter((author) => author.isActive === false);
  }

  // Calculate author statistics (would integrate with book service in real implementation)
  calculateAuthorStats(authorId: number): AuthorStats {
    // This would typically query the book service to get actual stats
    // For now, returning mock data
    return {
      totalBooks: 0,
      readBooks: 0,
      unreadBooks: 0,
      averageRating: 0,
      totalPages: 0,
      favoriteGenres: [],
      readingProgress: {
        completed: 0,
        reading: 0,
        wantToRead: 0,
        onHold: 0,
      },
    };
  }

  // Update author book statistics (to be called when books are added/updated)
  updateAuthorStats(authorId: number, stats: Partial<AuthorStats>): void {
    const currentAuthors = this.authorsSubject.value;
    const authorIndex = currentAuthors.findIndex((author) => author.id === authorId);

    if (authorIndex !== -1) {
      const updatedAuthors = [...currentAuthors];
      updatedAuthors[authorIndex] = {
        ...updatedAuthors[authorIndex],
        totalBooks: stats.totalBooks || updatedAuthors[authorIndex].totalBooks || 0,
        averageRating: stats.averageRating || updatedAuthors[authorIndex].averageRating || 0,
        updatedAt: new Date(),
      };

      this.authorsSubject.next(updatedAuthors);
      this.saveToStorage();
    }
  }

  // Get authors sorted by various criteria
  getAuthorsSorted(sortBy: 'name' | 'totalBooks' | 'averageRating' | 'createdAt' = 'name'): Author[] {
    const authors = [...this.authorsSubject.value];
    
    return authors.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'totalBooks':
          return (b.totalBooks || 0) - (a.totalBooks || 0);
        case 'averageRating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'createdAt':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });
  }

  // Private methods for persistence
  private saveToStorage(): void {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.authorsSubject.value)
      );
    } catch (error) {
      console.error('Failed to save authors to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsedAuthors = JSON.parse(stored);
        // Ensure dates are properly parsed
        const authorsWithDates = parsedAuthors.map((author: any) => ({
          ...author,
          birthDate: author.birthDate ? new Date(author.birthDate) : undefined,
          deathDate: author.deathDate ? new Date(author.deathDate) : undefined,
          createdAt: new Date(author.createdAt),
          updatedAt: new Date(author.updatedAt),
        }));
        this.authorsSubject.next(authorsWithDates);
      }
    } catch (error) {
      console.error('Failed to load authors from localStorage:', error);
      // Keep default authors if loading fails
    }
  }
}
