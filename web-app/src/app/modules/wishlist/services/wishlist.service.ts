import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BookService } from '../../books/services/book.service';
import { Book, BookCreateRequest } from '../../books/models/book.model';

export interface WishlistStats {
    totalItems: number;
    totalValue: number;
    averagePrice: number;
    highPriorityCount: number;
    mediumPriorityCount: number;
    lowPriorityCount: number;
}

export interface WishlistFilters {
    priority?: 'High' | 'Medium' | 'Low' | null;
    priceRange?: { min?: number; max?: number };
    genres?: string[];
    authors?: string[];
    isGiftIdea?: boolean;
    searchTerm?: string;
}

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    constructor(private bookService: BookService) { }

    // Get all wishlist books (status = 'Want to Read')
    getWishlistBooks(): Book[] {
        return this.bookService.getBooksByStatus('Want to Read');
    }

    // Get wishlist books as observable
    getWishlistBooks$(): Observable<Book[]> {
        return this.bookService.books$.pipe(
            map(books => books.filter(book => book.status === 'Want to Read'))
        );
    }

    // Get filtered wishlist books
    getFilteredWishlistBooks(filters: WishlistFilters): Book[] {
        let books = this.getWishlistBooks();

        if (filters.priority) {
            books = books.filter(book => book.wishlistPriority === filters.priority);
        }

        if (filters.priceRange) {
            books = books.filter(book => {
                const price = book.targetPrice || book.price || 0;
                if (filters.priceRange?.min && price < filters.priceRange.min) return false;
                if (filters.priceRange?.max && price > filters.priceRange.max) return false;
                return true;
            });
        }

        if (filters.genres && filters.genres.length > 0) {
            books = books.filter(book =>
                book.genres.some(genre => filters.genres!.includes(genre))
            );
        }

        if (filters.authors && filters.authors.length > 0) {
            books = books.filter(book =>
                book.authorNames?.some(author => filters.authors!.includes(author))
            );
        }

        if (filters.isGiftIdea !== undefined) {
            books = books.filter(book => book.isGiftIdea === filters.isGiftIdea);
        }

        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            books = books.filter(book =>
                book.title.toLowerCase().includes(term) ||
                book.authorNames?.some(author => author.toLowerCase().includes(term)) ||
                book.wishlistNotes?.toLowerCase().includes(term)
            );
        }

        return books;
    }

    // Add book to wishlist
    addToWishlist(bookData: Omit<BookCreateRequest, 'status'>): Book {
        const wishlistBook: BookCreateRequest = {
            ...bookData,
            status: 'Want to Read',
            wishlistPriority: bookData.wishlistPriority || 'Medium'
        };
        return this.bookService.createBook(wishlistBook);
    }

    // Update wishlist book
    updateWishlistBook(id: number, updates: Partial<Book>): void {
        const bookData = { id, ...updates };
        this.bookService.updateBook(bookData);
    }

    // Move book from wishlist to library (change status)
    moveToLibrary(id: number, newStatus: 'Reading' | 'Read'): void {
        const book = this.bookService.getBookById(id);
        if (book && book.status === 'Want to Read') {
            const updatedBook = {
                id,
                status: newStatus,
                // Clear wishlist-specific fields when moving to library
                wishlistPriority: undefined,
                targetPrice: undefined,
                targetAcquisitionDate: undefined,
                wishlistNotes: undefined,
                priceAlertThreshold: undefined,
                isGiftIdea: undefined
            };
            this.bookService.updateBook(updatedBook);
        }
    }

    // Remove from wishlist (delete book entirely)
    removeFromWishlist(id: number): void {
        this.bookService.deleteBook(id);
    }

    // Get wishlist statistics
    getWishlistStats(): WishlistStats {
        const books = this.getWishlistBooks();

        const totalItems = books.length;
        const totalValue = books.reduce((sum, book) => {
            const price = book.targetPrice || book.price || 0;
            return sum + price;
        }, 0);

        const averagePrice = totalItems > 0 ? totalValue / totalItems : 0;

        const highPriorityCount = books.filter(book => book.wishlistPriority === 'High').length;
        const mediumPriorityCount = books.filter(book => book.wishlistPriority === 'Medium').length;
        const lowPriorityCount = books.filter(book => book.wishlistPriority === 'Low').length;

        return {
            totalItems,
            totalValue,
            averagePrice,
            highPriorityCount,
            mediumPriorityCount,
            lowPriorityCount
        };
    }

    // Get books by priority
    getBooksByPriority(priority: 'High' | 'Medium' | 'Low'): Book[] {
        return this.getWishlistBooks().filter(book => book.wishlistPriority === priority);
    }

    // Get gift ideas
    getGiftIdeas(): Book[] {
        return this.getWishlistBooks().filter(book => book.isGiftIdea === true);
    }

    // Set book as gift idea
    toggleGiftIdea(id: number): void {
        const book = this.bookService.getBookById(id);
        if (book) {
            this.updateWishlistBook(id, { isGiftIdea: !book.isGiftIdea });
        }
    }

    // Update priority
    updatePriority(id: number, priority: 'High' | 'Medium' | 'Low'): void {
        this.updateWishlistBook(id, { wishlistPriority: priority });
    }

    // Set price alert
    setPriceAlert(id: number, threshold: number): void {
        this.updateWishlistBook(id, { priceAlertThreshold: threshold });
    }

    // Check for price alerts (would be called by a background service)
    checkPriceAlerts(): Book[] {
        return this.getWishlistBooks().filter(book => {
            const currentPrice = book.price || 0;
            const threshold = book.priceAlertThreshold || 0;
            return threshold > 0 && currentPrice <= threshold;
        });
    }
}