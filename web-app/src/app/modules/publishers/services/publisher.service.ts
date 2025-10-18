import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CatalogPublisherCreateRequestDTO, CatalogPublisherUpdateRequestDTO, Publisher, PublisherCreateRequest, PublisherUpdateRequest } from '../models/publisher.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogPublisherHttpResponse } from '../models/response.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private readonly STORAGE_KEY = 'book_tracking_publishers';
  private publishersSubject = new BehaviorSubject<Publisher[]>([]);

  publisherForm!: FormGroup

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.publisherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      location: [''],
      website: ['', [Validators.pattern(/^https?:\/\/.*$/)]],
      description: ['']
    });

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
  createPublisherOld(publisherData: PublisherCreateRequest): Observable<Publisher> {
    return new Observable(observer => {
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

      observer.next(newPublisher);
      observer.complete();
    });
  }

  // Update existing publisher
  updatePublisher(id: number, publisherData: Partial<PublisherCreateRequest>): Observable<Publisher> {
    return new Observable(observer => {
      const publishers = this.publishersSubject.value;
      const index = publishers.findIndex(p => p.id === id);

      if (index === -1) {
        observer.error(new Error('Publisher not found'));
        return;
      }

      const updatedPublisher: Publisher = {
        ...publishers[index],
        ...publisherData
      };

      const updatedPublishers = [...publishers];
      updatedPublishers[index] = updatedPublisher;

      this.publishersSubject.next(updatedPublishers);
      this.savePublishersToStorage(updatedPublishers);

      observer.next(updatedPublisher);
      observer.complete();
    });
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
      publisher.location?.toLowerCase().includes(searchTerm) ||
      publisher.description?.toLowerCase().includes(searchTerm)
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


  private savePublishersToStorage(publishers: Publisher[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(publishers));
    } catch (error) {
      console.error('Error saving publishers to storage:', error);
    }
  }


  // api methods goes here
  createCatalogPublisher(data: CatalogPublisherCreateRequestDTO): Observable<CatalogPublisherHttpResponse> {
    let url = `${environment.catalog_service_url}/publishers`;

    return this.http.post<CatalogPublisherHttpResponse>(url, data);
  }

  getAllCatalogPublishers(): Observable<CatalogPublisherHttpResponse> {
    let url = `${environment.catalog_service_url}/publishers`;

    return this.http.get<CatalogPublisherHttpResponse>(url);
  }

  getCatalogPublisherById(id: number): Observable<CatalogPublisherHttpResponse> {
    let url = `${environment.catalog_service_url}/publishers/${id}`;
    return this.http.get<CatalogPublisherHttpResponse>(url);
  }

  updateCatalogPublisher(data: CatalogPublisherUpdateRequestDTO): Observable<CatalogPublisherHttpResponse> {
    let url = `${environment.catalog_service_url}/publishers`;
    return this.http.put<CatalogPublisherHttpResponse>(url, data);
  }
}
