import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Publisher, PublisherCreateRequest, PublisherUpdateRequest } from '../models/publisher.model';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private readonly STORAGE_KEY = 'book_tracking_publishers';
  private publishersSubject = new BehaviorSubject<Publisher[]>([]);

  constructor() {
    this.loadPublishersFromStorage();
  }

  // Observable for components to subscribe to
  get publishers$(): Observable<Publisher[]> {
    return this.publishersSubject.asObservable();
  }

  // Get all publishers
  getPublishers(): Publisher[] {
    return this.publishersSubject.value;
  }

  // Get publisher by ID
  getPublisherById(id: number): Publisher | null {
    return this.publishersSubject.value.find(p => p.id === id) || null;
  }

  // Create new publisher
  createPublisher(publisherData: PublisherCreateRequest): Publisher {
    const publishers = this.publishersSubject.value;
    const newId = this.generateId();
    
    const newPublisher: Publisher = {
      ...publisherData,
      id: newId,
      dateAdded: new Date().toISOString(),
      bookCount: 0
    };

    const updatedPublishers = [...publishers, newPublisher];
    this.publishersSubject.next(updatedPublishers);
    this.savePublishersToStorage(updatedPublishers);
    
    return newPublisher;
  }

  // Update existing publisher
  updatePublisher(publisherData: PublisherUpdateRequest): Publisher | null {
    const publishers = this.publishersSubject.value;
    const index = publishers.findIndex(p => p.id === publisherData.id);
    
    if (index === -1) {
      return null;
    }

    const updatedPublisher: Publisher = {
      ...publishers[index],
      ...publisherData
    };

    const updatedPublishers = [...publishers];
    updatedPublishers[index] = updatedPublisher;
    
    this.publishersSubject.next(updatedPublishers);
    this.savePublishersToStorage(updatedPublishers);
    
    return updatedPublisher;
  }

  // Delete publisher
  deletePublisher(id: number): boolean {
    const publishers = this.publishersSubject.value;
    const filteredPublishers = publishers.filter(p => p.id !== id);
    
    if (filteredPublishers.length === publishers.length) {
      return false; // Publisher not found
    }

    this.publishersSubject.next(filteredPublishers);
    this.savePublishersToStorage(filteredPublishers);
    return true;
  }

  // Search publishers by name
  searchPublishers(query: string): Publisher[] {
    if (!query.trim()) {
      return this.getPublishers();
    }

    const searchTerm = query.toLowerCase();
    return this.publishersSubject.value.filter(publisher =>
      publisher.name.toLowerCase().includes(searchTerm) ||
      publisher.location?.toLowerCase().includes(searchTerm)
    );
  }

  // Update book count for a publisher
  updatePublisherBookCount(publisherId: number, bookCount: number): void {
    const publishers = this.publishersSubject.value;
    const index = publishers.findIndex(p => p.id === publisherId);
    
    if (index !== -1) {
      const updatedPublishers = [...publishers];
      updatedPublishers[index] = {
        ...updatedPublishers[index],
        bookCount
      };
      
      this.publishersSubject.next(updatedPublishers);
      this.savePublishersToStorage(updatedPublishers);
    }
  }

  // Private methods
  private generateId(): number {
    const publishers = this.publishersSubject.value;
    return publishers.length > 0 ? Math.max(...publishers.map(p => p.id || 0)) + 1 : 1;
  }

  private loadPublishersFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const publishers = JSON.parse(stored) as Publisher[];
        this.publishersSubject.next(publishers);
      }
    } catch (error) {
      console.error('Error loading publishers from storage:', error);
      this.publishersSubject.next([]);
    }
  }

  private savePublishersToStorage(publishers: Publisher[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(publishers));
    } catch (error) {
      console.error('Error saving publishers to storage:', error);
    }
  }
}
