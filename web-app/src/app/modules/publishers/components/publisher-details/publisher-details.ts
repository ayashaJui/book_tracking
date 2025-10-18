import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PublisherService } from '../../services/publisher.service';
import { BookService } from '../../../books/services/book.service';
import { ImageService } from '../../../shared/services/image.service';
import { CatalogPublisherDTO, Publisher } from '../../models/publisher.model';

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
  styleUrls: ['./publisher-details.scss'],
  providers: [MessageService]
})
export class PublisherDetailsComponent implements OnInit {
  publisherId?: number;
  publisher: CatalogPublisherDTO | null = null;
  books: PublisherBook[] = [];
  stats: PublisherStats | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publisherService: PublisherService,
    private bookService: BookService,
    private messageService: MessageService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.publisherId = Number(this.route.snapshot.paramMap.get('id')) || undefined;

    this.loadCatalogPublisherDetails(this.publisherId!);
  }

  loadCatalogPublisherDetails(publisherId: number): void {
    this.publisherService.getCatalogPublisherById(publisherId).subscribe((response) => {
      if(response.data){
        this.publisher = response.data;
      }
    })
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
