// Catalog Genre - represents genres in the catalog
export interface CatalogGenre {
    id: number;
    name: string;
    description?: string;
    parentGenreId?: number; // For sub-genres (e.g., Epic Fantasy under Fantasy)
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// User Genre Preference - represents user's preferences for genres
export interface UserGenrePreference {
    id?: number;
    userId: number;
    catalogGenreId: number;
    preferenceLevel: number; // 1-5 scale (1 = strongly dislike, 5 = love)
    isExcluded: boolean; // If true, user wants to avoid this genre
    notes?: string; // Personal notes about this genre preference
    createdAt: Date;
    updatedAt: Date;

    // Related data
    catalogGenre?: CatalogGenre;
}

// Combined Genre - for display purposes, combines catalog and user data
export interface Genre {
    id: number;
    name: string;
    description?: string;
    parentGenreId?: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    // User preference fields (from user_genre_preferences table)
    preferenceLevel?: number; // 1-5 scale
    isExcluded?: boolean;
    notes?: string; // User's personal notes
    hasPreference?: boolean; // Whether user has set preferences for this genre

    // Hierarchical fields
    subGenres?: Genre[];
    parentGenre?: Genre;
    level?: number;
}

// DTOs for API calls
export interface GenreCreateRequest {
    name: string;
    description?: string;
    parentGenreId?: number;
    isActive?: boolean;

    // User preference fields
    preferenceLevel?: number;
    isExcluded?: boolean;
    notes?: string;
}

export interface CatalogGenreCreateRequestDTO {
    name: string;
    description: string;
    parentGenreId?: number;
    isActive: boolean;
}

export interface UserGenrePreferenceCreateRequestDTO {
    userId: number;
    catalogGenreId: number;
    preferenceLevel: number;
    isExcluded: boolean;
    notes: string;
}

export interface UserGenrePreferenceUpdateRequestDTO {
    id: number;
    userId: number;
    catalogGenreId: number;
    preferenceLevel: number;
    isExcluded: boolean;
    notes: string;
}

// Genre statistics
export interface GenreStats {
    totalBooks: number;
    readBooks: number;
    unreadBooks: number;
    averageRating: number;
}

// Genre hierarchy helper
export interface GenreHierarchy {
    rootGenres: Genre[];
    allGenres: Genre[];
    genreMap: Map<number, Genre>;
}

// Genre filter options
export interface GenreFilterOptions {
    includeInactive?: boolean;
    parentGenreId?: number;
    level?: number;
    hasUserPreferences?: boolean;
    excludedGenres?: boolean;
    preferenceLevel?: {
        min?: number;
        max?: number;
    };
}

