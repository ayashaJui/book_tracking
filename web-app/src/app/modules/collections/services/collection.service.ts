import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReadingCollection, CollectionBook, CollectionStats, CollectionFilters } from '../models/collection.model';

@Injectable({
    providedIn: 'root'
})
export class CollectionService {
    private collectionsSubject = new BehaviorSubject<ReadingCollection[]>([]);
    private collectionBooksSubject = new BehaviorSubject<CollectionBook[]>([]);

    // Mock data
    private mockCollections: ReadingCollection[] = [
        {
            id: 1,
            name: 'Currently Reading',
            description: 'Books I am currently reading',
            type: 'reading',
            isPublic: false,
            isDefault: true,
            sortOrder: 1,
            createdAt: '2025-01-01',
            bookCount: 3
        },
        {
            id: 2,
            name: '2025 Reading Challenge',
            description: 'My goal to read 24 books this year',
            type: 'reading',
            isPublic: true,
            isDefault: false,
            sortOrder: 2,
            createdAt: '2025-01-01',
            bookCount: 8
        },
        {
            id: 3,
            name: 'Productivity & Self-Help',
            description: 'Books to improve productivity and personal development',
            type: 'reading',
            isPublic: false,
            isDefault: false,
            sortOrder: 3,
            createdAt: '2025-02-15',
            bookCount: 12
        },
        {
            id: 4,
            name: 'Fiction Favorites',
            description: 'My favorite fiction books and series',
            type: 'reading',
            isPublic: true,
            isDefault: false,
            sortOrder: 4,
            createdAt: '2025-03-01',
            bookCount: 15
        },
        {
            id: 5,
            name: 'Want to Read',
            description: 'Books on my reading wishlist',
            type: 'wishlist',
            isPublic: false,
            isDefault: true,
            sortOrder: 5,
            createdAt: '2025-01-01',
            bookCount: 25
        },
        {
            id: 6,
            name: 'Programming & Tech',
            description: 'Technical books for software development',
            type: 'reading',
            isPublic: false,
            isDefault: false,
            sortOrder: 6,
            createdAt: '2025-04-10',
            bookCount: 7
        },
        {
            id: 7,
            name: 'High Priority Wishlist',
            description: 'Books I really want to read soon',
            type: 'wishlist',
            isPublic: false,
            isDefault: false,
            sortOrder: 7,
            createdAt: '2025-05-01',
            bookCount: 8
        },
        {
            id: 8,
            name: 'Gift Ideas',
            description: 'Books that would make great gifts',
            type: 'wishlist',
            isPublic: true,
            isDefault: false,
            sortOrder: 8,
            createdAt: '2025-05-15',
            bookCount: 12
        }
    ];

