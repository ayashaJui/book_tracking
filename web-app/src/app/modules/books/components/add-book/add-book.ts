import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Book, BookCreateRequest } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { Series } from '../../../series/models/series.model';
import { SeriesService } from '../../../series/services/series.service';
import { GenreService } from '../../../shared/services/genre.service';
import { AuthorService } from '../../../authors/services/author.service';
import { Author } from '../../../authors/models/author.model';
import { PublisherService } from '../../../publishers/services/publisher.service';
import { Publisher } from '../../../publishers/models/publisher.model';

@Component({
  selector: 'app-add-book',
  standalone: false,
  templateUrl: './add-book.html',
  styleUrl: './add-book.scss',
})
export class AddBook implements OnInit {
  newBook: Book = {
    title: '',
    authorIds: [],
    genres: [],
    status: undefined,
    pages: undefined,
    price: undefined,
    source: '',
    seriesName: '',
    seriesId: undefined,
    seriesOrder: undefined,
  };

  // Selected authors for the book
  selectedAuthors: Author[] = [];

  // Publisher related properties
  publisherOptions: { label: string; value: number | string }[] = [];
  selectedPublisherId: number | string | null = null;
  showAddPublisherDialog: boolean = false;
  newPublisherData = {
    name: '',
    location: '',
    website: '',
    description: ''
  };

  // Series related properties
  seriesOptions: { label: string; value: number }[] = [];
  selectedSeriesId: number | null = null;
  isPartOfSeries: boolean = false;
  availableSeriesOrders: number[] = [];
  showCreateNewSeries: boolean = false;
  newSeriesData = {
    title: '',
    author: '',
    totalBooks: 1,
    genres: [] as string[],
  };

