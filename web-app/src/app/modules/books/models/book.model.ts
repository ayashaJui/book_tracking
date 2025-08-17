export interface Book {
  id?: number;
  title: string;
  author: string;
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
}
