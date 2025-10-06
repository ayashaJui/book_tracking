import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CollectionService } from '../../services/collection.service';
import { ReadingCollection, CollectionBook } from '../../models/collection.model';

@Component({
    selector: 'app-collection-details',
    standalone: false,
    templateUrl: './collection-details.html',
    styleUrl: './collection-details.scss',
})
export class CollectionDetails implements OnInit {
    collection: ReadingCollection | null = null;
    books: CollectionBook[] = [];
    loading = false;
    collectionId: number = 0;

    // View modes
    viewMode: 'grid' | 'list' = 'grid';

    // Filters
    globalFilter = '';
    selectedStatus: string | null = null;
    selectedGenre: string | null = null;

    // Filter options
    statusOptions = [
        { label: 'All Status', value: null },
        { label: 'Want to Read', value: 'Want to Read' },
        { label: 'Reading', value: 'Reading' },
        { label: 'Read', value: 'Read' },
        { label: 'On Hold', value: 'On Hold' }
    ];

    genreOptions: { label: string; value: string }[] = [];
    filteredBooks: CollectionBook[] = [];

    // Dialogs
    showEditDialog = false;
    showAddBooksDialog = false;

    // Form data
    collectionForm = {
        name: '',
        description: '',
        isPublic: false
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private collectionService: CollectionService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.collectionId = +params['id'];
            this.loadCollection();
            this.loadBooks();
        });
    }

    loadCollection() {
        this.collection = this.collectionService.getCollectionById(this.collectionId) || null;
        if (!this.collection) {
            this.router.navigate(['/collections']);
            return;
        }

        this.collectionForm = {
            name: this.collection.name,
            description: this.collection.description || '',
            isPublic: this.collection.isPublic
        };
    }

    loadBooks() {
        this.loading = true;
        this.books = this.collectionService.getBooksInCollection(this.collectionId);
        this.setupFilterOptions();
        this.applyFilters();
        this.loading = false;
    }

    setupFilterOptions() {
        const genres = new Set<string>();
        this.books.forEach(book => {
            book.book?.genres?.forEach(genre => genres.add(genre));
        });

        this.genreOptions = [
            { label: 'All Genres', value: '' },
            ...Array.from(genres).map(genre => ({ label: genre, value: genre }))
        ];
    }

    applyFilters() {
        let filtered = [...this.books];

        // Search filter
        if (this.globalFilter?.trim()) {
            const query = this.globalFilter.toLowerCase();
            filtered = filtered.filter(book =>
                book.book?.title.toLowerCase().includes(query) ||
                book.book?.authorNames?.some(author => author.toLowerCase().includes(query)) ||
                book.notes?.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (this.selectedStatus) {
            filtered = filtered.filter(book => book.book?.status === this.selectedStatus);
        }

        // Genre filter
        if (this.selectedGenre && this.selectedGenre !== '') {
            filtered = filtered.filter(book =>
                book.book?.genres?.includes(this.selectedGenre!)
            );
        }

        this.filteredBooks = filtered;
    }

    onGlobalFilter(event: any) {
        this.globalFilter = event.target.value;
        this.applyFilters();
    }

    onFilterChange() {
        this.applyFilters();
    }

    clearFilters() {
        this.globalFilter = '';
        this.selectedStatus = null;
        this.selectedGenre = null;
        this.applyFilters();
    }

    // Collection operations
    editCollection() {
        this.showEditDialog = true;
    }

    saveCollection() {
        if (!this.collectionForm.name.trim() || !this.collection) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Collection name is required',
                life: 3000
            });
            return;
        }

        const updated = this.collectionService.updateCollection(this.collection.id!, {
            name: this.collectionForm.name.trim(),
            description: this.collectionForm.description.trim(),
            isPublic: this.collectionForm.isPublic
        });

        if (updated) {
            this.collection = updated;
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Collection updated successfully',
                life: 3000
            });
        }

        this.showEditDialog = false;
    }

    deleteCollection() {
        if (!this.collection || this.collection.isDefault) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cannot Delete',
                detail: 'Default collections cannot be deleted',
                life: 3000
            });
            return;
        }

        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${this.collection.name}"? This will remove all books from this collection.`,
            header: 'Delete Collection',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger p-button-sm',
            rejectButtonStyleClass: 'p-button-text p-button-sm',
            accept: () => {
                const success = this.collectionService.deleteCollection(this.collection!.id!);
                if (success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Collection deleted successfully',
                        life: 3000
                    });
                    this.router.navigate(['/collections']);
                }
            }
        });
    }

    // Book operations
    removeBookFromCollection(book: CollectionBook) {
        this.confirmationService.confirm({
            message: `Remove "${book.book?.title}" from this collection?`,
            header: 'Remove Book',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger p-button-sm',
            rejectButtonStyleClass: 'p-button-text p-button-sm',
            accept: () => {
                const success = this.collectionService.removeBookFromCollection(
                    this.collectionId,
                    book.userBookId
                );
                if (success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Book removed from collection',
                        life: 3000
                    });
                    this.loadBooks();
                    if (this.collection) {
                        this.collection.bookCount = (this.collection.bookCount || 0) - 1;
                    }
                }
            }
        });
    }

    viewBook(book: CollectionBook) {
        // Navigate to book details
        this.router.navigate(['/books', book.book?.id]);
    }

    addBooks() {
        this.showAddBooksDialog = true;
        // TODO: Implement add books dialog
    }

    // Helper methods
    getCollectionIcon(): string {
        if (!this.collection) return 'pi-folder';

        if (this.collection.isDefault) {
            if (this.collection.name.toLowerCase().includes('reading')) return 'pi-book';
            if (this.collection.name.toLowerCase().includes('want')) return 'pi-heart';
            return 'pi-star';
        }
        return this.collection.isPublic ? 'pi-globe' : 'pi-lock';
    }

    getStatusColor(status: string | undefined): string {
        switch (status) {
            case 'Read': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'Reading': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'Want to Read': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            case 'On Hold': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }

    getRatingStars(rating: number | undefined): string[] {
        const stars = [];
        const ratingValue = rating || 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= ratingValue) {
                stars.push('pi-star-fill');
            } else {
                stars.push('pi-star');
            }
        }
        return stars;
    }

    goBack() {
        this.router.navigate(['/collections']);
    }

    refreshData() {
        this.loadCollection();
        this.loadBooks();
        this.messageService.add({
            severity: 'info',
            summary: 'Refreshed',
            detail: 'Collection data has been refreshed',
            life: 2000
        });
    }
}