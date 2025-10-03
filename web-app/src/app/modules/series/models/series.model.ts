export interface SeriesAuthor {
  authorId?: number; // Reference to Author ID for data consistency
  name: string;
  role: string; // e.g., "Author", "Co-Author", "Editor", "Illustrator", "Translator", etc.
}

export interface Series {
  id?: number;
  title: string;
  authors: SeriesAuthor[]; // Changed from single author string to multiple authors with roles
  totalBooks: number;
  readBooks: number;
  coverUrl?: string;
  genres?: string[];
  description?: string;
  books: SeriesBook[];
  customTags?: string[];
}

export interface SeriesBook {
  title: string;
  status: 'Want to Read' | 'Reading' | 'Finished' | 'On Hold';
  pagesRead?: number;
  rating?: number;
  finishedDate?: string;
  orderInSeries?: number; // Position of this book in the series
}
