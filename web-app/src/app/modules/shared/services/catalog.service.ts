import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import {
    CatalogBook,
    CatalogAuthor,
    CatalogPublisher,
    CatalogSeries,
    CatalogGenre,
    CatalogSearchResult,
    CatalogSearchQuery,
    DuplicateDetectionResult,
    BookCreateNewRequest,
    UserLibraryBook
} from '../models/catalog.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CatalogService {
    private readonly catalogApiUrl = '/api/catalog';
    private readonly userLibraryApiUrl = '/api/user-library';

    constructor(private http: HttpClient) { }

    // Search across all catalog entities
    search(query: CatalogSearchQuery): Observable<CatalogSearchResult[]> {
        console.log('CatalogService.search called with query:', query);
        const params = new HttpParams()
            .set('query', query.query)
            .set('type', query.type || 'all')
            .set('limit', (query.limit || 50).toString())
            .set('exactMatch', (query.exactMatch || false).toString());

        return this.http.get<CatalogSearchResult[]>(`${this.catalogApiUrl}/search`, { params })
            .pipe(
                catchError(error => {
                    console.error('Error searching catalog:', error);
                    return of([]);
                })
            );
    }

    // Search for books specifically
    searchBooks(title: string, authorNames?: string[]): Observable<CatalogBook[]> {
        let params = new HttpParams().set('title', title);

        if (authorNames && authorNames.length > 0) {
            params = params.set('authors', authorNames.join(','));
        }

        return this.http.get<CatalogBook[]>(`${this.catalogApiUrl}/books/search`, { params })
            .pipe(
                catchError(error => {
                    console.error('Error searching books:', error);
                    return of([]);
                })
            );
    }

    // Search for authors
    searchAuthors(name: string): Observable<CatalogAuthor[]> {
        const params = new HttpParams().set('authorName', name);

        let url = `${environment.catalog_service_url}/authors/search`;

        return this.http.get(url, { params }) as Observable<CatalogAuthor[]>
    }

    // Search for publishers
    searchPublishers(name: string): Observable<CatalogPublisher[]> {
        const params = new HttpParams().set('name', name);

        return this.http.get<CatalogPublisher[]>(`${this.catalogApiUrl}/publishers/search`, { params })
            .pipe(
                catchError(error => {
                    console.error('Error searching publishers:', error);
                    return of([]);
                })
            );
    }

    // Search for series
    searchSeries(name: string): Observable<CatalogSeries[]> {
        const params = new HttpParams().set('name', name);

        return this.http.get<CatalogSeries[]>(`${this.catalogApiUrl}/series/search`, { params })
            .pipe(
                catchError(error => {
                    console.error('Error searching series:', error);
                    return of([]);
                })
            );
    }

    // Detect duplicates with confidence scoring
    detectDuplicates(bookData: Partial<CatalogBook>): Observable<DuplicateDetectionResult> {
        return this.http.post<DuplicateDetectionResult>(`${this.catalogApiUrl}/books/detect-duplicates`, bookData)
            .pipe(
                catchError(error => {
                    console.error('Error detecting duplicates:', error);
                    return of({
                        hasMatches: false,
                        exactMatches: [],
                        similarMatches: [],
                        confidence: 'low' as const,
                        suggestion: 'create_new' as const
                    } as DuplicateDetectionResult);
                })
            );
    }

    // Create or get existing catalog entities
    ensureBookInCatalog(bookData: Omit<CatalogBook, 'id'>): Observable<CatalogBook> {
        return this.detectDuplicates(bookData).pipe(
            switchMap(duplicateResult => {
                if (duplicateResult.hasMatches && duplicateResult.exactMatches.length > 0) {
                    // Return existing book
                    const existingBookId = duplicateResult.exactMatches[0].id;
                    return this.getCatalogBook(existingBookId);
                } else {
                    // Create new book in catalog
                    return this.createCatalogBook(bookData);
                }
            })
        );
    }

    ensureAuthorInCatalog(authorData: Omit<CatalogAuthor, 'id'>): Observable<CatalogAuthor> {
        return this.searchAuthors(authorData.name).pipe(
            switchMap(existingAuthors => {
                const exactMatch = existingAuthors.find(a =>
                    a.name.toLowerCase().trim() === authorData.name.toLowerCase().trim()
                );

                if (exactMatch) {
                    return of(exactMatch);
                } else {
                    return this.createCatalogAuthor(authorData);
                }
            })
        );
    }

    ensurePublisherInCatalog(publisherData: Omit<CatalogPublisher, 'id'>): Observable<CatalogPublisher> {
        return this.searchPublishers(publisherData.name).pipe(
            switchMap(existingPublishers => {
                const exactMatch = existingPublishers.find(p =>
                    p.name.toLowerCase().trim() === publisherData.name.toLowerCase().trim()
                );

                if (exactMatch) {
                    return of(exactMatch);
                } else {
                    return this.createCatalogPublisher(publisherData);
                }
            })
        );
    }

    ensureSeriesInCatalog(seriesData: Omit<CatalogSeries, 'id'>): Observable<CatalogSeries> {
        return this.searchSeries(seriesData.name).pipe(
            switchMap(existingSeries => {
                const exactMatch = existingSeries.find(s =>
                    s.name.toLowerCase().trim() === seriesData.name.toLowerCase().trim()
                );

                if (exactMatch) {
                    return of(exactMatch);
                } else {
                    return this.createCatalogSeries(seriesData);
                }
            })
        );
    }

    // CRUD operations for catalog entities
    getCatalogBook(id: number): Observable<CatalogBook> {
        return this.http.get<CatalogBook>(`${this.catalogApiUrl}/books/${id}`);
    }

    createCatalogBook(bookData: Omit<CatalogBook, 'id'>): Observable<CatalogBook> {
        return this.http.post<CatalogBook>(`${this.catalogApiUrl}/books`, bookData);
    }

    updateCatalogBook(id: number, bookData: Partial<CatalogBook>): Observable<CatalogBook> {
        return this.http.put<CatalogBook>(`${this.catalogApiUrl}/books/${id}`, bookData);
    }

    createCatalogAuthor(authorData: Omit<CatalogAuthor, 'id'>): Observable<CatalogAuthor> {
        return this.http.post<CatalogAuthor>(`${this.catalogApiUrl}/authors`, authorData);
    }

    createCatalogPublisher(publisherData: Omit<CatalogPublisher, 'id'>): Observable<CatalogPublisher> {
        return this.http.post<CatalogPublisher>(`${this.catalogApiUrl}/publishers`, publisherData);
    }

    createCatalogSeries(seriesData: Omit<CatalogSeries, 'id'>): Observable<CatalogSeries> {
        return this.http.post<CatalogSeries>(`${this.catalogApiUrl}/series`, seriesData);
    }

    // User library operations
    addBookToUserLibrary(bookData: Omit<UserLibraryBook, 'id' | 'userId'>): Observable<UserLibraryBook> {
        return this.http.post<UserLibraryBook>(`${this.userLibraryApiUrl}/books`, bookData);
    }

    updateUserLibraryBook(id: number, bookData: Partial<UserLibraryBook>): Observable<UserLibraryBook> {
        return this.http.put<UserLibraryBook>(`${this.userLibraryApiUrl}/books/${id}`, bookData);
    }

    getUserLibraryBooks(): Observable<UserLibraryBook[]> {
        return this.http.get<UserLibraryBook[]>(`${this.userLibraryApiUrl}/books`);
    }

    removeBookFromUserLibrary(id: number): Observable<void> {
        return this.http.delete<void>(`${this.userLibraryApiUrl}/books/${id}`);
    }

    // Complete book creation flow
    createCompleteBook(request: BookCreateNewRequest): Observable<UserLibraryBook> {
        // Step 1: Ensure all catalog entities exist
        const authorRequests = request.authors.map(author => {
            if ('id' in author && author.id) {
                return of(author as CatalogAuthor);
            } else {
                return this.ensureAuthorInCatalog(author as Omit<CatalogAuthor, 'id'>);
            }
        });

        const publisherRequest = request.publisher ?
            ('id' in request.publisher && request.publisher.id ?
                of(request.publisher as CatalogPublisher) :
                this.ensurePublisherInCatalog(request.publisher as Omit<CatalogPublisher, 'id'>)
            ) : of(null);

        const seriesRequest = request.series ?
            ('id' in request.series && request.series.id ?
                of(request.series as CatalogSeries) :
                this.ensureSeriesInCatalog(request.series as Omit<CatalogSeries, 'id'>)
            ) : of(null);

        return forkJoin({
            authors: forkJoin(authorRequests),
            publisher: publisherRequest,
            series: seriesRequest
        }).pipe(
            switchMap(({ authors, publisher, series }) => {
                // Step 2: Create catalog book with resolved IDs
                const catalogBookData: Omit<CatalogBook, 'id'> = {
                    ...request.catalogBook,
                    authorIds: authors.map(a => a.id!),
                    publisherId: publisher?.id,
                    seriesId: series?.id
                };

                return this.ensureBookInCatalog(catalogBookData);
            }),
            switchMap(catalogBook => {
                // Step 3: Create user library entry
                const userLibraryData: Omit<UserLibraryBook, 'id' | 'userId'> = {
                    ...request.userLibraryData,
                    catalogBookId: catalogBook.id!
                };

                return this.addBookToUserLibrary(userLibraryData);
            })
        );
    }
}