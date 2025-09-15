import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Book } from '../../models/book.model';

// Using the Book model from the books module instead of local interface

@Component({
  selector: 'app-all-book',
  standalone: false,
  templateUrl: './all-book.html',
  styleUrl: './all-book.scss',
})
export class AllBook implements OnInit {
  @ViewChild('dt') table!: Table;
  first = 0;
  rows = 10;

  viewMode: 'table' | 'grid' = 'table';
  loading = false;

  // Filters / search
  globalFilter = '';
  selectedStatus: string | null = null;
  selectedGenres: string[] = [];
  selectedAuthor: string | null = null;

  // Options for filters (derived in ngOnInit)
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Read', value: 'Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Want to Read', value: 'Want to Read' },
  ];

  genreOptions: { label: string; value: string }[] = [];
  authorOptions: { label: string; value: string }[] = [];

  // Data
  books: Book[] = [];
  filteredBooks: Book[] = [];

  // UI bindings
  ratingValue = 4; // sample binding for other UI pieces

  seriesMap: { [key: number]: Book[] } = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loading = true;

    // Simulate loading time for better UX
    setTimeout(() => {
      this.loadBooks();
      this.loading = false;
    }, 800);
  }

  loadBooks(): void {
    // SAMPLE DATA — replace with real data from backend
    this.books = [
      {
        id: 1,
        title: 'The Hobbit',
        authorIds: [1], // J.R.R. Tolkien
        authorNames: ['J.R.R. Tolkien'],
        genres: ['Fantasy', 'Adventure'],
        pages: 310,
        rating: 4.8,
        status: 'Reading',
        cover: 'assets/images/product-not-found.png',
        dateAdded: '2024-05-01',
        price: 9.99,
        source: 'Amazon',
        seriesId: 1,
        seriesName: 'Middle-earth',
      },
      {
        id: 2,
        title: 'The Fellowship of the Ring',
        authorIds: [1], // J.R.R. Tolkien
        authorNames: ['J.R.R. Tolkien'],
        genres: ['Fantasy', 'Epic'],
        pages: 423,
        rating: 4.9,
        status: 'Read',
        cover: 'assets/images/product-not-found.png',
        dateAdded: '2024-06-01',
        price: 11.99,
        source: 'Barnes & Noble',
        seriesId: 1,
        seriesName: 'Middle-earth',
      },
      {
        id: 3,
        title: 'Dune',
        authorIds: [2], // Frank Herbert
        authorNames: ['Frank Herbert'],
        genres: ['Science Fiction', 'Space Opera'],
        pages: 688,
        rating: 4.7,
        status: 'Want to Read',
        cover: 'assets/images/product-not-found.png',
        dateAdded: '2024-07-15',
        price: 15.99,
        source: 'Amazon',
      },
      {
        id: 4,
        title: 'The Name of the Wind',
        authorIds: [3], // Patrick Rothfuss
        authorNames: ['Patrick Rothfuss'],
        genres: ['Fantasy', 'Adventure'],
        pages: 662,
        rating: 4.6,
        status: 'Read',
        cover: 'assets/images/product-not-found.png',
        dateAdded: '2024-04-22',
        price: 12.99,
        source: 'Library',
        seriesId: 2,
        seriesName: 'The Kingkiller Chronicle',
      },
    ];

    // populate filter option lists
    const genres = new Set<string>();
    const authors = new Set<string>();
    this.books.forEach((b) => {
      b.genres.forEach((g) => genres.add(g));
      b.authorNames?.forEach((a) => authors.add(a));
    });

    this.genreOptions = Array.from(genres).map((g) => ({ label: g, value: g }));
    this.authorOptions = Array.from(authors).map((a) => ({
      label: a,
      value: a,
    }));

    // initial filtered list
    this.applyFilters();

    this.groupBooksBySeries();
  }

  groupBooksBySeries() {
    this.seriesMap = {};
    this.books.forEach((book) => {
      if (book.seriesId) {
        if (!this.seriesMap[book.seriesId]) {
          this.seriesMap[book.seriesId] = [];
        }
        this.seriesMap[book.seriesId].push(book);
      }
    });
  }

  // compute series completion status
  getSeriesCompletion(seriesId: number): string {
    const booksInSeries = this.seriesMap[seriesId];
    const finishedCount = booksInSeries.filter(
      (b) => b.status === 'Read'
    ).length;
    return `${finishedCount}/${booksInSeries.length} read`;
  }

  // Navigate to series view page
  viewSeries(seriesId: number) {
    const booksInSeries = this.seriesMap[seriesId];
    console.log('Series Books:', booksInSeries);
    // Navigate to series view page
    this.router.navigate([`/series/view/${seriesId}`]);
  }

  applyFilters() {
    const q = (this.globalFilter || '').trim().toLowerCase();

    this.filteredBooks = this.books.filter((b) => {
      // status
      if (this.selectedStatus && b.status !== this.selectedStatus) return false;

      // genres (all selected genres must be present)
      if (this.selectedGenres && this.selectedGenres.length) {
        const hasAll = this.selectedGenres.every((g) => b.genres.includes(g));
        if (!hasAll) return false;
      }

      // author
      if (this.selectedAuthor && !b.authorNames?.includes(this.selectedAuthor)) return false;

      // global search on title or author
      if (q) {
        const match =
          b.title.toLowerCase().includes(q) ||
          b.authorNames?.some(author => author.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });

    // If table is present, reset paginator to first page after filtering
    if (this.table) {
      this.table.reset();
    }
  }

  clearFilters() {
    this.globalFilter = '';
    this.selectedStatus = null;
    this.selectedGenres = [];
    this.selectedAuthor = null;
    this.applyFilters();
  }

  exportCSV() {
    // exports current filtered table (only works when p-table bound to filteredBooks)
    if (this.table) {
      this.table.exportCSV();
    }
  }

  getStatusBadgeClass(status: string | undefined) {
    switch (status) {
      case 'Read':
        return 'bg-green-500 text-white';
      case 'Reading':
        return 'bg-blue-500 text-white';
      case 'Wishlist':
      case 'Want to Read':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-400 text-white';
    }
  }

  getBooksByStatus(status: string): Book[] {
    return this.books.filter((book) => book.status === status);
  }

  // placeholder actions
  viewBook(id: any) {
    this.router.navigate([`/books/${id}`]);
    // open sidepanel / dialog
  }
  editBook(book: Book) {
    console.log('edit', book);
  }
  deleteBook(book: Book) {
    // confirm & remove
    this.books = this.books.filter((b) => b.id !== book.id);
    this.applyFilters();
  }

  addBookPage() {
    this.router.navigate(['/books/add-book']);
  }
}
