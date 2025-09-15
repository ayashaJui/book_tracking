export interface Author {
  id?: number;
  name: string;
  biography?: string;
  photoUrl?: string;
  birthDate?: Date;
  deathDate?: Date;
  nationality?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    goodreads?: string;
    facebook?: string;
    linkedin?: string;
  };
  genres?: string[]; // Primary genres this author writes in
  totalBooks?: number; // Number of books by this author in user's collection
  averageRating?: number; // Average rating of books by this author
  isActive?: boolean; // Whether author is still writing/alive
  notes?: string; // Personal notes about the author
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthorStats {
  totalBooks: number;
  readBooks: number;
  unreadBooks: number;
  averageRating: number;
  totalPages: number;
  favoriteGenres: string[];
  readingProgress: {
    completed: number;
    reading: number;
    wantToRead: number;
    onHold: number;
  };
}

export interface AuthorCreateRequest {
  name: string;
  biography?: string;
  photoUrl?: string;
  birthDate?: Date;
  deathDate?: Date;
  nationality?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    goodreads?: string;
    facebook?: string;
    linkedin?: string;
  };
  genres?: string[];
  isActive?: boolean;
  notes?: string;
}

export interface AuthorUpdateRequest extends AuthorCreateRequest {
  id: number;
}
