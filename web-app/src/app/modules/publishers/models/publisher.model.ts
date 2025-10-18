export interface Publisher {
  id?: number;
  name: string;
  location?: string;
  website?: string;
  description?: string;
  logo?: string;
  dateAdded?: string;
  bookCount?: number; // Computed field for display
  specializedGenres?: string[]; // Genres this publisher specializes in
}

export interface PublisherCreateRequest {
  name: string;
  location?: string;
  website?: string;
  description?: string;
  logo?: string;
}

export interface PublisherUpdateRequest extends Partial<PublisherCreateRequest> {
  id: number;
}

export interface CatalogPublisherCreateRequestDTO {
  name: string;
  location: string;
  website: string;
  description?: string;
}

export interface CatalogPublisherUpdateRequestDTO {
  id: number;
  name: string;
  location: string;
  website: string;
  description?: string;
}

export interface CatalogPublisherDTO {
  id: number;
  name: string;
  location: string;
  website: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  bookCount: number;
}