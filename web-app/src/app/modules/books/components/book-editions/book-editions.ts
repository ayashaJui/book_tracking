import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Edition } from '../../models/edition.model';
import { EditionService } from '../../services/edition.service';
import { PublisherService } from '../../../publishers/services/publisher.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-book-editions',
  templateUrl: './book-editions.html',
  standalone: false,
  styleUrls: ['./book-editions.scss'],
  providers: [MessageService, ConfirmationService]
})
export class BookEditionsComponent implements OnInit, OnDestroy {
  @Input() bookId!: number;
  @Input() bookTitle: string = '';

  editions: Edition[] = [];
  showAddDialog: boolean = false;
  showEditDialog: boolean = false;
  selectedEdition: Edition | null = null;
  
  newEdition: any = {
    format: '',
    isbn: '',
    isbn13: '',
    publicationDate: '',
    price: null,
    currency: 'USD',
    pages: null,
    publisherId: null,
    language: 'English',
    isOwned: false,
    condition: 'New'
  };

  formatOptions = [
    { label: 'Hardcover', value: 'Hardcover' },
    { label: 'Paperback', value: 'Paperback' },
    { label: 'Ebook', value: 'Ebook' },
    { label: 'Audiobook', value: 'Audiobook' },
    { label: 'Mass Market', value: 'Mass Market' }
  ];

  currencyOptions = [
    { label: 'USD ($)', value: 'USD' },
    { label: 'EUR (€)', value: 'EUR' },
    { label: 'GBP (£)', value: 'GBP' },
    { label: 'CAD (C$)', value: 'CAD' }
  ];

  conditionOptions = [
    { label: 'New', value: 'New' },
    { label: 'Like New', value: 'Like New' },
    { label: 'Very Good', value: 'Very Good' },
    { label: 'Good', value: 'Good' },
    { label: 'Acceptable', value: 'Acceptable' }
  ];

  publisherOptions: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private editionService: EditionService,
    private publisherService: PublisherService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadEditions();
    this.loadPublishers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEditions(): void {
    this.editionService.editions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(editions => {
        this.editions = editions.filter(e => e.bookId === this.bookId);
      });
  }

  loadPublishers(): void {
    this.publisherService.publishers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(publishers => {
        this.publisherOptions = publishers.map(p => ({
          label: p.name,
          value: p.id
        }));
      });
  }

  openAddDialog(): void {
    this.resetNewEdition();
    this.showAddDialog = true;
  }

  openEditDialog(edition: Edition): void {
    this.selectedEdition = { ...edition };
    this.showEditDialog = true;
  }

  resetNewEdition(): void {
    this.newEdition = {
      format: '',
      isbn: '',
      isbn13: '',
      publicationDate: '',
      price: null,
      currency: 'USD',
      pages: null,
      publisherId: null,
      language: 'English',
      isOwned: false,
      condition: 'New',
      notes: ''
    };
  }

  onAddEdition(): void {
    if (!this.newEdition.format) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Format is required'
      });
      return;
    }

    const editionData = {
      ...this.newEdition,
      bookId: this.bookId
    };

    try {
      this.editionService.createEdition(editionData);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Edition added successfully'
      });
      this.showAddDialog = false;
      this.resetNewEdition();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add edition'
      });
    }
  }

  onEditEdition(): void {
    if (!this.selectedEdition || !this.selectedEdition.id) return;

    try {
      this.editionService.updateEdition(this.selectedEdition as any);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Edition updated successfully'
      });
      this.showEditDialog = false;
      this.selectedEdition = null;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update edition'
      });
    }
  }

  deleteEdition(edition: Edition): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this ${edition.format} edition?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.editionService.deleteEdition(edition.id!)) {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Edition deleted successfully'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete edition'
          });
        }
      }
    });
  }

  onDialogCancel(): void {
    this.showAddDialog = false;
    this.showEditDialog = false;
    this.selectedEdition = null;
    this.resetNewEdition();
  }

  getFormatBadgeClass(format: string): string {
    const classes: { [key: string]: string } = {
      'Hardcover': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Paperback': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Ebook': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Audiobook': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Mass Market': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return classes[format] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }

  getConditionBadgeClass(condition: string): string {
    const classes: { [key: string]: string } = {
      'New': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Like New': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Very Good': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Good': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Acceptable': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return classes[condition] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}
