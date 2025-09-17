export interface Edition {
  id?: number;
  bookId: number; // Reference to the parent book
  format: 'Hardcover' | 'Paperback' | 'Ebook' | 'Audiobook' | 'Mass Market' | string;
  isbn?: string;
  isbn13?: string;
  publicationDate?: string;
  price?: number;
  currency?: string;
  pages?: number;
  coverImage?: string;
  publisherId?: number;
  publisherName?: string; // Computed field
  language?: string;
  dimensions?: string; // e.g., "6 x 9 inches"
  weight?: string; // e.g., "1.2 lbs"
  isOwned?: boolean; // Whether the user owns this edition
  dateAdded?: string;
  condition?: 'New' | 'Like New' | 'Very Good' | 'Good' | 'Acceptable' | string;
  notes?: string;
}

export interface EditionCreateRequest {
  bookId: number;
  format: string;
  isbn?: string;
  isbn13?: string;
  publicationDate?: string;
  price?: number;
  currency?: string;
  pages?: number;
  coverImage?: string;
  publisherId?: number;
  language?: string;
  dimensions?: string;
  weight?: string;
  isOwned?: boolean;
  condition?: string;
  notes?: string;
}

export interface EditionUpdateRequest extends Partial<EditionCreateRequest> {
  id: number;
}