    private mockCollectionBooks: CollectionBook[] = [
        // Currently Reading collection
        {
            id: 1, collectionId: 1, userBookId: 1, displayOrder: 1, addedAt: '2025-09-01',
            book: { id: 1, title: 'Atomic Habits', authorNames: ['James Clear'], cover: 'assets/images/product-not-found.png', status: 'Reading', rating: 5, genres: ['Self-Help', 'Psychology'] }
        },
        {
            id: 2, collectionId: 1, userBookId: 2, displayOrder: 2, addedAt: '2025-09-15',
            book: { id: 2, title: 'Deep Work', authorNames: ['Cal Newport'], cover: 'assets/images/product-not-found.png', status: 'Reading', rating: 4, genres: ['Productivity', 'Self-Help'] }
        },

        // 2025 Reading Challenge
        {
            id: 3, collectionId: 2, userBookId: 3, displayOrder: 1, addedAt: '2025-01-01',
            book: { id: 3, title: 'The Psychology of Money', authorNames: ['Morgan Housel'], cover: 'assets/images/product-not-found.png', status: 'Read', rating: 5, genres: ['Finance', 'Psychology'] }
        },
        {
            id: 4, collectionId: 2, userBookId: 4, displayOrder: 2, addedAt: '2025-02-01',
            book: { id: 4, title: 'Sapiens', authorNames: ['Yuval Noah Harari'], cover: 'assets/images/product-not-found.png', status: 'Read', rating: 4, genres: ['History', 'Anthropology'] }
        },

        // Productivity & Self-Help
        {
            id: 5, collectionId: 3, userBookId: 1, displayOrder: 1, addedAt: '2025-02-15',
            book: { id: 1, title: 'Atomic Habits', authorNames: ['James Clear'], cover: 'assets/images/product-not-found.png', status: 'Reading', rating: 5, genres: ['Self-Help', 'Psychology'] }
        },
        {
            id: 6, collectionId: 3, userBookId: 2, displayOrder: 2, addedAt: '2025-02-15',
            book: { id: 2, title: 'Deep Work', authorNames: ['Cal Newport'], cover: 'assets/images/product-not-found.png', status: 'Reading', rating: 4, genres: ['Productivity', 'Self-Help'] }
        },

        // Fiction Favorites
        {
            id: 7, collectionId: 4, userBookId: 5, displayOrder: 1, addedAt: '2025-03-01',
            book: { id: 5, title: 'The Name of the Wind', authorNames: ['Patrick Rothfuss'], cover: 'assets/images/product-not-found.png', status: 'Read', rating: 5, genres: ['Fantasy', 'Adventure'] }
        },
        {
            id: 8, collectionId: 4, userBookId: 6, displayOrder: 2, addedAt: '2025-03-05',
            book: { id: 6, title: 'The Hobbit', authorNames: ['J.R.R. Tolkien'], cover: 'assets/images/product-not-found.png', status: 'Read', rating: 5, genres: ['Fantasy', 'Adventure'] }
        },
    ];

    constructor() {
        this.collectionsSubject.next(this.mockCollections);
        this.collectionBooksSubject.next(this.mockCollectionBooks);
    }

    // Observables
    getCollections(): Observable<ReadingCollection[]> {
        return this.collectionsSubject.asObservable();
    }

    getCollectionBooks(): Observable<CollectionBook[]> {
        return this.collectionBooksSubject.asObservable();
    }

    // Collection CRUD operations
    getAllCollections(): ReadingCollection[] {
        return this.mockCollections;
    }

    getCollectionById(id: number): ReadingCollection | undefined {
        return this.mockCollections.find(c => c.id === id);
    }

    createCollection(collection: Omit<ReadingCollection, 'id' | 'createdAt' | 'updatedAt' | 'bookCount'>): ReadingCollection {
        const newCollection: ReadingCollection = {
            ...collection,
            id: Math.max(...this.mockCollections.map(c => c.id || 0)) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            bookCount: 0
        };

        this.mockCollections.push(newCollection);
        this.collectionsSubject.next([...this.mockCollections]);
        return newCollection;
    }

