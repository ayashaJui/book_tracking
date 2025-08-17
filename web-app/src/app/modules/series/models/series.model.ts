export interface Series {
  id?: number;
  title: string;
  author: string;
  totalBooks: number;
  readBooks: number;
  coverUrl?: string;
  genres?: string[];
  description?: string;
  books: SeriesBook[];
}

export interface SeriesBook {
  title: string;
  status: 'Want to Read' | 'Reading' | 'Finished' | 'On Hold';
  pagesRead?: number;
  rating?: number;
  finishedDate?: string;
  orderInSeries?: number; // Position of this book in the series
}
