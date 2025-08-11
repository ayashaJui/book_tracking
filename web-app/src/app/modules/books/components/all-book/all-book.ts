import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

interface Book {
  id: number;
  title: string;
  author: string;
  genres: string[];
  pages: number;
  rating: number; // 0-5
  status: 'Read' | 'Reading' | 'Want to Read' | string;
  cover?: string;
  dateAdded?: string;
  price?: number;
  source?: string; // e.g., 'Amazon', 'Library', etc.
}

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

  constructor() {}

  ngOnInit(): void {
    // SAMPLE DATA — replace with real data from backend
    this.books = [
      {
        id: 1,
        title: 'Atomic Habits',
        author: 'James Clear',
        genres: ['Self-help', 'Productivity'],
        pages: 320,
        rating: 4.5,
        status: 'Read',
        cover: 'assets/images/product-not-found.png',
        dateAdded: '2024-02-10',
        price: 12.99,
        source: 'Amazon',
      },
      {
        id: 2,
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genres: ['Fantasy'],
        pages: 310,
        rating: 4.8,
        status: 'Reading',
        cover: 'assets/images/product-not-found.png',
        dateAdded: '2024-05-01',
        price: 9.99,
        source: 'Library',
      },
      {
        id: 3,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        genres: ['History', 'Non-Fiction'],
        pages: 498,
        rating: 4.6,
        status: 'Want to Read',
        cover: 'assets/images/product-not-found.png',
        dateAdded: '2024-06-12',
        price: 14.99,
        source: 'Bookstore',
      },
      // add more items for testing...
    ];

    // populate filter option lists
    const genres = new Set<string>();
    const authors = new Set<string>();
    this.books.forEach((b) => {
      b.genres.forEach((g) => genres.add(g));
      authors.add(b.author);
    });

    this.genreOptions = Array.from(genres).map((g) => ({ label: g, value: g }));
    this.authorOptions = Array.from(authors).map((a) => ({
      label: a,
      value: a,
    }));

    // initial filtered list
    this.applyFilters();
  }

  toggleView() {
    this.viewMode = this.viewMode === 'table' ? 'grid' : 'table';
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
      if (this.selectedAuthor && b.author !== this.selectedAuthor) return false;

      // global search on title or author
      if (q) {
        const match =
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q);
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

  getStatusBadgeClass(status: string) {
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

  // placeholder actions
  viewBook(book: Book) {
    console.log('view', book);
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
}
