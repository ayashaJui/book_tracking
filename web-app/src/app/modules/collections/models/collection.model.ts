export interface ReadingCollection {
    id?: number;
    userId?: number;
    name: string;
    description?: string;
    type?: 'reading' | 'wishlist' | 'custom'; // Type of collection
    isPublic: boolean;
    isDefault: boolean;
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
    bookCount?: number; // Computed field for UI
}

export interface CollectionBook {
    id?: number;
    collectionId: number;
    userBookId: number;
    addedAt?: string;
    displayOrder: number;
    notes?: string;
    // Populated book data for UI
    book?: {
        id: number;
        title: string;
        authorNames?: string[];
        cover?: string;
        status?: string;
        rating?: number;
        genres?: string[];
    };
}

export interface CollectionStats {
    totalCollections: number;
    totalBooks: number;
    defaultCollections: number;
    publicCollections: number;
    averageBooksPerCollection: number;
}

export interface CollectionFilters {
    searchQuery?: string;
    isPublic?: boolean;
    isDefault?: boolean;
    type?: 'reading' | 'wishlist' | 'custom';
    sortBy?: 'name' | 'createdAt' | 'bookCount';
    sortOrder?: 'asc' | 'desc';
}