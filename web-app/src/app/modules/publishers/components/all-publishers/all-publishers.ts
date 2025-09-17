import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Publisher } from '../../models/publisher.model';
import { PublisherService } from '../../services/publisher.service';
import { BookService } from '../../../books/services/book.service';
import { EditionService } from '../../../books/services/edition.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-all-publishers',
  standalone: false,
  templateUrl: './all-publishers.html',
  styleUrls: ['./all-publishers.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AllPublishersComponent implements OnInit, OnDestroy {
  publishers: Publisher[] = [];
  filteredPublishers: Publisher[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  
  // Sorting and filtering
  sortBy: string = 'name';
  bookCountFilter: string = 'all';
  
  sortOptions = [
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Name (Z-A)', value: 'name-desc' },
    { label: 'Book Count (High-Low)', value: 'books-desc' },
    { label: 'Book Count (Low-High)', value: 'books-asc' },
    { label: 'Location', value: 'location' }
  ];
  
  bookCountFilterOptions = [
    { label: 'All Publishers', value: 'all' },
    { label: 'No Books (0)', value: '0' },
    { label: 'Few Books (1-5)', value: '1-5' },
    { label: 'Many Books (6-15)', value: '6-15' },
    { label: 'Extensive (16+)', value: '16+' }
  ];
  
  private destroy$ = new Subject<void>();

  constructor(
    private publisherService: PublisherService,
    private bookService: BookService,
    private editionService: EditionService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPublishers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPublishers(): void {
    this.loading = true;
    this.publisherService.publishers$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (publishers) => {
          this.publishers = publishers.map(publisher => ({
            ...publisher,
            bookCount: this.bookService.getBooksByPublisher(publisher.id || 0).length
          }));
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading publishers:', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load publishers'
          });
        }
      });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.publishers];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(publisher =>
        publisher.name.toLowerCase().includes(searchLower) ||
        (publisher.location && publisher.location.toLowerCase().includes(searchLower)) ||
        (publisher.description && publisher.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply book count filter
    if (this.bookCountFilter !== 'all') {
      filtered = filtered.filter(publisher => {
        const bookCount = publisher.bookCount || 0;
        switch (this.bookCountFilter) {
          case '0': return bookCount === 0;
          case '1-5': return bookCount >= 1 && bookCount <= 5;
          case '6-15': return bookCount >= 6 && bookCount <= 15;
          case '16+': return bookCount >= 16;
          default: return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'books-desc':
          return (b.bookCount || 0) - (a.bookCount || 0);
        case 'books-asc':
          return (a.bookCount || 0) - (b.bookCount || 0);
        case 'location':
          return (a.location || '').localeCompare(b.location || '');
        default:
          return 0;
      }
    });

    this.filteredPublishers = filtered;
  }

  // Statistics methods
  getTotalPublishers(): number {
    return this.publishers.length;
  }

  getTotalBooks(): number {
    return this.publishers.reduce((total, publisher) => total + (publisher.bookCount || 0), 0);
  }

  getAverageBooksPerPublisher(): string {
    if (this.publishers.length === 0) return '0';
    const avg = this.getTotalBooks() / this.publishers.length;
    return avg.toFixed(1);
  }

  getTopPublisher(): string {
    if (this.publishers.length === 0) return 'None';
    const top = this.publishers.reduce((max, publisher) => 
      (publisher.bookCount || 0) > (max.bookCount || 0) ? publisher : max
    );
    return top.name;
  }

  hasActiveFilters(): boolean {
    return this.searchTerm.trim() !== '' || this.bookCountFilter !== 'all' || this.sortBy !== 'name';
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.bookCountFilter = 'all';
    this.sortBy = 'name';
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Publisher helper methods
  getPublisherBookCount(publisher: Publisher): number {
    return publisher.bookCount || 0;
  }

  getPublisherOwnedBooks(publisher: Publisher): number {
    if (!publisher.id) return 0;
    const books = this.bookService.getBooksByPublisher(publisher.id);
    // Count books that have at least one owned edition
    return books.filter(book => {
      if (!book.id) return false;
      const editions = this.editionService.getEditionsByBook(book.id);
      return editions.some(edition => edition.isOwned);
    }).length;
  }

  getPublisherGenres(publisher: Publisher): string[] {
    if (!publisher.id) return [];
    const books = this.bookService.getBooksByPublisher(publisher.id);
    const genres = new Set<string>();
    books.forEach(book => {
      if (book.genres) {
        book.genres.forEach(genre => genres.add(genre));
      }
    });
    return Array.from(genres);
  }

  openWebsite(url: string): void {
    window.open(url, '_blank');
  }

  addBookFromPublisher(publisher: Publisher): void {
    // Navigate to add book page with publisher pre-selected
    this.router.navigate(['/books/add'], { 
      queryParams: { publisherId: publisher.id } 
    });
  }

  addPublisher(): void {
    this.router.navigate(['/publishers/add']);
  }

  viewPublisher(publisher: Publisher): void {
    if (publisher.id) {
      this.router.navigate(['/publishers/details', publisher.id]);
    }
  }

  editPublisher(publisher: Publisher): void {
    if (publisher.id) {
      this.router.navigate(['/publishers/edit', publisher.id]);
    }
  }

  deletePublisher(publisher: Publisher): void {
    if (!publisher.id) return;

    const booksCount = this.bookService.getBooksByPublisher(publisher.id).length;
    
    if (booksCount > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cannot Delete',
        detail: `Cannot delete publisher. ${booksCount} book(s) are associated with this publisher.`
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${publisher.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.publisherService.deletePublisher(publisher.id!)) {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Publisher deleted successfully'
          });
          this.loadPublishers();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete publisher'
          });
        }
      }
    });
  }
}