  statusOptions = [
    { label: 'Want to Read', value: 'Want to Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Read', value: 'Read' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  genreOptions: { label: string; value: string }[] = [];

  // Add author dialog properties
  showAddAuthorDialog: boolean = false;
  newAuthorData = {
    name: '',
    biography: '',
    birthDate: null as Date | null,
    nationality: '',
    genres: [] as string[],
    isAlive: true
  };

  constructor(
    private location: Location,
    private router: Router,
    private seriesService: SeriesService,
    private genreService: GenreService,
    private bookService: BookService,
    private authorService: AuthorService,
    private publisherService: PublisherService
  ) {}

  ngOnInit() {
    this.loadSeriesOptions();
    this.loadGenreOptions();
    this.loadPublisherOptions();
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

  onAuthorsChange(authors: Author[]) {
    this.selectedAuthors = authors;
    this.newBook.authorIds = authors.map(a => a.id!).filter(id => id !== undefined);
  }

  onAddNewAuthor() {
    // Open the add author dialog
    this.showAddAuthorDialog = true;
  }

  onViewAuthor(author: Author) {
    // Navigate to author details page
    if (author.id) {
      this.router.navigate(['/authors', author.id]);
    }
  }

  onAddAuthorDialogSave() {
    if (this.newAuthorData.name.trim()) {
      // Create new author object
      const newAuthor: Author = {
        name: this.newAuthorData.name.trim(),
        biography: this.newAuthorData.biography,
        birthDate: this.newAuthorData.birthDate || undefined,
        nationality: this.newAuthorData.nationality,
        genres: this.newAuthorData.genres,
        isActive: this.newAuthorData.isAlive,
        totalBooks: 0,
        averageRating: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add the author using the service
      this.authorService.addAuthor(newAuthor);

      // Add the newly created author to the selected authors
      if (newAuthor.id) {
        this.selectedAuthors = [...this.selectedAuthors, newAuthor];
        this.newBook.authorIds = this.selectedAuthors.map(a => a.id!).filter(id => id !== undefined);
      }

      // Close dialog and reset form
      this.showAddAuthorDialog = false;
      this.resetNewAuthorData();
    }
  }

  onAddAuthorDialogCancel() {
    this.showAddAuthorDialog = false;
    this.resetNewAuthorData();
  }

  private resetNewAuthorData() {
    this.newAuthorData = {
      name: '',
      biography: '',
      birthDate: null,
      nationality: '',
      genres: [],
      isAlive: true
    };
  }

  onGenreCreated(genreName: string) {
    // Refresh genre options when a new genre is created
    this.loadGenreOptions();
  }

  // Getter for series order options
  get seriesOrderOptions() {
    return this.availableSeriesOrders.map((order) => ({
      label: `Book ${order}`,
      value: order,
    }));
  }

  loadSeriesOptions() {
    this.seriesOptions = this.seriesService.getSeriesOptions();
  }

  onSeriesToggle() {
    if (!this.isPartOfSeries) {
      this.selectedSeriesId = null;
      this.newBook.seriesId = undefined;
      this.newBook.seriesName = '';
      this.newBook.seriesOrder = undefined;
      this.availableSeriesOrders = [];
    }
  }

  onSeriesChange() {
    if (this.selectedSeriesId) {
      const series = this.seriesService.getSeriesById(this.selectedSeriesId);
      if (series) {
        this.newBook.seriesId = this.selectedSeriesId;
        this.newBook.seriesName = series.title;

        // Generate available positions in the series
        this.updateAvailableSeriesOrders(series);

        // Auto-fill author if no authors selected and series has author
        if (this.selectedAuthors.length === 0 && series.author) {
          // Try to find matching author in our author system
          const authors = this.authorService.getAuthors();
          const matchingAuthor = authors.find(author => 
            author.name.toLowerCase() === series.author.toLowerCase()
          );
          if (matchingAuthor) {
            this.selectedAuthors = [matchingAuthor];
            this.newBook.authorIds = [matchingAuthor.id!];
          }
        }
      }
    } else {
      this.newBook.seriesId = undefined;
      this.newBook.seriesName = '';
      this.newBook.seriesOrder = undefined;
      this.availableSeriesOrders = [];
    }
  }

  updateAvailableSeriesOrders(series: Series) {
    // Get existing order positions
    const existingOrders = series.books
      .map((book) => book.orderInSeries)
      .filter((order) => order !== undefined) as number[];

    // Generate available positions (1 to totalBooks + 1 for new books)
    const maxOrder = Math.max(series.totalBooks, ...existingOrders, 0);
    this.availableSeriesOrders = [];

    for (let i = 1; i <= maxOrder + 1; i++) {
      this.availableSeriesOrders.push(i);
    }
  }

  toggleCreateNewSeries() {
    this.showCreateNewSeries = !this.showCreateNewSeries;
    if (this.showCreateNewSeries) {
      // Pre-fill with current book's first author
      if (this.selectedAuthors.length > 0) {
        this.newSeriesData.author = this.selectedAuthors[0].name;
      }
    }
  }

  createNewSeries() {
    if (this.newSeriesData.title && this.newSeriesData.author) {
      const newSeries: Series = {
        title: this.newSeriesData.title,
        author: this.newSeriesData.author,
        totalBooks: this.newSeriesData.totalBooks,
        readBooks: 0,
        genres: this.newSeriesData.genres,
        books: [],
      };

      this.seriesService.addSeries(newSeries);
      this.loadSeriesOptions();

      // Select the newly created series
      this.selectedSeriesId = newSeries.id!;
      this.onSeriesChange();

      // Reset new series form
      this.showCreateNewSeries = false;
      this.newSeriesData = {
        title: '',
        author: '',
        totalBooks: 1,
        genres: [],
      };
    }
  }

  addBook() {
    console.log('Book added:', this.newBook);

    // Add publisher ID if selected
    if (this.selectedPublisherId && typeof this.selectedPublisherId === 'number') {
      this.newBook.publisherId = this.selectedPublisherId;
    }

    // If book is part of a series, add it to the series
    if (
      this.isPartOfSeries &&
      this.selectedSeriesId &&
      this.newBook.seriesOrder
    ) {
      this.seriesService.addBookToSeries(
        this.selectedSeriesId,
        this.newBook.title,
        this.newBook.seriesOrder
      );
    }

    // Add current date
    this.newBook.dateAdded = new Date().toISOString().split('T')[0];

    // Create the book using the service
    const bookData: BookCreateRequest = {
      ...this.newBook,
      authorIds: this.newBook.authorIds,
      publisherId: (typeof this.selectedPublisherId === 'number') ? this.selectedPublisherId : undefined
    };

    const createdBook = this.bookService.createBook(bookData);
    console.log('Book created:', createdBook);

    // Show success message and navigate back
    // You can add a toast notification here
    this.goBack();
  }

  goBack() {
    this.location.back();
  }

  onPublisherChange() {
    if (this.selectedPublisherId === 'add_new') {
      this.showAddPublisherDialog = true;
      this.selectedPublisherId = null;
    }
  }

  viewPublisherDetails(publisherId: number | string | null) {
    if (publisherId && typeof publisherId === 'number') {
      // Open publisher details in new tab or navigate
      this.router.navigate(['/publishers/details', publisherId]);
    }
  }

  openAddPublisherDialog() {
    this.showAddPublisherDialog = true;
  }

  onAddNewPublisher() {
    this.showAddPublisherDialog = true;
  }

  createNewPublisher() {
    if (this.newPublisherData.name.trim()) {
      const newPublisher = this.publisherService.createPublisher({
        name: this.newPublisherData.name,
        location: this.newPublisherData.location,
        website: this.newPublisherData.website,
        description: this.newPublisherData.description
      });

      if (newPublisher) {
        // Reload publisher options
        this.loadPublisherOptions();
        
        // Select the newly created publisher
        this.selectedPublisherId = newPublisher.id!;
        
        // Reset form and close dialog
        this.newPublisherData = {
          name: '',
          location: '',
          website: '',
          description: ''
        };
        this.showAddPublisherDialog = false;
      }
    }
  }

  cancelAddPublisher() {
    this.newPublisherData = {
      name: '',
      location: '',
      website: '',
      description: ''
    };
    this.showAddPublisherDialog = false;
  }

  onCoverUpload(event: any) {
    // handle file upload
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newBook.cover = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
