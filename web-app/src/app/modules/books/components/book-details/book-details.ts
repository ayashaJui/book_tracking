import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Quote {
  id: number;
  quote: string;
  pageNumber?: number;
  tags: string[];
  dateAdded: Date;
  notes?: string;
  favorite?: boolean;
}

interface ReadingLog {
  id: number;
  startDate: Date | null;
  finishDate: Date | null;
  status: 'Want to Read' | 'Reading' | 'Finished' | 'On Hold';
  estimatedTimeHrs?: number;
  actualTimeHrs?: number;
}

interface Review {
  id: number;
  rating: number;
  takeaways: string;
  wouldRecommend: boolean | null;
  date: Date;
  anonymous?: boolean;
}

interface SeriesInfo {
  id: number;
  title: string;
  orderInSeries: number;
  totalBooks: number;
}

interface SeriesBook {
  id: number;
  title: string;
  orderInSeries: number;
  status: 'Not Released' | 'Want to Read' | 'Reading' | 'Finished' | 'On Hold';
  isCurrent?: boolean;
}

interface Book {
  seriesBooks?: SeriesBook[];
  id?: number;
  title?: string;
  author?: string;
  genre?: string;
  genres?: string[];
  purchaseDate?: Date;
  price?: number;
  source?: string;
  startDate?: Date;
  finishDate?: Date;
  status?: string;
  estimatedTime?: number;
  actualTime?: number;
  rating?: number;
  pages?: number;
  coverImage?: any;
  readingSpeed?: number;
  tags?: string[];
  readingLogs?: ReadingLog[];
  relatedQuotes?: Quote[];
  seriesInfo?: SeriesInfo;
  reviews?: Review[];
  wishlist?: boolean;
  notes?: string;
}

@Component({
  selector: 'app-book-details',
  standalone: false,
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
})
export class BookDetails implements OnInit {
  book: Book = {};
  activeTab = 'details';

  statuses = ['Not Started', 'Reading', 'Completed', 'Abandoned'];
  quoteTags = ['Funny', 'Inspiring', 'Philosophical'];
  tags = ['Fiction', 'Non-Fiction', 'Biography', 'Self-Help', 'Classic'];

  constructor(private router: Router) {}

  ngOnInit() {
    // Mock data for demonstration
    this.book = {
      id: 1,
      title: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      genre: 'Fantasy',
      genres: ['Fantasy', 'Adventure', 'Magic'],
      purchaseDate: new Date('2023-11-15'),
      price: 14.99,
      source: 'Amazon',
      startDate: new Date('2024-01-20'),
      finishDate: new Date('2024-02-10'),
      status: 'Completed',
      estimatedTime: 20,
      actualTime: 18,
      rating: 4.5,
      pages: 662,
      wishlist: true,
      seriesBooks: [
        {
          id: 1,
          title: 'The Name of the Wind',
          orderInSeries: 1,
          status: 'Finished',
          isCurrent: true,
        },
        {
          id: 2,
          title: "The Wise Man's Fear",
          orderInSeries: 2,
          status: 'Want to Read',
        },
        {
          id: 3,
          title: 'The Doors of Stone',
          orderInSeries: 3,
          status: 'Not Released',
        },
      ],
      tags: ['Fantasy', 'Magic System', 'University'],
      notes: 'One of my favorite fantasy novels with a unique magic system.',
      seriesInfo: {
        id: 2,
        title: 'The Kingkiller Chronicle',
        orderInSeries: 1,
        totalBooks: 3,
      },
      readingLogs: [
        {
          id: 1,
          startDate: new Date('2024-01-20'),
          finishDate: new Date('2024-02-10'),
          status: 'Finished',
          estimatedTimeHrs: 20,
          actualTimeHrs: 18,
        },
      ],
      relatedQuotes: [
        {
          id: 1,
          quote:
            "It's like everyone tells a story about themselves inside their own head. Always. All the time. That story makes you what you are. We build ourselves out of that story.",
          pageNumber: 245,
          tags: ['Philosophical', 'Identity'],
          dateAdded: new Date('2024-02-05'),
          favorite: true,
        },
        {
          id: 2,
          quote:
            'Words are pale shadows of forgotten names. As names have power, words have power. Words can light fires in the minds of men. Words can wring tears from the hardest hearts.',
          pageNumber: 352,
          tags: ['Power', 'Language'],
          dateAdded: new Date('2024-02-07'),
        },
      ],
      reviews: [
        {
          id: 1,
          rating: 4.5,
          takeaways:
            'A masterpiece of fantasy worldbuilding with an intriguing magic system.',
          wouldRecommend: true,
          date: new Date('2024-02-15'),
        },
      ],
    };
  }

  toggleWishlist() {
    this.book.wishlist = !this.book.wishlist;
  }

  navigateToSeries(seriesId: number) {
    this.router.navigate(['/series', seriesId]);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  openAddToSeriesDialog() {
    // This would normally open a dialog to add a book to a series
    console.log('Opening dialog to add book to a series');
    // In a real implementation, you would use a dialog service or component
    alert('Add to Series functionality would open a dialog here');
  }

  viewAllSeries() {
    // Navigate to the series listing page
    this.router.navigate(['/series']);
  }

  navigateToSeriesBook(bookId: number) {
    // Navigate to another book in the series
    if (bookId !== this.book.id) {
      this.router.navigate(['/books', bookId]);
    }
  }

  /**
   * Gets series books that this book is part of
   * In a real app, this would be fetched from a service
   */
  getSeriesBooks() {
    return this.book.seriesBooks || [];
  }
}
