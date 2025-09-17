import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublisherService } from '../../services/publisher.service';
import { BookService } from '../../../books/services/book.service';
import { Publisher } from '../../models/publisher.model';

interface PublisherBook {
  id: number;
  title: string;
  author: string;
  genres: string[];
  pages?: number;
  status: string;
  rating?: number;
  publicationYear?: number;
  isbn?: string;
  series?: string;
  seriesOrder?: number;
}

interface PublisherStats {
  totalBooks: number;
  totalPages: number;
  averageRating: number;
  genreDistribution: { [key: string]: number };
  publicationYears: number[];
  topRatedBooks: PublisherBook[];
}

@Component({
  selector: 'app-publisher-details',
  standalone: false,
  templateUrl: './publisher-details.html',
  styleUrls: ['./publisher-details.scss']
})
export class PublisherDetailsComponent implements OnInit {
  publisherId?: number;
  publisher: Publisher | null = null;
  books: PublisherBook[] = [];
  stats: PublisherStats | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publisherService: PublisherService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.publisherId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    
    // Enhanced dummy data for demonstration
    this.loadDummyData();
  }

  private loadDummyData(): void {
    // Comprehensive publisher information
    this.publisher = {
      id: 1,
      name: 'DAW Books',
      location: 'New York, NY, USA',
      website: 'https://www.dawbooks.com',
      description: 'DAW Books is a major science fiction and fantasy publisher founded in 1971 by Donald A. Wollheim. Known for publishing award-winning authors and breakthrough novels in speculative fiction, DAW has been home to legendary writers like Ursula K. Le Guin, Tad Williams, Mercedes Lackey, and Patrick Rothfuss. The publisher is renowned for discovering new talent and supporting innovative storytelling in the science fiction and fantasy genres.',
      logo: '/assets/images/product-not-found.png',
      dateAdded: '2024-01-01',
      bookCount: 12
    };

    // Comprehensive book catalog from this publisher
    this.books = [
      {
        id: 1,
        title: 'The Name of the Wind',
        author: 'Patrick Rothfuss',
        genres: ['Fantasy', 'Adventure', 'Magic'],
        pages: 662,
        status: 'Read',
        rating: 5,
        publicationYear: 2007,
        isbn: '978-0756404079',
        series: 'The Kingkiller Chronicle',
        seriesOrder: 1
      },
      {
        id: 2,
        title: 'The Wise Man\'s Fear',
        author: 'Patrick Rothfuss',
        genres: ['Fantasy', 'Adventure', 'Magic'],
        pages: 994,
        status: 'Reading',
        rating: 5,
        publicationYear: 2011,
        isbn: '978-0756407919',
        series: 'The Kingkiller Chronicle',
        seriesOrder: 2
      },
      {
        id: 3,
        title: 'The Left Hand of Darkness',
        author: 'Ursula K. Le Guin',
        genres: ['Science Fiction', 'Social Science Fiction'],
        pages: 304,
        status: 'Read',
        rating: 4.5,
        publicationYear: 1969,
        isbn: '978-0441478125'
      },
      {
        id: 4,
        title: 'The Dispossessed',
        author: 'Ursula K. Le Guin',
        genres: ['Science Fiction', 'Political Fiction'],
        pages: 341,
        status: 'Read',
        rating: 4.8,
        publicationYear: 1974,
        isbn: '978-0061054884'
      },
      {
        id: 5,
        title: 'Otherland: City of Golden Shadow',
        author: 'Tad Williams',
        genres: ['Science Fiction', 'Cyberpunk', 'Virtual Reality'],
        pages: 780,
        status: 'Want to Read',
        rating: 4.2,
        publicationYear: 1996,
        isbn: '978-0886777630',
        series: 'Otherland',
        seriesOrder: 1
      },
      {
        id: 6,
        title: 'The Dragonbone Chair',
        author: 'Tad Williams',
        genres: ['Fantasy', 'Epic Fantasy'],
        pages: 766,
        status: 'Read',
        rating: 4.3,
        publicationYear: 1988,
        isbn: '978-0886774035',
        series: 'Memory, Sorrow and Thorn',
        seriesOrder: 1
      },
      {
        id: 7,
        title: 'Magic\'s Pawn',
        author: 'Mercedes Lackey',
        genres: ['Fantasy', 'LGBTQ+', 'Romance'],
        pages: 352,
        status: 'Read',
        rating: 4.1,
        publicationYear: 1989,
        isbn: '978-0886773922',
        series: 'The Last Herald-Mage',
        seriesOrder: 1
      },
      {
        id: 8,
        title: 'Arrows of the Queen',
        author: 'Mercedes Lackey',
        genres: ['Fantasy', 'Young Adult'],
        pages: 319,
        status: 'Read',
        rating: 4.0,
        publicationYear: 1987,
        isbn: '978-0886773786',
        series: 'Heralds of Valdemar',
        seriesOrder: 1
      },
      {
        id: 9,
        title: 'The Hundred Thousand Kingdoms',
        author: 'N.K. Jemisin',
        genres: ['Fantasy', 'Mythology', 'African-inspired'],
        pages: 427,
        status: 'On Hold',
        rating: 4.4,
        publicationYear: 2010,
        isbn: '978-0316043915',
        series: 'Inheritance Trilogy',
        seriesOrder: 1
      },
      {
        id: 10,
        title: 'The Fifth Season',
        author: 'N.K. Jemisin',
        genres: ['Fantasy', 'Post-Apocalyptic', 'Geological Fantasy'],
        pages: 512,
        status: 'Want to Read',
        rating: 4.6,
        publicationYear: 2015,
        isbn: '978-0316229296',
        series: 'The Broken Earth',
        seriesOrder: 1
      },
      {
        id: 11,
        title: 'Dune',
        author: 'Frank Herbert',
        genres: ['Science Fiction', 'Space Opera', 'Political'],
        pages: 688,
        status: 'Read',
        rating: 4.7,
        publicationYear: 1965,
        isbn: '978-0441172719',
        series: 'Dune Chronicles',
        seriesOrder: 1
      },
      {
        id: 12,
        title: 'Foundation',
        author: 'Isaac Asimov',
        genres: ['Science Fiction', 'Space Opera', 'Galactic Empire'],
        pages: 244,
        status: 'Read',
        rating: 4.5,
        publicationYear: 1951,
        isbn: '978-0553293357',
        series: 'Foundation',
        seriesOrder: 1
      }
    ];

    // Calculate comprehensive statistics
    this.calculateStats();
  }

  private calculateStats(): void {
    if (this.books.length === 0) return;

    const readBooks = this.books.filter(book => book.status === 'Read');
    const totalPages = this.books.reduce((sum, book) => sum + (book.pages || 0), 0);
    const totalRating = readBooks.reduce((sum, book) => sum + (book.rating || 0), 0);
    const averageRating = readBooks.length > 0 ? totalRating / readBooks.length : 0;

    // Genre distribution
    const genreDistribution: { [key: string]: number } = {};
    this.books.forEach(book => {
      book.genres.forEach(genre => {
        genreDistribution[genre] = (genreDistribution[genre] || 0) + 1;
      });
    });

    // Publication years
    const publicationYears = [...new Set(this.books.map(book => book.publicationYear).filter(year => year))].sort();

    // Top rated books
    const topRatedBooks = [...readBooks]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    this.stats = {
      totalBooks: this.books.length,
      totalPages,
      averageRating: Math.round(averageRating * 10) / 10,
      genreDistribution,
      publicationYears: publicationYears as number[],
      topRatedBooks
    };
  }

  goBack(): void {
    this.router.navigate(['/publishers']);
  }

  getGenreEntries(): [string, number][] {
    return this.stats ? Object.entries(this.stats.genreDistribution).sort((a, b) => b[1] - a[1]) : [];
  }

  getStatusCount(status: string): number {
    return this.books.filter(book => book.status === status).length;
  }

  getSeriesBooks(): { [key: string]: PublisherBook[] } {
    const seriesBooks: { [key: string]: PublisherBook[] } = {};
    
    this.books.forEach(book => {
      if (book.series) {
        if (!seriesBooks[book.series]) {
          seriesBooks[book.series] = [];
        }
        seriesBooks[book.series].push(book);
      }
    });

    // Sort books within each series by order
    Object.keys(seriesBooks).forEach(series => {
      seriesBooks[series].sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
    });

    return seriesBooks;
  }

  getDecadeDistribution(): { [key: string]: number } {
    const decades: { [key: string]: number } = {};
    
    this.books.forEach(book => {
      if (book.publicationYear) {
        const decade = Math.floor(book.publicationYear / 10) * 10;
        const decadeLabel = `${decade}s`;
        decades[decadeLabel] = (decades[decadeLabel] || 0) + 1;
      }
    });

    return decades;
  }
}
