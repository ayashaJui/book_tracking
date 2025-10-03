import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BookService } from '../../services/book.service';
import { AuthorService } from '../../../authors/services/author.service';
import { PublisherService } from '../../../publishers/services/publisher.service';
import { GenreService } from '../../../shared/services/genre.service';
import { Book, BookAuthor } from '../../models/book.model';
import { Author } from '../../../authors/models/author.model';
import { Publisher } from '../../../publishers/models/publisher.model';

interface Quote {
  id: number;
  quote: string;
  pageNumber?: number;
  tags: string[];
  dateAdded: Date;
  notes?: string;
  favorite?: boolean;
}

interface ReadingLog {
  id: number;
  startDate: Date | null;
  finishDate: Date | null;
  status: 'Want to Read' | 'Reading' | 'Finished' | 'On Hold';
  estimatedTimeHrs?: number;
  actualTimeHrs?: number;
}

interface Review {
  id: number;
  rating: number;
  takeaways: string;
  wouldRecommend: boolean | null;
  date: Date;
  anonymous?: boolean;
}

interface SeriesInfo {
  id: number;
  title: string;
  orderInSeries: number;
  totalBooks: number;
}

interface SeriesBook {
  id: number;
  title: string;
  orderInSeries: number;
  status: 'Not Released' | 'Want to Read' | 'Reading' | 'Finished' | 'On Hold';
  isCurrent?: boolean;
}

@Component({
  selector: 'app-book-details',
  standalone: false,
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
  providers: [MessageService]
})
export class BookDetails implements OnInit {
  book: Book = {
    id: 1,
    title: "The Name of the Wind",
    authorIds: [3],
    authorNames: ["Patrick Rothfuss"],
    genres: ["Fantasy", "Adventure", "Magic", "Coming of Age"],
    pages: 662,
    status: "Read",
    cover: "/assets/images/product-not-found.png",
    dateAdded: "2024-01-10",
    price: 16.99,
    source: "Amazon",
    rating: 5,
    publisherId: 1,
    publisherName: "DAW Books",
    editionCount: 5,
    seriesId: 1,
    seriesName: "The Kingkiller Chronicle",
    seriesOrder: 1
  };
  activeTab = 'details';

  // Additional book details not in the Book model but needed for display
  bookDetails = {
    notes: "An absolutely stunning piece of fantasy literature. Rothfuss weaves a masterful tale of Kvothe, a legendary figure whose life story unfolds through beautiful prose and rich world-building. The magic system is unique and the character development is exceptional.",
    startDate: "2024-01-10",
    finishDate: "2024-01-18",
    readingSpeed: 41,
    estimatedTime: 16,
    actualTime: 16.2,
    purchaseDate: "2024-01-08"
  };

  // Edit book properties
  showEditBookDialog = false;
  editingBook: Book = {
    title: '',
    authorIds: [],
    genres: []
  };
  selectedAuthors: Author[] = [];
  authorOptions: Author[] = [];
  publisherOptions: { label: string; value: number | string }[] = [];
  selectedPublisherId: number | string | null = null;

  statuses = ['Want to Read', 'Reading', 'Read', 'On Hold'];
  quoteTags = ['Funny', 'Inspiring', 'Philosophical', 'Wisdom', 'Magic', 'Storytelling', 'Truth', 'Dark', 'Identity', 'Psychology'];
  tags = ['Fiction', 'Non-Fiction', 'Biography', 'Self-Help', 'Classic', 'Fantasy', 'Science Fiction', 'Romance', 'Mystery', 'Thriller'];
  genreOptions: { label: string; value: string }[] = [];

  // Additional properties for display (not in Book model)
  mockQuotes: Quote[] = [];
  mockReadingLogs: ReadingLog[] = [];
  mockReviews: Review[] = [];
  mockSeriesInfo: SeriesInfo | null = null;
  mockSeriesBooks: SeriesBook[] = [];
  isWishlisted = false;

  // Publisher expansion state
  showPublisherDetails = false;

  // Navigation and action methods
  navigateToSeries(id: number) {
    if (id) {
      this.router.navigate(['/series', id]);
    }
  }

