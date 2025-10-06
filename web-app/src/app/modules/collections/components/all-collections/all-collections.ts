import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CollectionService } from '../../services/collection.service';
import { ReadingCollection, CollectionStats, CollectionFilters } from '../../models/collection.model';

@Component({
    selector: 'app-all-collections',
    standalone: false,
    templateUrl: './all-collections.html',
    styleUrl: './all-collections.scss',
})
export class AllCollections implements OnInit {
    @ViewChild('dt') table!: Table;

    collections: ReadingCollection[] = [];
    filteredCollections: ReadingCollection[] = [];
    stats: CollectionStats = {
        totalCollections: 0,
        totalBooks: 0,
        defaultCollections: 0,
        publicCollections: 0,
        averageBooksPerCollection: 0
    };

    // View modes
    viewMode: 'grid' | 'table' = 'grid';
    loading = false;

    // Filters
    globalFilter = '';
    selectedType: string | null = null;
    selectedVisibility: string | null = null;
    sortBy: 'name' | 'createdAt' | 'bookCount' = 'name';
    sortOrder: 'asc' | 'desc' = 'asc';

    // Filter options
    typeOptions = [
        { label: 'All Collections', value: null },
        { label: 'Reading Collections', value: 'reading' },
        { label: 'Wishlist Collections', value: 'wishlist' },
        { label: 'Custom Collections', value: 'custom' }
    ];

    visibilityOptions = [
        { label: 'All', value: null },
        { label: 'Private', value: 'private' },
        { label: 'Public', value: 'public' }
    ];

    sortOptions = [
        { label: 'Name', value: 'name' },
        { label: 'Date Created', value: 'createdAt' },
        { label: 'Book Count', value: 'bookCount' }
    ];

    // Dialogs
    showCreateDialog = false;
    showEditDialog = false;
    selectedCollection: ReadingCollection | null = null;

    // Form data
    collectionForm = {
        name: '',
        description: '',
        isPublic: false,
        sortOrder: 0
    };

    constructor(
        private router: Router,
        private collectionService: CollectionService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadCollections();
        this.loadStats();
    }

    loadCollections() {
        this.loading = true;
        this.collections = this.collectionService.getAllCollections();
        this.applyFilters();
        this.loading = false;
    }

    loadStats() {
        this.stats = this.collectionService.getCollectionStats();
    }

    applyFilters() {
        const filters: CollectionFilters = {
            searchQuery: this.globalFilter?.trim(),
            sortBy: this.sortBy,
            sortOrder: this.sortOrder
        };

        if (this.selectedType) {
            filters.type = this.selectedType as 'reading' | 'wishlist' | 'custom';
        }

        if (this.selectedVisibility === 'public') {
            filters.isPublic = true;
        } else if (this.selectedVisibility === 'private') {
            filters.isPublic = false;
        }

        this.filteredCollections = this.collectionService.searchCollections(filters);
    }

    onGlobalFilter(event: any) {
        this.globalFilter = event.target.value;
        this.applyFilters();
    }

    onFilterChange() {
        this.applyFilters();
    }

    onSortChange() {
        this.applyFilters();
    }

    toggleSortOrder() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        this.applyFilters();
    }

    clearFilters() {
        this.globalFilter = '';
        this.selectedType = null;
        this.selectedVisibility = null;
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.applyFilters();
    }

    // Collection operations
    createCollection() {
        this.collectionForm = {
            name: '',
            description: '',
            isPublic: false,
            sortOrder: this.collections.length + 1
        };
        this.showCreateDialog = true;
    }

    editCollection(collection: ReadingCollection) {
        this.selectedCollection = collection;
        this.collectionForm = {
            name: collection.name,
            description: collection.description || '',
            isPublic: collection.isPublic,
            sortOrder: collection.sortOrder
        };
        this.showEditDialog = true;
    }

    viewCollection(collection: ReadingCollection) {
        this.router.navigate(['/collections', collection.id]);
    }

    deleteCollection(collection: ReadingCollection) {
        if (collection.isDefault) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cannot Delete',
                detail: 'Default collections cannot be deleted',
                life: 3000
            });
            return;
        }

        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${collection.name}"? This will remove all books from this collection.`,
            header: 'Delete Collection',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger p-button-sm',
            rejectButtonStyleClass: 'p-button-text p-button-sm',
            accept: () => {
                const success = this.collectionService.deleteCollection(collection.id!);
                if (success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `"${collection.name}" deleted successfully`,
                        life: 3000
                    });
                    this.loadCollections();
                    this.loadStats();
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete collection',
                        life: 3000
                    });
                }
            }
        });
    }

    // Dialog operations
    saveCollection() {
        if (!this.collectionForm.name.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Collection name is required',
                life: 3000
            });
            return;
        }

        if (this.showCreateDialog) {
            const newCollection = this.collectionService.createCollection({
                name: this.collectionForm.name.trim(),
                description: this.collectionForm.description.trim(),
                isPublic: this.collectionForm.isPublic,
                isDefault: false,
                sortOrder: this.collectionForm.sortOrder
            });

            if (newCollection) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Collection "${newCollection.name}" created successfully`,
                    life: 3000
                });
                this.loadCollections();
                this.loadStats();
            }
        } else if (this.showEditDialog && this.selectedCollection) {
            const updated = this.collectionService.updateCollection(this.selectedCollection.id!, {
                name: this.collectionForm.name.trim(),
                description: this.collectionForm.description.trim(),
                isPublic: this.collectionForm.isPublic,
                sortOrder: this.collectionForm.sortOrder
            });

            if (updated) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Collection "${updated.name}" updated successfully`,
                    life: 3000
                });
                this.loadCollections();
            }
        }

        this.closeDialogs();
    }

    closeDialogs() {
        this.showCreateDialog = false;
        this.showEditDialog = false;
        this.selectedCollection = null;
        this.collectionForm = {
            name: '',
            description: '',
            isPublic: false,
            sortOrder: 0
        };
    }

    // Helper methods
    getCollectionIcon(collection: ReadingCollection): string {
        if (collection.isDefault) {
            if (collection.name.toLowerCase().includes('reading')) return 'pi-book';
            if (collection.name.toLowerCase().includes('want')) return 'pi-heart';
            return 'pi-star';
        }
        return collection.isPublic ? 'pi-globe' : 'pi-lock';
    }

    getCollectionTypeLabel(collection: ReadingCollection): string {
        switch (collection.type) {
            case 'wishlist': return 'Wishlist';
            case 'reading': return 'Reading';
            case 'custom': return 'Custom';
            default: return collection.isDefault ? 'Default' : 'Custom';
        }
    }

    getVisibilityLabel(collection: ReadingCollection): string {
        return collection.isPublic ? 'Public' : 'Private';
    }

    getBookCountText(count: number): string {
        return count === 1 ? '1 book' : `${count} books`;
    }

    refreshData() {
        this.loadCollections();
        this.loadStats();
        this.messageService.add({
            severity: 'info',
            summary: 'Refreshed',
            detail: 'Collections data has been refreshed',
            life: 2000
        });
    }

    exportCollections() {
        // TODO: Implement export functionality
        this.messageService.add({
            severity: 'info',
            summary: 'Export',
            detail: 'Export functionality coming soon',
            life: 3000
        });
    }
}