import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

interface Quote {
  id: number;
  quote: string;
  book: string;
  author: string;
  pageNumber?: number;
  tags: string[];
  dateAdded: Date;
  notes?: string;
  favorite?: boolean;
}

@Component({
  selector: 'app-all-quotes',
  standalone: false,
  templateUrl: './all-quotes.html',
  styleUrl: './all-quotes.scss',
})
export class AllQuotes implements OnInit {
  @ViewChild('dt') table!: Table;

  quotes: Quote[] = [];
  filteredQuotes: Quote[] = [];

  showFavoritesOnly: boolean = false;

  globalFilter = '';
  selectedTags: string[] = [];
  selectedBook: string | null = null;

  tagOptions: { label: string; value: string }[] = [];
  bookOptions: { label: string; value: string }[] = [];

  // Dialog controls
  displayQuoteDialog = false;
  selectedQuote?: Quote;
  displayTagDialog = false;
  tagCounts: Record<string, number> = {};

  ngOnInit(): void {
    // Sample data
    this.quotes = [
      {
        id: 1,
        quote:
          'The quality of your life is determined by the quality of your thoughts.',
        book: 'Atomic Habits',
        author: 'James Clear',
        pageNumber: 45,
        tags: ['inspirational', 'self-help'],
        dateAdded: new Date('2024-01-15'),
      },
      {
        id: 2,
        quote: 'Not all those who wander are lost.',
        book: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        tags: ['fiction', 'classic'],
        dateAdded: new Date('2024-02-10'),
      },
      {
        id: 3,
        quote: 'History is written by the victors.',
        book: 'Sapiens',
        author: 'Yuval Noah Harari',
        pageNumber: 103,
        tags: ['history', 'philosophical'],
        dateAdded: new Date('2024-03-05'),
      },
    ];

    this.initializeFilters();
    this.applyFilters();
    this.calculateTagCounts();
  }

  calculateTagCounts() {
    this.tagCounts = {};
    this.quotes.forEach((q) => {
      q.tags.forEach((tag) => {
        this.tagCounts[tag] = (this.tagCounts[tag] || 0) + 1;
      });
    });
  }

  toggleTagFilter(tag: string) {
    if (!this.selectedTags) this.selectedTags = [];
    const idx = this.selectedTags.indexOf(tag);
    if (idx > -1) this.selectedTags.splice(idx, 1);
    else this.selectedTags.push(tag);
    this.applyFilters();
  }

  initializeFilters() {
    // Extract unique tags and books
    const tagSet = new Set<string>();
    const bookSet = new Set<string>();

    this.quotes.forEach((q) => {
      q.tags.forEach((t) => tagSet.add(t));
      bookSet.add(q.book);
    });

    this.tagOptions = Array.from(tagSet).map((tag) => ({
      label: this.capitalize(tag),
      value: tag,
    }));
    this.bookOptions = Array.from(bookSet).map((book) => ({
      label: book,
      value: book,
    }));
  }

  applyFilters() {
    const q = this.globalFilter.trim().toLowerCase();

    this.filteredQuotes = this.quotes.filter((quote) => {
      if (this.showFavoritesOnly && !quote.favorite) return false;

      const matchesSearch =
        !q ||
        quote.quote.toLowerCase().includes(q) ||
        quote.book.toLowerCase().includes(q) ||
        quote.author.toLowerCase().includes(q);

      // Check if selectedTags is set & has length, then quote must have at least one tag in selectedTags
      if (this.selectedTags && this.selectedTags.length > 0) {
        if (!this.selectedTags.some((tag) => quote.tags.includes(tag)))
          return false;
      }

      // Filter by selected book if set
      if (this.selectedBook && quote.book !== this.selectedBook) return false;

      return matchesSearch;
    });
  }

  toggleFavorite(quote: Quote) {
    quote.favorite = !quote.favorite;
    this.applyFilters();
  }

  toggleFavoritesFilter() {
    this.showFavoritesOnly = !this.showFavoritesOnly;
    this.applyFilters();
  }

  clearFilters() {
    this.globalFilter = '';
    this.selectedTags = [];
    this.selectedBook = null;
    this.applyFilters();
  }

  openAddQuoteDialog() {
    // this.editingQuote = null;
    // this.quoteFormModel = {
    //   quote: '',
    //   book: '',
    //   author: '',
    //   pageNumber: undefined,
    //   tags: [],
    //   dateAdded: new Date(),
    // };
    this.displayQuoteDialog = true;
  }

  openTagDialog() {
    this.displayTagDialog = true;
  }

  closeQuoteDialog() {
    this.displayQuoteDialog = false;
  }

  closeTagDialog() {
    this.displayTagDialog = false;
  }

  getTagSeverity(
    tag: string
  ): 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    // Assign colors by tag for fun
    switch (tag.toLowerCase()) {
      case 'inspirational':
        return 'success';
      case 'self-help':
        return 'info';
      case 'fiction':
        return 'warn';
      case 'classic':
        return 'secondary';
      case 'history':
        return 'danger';
      case 'philosophical':
        return 'contrast';
      default:
        return 'info';
    }
  }

  getTagSeverityClass(tag: string): string {
    switch (tag.toLowerCase()) {
      case 'inspirational':
        return 'bg-green-200 text-green-800';
      case 'self-help':
        return 'bg-blue-200 text-blue-800';
      case 'fiction':
        return 'bg-yellow-200 text-yellow-800';
      case 'classic':
        return 'bg-gray-300 text-gray-800';
      case 'history':
        return 'bg-red-200 text-red-800';
      case 'philosophical':
        return 'bg-purple-200 text-purple-800';
      default:
        return 'bg-indigo-200 text-indigo-800';
    }
  }

  editQuote(quote: Quote) {
    alert(`Edit quote: "${quote.quote}"`);
    // TODO: open edit dialog
  }

  deleteQuote(quote: Quote) {
    if (confirm(`Delete this quote? \n\n"${quote.quote}"`)) {
      this.quotes = this.quotes.filter((q) => q.id !== quote.id);
      this.applyFilters();
    }
  }

  private capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  exportQuotesCSV() {
    if (this.table) {
      this.table.exportCSV();
    }
  }

  importQuotesCSV(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const csvText = reader.result as string;
      // Parse CSV - use a library or simple parser here
      const rows = csvText.split('\n');
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(',');
        if (cols.length < 6) continue;
        this.quotes.push({
          id: Date.now() + i,
          quote: cols[0].trim(),
          book: cols[1].trim(),
          author: cols[2].trim(),
          pageNumber: +cols[3].trim() || undefined,
          tags: cols[4].split(';').map((t) => t.trim()),
          dateAdded: new Date(cols[5].trim()),
        });
      }
      this.applyFilters();
    };
    reader.readAsText(file);
  }

  shareQuote(quote: Quote) {
    const text = `"${quote.quote}" — ${quote.author}, ${quote.book}`;
    const url = encodeURIComponent(window.location.href);

    if (navigator.share) {
      navigator.share({
        title: 'Favorite Quote',
        text,
        url,
      });
    } else {
      // fallback: open twitter share
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        '_blank'
      );
    }
  }

  viewQuoteDetails(quote: Quote) {
    this.selectedQuote = { ...quote };
    this.displayQuoteDialog = true;
  }

  saveQuoteDetails() {
    if (!this.selectedQuote) return;
    const idx = this.quotes.findIndex((q) => q.id === this.selectedQuote!.id);
    if (idx !== -1) {
      this.quotes[idx] = { ...this.selectedQuote };
    }
    this.displayQuoteDialog = false;
    this.applyFilters();
  }
}