  openAddToSeriesDialog() {
    this.messageService.add({
      severity: 'info',
      summary: 'Feature Coming Soon',
      detail: 'Add to Series functionality will be available soon!'
    });
  }

  viewAllSeries() {
    this.router.navigate(['/series']);
  }

  constructor(
    private router: Router,
    private messageService: MessageService,
    private bookService: BookService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private genreService: GenreService
  ) { }

  ngOnInit() {
    this.loadGenreOptions();
    this.loadPublisherOptions();
    this.loadAuthorOptions();

    // Enhanced mock data for demonstration
    this.book = {
      id: 1,
      title: 'The Name of the Wind',
      authorIds: [3], // Patrick Rothfuss
      authorNames: ['Patrick Rothfuss'],
      genres: ['Fantasy', 'Adventure', 'Magic', 'Coming of Age'],
      customTags: ['comfort-read', 'reread-worthy', 'emotional', 'page-turner'], // Example custom tags
      price: 16.99,
      source: 'Amazon',
      status: 'Read',
      pages: 662,
      cover: '/assets/images/product-not-found.png',
      rating: 5,
      publisherId: 1,
      publisherName: 'DAW Books',
      editionCount: 5,
      seriesId: 1,
      seriesName: 'The Kingkiller Chronicle',
      seriesOrder: 1,
      dateAdded: '2024-01-10'
    };

    // Enhanced book details with more comprehensive data
    this.bookDetails = {
      notes: "An absolutely stunning piece of fantasy literature. Rothfuss weaves a masterful tale of Kvothe, a legendary figure whose life story unfolds through beautiful prose and rich world-building. The magic system is unique and the character development is exceptional. This book sets up an incredible trilogy that fantasy fans should not miss.",
      startDate: "2024-01-10",
      finishDate: "2024-01-18",
      readingSpeed: 41, // pages per hour
      estimatedTime: 16,
      actualTime: 16.2,
      purchaseDate: "2024-01-08"
    };

    // Set wishlisted status
    this.isWishlisted = false; // Already read, so not in wishlist

    // Comprehensive mock quotes showing variety
    this.mockQuotes = [
      {
        id: 1,
        quote: 'Words are pale shadows of forgotten names. As names have power, words have power. Words can light fires in the minds of men. Words can wring tears from the hardest hearts.',
        pageNumber: 156,
        tags: ['Inspiring', 'Philosophical', 'Magic'],
        dateAdded: new Date('2024-01-12'),
        favorite: true,
        notes: 'This quote perfectly captures the theme of the power of storytelling and naming that runs throughout the book.'
      },
      {
        id: 2,
        quote: 'It is the questions we cannot answer that teach us the most. They teach us how to think. If you give a man an answer, all he gains is a little fact. But give him a question and he will look for his own answers.',
        pageNumber: 242,
        tags: ['Philosophical', 'Wisdom'],
        dateAdded: new Date('2024-01-14'),
        favorite: true,
        notes: 'Kilvin\'s wisdom about learning and curiosity.'
      },
      {
        id: 3,
        quote: 'You have to be a bit of a liar to tell a story the right way.',
        pageNumber: 394,
        tags: ['Storytelling', 'Truth'],
        dateAdded: new Date('2024-01-16'),
        favorite: false,
        notes: 'Kvothe reflecting on the nature of storytelling.'
      },
      {
        id: 4,
        quote: 'The truth is that the world is always ending. The end of the world is a daily occurrence.',
        pageNumber: 445,
        tags: ['Philosophical', 'Dark'],
        dateAdded: new Date('2024-01-17'),
        favorite: false
      },
      {
        id: 5,
        quote: 'We understand how dangerous a mask can be. We all become what we pretend to be.',
        pageNumber: 572,
        tags: ['Identity', 'Psychology'],
        dateAdded: new Date('2024-01-18'),
        favorite: true,
        notes: 'Powerful insight into human nature and identity.'
      }
    ];

    // Enhanced reading logs showing progression
    this.mockReadingLogs = [
      {
        id: 1,
        startDate: new Date('2024-01-10'),
        finishDate: new Date('2024-01-18'),
        status: 'Finished',
        estimatedTimeHrs: 16,
        actualTimeHrs: 16.2,
      },
      {
        id: 2,
        startDate: new Date('2023-11-15'),
        finishDate: new Date('2023-11-20'),
        status: 'Finished',
        estimatedTimeHrs: 15,
        actualTimeHrs: 14.5,
      }
    ];

    // Comprehensive review data
    this.mockReviews = [
      {
        id: 1,
        rating: 5,
        takeaways: 'This book completely exceeded my expectations. Rothfuss has created a rich, immersive world with incredible attention to detail. The magic system is unique and well-thought-out, the character development is exceptional, and the prose is simply beautiful. Kvothe is a complex and fascinating protagonist whose story draws you in from the very first page. The way the story is structured as a tale within a tale adds another layer of depth. My only complaint is that I now have to wait for the next book! Highly recommended for fantasy lovers and anyone who appreciates masterful storytelling.',
        wouldRecommend: true,
        date: new Date('2024-01-19'),
        anonymous: false
      },
      {
        id: 2,
        rating: 4,
        takeaways: 'Second read-through and it\'s even better than I remembered. You catch so many subtle details and foreshadowing that you miss the first time. The worldbuilding is incredibly deep.',
        wouldRecommend: true,
        date: new Date('2023-11-21'),
        anonymous: false
      }
    ];

    // Enhanced series information
    this.mockSeriesInfo = {
      id: 1,
      title: 'The Kingkiller Chronicle',
      orderInSeries: 1,
      totalBooks: 3,
    };

    // Complete series book list with realistic statuses
    this.mockSeriesBooks = [
      {
        id: 1,
        title: 'The Name of the Wind',
        orderInSeries: 1,
        status: 'Finished',
        isCurrent: true,
      },
      {
        id: 2,
        title: 'The Wise Man\'s Fear',
        orderInSeries: 2,
        status: 'Reading',
        isCurrent: false,
      },
      {
        id: 3,
        title: 'The Doors of Stone',
        orderInSeries: 3,
        status: 'Want to Read',
        isCurrent: false,
      },
    ];
  }

