import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SeriesService } from '../../services/series.service';
import { Series } from '../../models/series.model';

@Component({
  selector: 'app-view-series',
  standalone: false,
  templateUrl: './view-series.html',
  providers: [MessageService],
})
export class ViewSeries implements OnInit {
  series: Series | null = null;
  isLoading = true;
  seriesId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seriesService: SeriesService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.seriesId = +params['id'];
        this.loadSeries();
      } else {
        this.router.navigate(['/series']);
      }
    });
  }

  loadSeries() {
    if (this.seriesId) {
      const foundSeries = this.seriesService.getSeriesById(this.seriesId);
      if (foundSeries) {
        this.series = foundSeries;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Series not found',
        });
        this.router.navigate(['/series']);
      }
    }
    this.isLoading = false;
  }

  editSeries() {
    if (this.seriesId) {
      this.router.navigate(['/series/edit', this.seriesId]);
    }
  }

  goBack() {
    this.router.navigate(['/series']);
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'Want to Read':
        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      Reading:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      Finished:
        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'On Hold':
        'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }

  getProgressWidth(): number {
    if (!this.series || this.series.totalBooks === 0) return 0;
    return (this.series.readBooks / this.series.totalBooks) * 100;
  }

  getRatingStars(rating?: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating && i <= rating) {
        stars.push('pi pi-star-fill text-yellow-400');
      } else {
        stars.push('pi pi-star text-gray-300');
      }
    }
    return stars;
  }

  getCurrentlyReadingCount(): number {
    if (!this.series) return 0;
    return this.series.books.filter((book) => book.status === 'Reading').length;
  }

  getWantToReadCount(): number {
    if (!this.series) return 0;
    return this.series.books.filter((book) => book.status === 'Want to Read')
      .length;
  }

  getOnHoldCount(): number {
    if (!this.series) return 0;
    return this.series.books.filter((book) => book.status === 'On Hold').length;
  }
}
