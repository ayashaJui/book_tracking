import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Series } from '../models/series.model';

@Injectable({
  providedIn: 'root',
})
export class SeriesService {
  private seriesSubject = new BehaviorSubject<Series[]>([
    {
      id: 1,
      title: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      totalBooks: 3,
      readBooks: 2,
      coverUrl: 'assets/images/product-not-found.png',
      genre: 'Fantasy',
      books: [
        {
          title: 'Fellowship of the Ring',
          status: 'Finished',
          pagesRead: 423,
          rating: 5,
          finishedDate: '2025-07-01',
          orderInSeries: 1,
        },
        {
          title: 'The Two Towers',
          status: 'Finished',
          pagesRead: 352,
          rating: 5,
          finishedDate: '2025-07-15',
          orderInSeries: 2,
        },
        {
          title: 'The Return of the King',
          status: 'Reading',
          pagesRead: 120,
          orderInSeries: 3,
        },
      ],
    },
    {
      id: 2,
      title: 'Harry Potter',
      author: 'J.K. Rowling',
      totalBooks: 7,
      readBooks: 4,
      coverUrl: 'assets/images/product-not-found.png',
      genre: 'Fantasy',
      books: [
        {
          title: "Harry Potter and the Philosopher's Stone",
          status: 'Finished',
          pagesRead: 223,
          rating: 5,
          finishedDate: '2025-01-10',
          orderInSeries: 1,
        },
        {
          title: 'Harry Potter and the Chamber of Secrets',
          status: 'Finished',
          pagesRead: 251,
          rating: 5,
          finishedDate: '2025-02-05',
          orderInSeries: 2,
        },
        {
          title: 'Harry Potter and the Prisoner of Azkaban',
          status: 'Finished',
          pagesRead: 278,
          rating: 4,
          finishedDate: '2025-03-10',
          orderInSeries: 3,
        },
        {
          title: 'Harry Potter and the Goblet of Fire',
          status: 'Finished',
          pagesRead: 636,
          rating: 5,
          finishedDate: '2025-04-20',
          orderInSeries: 4,
        },
        {
          title: 'Harry Potter and the Order of the Phoenix',
          status: 'Want to Read',
          orderInSeries: 5,
        },
        {
          title: 'Harry Potter and the Half-Blood Prince',
          status: 'Want to Read',
          orderInSeries: 6,
        },
        {
          title: 'Harry Potter and the Deathly Hallows',
          status: 'Want to Read',
          orderInSeries: 7,
        },
      ],
    },
  ]);

  public series$ = this.seriesSubject.asObservable();

  constructor() {}

  getAllSeries(): Series[] {
    return this.seriesSubject.value;
  }

  getSeriesById(id: number): Series | undefined {
    return this.seriesSubject.value.find((series) => series.id === id);
  }

  addSeries(series: Series): void {
    const currentSeries = this.seriesSubject.value;
    const newId = Math.max(...currentSeries.map((s) => s.id || 0), 0) + 1;
    series.id = newId;
    this.seriesSubject.next([...currentSeries, series]);
  }

  updateSeries(updatedSeries: Series): void {
    const currentSeries = this.seriesSubject.value;
    const index = currentSeries.findIndex((s) => s.id === updatedSeries.id);
    if (index !== -1) {
      currentSeries[index] = updatedSeries;
      this.seriesSubject.next([...currentSeries]);
    }
  }

  // Helper method to get series options for dropdowns
  getSeriesOptions(): { label: string; value: number }[] {
    return this.seriesSubject.value.map((series) => ({
      label: `${series.title} by ${series.author}`,
      value: series.id!,
    }));
  }

  // Add a book to an existing series
  addBookToSeries(
    seriesId: number,
    bookTitle: string,
    orderInSeries: number
  ): void {
    const series = this.getSeriesById(seriesId);
    if (series) {
      series.books.push({
        title: bookTitle,
        status: 'Want to Read',
        orderInSeries: orderInSeries,
      });
      series.totalBooks = series.books.length;
      this.updateSeries(series);
    }
  }
}
