import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SeriesService } from '../../services/series.service';
import { Series, SeriesBook, SeriesAuthor } from '../../models/series.model';

@Component({
  selector: 'app-edit-series',
  standalone: false,
  templateUrl: './edit-series.html',
  providers: [MessageService],
})
export class EditSeries implements OnInit {
  series: Series = {
    title: '',
    authors: [{ name: '', role: 'Author' }],
    totalBooks: 0,
    readBooks: 0,
    books: [],
  };

  isLoading = false;
  seriesId: number | null = null;
  genreInput = '';

  bookStatuses = [
    { label: 'Want to Read', value: 'Want to Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Finished', value: 'Finished' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  // Role options for authors
  roleOptions = [
    { label: 'Author', value: 'Author' },
    { label: 'Co-Author', value: 'Co-Author' },
    { label: 'Editor', value: 'Editor' },
    { label: 'Illustrator', value: 'Illustrator' },
    { label: 'Translator', value: 'Translator' },
    { label: 'Contributor', value: 'Contributor' },
  ];

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
      }
    });
  }

  loadSeries() {
    if (this.seriesId) {
      const series = this.seriesService.getSeriesById(this.seriesId);
      if (series) {
        this.series = { ...series };
        // Ensure books array has proper order
        this.series.books.sort(
          (a, b) => (a.orderInSeries || 0) - (b.orderInSeries || 0)
        );
        // Set genre input
        this.genreInput = this.series.genres
          ? this.series.genres.join(', ')
          : '';
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Series not found',
        });
        this.router.navigate(['/series']);
      }
    }
  }

  addBook() {
    const newBook: SeriesBook = {
      title: '',
      status: 'Want to Read',
      orderInSeries: this.series.books.length + 1,
    };
    this.series.books.push(newBook);
    this.updateTotalBooks();
  }

  removeBook(index: number) {
    this.series.books.splice(index, 1);
    // Reorder remaining books
    this.series.books.forEach((book, i) => {
      book.orderInSeries = i + 1;
    });
    this.updateTotalBooks();
  }

  moveBookUp(index: number) {
    if (index > 0) {
      const temp = this.series.books[index];
      this.series.books[index] = this.series.books[index - 1];
      this.series.books[index - 1] = temp;
      // Update order numbers
      this.series.books[index].orderInSeries = index + 1;
      this.series.books[index - 1].orderInSeries = index;
    }
  }

  moveBookDown(index: number) {
    if (index < this.series.books.length - 1) {
      const temp = this.series.books[index];
      this.series.books[index] = this.series.books[index + 1];
      this.series.books[index + 1] = temp;
      // Update order numbers
      this.series.books[index].orderInSeries = index + 1;
      this.series.books[index + 1].orderInSeries = index + 2;
    }
  }

  updateTotalBooks() {
    this.series.totalBooks = this.series.books.length;
    this.updateReadBooks();
  }

  updateReadBooks() {
    this.series.readBooks = this.series.books.filter(
      (book) => book.status === 'Finished'
    ).length;
  }

  updateGenres() {
    if (this.genreInput.trim()) {
      this.series.genres = this.genreInput
        .split(',')
        .map((genre) => genre.trim())
        .filter((genre) => genre.length > 0);
    } else {
      this.series.genres = [];
    }
  }

  removeGenre(index: number) {
    if (this.series.genres) {
      this.series.genres.splice(index, 1);
      this.genreInput = this.series.genres.join(', ');
    }
  }

  onBookStatusChange() {
    this.updateReadBooks();
  }

  addAuthor() {
    this.series.authors.push({ name: '', role: 'Author' });
  }

  removeAuthor(index: number) {
    if (this.series.authors.length > 1) {
      this.series.authors.splice(index, 1);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'A series must have at least one author',
      });
    }
  }

  onSubmit() {
    if (!this.series.title || !this.series.authors || this.series.authors.length === 0 || !this.series.authors[0].name.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    this.isLoading = true;

    try {
      this.seriesService.updateSeries(this.series);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Series updated successfully',
      });

      setTimeout(() => {
        this.router.navigate(['/series']);
      }, 1500);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update series',
      });
    } finally {
      this.isLoading = false;
    }
  }

  onCancel() {
    this.router.navigate(['/series']);
  }
}
