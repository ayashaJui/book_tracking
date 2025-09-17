import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Edition, EditionCreateRequest, EditionUpdateRequest } from '../models/edition.model';
import { PublisherService } from '../../publishers/services/publisher.service';

@Injectable({
  providedIn: 'root'
})
export class EditionService {
  private readonly STORAGE_KEY = 'book_tracking_editions';
  private editionsSubject = new BehaviorSubject<Edition[]>([]);

  constructor(private publisherService: PublisherService) {
    this.loadEditionsFromStorage();
  }

  // Observable for components to subscribe to
  get editions$(): Observable<Edition[]> {
    return this.editionsSubject.asObservable();
  }

  // Get all editions
  getEditions(): Edition[] {
    return this.editionsSubject.value.map(edition => this.populatePublisherName(edition));
  }

  // Get edition by ID
  getEditionById(id: number): Edition | null {
    const edition = this.editionsSubject.value.find(e => e.id === id);
    return edition ? this.populatePublisherName(edition) : null;
  }

  // Get editions by book ID
  getEditionsByBook(bookId: number): Edition[] {
    return this.editionsSubject.value
      .filter(edition => edition.bookId === bookId)
      .map(edition => this.populatePublisherName(edition));
  }

  // Get editions by publisher ID
  getEditionsByPublisher(publisherId: number): Edition[] {
    return this.editionsSubject.value
      .filter(edition => edition.publisherId === publisherId)
      .map(edition => this.populatePublisherName(edition));
  }

  // Get owned editions
  getOwnedEditions(): Edition[] {
    return this.editionsSubject.value
      .filter(edition => edition.isOwned)
      .map(edition => this.populatePublisherName(edition));
  }

  // Create new edition
  createEdition(editionData: EditionCreateRequest): Edition {
    const editions = this.editionsSubject.value;
    const newId = this.generateId();
    
    const newEdition: Edition = {
      ...editionData,
      id: newId,
      dateAdded: new Date().toISOString(),
      currency: editionData.currency || 'USD',
      language: editionData.language || 'English',
      isOwned: editionData.isOwned || false
    };

    const updatedEditions = [...editions, newEdition];
    this.editionsSubject.next(updatedEditions);
    this.saveEditionsToStorage(updatedEditions);
    
    return this.populatePublisherName(newEdition);
  }

  // Update existing edition
  updateEdition(editionData: EditionUpdateRequest): Edition | null {
    const editions = this.editionsSubject.value;
    const index = editions.findIndex(e => e.id === editionData.id);
    
    if (index === -1) {
      return null;
    }

    const updatedEdition: Edition = {
      ...editions[index],
      ...editionData
    };

    const updatedEditions = [...editions];
    updatedEditions[index] = updatedEdition;
    
    this.editionsSubject.next(updatedEditions);
    this.saveEditionsToStorage(updatedEditions);
    
    return this.populatePublisherName(updatedEdition);
  }

  // Delete edition
  deleteEdition(id: number): boolean {
    const editions = this.editionsSubject.value;
    const filteredEditions = editions.filter(e => e.id !== id);
    
    if (filteredEditions.length === editions.length) {
      return false; // Edition not found
    }

    this.editionsSubject.next(filteredEditions);
    this.saveEditionsToStorage(filteredEditions);
    return true;
  }

  // Delete all editions for a book
  deleteEditionsByBook(bookId: number): void {
    const editions = this.editionsSubject.value;
    const filteredEditions = editions.filter(e => e.bookId !== bookId);
    
    this.editionsSubject.next(filteredEditions);
    this.saveEditionsToStorage(filteredEditions);
  }

  // Search editions by ISBN
  searchEditionsByISBN(isbn: string): Edition[] {
    if (!isbn.trim()) {
      return [];
    }

    const searchTerm = isbn.replace(/[-\s]/g, ''); // Remove dashes and spaces
    return this.editionsSubject.value
      .filter(edition => 
        edition.isbn?.replace(/[-\s]/g, '').includes(searchTerm) ||
        edition.isbn13?.replace(/[-\s]/g, '').includes(searchTerm)
      )
      .map(edition => this.populatePublisherName(edition));
  }

  // Get editions by format
  getEditionsByFormat(format: string): Edition[] {
    return this.editionsSubject.value
      .filter(edition => edition.format === format)
      .map(edition => this.populatePublisherName(edition));
  }

  // Private methods
  private populatePublisherName(edition: Edition): Edition {
    if (edition.publisherId) {
      const publisher = this.publisherService.getPublisherById(edition.publisherId);
      return {
        ...edition,
        publisherName: publisher?.name
      };
    }
    return edition;
  }

  private generateId(): number {
    const editions = this.editionsSubject.value;
    return editions.length > 0 ? Math.max(...editions.map(e => e.id || 0)) + 1 : 1;
  }