  loadGenreOptions() {
    this.genreOptions = this.genreService.getGenreOptions();
  }

  loadPublisherOptions() {
    const publishers = this.publisherService.getPublishers();
    this.publisherOptions = [
      { label: '+ Add New Publisher', value: 'add_new' },
      ...publishers.map(publisher => ({
        label: publisher.name,
        value: publisher.id!
      }))
    ];
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  goToAuthor(authorId: number) {
    this.router.navigate(['/authors', authorId]);
  }

  toggleWishlist() {
    this.isWishlisted = !this.isWishlisted;
  }

  // Edit Book functionality
  openEditBookDialog() {
    // Navigate to edit book page
    this.router.navigate(['/books/edit-book', this.book.id]);
  }

  onAuthorsChange(authors: Author[]) {
    this.selectedAuthors = authors;
    this.editingBook.authorIds = authors.map(author => author.id!);
  }

  saveBookChanges() {
    if (this.editingBook.title && this.editingBook.title.trim()) {
      // Update publisher info
      if (typeof this.selectedPublisherId === 'number') {
        this.editingBook.publisherId = this.selectedPublisherId;
        const publisher = this.publisherService.getPublisherById(this.selectedPublisherId);
        this.editingBook.publisherName = publisher?.name;
      }

      // Update author info
      this.editingBook.authorIds = this.selectedAuthors.map(author => author.id!);
      this.editingBook.authorNames = this.selectedAuthors.map(author => author.name);

      // In a real app, call bookService.updateBook
      // const updatedBook = this.bookService.updateBook(this.editingBook);

      // For now, just update the local book object
      this.book = { ...this.editingBook };

      this.showEditBookDialog = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Book Updated',
        detail: `${this.book.title} has been updated successfully.`,
        life: 3000,
      });
    }
  }

  cancelEditBook() {
    this.showEditBookDialog = false;
    this.editingBook = {
      title: '',
      authorIds: [],
      genres: []
    };
    this.selectedAuthors = [];
    this.selectedPublisherId = null;
  }

  getSeriesBooks() {
    return this.mockSeriesBooks;
  }

  // Publisher-related methods
  getSelectedPublisher(): Publisher | null {
    if (this.book?.publisherId) {
      let publisher = this.publisherService.getPublisherById(this.book.publisherId);

      // If publisher doesn't exist, create a mock one for demo purposes
      if (!publisher && this.book.publisherId === 1) {
        publisher = {
          id: 1,
          name: 'DAW Books',
          location: 'New York, USA',
          website: 'https://www.dawbooks.com',
          description: 'DAW Books is an American science fiction and fantasy publisher, founded by Donald A. Wollheim. Known for publishing works by acclaimed authors like Mercedes Lackey, Tanya Huff, and Patrick Rothfuss.',
          specializedGenres: ['Science Fiction', 'Fantasy', 'Urban Fantasy', 'Epic Fantasy'],
          bookCount: 12
        };
      }

      return publisher;
    }
    return null;
  }

  viewPublisherDetails(publisherId: number) {
    this.router.navigate(['/publishers/details', publisherId]);
  }

  getPublisherBookCount(): number {
    const publisher = this.getSelectedPublisher();
    if (!publisher?.id) return 0;
    return this.bookService.getBooksByPublisher(publisher.id).length;
  }

  getPublisherOwnedCount(): number {
    const publisher = this.getSelectedPublisher();
    if (!publisher?.id) return 0;
    // This would need to check editions for ownership
    // For now, returning a placeholder
    return Math.floor(this.getPublisherBookCount() * 0.7); // Assume 70% owned
  }

  togglePublisherDetails() {
    this.showPublisherDetails = !this.showPublisherDetails;

    // Add user feedback
    if (this.showPublisherDetails) {
      console.log('Publisher details expanded');
    } else {
      console.log('Publisher details collapsed');
    }
  }

  navigateToBook(bookId: number) {
    if (bookId && bookId !== this.book.id) {
      this.router.navigate(['/books', bookId]);
    }
  }

  getPublisherBooks(): any[] {
    const publisher = this.getSelectedPublisher();
    if (!publisher?.id) return [];

    // Mock books for demo purposes
    if (publisher.id === 1) {
      return [
        {
          id: 2,
          title: 'The Wise Man\'s Fear',
          author: 'Patrick Rothfuss',
          status: 'Want to Read'
        },
        {
          id: 10,
          title: 'The Last Wish',
          author: 'Andrzej Sapkowski',
          status: 'Completed'
        },
        {
          id: 11,
          title: 'Blood of Elves',
          author: 'Andrzej Sapkowski',
          status: 'Reading'
        },
        {
          id: 15,
          title: 'The Way of Kings',
          author: 'Brandon Sanderson',
          status: 'Completed'
        }
      ];
    }

    // Get books from this publisher (excluding current book)
    const publisherBooks = this.bookService.getBooksByPublisher(publisher.id)
      .filter(book => book.id !== this.book.id)
      .slice(0, 5); // Limit to 5 for better UI

    return publisherBooks;
  }

  private loadAuthorOptions() {
    this.authorOptions = this.authorService.getAuthors();
  }

  formatAuthorsWithRoles(book: Book): string {
    if (book.authors && book.authors.length > 0) {
      return book.authors.map(author => `${author.authorName || 'Unknown'} (${author.role})`).join(', ');
    } else if (book.authorNames && book.authorNames.length > 0) {
      // Fallback for books without role information
      return book.authorNames.join(', ');
    }
    return 'Unknown Author';
  }

  getAuthorsWithRoles(book: Book): BookAuthor[] {
    return book.authors || [];
  }

  // Image upload methods
  onImageUploaded(imageUrl: string) {
    // Update the book's cover URL
    this.book.cover = imageUrl;

    // Update the book in the service if you want persistence
    if (this.book.id) {
      const updateRequest = {
        id: this.book.id,
        cover: imageUrl
      };
      // Note: You might need to add a method to BookService to update just the cover
      // For now, we'll just update the local book object
    }
  }

  onImageRemoved() {
    // Remove the book's cover URL
    this.book.cover = undefined;

    // Update the book in the service if you want persistence
    if (this.book.id) {
      const updateRequest = {
        id: this.book.id,
        cover: undefined
      };
      // Note: You might need to add a method to BookService to update just the cover
      // For now, we'll just update the local book object
    }
  }
}
