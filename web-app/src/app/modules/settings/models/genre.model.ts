export interface UserGenrePreferenceDTO {
    id: number;
    userId: number;
    catalogGenreId: number;
    preferenceLevel: number;
    isExcluded: boolean;
    notes: string;
    createdAt: string;
    updatedAt: string;
    catalogGenre?: CatalogGenreDTO;
}

export interface CatalogGenreDTO {
    id: number;
    name: string;
    description: string;
    parentGenreId?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CatalogGenreCreateRequestDTO {
    name: string;
    description: string;
    parentGenreId?: number;
    isActive: boolean;
}

export interface CatalogGenreUpdateRequestDTO {
    id: number;
    name: string;
    description: string;
    parentGenreId?: number;
    isActive: boolean;
}

export interface GenreCreateRequestDTO {
    userId: number;
    catalogGenreId: number;
    preferenceLevel: number;
    isExcluded: boolean;
    notes: string;
}

export interface GenreUpdateRequestDTO {
    id: number;
    userId: number;
    catalogGenreId: number;
    preferenceLevel: number;
    isExcluded: boolean;
    notes: string;
}