  private loadEditionsFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const editions = JSON.parse(stored) as Edition[];
        this.editionsSubject.next(editions);
      } else {
        // Initialize with dummy data if no data exists
        this.initializeDummyEditions();
      }
    } catch (error) {
      console.error('Error loading editions from storage:', error);
      this.initializeDummyEditions();
    }
  }

  private initializeDummyEditions(): void {
    const dummyEditions: Edition[] = [
      // The Name of the Wind (multiple editions)
      {
        id: 1,
        bookId: 1,
        format: 'Hardcover',
        isbn: '978-0756404079',
        isbn13: '978-0756404079',
        publicationDate: '2007-03-27',
        price: 27.99,
        currency: 'USD',
        pages: 662,
        publisherId: 1, // DAW Books
        language: 'English',
        dimensions: '6.4 x 9.5 inches',
        weight: '1.8 lbs',
        isOwned: true,
        dateAdded: '2023-01-15T10:00:00Z',
        condition: 'Like New',
        notes: 'First edition hardcover, dust jacket included. Beautiful cover art.'
      },
      {
        id: 2,
        bookId: 1,
        format: 'Paperback',
        isbn: '978-0756405896',
        isbn13: '978-0756405896',
        publicationDate: '2008-04-01',
        price: 16.99,
        currency: 'USD',
        pages: 672,
        publisherId: 1, // DAW Books
        language: 'English',
        dimensions: '4.2 x 6.9 inches',
        weight: '0.9 lbs',
        isOwned: true,
        dateAdded: '2023-02-10T14:30:00Z',
        condition: 'Very Good',
        notes: 'Mass market paperback for travel reading. Some wear on spine.'
      },
      {
        id: 3,
        bookId: 1,
        format: 'Ebook',
        publicationDate: '2007-03-27',
        price: 12.99,
        currency: 'USD',
        publisherId: 1, // DAW Books
        language: 'English',
        isOwned: true,
        dateAdded: '2023-03-05T09:15:00Z',
        condition: 'New',
        notes: 'Kindle edition with enhanced formatting and bookmarks.'
      },
      {
        id: 4,
        bookId: 1,
        format: 'Audiobook',
        publicationDate: '2007-05-15',
        price: 24.95,
        currency: 'USD',
        publisherId: 1, // DAW Books
        language: 'English',
        isOwned: false,
        dateAdded: '2023-04-20T16:45:00Z',
        condition: 'New',
        notes: 'Narrated by Rupert Degas. 27 hours 55 minutes. Wishlist item.'
      },

      // The Wise Man's Fear (multiple editions)
      {
        id: 5,
        bookId: 2,
        format: 'Hardcover',
        isbn: '978-0756407919',
        isbn13: '978-0756407919',
        publicationDate: '2011-03-01',
        price: 29.99,
        currency: 'USD',
        pages: 994,
        publisherId: 1, // DAW Books
        language: 'English',
        dimensions: '6.4 x 9.5 inches',
        weight: '2.4 lbs',
        isOwned: true,
        dateAdded: '2023-01-20T11:00:00Z',
        condition: 'New',
        notes: 'Pre-ordered first edition. Pristine condition with dust jacket.'
      },
      {
        id: 6,
        bookId: 2,
        format: 'Paperback',
        isbn: '978-0756407926',
        isbn13: '978-0756407926',
        publicationDate: '2012-05-01',
        price: 18.99,
        currency: 'USD',
        pages: 1008,
        publisherId: 1, // DAW Books
        language: 'English',
        dimensions: '4.2 x 6.9 inches',
        weight: '1.2 lbs',
        isOwned: false,
        dateAdded: '2023-06-12T13:20:00Z',
        condition: 'New',
        notes: 'Considering purchase for lending library.'
      },

      // A Wizard of Earthsea (vintage editions)
      {
        id: 7,
        bookId: 3,
        format: 'Hardcover',
        isbn: '978-0395066218',
        isbn13: '978-0395066218',
        publicationDate: '1968-11-01',
        price: 125.00,
        currency: 'USD',
        pages: 183,
        publisherId: 2, // Random House
        language: 'English',
        dimensions: '5.5 x 8.25 inches',
        weight: '0.8 lbs',
        isOwned: true,
        dateAdded: '2023-07-15T10:30:00Z',
        condition: 'Good',
        notes: 'Original 1968 first edition! Some foxing on pages but binding solid. Collector\'s item.'
      },
      {
        id: 8,
        bookId: 3,
        format: 'Paperback',
        isbn: '978-0553262506',
        isbn13: '978-0553262506',
        publicationDate: '1975-09-01',
        price: 8.99,
        currency: 'USD',
        pages: 192,
        publisherId: 3, // Bantam
        language: 'English',
        dimensions: '4.2 x 6.9 inches',
        weight: '0.3 lbs',
        isOwned: true,
        dateAdded: '2023-02-28T15:45:00Z',
        condition: 'Acceptable',
        notes: 'Vintage 1970s edition with classic cover art. Well-read copy.'
      },
      {
        id: 9,
        bookId: 3,
        format: 'Ebook',
        publicationDate: '2012-06-26',
        price: 9.99,
        currency: 'USD',
        publisherId: 4, // Houghton Mifflin
        language: 'English',
        isOwned: true,
        dateAdded: '2023-05-10T12:00:00Z',
        condition: 'New',
        notes: 'Modern ebook edition with updated formatting.'
      },

      // The Left Hand of Darkness (collector editions)
      {
        id: 10,
        bookId: 4,
        format: 'Hardcover',
        isbn: '978-0441478125',
        isbn13: '978-0441478125',
        publicationDate: '1969-08-01',
        price: 200.00,
        currency: 'USD',
        pages: 286,
        publisherId: 5, // Ace Books
        language: 'English',
        dimensions: '5.5 x 8.5 inches',
        weight: '1.1 lbs',
        isOwned: false,
        dateAdded: '2023-08-05T14:20:00Z',
        condition: 'Very Good',
        notes: 'First edition hardcover. Seeking for collection. Price negotiable.'
      },
      {
        id: 11,
        bookId: 4,
        format: 'Paperback',
        isbn: '978-0441007318',
        isbn13: '978-0441007318',
        publicationDate: '1976-01-01',
        price: 12.99,
        currency: 'USD',
        pages: 304,
        publisherId: 5, // Ace Books
        language: 'English',
        dimensions: '4.2 x 6.9 inches',
        weight: '0.4 lbs',
        isOwned: true,
        dateAdded: '2023-03-18T09:30:00Z',
        condition: 'Very Good',
        notes: 'Classic Ace paperback edition with iconic cover design.'
      },

      // The Dragonbone Chair (signed editions)
      {
        id: 12,
        bookId: 5,
        format: 'Hardcover',
        isbn: '978-0886773830',
        isbn13: '978-0886773830',
        publicationDate: '1988-10-01',
        price: 350.00,
        currency: 'USD',
        pages: 654,
        publisherId: 1, // DAW Books
        language: 'English',
        dimensions: '6.1 x 9.2 inches',
        weight: '2.0 lbs',
        isOwned: true,
        dateAdded: '2023-09-12T16:00:00Z',
        condition: 'Like New',
        notes: 'SIGNED first edition! Author signature on title page. Convention exclusive.'
      },
      {
        id: 13,
        bookId: 5,
        format: 'Paperback',
        isbn: '978-0886774721',
        isbn13: '978-0886774721',
        publicationDate: '1989-09-01',
        price: 14.99,
        currency: 'USD',
        pages: 672,
        publisherId: 1, // DAW Books
        language: 'English',
        dimensions: '4.2 x 6.9 inches',
        weight: '0.9 lbs',
        isOwned: true,
        dateAdded: '2023-01-30T11:15:00Z',
        condition: 'Good',
        notes: 'Reading copy with some shelf wear. Perfect for re-reads.'
      },

      // International editions and special formats
      {
        id: 14,
        bookId: 1, // The Name of the Wind - German edition
        format: 'Hardcover',
        isbn: '978-3608937732',
        isbn13: '978-3608937732',
        publicationDate: '2008-09-15',
        price: 24.95,
        currency: 'EUR',
        pages: 735,
        publisherId: 6, // Klett-Cotta (German publisher)
        language: 'German',
        dimensions: '13.5 x 21.5 cm',
        weight: '0.9 kg',
        isOwned: true,
        dateAdded: '2023-05-25T13:40:00Z',
        condition: 'New',
        notes: 'German translation "Der Name des Windes". Beautiful European binding.'
      },
      {
        id: 15,
        bookId: 3, // A Wizard of Earthsea - Anniversary edition
        format: 'Hardcover',
        isbn: '978-0547773742',
        isbn13: '978-0547773742',
        publicationDate: '2018-10-01',
        price: 35.00,
        currency: 'USD',
        pages: 183,
        publisherId: 4, // Houghton Mifflin
        language: 'English',
        dimensions: '6 x 9 inches',
        weight: '1.2 lbs',
        isOwned: true,
        dateAdded: '2023-10-15T18:30:00Z',
        condition: 'New',
        notes: '50th Anniversary Edition with new illustrations and foreword. Gift quality.'
      },
      {
        id: 16,
        bookId: 2, // The Wise Man's Fear - Limited edition
        format: 'Hardcover',
        isbn: '978-0756407920',
        isbn13: '978-0756407920',
        publicationDate: '2011-03-01',
        price: 89.99,
        currency: 'USD',
        pages: 994,
        publisherId: 1, // DAW Books
        language: 'English',
        dimensions: '6.4 x 9.5 inches',
        weight: '2.6 lbs',
        isOwned: false,
        dateAdded: '2023-11-08T20:15:00Z',
        condition: 'New',
        notes: 'Limited numbered edition (1 of 1000) with slipcase and author signature plate. Dream purchase!'
      }
    ];

    this.editionsSubject.next(dummyEditions);
    this.saveEditionsToStorage(dummyEditions);
  }

  private saveEditionsToStorage(editions: Edition[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(editions));
    } catch (error) {
      console.error('Error saving editions to storage:', error);
    }
  }
}
