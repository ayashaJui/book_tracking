import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Book, BookUpdateRequest, BookAuthor } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { Series } from '../../../series/models/series.model';
import { SeriesService } from '../../../series/services/series.service';
import { GenreService } from '../../../shared/services/genre.service';
import { AuthorService } from '../../../authors/services/author.service';
import { Author } from '../../../authors/models/author.model';
import { PublisherService } from '../../../publishers/services/publisher.service';
import { Publisher } from '../../../publishers/models/publisher.model';

@Component({
  selector: 'app-edit-book',
  standalone: false,
  templateUrl: './edit-book.html',
  styleUrl: './edit-book.scss',
  providers: [MessageService],
})
export class EditBook implements OnInit {
  book: Book = {
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

  bookId: number | null = null;
  isLoading = false;

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

  // Role options for authors
  roleOptions = [
    { label: 'Author', value: 'Author' },
    { label: 'Co-Author', value: 'Co-Author' },
    { label: 'Editor', value: 'Editor' },
    { label: 'Illustrator', value: 'Illustrator' },
    { label: 'Translator', value: 'Translator' },
    { label: 'Contributor', value: 'Contributor' },
  ];

  // Authors with roles for the book
  selectedAuthorsWithRoles: BookAuthor[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private bookService: BookService,
    private seriesService: SeriesService,
    private genreService: GenreService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadData();
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.bookId) {
      this.loadBook();
    }
  }

  private loadData() {
    this.loadGenres();
    this.loadSeriesOptions();
    this.loadPublisherOptions();
  }

  private loadBook() {
    if (!this.bookId) return;

    this.isLoading = true;
    const book = this.bookService.getBookById(this.bookId);

    if (book) {
      this.book = { ...book };
      this.selectedPublisherId = book.publisherId || null;
      this.selectedSeriesId = book.seriesId || null;
      this.isPartOfSeries = !!book.seriesId;

      // Load selected authors
      this.selectedAuthors = this.authorService.getAuthors()
        .filter(author => book.authorIds.includes(author.id || 0));

      // Initialize authors with roles
      if (book.authors && book.authors.length > 0) {
        this.selectedAuthorsWithRoles = [...book.authors];
      } else {
        // Convert from legacy authorIds format
        this.selectedAuthorsWithRoles = this.selectedAuthors.map(author => ({
          authorId: author.id || 0,
          authorName: author.name,
          role: 'Author'
        }));
      }

      if (this.isPartOfSeries && this.selectedSeriesId) {
        this.loadAvailableSeriesOrders();
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Book not found'
      });
      this.router.navigate(['/books/all-book']);
    }

