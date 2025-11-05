

export interface SeriesBookDTO {
  title: string;
  status: 'Want to Read' | 'Reading' | 'Finished' | 'On Hold';
  pagesRead?: number;
  rating?: number;
  finishedDate?: string;
  orderInSeries?: number; // Position of this book in the series
}

export interface SeriesDTO {
  id?: number;
  title: string;
  authors: SeriesAuthorDTO[]; // Changed from single author string to multiple authors with roles
  totalBooks: number;
  readBooks: number;
  coverUrl?: string;
  genres?: string[];
  description?: string;
  books: SeriesBookDTO[];
  customTags?: string[];

  // Catalog series fields
  isComplete?: boolean; // Whether the series is complete (no more books will be published)

  // User series related fields
  booksOwned?: number;
  status?: 'Want to Read' | 'Reading' | 'On Hold' | 'Completed';
  startDate?: string;
  completionDate?: string;
  isFavorite?: boolean;
  readingOrderPreference?: 'Publication Order' | 'Chronological Order' | 'Custom Order';
  notes?: string;
}


// new
export interface SeriesAuthorDTO {
  id?: number;
  authorId?: number;
  authorName: string;
  authorRole: string; // e.g., "Author", "Co-Author", "Editor", "Illustrator", "Translator", etc.
}

export interface SeriesGenreDTO {
  id: number;
  genreId: number;
  genreName: string;
}

export interface CatalogSeriesCreateRequestDTO {
  name: string;
  description?: string;
  totalBooks?: number;
  isCompleted?: boolean;
  seriesGenreCreateDTOS?: { genreId: number }[];
  seriesAuthorCreateDTOS?: { authorId: number, authorRole: string }[];
}

export interface UserSeriesCreateRequestDTO {
  userId: number;
  catalogSeriesId: number;
  seriesTotalBooks?: number;
  booksRead?: number;
  booksOwned?: number;
  status?: string;
  startDate?: string;
  completionDate?: string;
  isFavorite?: boolean;
  readingOrderPreference?: string;
  notes?: string;
}

export interface UserSeriesDTO {
  id: number;
  userId: number;
  catalogSeriesId: number;
  booksRead: number;
  booksOwned: number;
  completionPercentage: number;
  status: string;
  startDate: string;
  completionDate: string;
  isFavorite: boolean;
  readingOrderPreference: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  catalogSeries?: CatalogSeriesDTO;
}

export interface CatalogSeriesDTO {
  id: number;
  name: string;
  description: string;
  totalBooks: number;
  isCompleted: boolean;
  seriesGenres: SeriesGenreDTO[];
  seriesAuthors: SeriesAuthorDTO[];
  // seriesBooks: SeriesBookDTO[];
  createdAt: string;
  updatedAt: string;
}
