import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SeriesDTO } from '../models/series.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SeriesService {
  seriesForm!: FormGroup;

  private seriesSubject = new BehaviorSubject<SeriesDTO[]>([
    {
      id: 1,
      title: 'The Lord of the Rings',
      authors: [
        { authorName: 'J.R.R. Tolkien', authorRole: 'Author' }
      ],
      totalBooks: 3,
      readBooks: 2,
      coverUrl: 'assets/images/product-not-found.png',
      genres: ['Fantasy', 'Adventure'],
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
      authors: [
        { authorName: 'J.K. Rowling', authorRole: 'Author' }
      ],
      totalBooks: 7,
      readBooks: 4,
      coverUrl: 'assets/images/product-not-found.png',
      genres: ['Fantasy', 'Young Adult'],
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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.seriesForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      totalBooks: [0, [Validators.required, Validators.min(1)]],
      isCompleted: [false],
      genres: [[]],
      authors: this.fb.array([]),

      // User series related fields
      booksRead: [0, [Validators.min(0)]],
      booksOwned: [0, [Validators.min(0)]],
      status: ['Want to Read', [Validators.required]],
      startDate: [''],
      completionDate: [''],
      isFavorite: [false],
      readingOrderPreference: ['Publication Order'],
      notes: [''],
    });
  }

  getAllSeries(): SeriesDTO[] {
    return this.seriesSubject.value;
  }

  getSeriesById(id: number): SeriesDTO | undefined {
    return this.seriesSubject.value.find((series) => series.id === id);
  }

  addSeries(series: SeriesDTO): void {
    const currentSeries = this.seriesSubject.value;
    const newId = Math.max(...currentSeries.map((s) => s.id || 0), 0) + 1;
    series.id = newId;
    this.seriesSubject.next([...currentSeries, series]);
  }

  updateSeries(updatedSeries: SeriesDTO): void {
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
      label: `${series.title} by ${series.authors.map(a => a.authorName).join(', ')}`,
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