    this.isLoading = false;
  }

  private loadGenres() {
    const genres = this.genreService.getGenres();
    this.genreOptions = genres.map(genre => ({
      label: typeof genre === 'string' ? genre : genre.toString(),
      value: typeof genre === 'string' ? genre : genre.toString()
    }));
  }

  private loadSeriesOptions() {
    const allSeries = this.seriesService.getAllSeries();
    this.seriesOptions = allSeries.map((series: Series) => ({
      label: series.title,
      value: series.id || 0
    }));
  }

  private loadPublisherOptions() {
    const publishers = this.publisherService.getPublishers();
    this.publisherOptions = [
      { label: 'No Publisher', value: '' },
      ...publishers.map(publisher => ({
        label: publisher.name,
        value: publisher.id || 0
      }))
    ];
  }

  private loadAvailableSeriesOrders() {
    if (!this.selectedSeriesId) return;

    const series = this.seriesService.getSeriesById(this.selectedSeriesId);
    if (series) {
      // Get existing orders in the series, excluding current book
      const existingOrders = series.books
        ?.filter(book => book.orderInSeries !== this.book.seriesOrder)
        .map(book => book.orderInSeries || 0) || [];

      // Generate available orders (1 to totalBooks + 1)
      const maxOrder = Math.max(series.totalBooks || 1, ...existingOrders);
      this.availableSeriesOrders = [];

      for (let i = 1; i <= maxOrder + 1; i++) {
        if (!existingOrders.includes(i) || i === this.book.seriesOrder) {
          this.availableSeriesOrders.push(i);
        }
      }
    }
  }

  onSeriesChange() {
    if (this.isPartOfSeries && this.selectedSeriesId) {
      this.book.seriesId = this.selectedSeriesId;
      this.loadAvailableSeriesOrders();

      const series = this.seriesService.getSeriesById(this.selectedSeriesId);
      if (series) {
        this.book.seriesName = series.title;
      }
    } else {
      this.book.seriesId = undefined;
      this.book.seriesName = '';
      this.book.seriesOrder = undefined;
      this.selectedSeriesId = null;
      this.availableSeriesOrders = [];
    }
  }

  onPublisherChange() {
    if (this.selectedPublisherId && this.selectedPublisherId !== '') {
      this.book.publisherId = Number(this.selectedPublisherId);
    } else {
      this.book.publisherId = undefined;
    }
  }

  onAuthorSelectionChange(selectedAuthors: Author[]) {
    this.selectedAuthors = selectedAuthors;
    this.book.authorIds = selectedAuthors.map(author => author.id || 0);

    // Update authors with roles - preserve existing roles if author was already selected
    const newAuthorsWithRoles: BookAuthor[] = [];

    selectedAuthors.forEach(author => {
      const existingAuthor = this.selectedAuthorsWithRoles.find(a => a.authorId === author.id);
      if (existingAuthor) {
        newAuthorsWithRoles.push(existingAuthor);
      } else {
        newAuthorsWithRoles.push({
          authorId: author.id || 0,
          authorName: author.name,
          role: 'Author'
        });
      }
    });

    this.selectedAuthorsWithRoles = newAuthorsWithRoles;
  }

  onAuthorRoleChange(authorId: number, newRole: string) {
    const author = this.selectedAuthorsWithRoles.find(a => a.authorId === authorId);
    if (author) {
      author.role = newRole;
    }
  }

  addPublisher() {
    if (this.newPublisherData.name.trim()) {
      const newPublisher: Publisher = {
        name: this.newPublisherData.name,
        location: this.newPublisherData.location,
        website: this.newPublisherData.website,
        description: this.newPublisherData.description
      };

      const addedPublisher = this.publisherService.createPublisher(newPublisher);
      this.loadPublisherOptions();
      this.selectedPublisherId = addedPublisher.id || 0;
      this.onPublisherChange();

      this.newPublisherData = { name: '', location: '', website: '', description: '' };
      this.showAddPublisherDialog = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Publisher added successfully'
      });
    }
  }

  updateBook() {
    if (!this.bookId) return;

    // Prepare the update request
    const updateRequest: BookUpdateRequest = {
      id: this.bookId,
      title: this.book.title,
      authorIds: this.book.authorIds,
      genres: this.book.genres,
      status: this.book.status,
      pages: this.book.pages,
      price: this.book.price,
      source: this.book.source,
      seriesId: this.book.seriesId,
      seriesOrder: this.book.seriesOrder,
      publisherId: this.book.publisherId,
      authors: this.selectedAuthorsWithRoles.length > 0 ? this.selectedAuthorsWithRoles : undefined
    };

    try {
      const updatedBook = this.bookService.updateBook(updateRequest);

      if (updatedBook) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Book updated successfully'
        });

        // Navigate back to book details
        this.router.navigate(['/books/book-details', this.bookId]);
      } else {
        throw new Error('Failed to update book');
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update book'
      });
    }
  }

  onCancel() {
    this.location.back();
  }

  goBack() {
    this.location.back();
  }

  formatAuthorsWithRoles(book: Book): string {
    if (book.authors && book.authors.length > 0) {
      return book.authors.map(author => `${author.authorName || 'Unknown'} (${author.role})`).join(', ');
    } else if (book.authorNames && book.authorNames.length > 0) {
      return book.authorNames.join(', ');
    }
    return 'Unknown Author';
  }

  get seriesOrderOptions() {
    return this.availableSeriesOrders.map(order => ({
      label: `Book ${order}`,
      value: order
    }));
  }

  onCustomTagCreated(tagName: string) {
    // Handle custom tag creation
    console.log('Custom tag created:', tagName);
    // In a real app, this would save to the tagging service
  }
}