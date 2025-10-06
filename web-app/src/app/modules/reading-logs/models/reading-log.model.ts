export interface ReadingLog {
  id: number;
  userId: number;
  catalogBookId: number;
  title: string;
  author: string;
  authorNames?: string[];
  cover?: string;
  status: 'want_to_read' | 'currently_reading' | 'read' | 'did_not_finish' | 'on_hold';
  rating?: number;
  progressPercentage?: number;
  currentPage?: number;
  totalPages?: number;
  startDate: Date | null;
  finishDate: Date | null;
  estimatedTimeHrs?: number;
  actualTimeHrs?: number;
  isFavorite?: boolean;
  readingFormat?: 'PHYSICAL' | 'DIGITAL';
  notes?: string;
  privateNotes?: string;
  firstAcquisitionDate?: Date;
  firstAcquisitionMethod?: string;
  sourceType?: 'catalog_existing' | 'catalog_created' | 'manual';
  originalSearchQuery?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReadingLogFilters {
  searchQuery?: string;
  status?: string;
  authors?: string[];
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  rating?: number;
  readingFormat?: string;
  sortBy?: 'title' | 'author' | 'startDate' | 'finishDate' | 'rating' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ReadingStats {
  totalBooks: number;
  booksRead: number;
  currentlyReading: number;
  wantToRead: number;
  onHold: number;
  didNotFinish: number;
  averageRating: number;
  totalReadingTime: number;
  booksReadThisYear: number;
  booksReadThisMonth: number;
  averageReadingSpeed: number; // pages per day
}

export interface ReadingSessionLog {
  id?: number;
  userBookId: number;
  sessionDate: Date;
  startPage: number;
  endPage: number;
  sessionDurationMinutes: number;
  notes?: string;
  location?: string; // where they read
  mood?: string;
  createdAt?: Date;
}