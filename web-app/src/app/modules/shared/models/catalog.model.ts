// Catalog entities - these represent the shared catalog across all users
export interface CatalogBook {
    id?: number;
    title: string;
    authorIds: number[];
    publisherId?: number;
    genres: string[];
    pages?: number;
    isbn?: string;
    originalPublicationDate?: string;
    description?: string;
    language?: string;
    seriesId?: number;
    seriesOrder?: number;
    coverUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CatalogAuthor {
    id?: number;
    name: string;
    biography?: string;
    birthDate?: string;
    deathDate?: string;
    nationality?: string;
    website?: string;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
    instagramUrl?: string;
    goodreadUrl?: string;
    threadsUrl?: string;
}

export interface CatalogPublisher {
    id?: number;
    name: string;
    description?: string;
    website?: string;
    foundedYear?: number;
    headquarters?: string;
    logoUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CatalogSeries {
    id?: number;
    name: string;
    description?: string;
    totalBooks?: number;
    isCompleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CatalogGenre {
    id?: number;
    name: string;
    description?: string;
    parentGenreId?: number;
    createdAt?: string;
    updatedAt?: string;
}

// User library entities - these represent user-specific data
export interface UserLibraryBook {
    id?: number;
    userId: number;
    catalogBookId: number;
    status: 'Read' | 'Reading' | 'Want to Read' | 'On Hold' | string;
    personalRating?: number;
    personalNotes?: string;
    dateAdded?: string;
    dateStarted?: string;
    dateFinished?: string;
    price?: number;
    source?: string; // Where user got the book
    isOwned?: boolean;
    condition?: string; // if physical book
    location?: string; // where book is stored
    isFavorite?: boolean;
    privateReview?: string;
    readingProgress?: number; // percentage read
    createdAt?: string;
    updatedAt?: string;
}

// Search and response interfaces
export interface CatalogSearchResult {
    type: 'book' | 'author' | 'publisher' | 'series' | 'genre';
    id: number;
    title?: string; // For books
    name?: string; // For authors, publishers, series, genres
    description?: string;
}

export interface CatalogSearchHttpResponse {
    data: any[];
    status: string;
    code: number;
}

export interface CatalogSearchQuery {
    query: string;
    type?: 'book' | 'author' | 'publisher' | 'series' | 'genre' | 'edition' | 'all';
    limit?: number;
    exactMatch?: boolean;
}

export interface BookCreateFromCatalogRequest {
    catalogBookId: number;
    status?: string;
    personalRating?: number;
    personalNotes?: string;
    price?: number;
    source?: string;
    isOwned?: boolean;
    condition?: string;
    location?: string;
}

export interface BookCreateNewRequest {
    // Catalog data
    catalogBook: Omit<CatalogBook, 'id'>;
    authors: (CatalogAuthor | { name: string })[];
    publisher?: CatalogPublisher | { name: string };
    series?: CatalogSeries | { name: string };

    // User library data
    userLibraryData: Omit<UserLibraryBook, 'id' | 'userId' | 'catalogBookId'>;
}

export interface DuplicateDetectionResult {
    hasMatches: boolean;
    exactMatches: CatalogSearchResult[];
    similarMatches: CatalogSearchResult[];
    confidence: 'high' | 'medium' | 'low';
    suggestion: 'use_existing' | 'create_new' | 'review_required';
}