    updateCollection(id: number, updates: Partial<ReadingCollection>): ReadingCollection | null {
        const index = this.mockCollections.findIndex(c => c.id === id);
        if (index === -1) return null;

        this.mockCollections[index] = {
            ...this.mockCollections[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.collectionsSubject.next([...this.mockCollections]);
        return this.mockCollections[index];
    }

    deleteCollection(id: number): boolean {
        const index = this.mockCollections.findIndex(c => c.id === id);
        if (index === -1) return false;

        // Don't allow deleting default collections
        if (this.mockCollections[index].isDefault) {
            return false;
        }

        this.mockCollections.splice(index, 1);

        // Remove all books from this collection
        this.mockCollectionBooks = this.mockCollectionBooks.filter(cb => cb.collectionId !== id);

        this.collectionsSubject.next([...this.mockCollections]);
        this.collectionBooksSubject.next([...this.mockCollectionBooks]);
        return true;
    }

    // Collection Books operations
    getBooksInCollection(collectionId: number): CollectionBook[] {
        return this.mockCollectionBooks
            .filter(cb => cb.collectionId === collectionId)
            .sort((a, b) => a.displayOrder - b.displayOrder);
    }

    addBookToCollection(collectionId: number, userBookId: number, notes?: string): CollectionBook | null {
        // Check if book is already in collection
        const exists = this.mockCollectionBooks.find(cb =>
            cb.collectionId === collectionId && cb.userBookId === userBookId
        );
        if (exists) return null;

        const newCollectionBook: CollectionBook = {
            id: Math.max(...this.mockCollectionBooks.map(cb => cb.id || 0)) + 1,
            collectionId,
            userBookId,
            displayOrder: this.getBooksInCollection(collectionId).length + 1,
            addedAt: new Date().toISOString(),
            notes
        };

        this.mockCollectionBooks.push(newCollectionBook);
        this.updateCollectionBookCount(collectionId);
        this.collectionBooksSubject.next([...this.mockCollectionBooks]);
        return newCollectionBook;
    }

    removeBookFromCollection(collectionId: number, userBookId: number): boolean {
        const index = this.mockCollectionBooks.findIndex(cb =>
            cb.collectionId === collectionId && cb.userBookId === userBookId
        );
        if (index === -1) return false;

        this.mockCollectionBooks.splice(index, 1);
        this.updateCollectionBookCount(collectionId);
        this.collectionBooksSubject.next([...this.mockCollectionBooks]);
        return true;
    }

    reorderBooksInCollection(collectionId: number, bookIds: number[]): void {
        bookIds.forEach((userBookId, index) => {
            const book = this.mockCollectionBooks.find(cb =>
                cb.collectionId === collectionId && cb.userBookId === userBookId
            );
            if (book) {
                book.displayOrder = index + 1;
            }
        });
        this.collectionBooksSubject.next([...this.mockCollectionBooks]);
    }

    // Helper methods
    private updateCollectionBookCount(collectionId: number): void {
        const collection = this.mockCollections.find(c => c.id === collectionId);
        if (collection) {
            collection.bookCount = this.getBooksInCollection(collectionId).length;
            this.collectionsSubject.next([...this.mockCollections]);
        }
    }

    getCollectionStats(): CollectionStats {
        const totalBooks = this.mockCollectionBooks.length;
        const totalCollections = this.mockCollections.length;

        return {
            totalCollections,
            totalBooks,
            defaultCollections: this.mockCollections.filter(c => c.isDefault).length,
            publicCollections: this.mockCollections.filter(c => c.isPublic).length,
            averageBooksPerCollection: totalCollections > 0 ? Math.round(totalBooks / totalCollections) : 0
        };
    }

    searchCollections(filters: CollectionFilters): ReadingCollection[] {
        let filtered = [...this.mockCollections];

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.description?.toLowerCase().includes(query)
            );
        }

        if (filters.isPublic !== undefined) {
            filtered = filtered.filter(c => c.isPublic === filters.isPublic);
        }

        if (filters.isDefault !== undefined) {
            filtered = filtered.filter(c => c.isDefault === filters.isDefault);
        }

        if (filters.type) {
            filtered = filtered.filter(c => c.type === filters.type);
        }

        // Sort
        const sortBy = filters.sortBy || 'sortOrder';
        const sortOrder = filters.sortOrder || 'asc';

        filtered.sort((a, b) => {
            let aVal: any = a[sortBy];
            let bVal: any = b[sortBy];

            if (sortBy === 'createdAt') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }

            if (sortOrder === 'desc') {
                return bVal - aVal;
            }
            return aVal - bVal;
        });

        return filtered;
    }

    getDefaultCollections(): ReadingCollection[] {
        return this.mockCollections.filter(c => c.isDefault);
    }

    getPublicCollections(): ReadingCollection[] {
        return this.mockCollections.filter(c => c.isPublic);
    }

    // Get collections by type
    getCollectionsByType(type: 'reading' | 'wishlist' | 'custom'): ReadingCollection[] {
        return this.mockCollections.filter(c => c.type === type);
    }

    // Get all wishlist collections
    getWishlistCollections(): ReadingCollection[] {
        return this.getCollectionsByType('wishlist');
    }

    // Get reading collections
    getReadingCollections(): ReadingCollection[] {
        return this.getCollectionsByType('reading');
    }
}