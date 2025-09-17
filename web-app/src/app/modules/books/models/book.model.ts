export interface Book {
  id?: number;
  title: string;
  authorIds: number[]; // References to Author IDs - support multiple authors
  authorNames?: string[]; // Computed field for display purposes (optional)
  genres: string[];
  pages?: number;
  status?: 'Read' | 'Reading' | 'Want to Read' | 'On Hold' | string;
  cover?: string;
  dateAdded?: string;
  price?: number;
  source?: string;
  seriesId?: number;
  seriesName?: string;
  seriesOrder?: number; // Position of book in the series (1, 2, 3, etc.)
  rating?: number;
  publisherId?: number; // Reference to Publisher ID
  publisherName?: string; // Computed field for display purposes
  editionCount?: number; // Computed field - number of editions available
  primaryEditionId?: number; // The main/preferred edition of this book
}

// For backward compatibility and API requests
export interface BookCreateRequest {
  title: string;
  authorIds: number[];
  genres: string[];
  pages?: number;
  status?: string;
  cover?: string;
  price?: number;
  source?: string;
  seriesId?: number;
  seriesName?: string;
  seriesOrder?: number;
  rating?: number;
  publisherId?: number;
}

export interface BookUpdateRequest extends Partial<BookCreateRequest> {
  id: number;
}

// Legacy interface for migration purposes
export interface LegacyBook {
  id?: number;
  title: string;
  author: string; // Old string-based author
  genres: string[];
  pages?: number;
  status?: string;
  cover?: string;
  dateAdded?: string;
  price?: number;
  source?: string;
  seriesId?: number;
  seriesName?: string;
  seriesOrder?: number;
  rating?: number;
  publisherId?: number;
}
