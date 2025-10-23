import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Book, BookCreateRequest, BookAuthor } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { SeriesDTO } from '../../../series/models/series.model';
import { SeriesService } from '../../../series/services/series.service';
import { GenreSelectorService } from '../../../shared/services/genre.selector.service';
import { AuthorService } from '../../../authors/services/author.service';
import { Author } from '../../../authors/models/author.model';
import { PublisherService } from '../../../publishers/services/publisher.service';
import { Publisher } from '../../../publishers/models/publisher.model';
import { CatalogService } from '../../../shared/services/catalog.service';
import {
  CatalogSearchResult,
  DuplicateDetectionResult,
  BookCreateNewRequest,
  CatalogBook,
  CatalogAuthor,
  CatalogPublisher
} from '../../../shared/models/catalog.model';
import { DuplicateDialogAction } from '../../../shared/components/duplicate-dialog/duplicate-dialog.component';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
    customTags: [], // Initialize custom tags array
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
  showEditPublisherDialog: boolean = false;
  publisherToEdit: Publisher | null = null;
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

  // ===== NEW CATALOG PROPERTIES =====

  // Catalog search state
  showCatalogSearch: boolean = true;
  catalogSearchPerformed: boolean = false;
  selectedCatalogBook: CatalogSearchResult | null = null;
  showCreateNewForm: boolean = false;

  // Duplicate detection
  showDuplicateDialog: boolean = false;
  duplicateResult: DuplicateDetectionResult | null = null;
  searchTerm: string = '';

  // Step-by-step flow
  currentStep: 'search' | 'duplicate_check' | 'create_new' | 'add_to_library' = 'search';

  // Enhanced author search
  catalogAuthors: CatalogAuthor[] = [];
  catalogPublishers: CatalogPublisher[] = [];

  constructor(
    private location: Location,
    private router: Router,
    private seriesService: SeriesService,
    private genreSelectorService: GenreSelectorService,
    private bookService: BookService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private catalogService: CatalogService
  ) { }

  ngOnInit() {
    this.loadSeriesOptions();
    this.loadGenreOptions();
    this.loadPublisherOptions();
  }

  loadGenreOptions() {
    // this.genreOptions = this.genreService.getGenreOptions();
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

    // Update authors with roles - assign default "Author" role for new authors
    this.selectedAuthorsWithRoles = authors.map(author => {
      // Check if this author already has a role assigned
      const existingRole = this.selectedAuthorsWithRoles.find(ar => ar.authorId === author.id);
      return {
        authorId: author.id!,
        authorName: author.name,
        role: existingRole?.role || 'Author' // Keep existing role or default to 'Author'
      };
    });

    // Update the book's authors array
    this.newBook.authors = this.selectedAuthorsWithRoles;
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

  onCustomTagCreated(tagName: string) {
    // Handle custom tag creation
    console.log('Custom tag created:', tagName);
    // In a real app, this would save to the tagging service
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

        // Auto-fill author if no authors selected and series has authors
        if (this.selectedAuthors.length === 0 && series.authors && series.authors.length > 0) {
          // Try to find matching author in our author system
          const authors = this.authorService.getAuthors();
          const matchingAuthor = authors.find(author =>
            series.authors.some(seriesAuthor =>
              author.name.toLowerCase() === seriesAuthor.authorName.toLowerCase()
            )
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

  updateAvailableSeriesOrders(series: SeriesDTO) {
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
      const newSeries: SeriesDTO = {
        title: this.newSeriesData.title,
        authors: [{ authorName: this.newSeriesData.author, authorRole: 'Author' }],
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

  onAuthorRoleChange(authorId: number, newRole: string) {
    // Update the role for the specific author
    const authorIndex = this.selectedAuthorsWithRoles.findIndex(ar => ar.authorId === authorId);
    if (authorIndex >= 0) {
      this.selectedAuthorsWithRoles[authorIndex].role = newRole;
      // Update the book's authors array
      this.newBook.authors = [...this.selectedAuthorsWithRoles];
    }
  }

  // ===== NEW CATALOG-AWARE METHODS =====

  // Handle catalog search results
  onCatalogBookSelected(result: CatalogSearchResult) {
    this.selectedCatalogBook = result;
    this.currentStep = 'add_to_library';
    this.showCatalogSearch = false;
  }

  // Handle "create new" from catalog search
  onCreateNewFromCatalog(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.newBook.title = searchTerm;
    this.checkForDuplicatesBeforeCreate();
  }

  // Check for duplicates before creating new book
  checkForDuplicatesBeforeCreate() {
    if (!this.newBook.title.trim()) {
      this.showCreateNewForm = true;
      return;
    }

    const catalogBookData: Partial<CatalogBook> = {
      title: this.newBook.title,
      authorIds: this.selectedAuthors.map(a => a.id!),
      genres: this.newBook.genres
    };

    this.bookService.checkForDuplicates(catalogBookData).subscribe({
      next: (result) => {
        this.duplicateResult = result;

        if (result.hasMatches && (result.confidence === 'high' || result.confidence === 'medium')) {
          this.showDuplicateDialog = true;
          this.currentStep = 'duplicate_check';
        } else {
          this.showCreateNewForm = true;
          this.currentStep = 'create_new';
        }
      },
      error: (error) => {
        console.error('Error checking duplicates:', error);
        this.showCreateNewForm = true;
        this.currentStep = 'create_new';
      }
    });
  }

  // Handle duplicate dialog actions
  onDuplicateAction(action: DuplicateDialogAction) {
    this.showDuplicateDialog = false;

    switch (action.action) {
      case 'use_existing':
        this.selectedCatalogBook = action.selectedItem || null;
        this.currentStep = 'add_to_library';
        break;
      case 'create_new':
        this.showCreateNewForm = true;
        this.currentStep = 'create_new';
        break;
      case 'cancel':
        this.resetToSearch();
        break;
    }
  }

  // Enhanced author search with catalog
  onAuthorSearch(query: string) {
    if (query.length < 2) return;

    this.bookService.searchCatalogAuthors(query).subscribe({
      next: (authors) => {
        this.catalogAuthors = authors;

        // Also search local authors for backward compatibility
        const localAuthors = this.authorService.searchAuthors(query);
        // Merge and deduplicate if needed
      },
      error: (error) => {
        console.error('Error searching catalog authors:', error);
        // Fallback to local search
        this.catalogAuthors = [];
      }
    });
  }

  // Add author from catalog or create new
  onSelectCatalogAuthor(author: CatalogAuthor) {
    // Convert catalog author to local author format for compatibility
    const localAuthor: Author = {
      id: author.id,
      name: author.name,
      biography: author.biography || '',
      birthDate: author.birthDate ? new Date(author.birthDate) : undefined,
      nationality: author.nationality || '',
      genres: [], // Will be populated separately
      isActive: !author.deathDate,
      totalBooks: 0,
      averageRating: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.selectedAuthors.push(localAuthor);
    this.newBook.authorIds = this.selectedAuthors.map(a => a.id!).filter(id => id !== undefined);
  }

  // Override existing onAddAuthorDialogSave with catalog integration
  // (This replaces the existing method to add catalog functionality)

  // Create new author in catalog
  createNewAuthorInCatalog() {
    const catalogAuthorData: Omit<CatalogAuthor, 'id'> = {
      name: this.newAuthorData.name.trim(),
      biography: this.newAuthorData.biography,
      birthDate: this.newAuthorData.birthDate?.toISOString(),
      nationality: this.newAuthorData.nationality
    };

    this.bookService.ensureAuthorInCatalog(catalogAuthorData).subscribe({
      next: (catalogAuthor) => {
        this.onSelectCatalogAuthor(catalogAuthor);
        this.resetAddAuthorDialog();
      },
      error: (error) => {
        console.error('Error creating author in catalog:', error);
        // Fallback to local creation
        this.createAuthorLocally();
      }
    });
  }

  // Fallback to local author creation
  createAuthorLocally() {
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

    const addedAuthor = this.authorService.addAuthor(newAuthor);
    this.selectedAuthors.push(addedAuthor);
    this.newBook.authorIds = this.selectedAuthors.map(a => a.id!).filter(id => id !== undefined);
    this.resetAddAuthorDialog();
  }

  // Enhanced book creation with catalog integration
  addBookWithCatalog() {
    if (this.selectedCatalogBook) {
      // Add existing book from catalog to user library
      this.addExistingBookToLibrary();
    } else {
      // Create completely new book
      this.createCompletelyNewBook();
    }
  }

  // Add existing catalog book to user library
  addExistingBookToLibrary() {
    if (!this.selectedCatalogBook) return;

    const request = {
      catalogBookId: this.selectedCatalogBook.id,
      status: this.newBook.status || 'Want to Read',
      personalRating: this.newBook.rating,
      price: this.newBook.price,
      source: this.newBook.source
    };

    this.bookService.createBookFromCatalog(request).subscribe({
      next: (userLibraryBook) => {
        console.log('Book added to library:', userLibraryBook);
        this.goBack();
      },
      error: (error) => {
        console.error('Error adding book to library:', error);
      }
    });
  }

  // Create completely new book with catalog
  createCompletelyNewBook() {
    const authorNames = this.selectedAuthors.map(a => a.name);

    const request: BookCreateNewRequest = this.bookService.convertToBookCreateNewRequest(
      this.convertToBookCreateRequest(),
      authorNames
    );

    this.bookService.createNewBookWithCatalogCheck(request).subscribe({
      next: (userLibraryBook) => {
        console.log('New book created:', userLibraryBook);
        this.handleSeriesAssignment();
        this.goBack();
      },
      error: (error) => {
        console.error('Error creating new book:', error);
        // Fallback to legacy method
        this.addBook();
      }
    });
  }

  // Helper methods
  resetToSearch() {
    this.currentStep = 'search';
    this.showCatalogSearch = true;
    this.showCreateNewForm = false;
    this.selectedCatalogBook = null;
    this.duplicateResult = null;
  }

  resetAddAuthorDialog() {
    this.showAddAuthorDialog = false;
    this.newAuthorData = {
      name: '',
      biography: '',
      birthDate: null,
      nationality: '',
      genres: [],
      isAlive: true
    };
  }

  convertToBookCreateRequest(): BookCreateRequest {
    return {
      ...this.newBook,
      authorIds: this.newBook.authorIds,
      authors: this.selectedAuthorsWithRoles,
      publisherId: (typeof this.selectedPublisherId === 'number') ? this.selectedPublisherId : undefined
    };
  }

  handleSeriesAssignment() {
    if (this.isPartOfSeries && this.selectedSeriesId && this.newBook.seriesOrder) {
      this.seriesService.addBookToSeries(
        this.selectedSeriesId,
        this.newBook.title,
        this.newBook.seriesOrder
      );
    }
  }

  // ===== END CATALOG METHODS =====

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
      authors: this.selectedAuthorsWithRoles, // Include authors with roles
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

  openEditPublisherDialog() {
    if (this.selectedPublisherId && typeof this.selectedPublisherId === 'number') {
      this.publisherToEdit = this.publisherService.getPublisherById(this.selectedPublisherId);
      if (this.publisherToEdit) {
        this.showEditPublisherDialog = true;
      }
    }
  }

  onPublisherSaved(publisher: Publisher) {
    // Reload publisher options to reflect changes
    this.loadPublisherOptions();

    // Update selected publisher if it was edited
    if (this.showEditPublisherDialog) {
      this.selectedPublisherId = publisher.id!;
    }

    // Close dialogs
    this.showAddPublisherDialog = false;
    this.showEditPublisherDialog = false;
    this.publisherToEdit = null;
  }

  onPublisherDialogCancelled() {
    this.showAddPublisherDialog = false;
    this.showEditPublisherDialog = false;
    this.publisherToEdit = null;
  }

  getSelectedPublisher(): Publisher | null {
    if (this.selectedPublisherId && typeof this.selectedPublisherId === 'number') {
      return this.publisherService.getPublisherById(this.selectedPublisherId);
    }
    return null;
  }

  onAddNewPublisher() {
    this.showAddPublisherDialog = true;
  }

  cancelAddPublisher() {
    this.onPublisherDialogCancelled();
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

  onGenrePreferenceUpdated(preference: any) {
    console.log('Genre preference updated:', preference);
    // Optionally show a success message or handle the preference update
    // The preference is automatically saved by the genre selector component
  }
}
