import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { Series } from '../../../series/models/series.model';
import { SeriesService } from '../../../series/services/series.service';

@Component({
  selector: 'app-add-book',
  standalone: false,
  templateUrl: './add-book.html',
  styleUrl: './add-book.scss',
})
export class AddBook implements OnInit {
  newBook: Book = {
    title: '',
    author: '',
    genres: [],
    status: undefined,
    pages: undefined,
    price: undefined,
    source: '',
    seriesName: '',
    seriesId: undefined,
    seriesOrder: undefined,
  };

  // Series related properties
  seriesOptions: { label: string; value: number }[] = [];
  selectedSeriesId: number | null = null;
  isPartOfSeries: boolean = false;
  availableSeriesOrders: number[] = [];
  showCreateNewSeries: boolean = false;
  newSeriesData = {
    title: '',
    author: '',
    totalBooks: 1,
    genre: '',
  };

  statusOptions = [
    { label: 'Want to Read', value: 'Want to Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Read', value: 'Read' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  genreOptions = [
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Science Fiction', value: 'Science Fiction' },
    { label: 'Mystery', value: 'Mystery' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Self-help', value: 'Self-help' },
    { label: 'History', value: 'History' },
    { label: 'Non-Fiction', value: 'Non-Fiction' },
    { label: 'Biography', value: 'Biography' },
    { label: 'Science', value: 'Science' },
    { label: 'Philosophy', value: 'Philosophy' },
    { label: 'Poetry', value: 'Poetry' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Young Adult', value: 'Young Adult' },
    { label: 'Children', value: 'Children' },
    // add more as needed
  ];

  constructor(
    private location: Location,
    private router: Router,
    private seriesService: SeriesService
  ) {}

  ngOnInit() {
    this.loadSeriesOptions();
  }

  // Getter for series order options
  get seriesOrderOptions() {
    return this.availableSeriesOrders.map((order) => ({
      label: `Book ${order}`,
      value: order,
    }));
  }

  loadSeriesOptions() {
    this.seriesOptions = this.seriesService.getSeriesOptions();
  }

  onSeriesToggle() {
    if (!this.isPartOfSeries) {
      this.selectedSeriesId = null;
      this.newBook.seriesId = undefined;
      this.newBook.seriesName = '';
      this.newBook.seriesOrder = undefined;
      this.availableSeriesOrders = [];
    }
  }

  onSeriesChange() {
    if (this.selectedSeriesId) {
      const series = this.seriesService.getSeriesById(this.selectedSeriesId);
      if (series) {
        this.newBook.seriesId = this.selectedSeriesId;
        this.newBook.seriesName = series.title;

        // Generate available positions in the series
        this.updateAvailableSeriesOrders(series);

        // Auto-fill author if it's the same as series author
        if (!this.newBook.author || this.newBook.author === '') {
          this.newBook.author = series.author;
        }
      }
    } else {
      this.newBook.seriesId = undefined;
      this.newBook.seriesName = '';
      this.newBook.seriesOrder = undefined;
      this.availableSeriesOrders = [];
    }
  }

  updateAvailableSeriesOrders(series: Series) {
    // Get existing order positions
    const existingOrders = series.books
      .map((book) => book.orderInSeries)
      .filter((order) => order !== undefined) as number[];

    // Generate available positions (1 to totalBooks + 1 for new books)
    const maxOrder = Math.max(series.totalBooks, ...existingOrders, 0);
    this.availableSeriesOrders = [];

    for (let i = 1; i <= maxOrder + 1; i++) {
      this.availableSeriesOrders.push(i);
    }
  }

  toggleCreateNewSeries() {
    this.showCreateNewSeries = !this.showCreateNewSeries;
    if (this.showCreateNewSeries) {
      // Pre-fill with current book's author
      this.newSeriesData.author = this.newBook.author;
    }
  }

  createNewSeries() {
    if (this.newSeriesData.title && this.newSeriesData.author) {
      const newSeries: Series = {
        title: this.newSeriesData.title,
        author: this.newSeriesData.author,
        totalBooks: this.newSeriesData.totalBooks,
        readBooks: 0,
        genre: this.newSeriesData.genre,
        books: [],
      };

      this.seriesService.addSeries(newSeries);
      this.loadSeriesOptions();

      // Select the newly created series
      this.selectedSeriesId = newSeries.id!;
      this.onSeriesChange();

      // Reset new series form
      this.showCreateNewSeries = false;
      this.newSeriesData = {
        title: '',
        author: '',
        totalBooks: 1,
        genre: '',
      };
    }
  }

  addBook() {
    console.log('Book added:', this.newBook);

    // If book is part of a series, add it to the series
    if (
      this.isPartOfSeries &&
      this.selectedSeriesId &&
      this.newBook.seriesOrder
    ) {
      this.seriesService.addBookToSeries(
        this.selectedSeriesId,
        this.newBook.title,
        this.newBook.seriesOrder
      );
    }

    // Add current date
    this.newBook.dateAdded = new Date().toISOString().split('T')[0];

    // TODO: send newBook to backend API or store locally

    // Show success message and navigate back
    // You can add a toast notification here
    this.goBack();
  }

  goBack() {
    this.location.back();
  }

  onCoverUpload(event: any) {
    // handle file upload
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newBook.cover = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
