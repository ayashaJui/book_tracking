import { Component, ViewChild, OnInit } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexFill,
  ApexDataLabels,
  ApexTooltip,
  ChartComponent,
} from 'ng-apexcharts';
import { LayoutService } from '../../../../layout/service/layout.service';
import { Subscription } from 'rxjs';
import { UiService } from '../../../shared/services/ui.service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SeriesDTO, SeriesBookDTO } from '../../models/series.model';
import { SeriesService } from '../../services/series.service';
import { MessageService } from 'primeng/api';

// Using the feature-specific models instead of shared models

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend?: any;
  colors?: string[];
};

@Component({
  selector: 'app-all-series',
  standalone: false,
  templateUrl: './all-series.html',
  styleUrl: './all-series.scss',
  providers: [MessageService],
})
export class AllSeries implements OnInit {
  showDialog: boolean = false;
  isLoading: boolean = false;
  // Search term for filtering series (added for enhanced UI search)
  searchQuery: string = '';
  // View mode for switching between grid and list view
  viewMode: 'grid' | 'list' = 'grid';

  @ViewChild('chart') chart: any;
  subscription: Subscription[] = [];

  seriesList: SeriesDTO[] = [
    {
      title: 'The Lord of the Rings',
      authors: [
        { authorName: 'J.R.R. Tolkien', authorRole: 'Author' }
      ],
      totalBooks: 3,
      readBooks: 2,
      coverUrl: 'assets/images/product-not-found.png',
      genres: ['Fantasy', 'Adventure'],
      customTags: ['classic', 'epic-fantasy', 'reread-worthy'],
      books: [
        {
          title: 'Fellowship',
          status: 'Finished',
          pagesRead: 423,
          rating: 5,
          finishedDate: '2025-07-01',
        },
        {
          title: 'Two Towers',
          status: 'Finished',
          pagesRead: 352,
          rating: 5,
          finishedDate: '2025-07-15',
        },
        { title: 'Return of the King', status: 'Reading', pagesRead: 120 },
      ],
    },
    {
      title: 'Harry Potter',
      authors: [
        { authorName: 'J.K. Rowling', authorRole: 'Author' }
      ],
      totalBooks: 7,
      readBooks: 4,
      coverUrl: 'assets/images/product-not-found.png',
      genres: ['Fantasy', 'Young Adult'],
      customTags: ['nostalgic', 'comfort-read'],
      books: [
        {
          title: "Philosopher's Stone",
          status: 'Finished',
          pagesRead: 223,
          rating: 5,
          finishedDate: '2025-01-10',
        },
        {
          title: 'Chamber of Secrets',
          status: 'Finished',
          pagesRead: 251,
          rating: 5,
          finishedDate: '2025-02-05',
        },
        {
          title: 'Prisoner of Azkaban',
          status: 'Finished',
          pagesRead: 278,
          rating: 4,
          finishedDate: '2025-03-10',
        },
        {
          title: 'Goblet of Fire',
          status: 'Finished',
          pagesRead: 636,
          rating: 5,
          finishedDate: '2025-04-20',
        },
        { title: 'Order of the Phoenix', status: 'Want to Read' },
        { title: 'Half-Blood Prince', status: 'Want to Read' },
        { title: 'Deathly Hallows', status: 'Want to Read' },
      ],
    },
  ];

  selectedSeries: SeriesDTO | null = null;

  filterStatus: 'All' | 'Finished' | 'Reading' | 'Want to Read' = 'All';
  sortOption: 'Completion' | 'Title' | 'Author' = 'Completion';

  statusLabels = ['Completed', 'In Progress', 'Not Started'];
  statusOptions = ['All', 'Finished', 'Reading', 'Want to Read'];
  sortOptions = ['Completion', 'Title', 'Author'];

  public chartOptions!: ChartOptions;
  @ViewChild('piechart') piechart!: ChartComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private uiService: UiService,
    private seriesService: SeriesService,
    private messageService: MessageService
  ) {
    this.updateChart();
  }

  ngOnInit() {
    this.loadSeriesData();
  }

  openSeries(series: SeriesDTO) {
    this.selectedSeries = series;
    this.showDialog = true;
  }

  viewSeries(series: SeriesDTO) {
    this.router.navigate(['/series/view', series.id]);
  }

  editSeries(series: SeriesDTO) {
    this.router.navigate(['/series/edit', series.id]);
  }

  getNextBookToRead(series: SeriesDTO): SeriesBookDTO | null {
    // Find the first book that is not finished and not currently being read
    const nextBook = series.books
      .filter((book) => book.status === 'Want to Read')
      .sort((a, b) => (a.orderInSeries || 0) - (b.orderInSeries || 0))[0];

    return nextBook || null;
  }

  startNextBook(series: SeriesDTO) {
    const nextBook = this.getNextBookToRead(series);
    if (nextBook) {
      // Update the book status to 'Reading'
      nextBook.status = 'Reading';

      // Update the series through the service
      this.seriesService.updateSeries(series);

      // Show success message
      this.messageService.add({
        severity: 'success',
        summary: 'Started Reading',
        detail: `Started reading "${nextBook.title}" from ${series.title}`,
      });

      // Update local data to reflect changes
      this.loadSeriesData();
    }
  }

  loadSeriesData() {
    // Reload the series data from the service
    this.seriesList = this.seriesService.getAllSeries();
  }

  closeSeries() {
    this.selectedSeries = null;
  }

  getCompletionPercentage(series: SeriesDTO): number {
    return Math.round((series.readBooks / series.totalBooks) * 100);
  }

  getProgressColor(series: SeriesDTO) {
    const pct = this.getCompletionPercentage(series);
    if (pct === 100) return 'bg-green-500';
    if (pct > 0) return 'bg-yellow-500';
    return 'bg-gray-400';
  }

  getBookDotColor(book: SeriesBookDTO) {
    switch (book.status) {
      case 'Finished':
        return 'bg-green-500';
      case 'Reading':
        return 'bg-yellow-400';
      case 'Want to Read':
        return 'bg-gray-400';
      case 'On Hold':
        return 'bg-blue-400';
      default:
        return 'bg-gray-400';
    }
  }

  get displayedSeries() {
    let list = [...this.seriesList];
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.authors.some(author => author.authorName.toLowerCase().includes(q)) ||
          (s.genres || []).some((genre) => genre.toLowerCase().includes(q))
      );
    }
    if (this.filterStatus !== 'All') {
      list = list.filter((series) => {
        if (this.filterStatus === 'Finished')
          return series.readBooks === series.totalBooks;
        if (this.filterStatus === 'Reading')
          return series.readBooks > 0 && series.readBooks < series.totalBooks;
        if (this.filterStatus === 'Want to Read') return series.readBooks === 0;
        return true;
      });
    }
    if (this.sortOption === 'Completion') {
      list.sort(
        (a, b) =>
          this.getCompletionPercentage(b) - this.getCompletionPercentage(a)
      );
    } else if (this.sortOption === 'Title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortOption === 'Author') {
      list.sort((a, b) => {
        const aAuthor = a.authors[0]?.authorName || '';
        const bAuthor = b.authors[0]?.authorName || '';
        return aAuthor.localeCompare(bAuthor);
      });
    }
    return list;
  }

  updateChart() {
    const finished = this.seriesList.filter(
      (s) => s.readBooks === s.totalBooks
    ).length;
    const inProgress = this.seriesList.filter(
      (s) => (s.readBooks || 0) > 0 && (s.readBooks || 0) < s.totalBooks
    ).length;
    const notStarted = this.seriesList.filter((s) => (s.readBooks || 0) === 0).length;
    const newColor = this.layoutService.isDarkTheme() ? '#f2f3f4' : '#415B61';

    this.chartOptions = {
      series: [finished, inProgress, notStarted],
      chart: { type: 'donut', height: 250 },
      labels: this.statusLabels,
      colors: ['#22c55e', '#eab308', '#9ca3af'],
      legend: {
        position: 'bottom',
        labels: {
          colors: this.statusLabels.map(() => newColor),
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: { chart: { width: 200 }, legend: { position: 'bottom' } },
        },
      ],
    };

    this.subscription.push(
      this.uiService.colorScheme$.subscribe((colorScheme) => {
        const newColor = colorScheme === 'dark' ? '#f2f3f4' : '#415B61';

        // Check if piechart exists before updating
        if (this.piechart && this.piechart.updateOptions) {
          this.piechart.updateOptions({
            legend: {
              labels: {
                colors: [newColor, newColor, newColor],
              },
            },
          });
        }
      })
    );
  }

  markBookAsRead(book: SeriesBookDTO) {
    book.status = 'Finished';
    this.selectedSeries!.readBooks = this.selectedSeries!.books.filter(
      (b) => b.status === 'Finished'
    ).length;
    this.updateChart();
  }

  markBookAsUnread(book: SeriesBookDTO) {
    book.status = 'Want to Read';
    this.selectedSeries!.readBooks = this.selectedSeries!.books.filter(
      (b) => b.status === 'Finished'
    ).length;
    this.updateChart();
  }

  addNextBook() {
    const nextBook = this.selectedSeries?.books.find(
      (b) => b.status === 'Want to Read'
    );
    if (nextBook) nextBook.status = 'Reading';
  }

  // Header Statistics Methods
  getTotalSeries(): number {
    return this.seriesList.length;
  }

  getTotalBooksRead(): number {
    return this.seriesList.reduce(
      (total, series) => total + (series.readBooks || 0),
      0
    );
  }

  getCompletedSeries(): number {
    return this.seriesList.filter((s) => s.readBooks === s.totalBooks).length;
  }

  // Chart Statistics Methods
  getFinishedCount(): number {
    return this.seriesList.filter((s) => s.readBooks === s.totalBooks).length;
  }

  getInProgressCount(): number {
    return this.seriesList.filter(
      (s) => (s.readBooks || 0) > 0 && (s.readBooks || 0) < s.totalBooks
    ).length;
  }

  getNotStartedCount(): number {
    return this.seriesList.filter((s) => (s.readBooks || 0) === 0).length;
  }

  // Quick Stats Methods
  getAverageProgress(): number {
    if (this.seriesList.length === 0) return 0;
    const totalProgress = this.seriesList.reduce(
      (sum, series) => sum + this.getCompletionPercentage(series),
      0
    );
    return Math.round(totalProgress / this.seriesList.length);
  }

  getFavoriteGenre(): string {
    const genreCounts = this.seriesList.reduce((acc, series) => {
      const genres = series.genres || ['Unknown'];
      genres.forEach((genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
      });
      return acc;
    }, {} as { [key: string]: number });

    const topGenre = Object.entries(genreCounts).sort(
      ([, a], [, b]) => b - a
    )[0];
    return topGenre ? topGenre[0] : 'None';
  }

  getCurrentlyReading(): number {
    return this.seriesList.reduce((count, series) => {
      const currentBooks = series.books.filter(
        (b) => b.status === 'Reading'
      ).length;
      return count + currentBooks;
    }, 0);
  }

  getTotalPages(): number {
    return this.seriesList.reduce((total, series) => {
      const seriesPages = series.books.reduce(
        (sum, book) => sum + (book.pagesRead || 0),
        0
      );
      return total + seriesPages;
    }, 0);
  }

  // Check if a series has currently reading books
  hasCurrentlyReading(series: SeriesDTO): boolean {
    return series.books.some((book) => book.status === 'Reading');
  }

  // Get overall completion rate
  getCompletionRate(): number {
    if (this.seriesList.length === 0) return 0;
    return Math.round(
      (this.getCompletedSeries() / this.getTotalSeries()) * 100
    );
  }

  addSeries() {
    this.router.navigate(['/series/add-series'])
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterStatus = 'All';
    this.sortOption = 'Completion';
  }

  formatAuthors(series: SeriesDTO): string {
    if (!series.authors || series.authors.length === 0) {
      return 'Unknown Author';
    }
    return series.authors.map(a => a.authorName).join(', ');
  }
}
