import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}

  quotes: Quote[] = [];
  filteredQuotes: Quote[] = [];
  loading = false;
  viewMode: 'table' | 'card' = 'table';
  currentPageFirst = 0;
  pageSize = 12;

  showFavoritesOnly: boolean = false;

  globalFilter = '';
  selectedTags: string[] = [];
  selectedBook: string | null = null;

  tagOptions: { label: string; value: string }[] = [];
  bookOptions: { label: string; value: string }[] = [];

  // Dialog controls
  displayTagDialog = false;
  tagCounts: Record<string, number> = {};
  newTagName = '';

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.loading = true;

    // Simulate loading delay
    setTimeout(() => {
      // Sample data with more quotes for better demonstration
      this.quotes = [
        {
          id: 1,
          quote:
            'The quality of your life is determined by the quality of your thoughts.',
          book: 'Atomic Habits',
          author: 'James Clear',
          pageNumber: 45,
          tags: ['inspirational', 'self-help', 'mindset'],
          dateAdded: new Date('2024-01-15'),
          favorite: true,
          notes:
            'This really resonated with me during my morning routine development.',
        },
        {
          id: 2,
          quote: 'Not all those who wander are lost.',
          book: 'The Fellowship of the Ring',
          author: 'J.R.R. Tolkien',
          tags: ['fiction', 'classic', 'adventure'],
          dateAdded: new Date('2024-02-10'),
          favorite: false,
          notes: "Beautiful metaphor for life's journey.",
        },
        {
          id: 3,
          quote: 'History is written by the victors.',
          book: 'Sapiens',
          author: 'Yuval Noah Harari',
          pageNumber: 103,
          tags: ['history', 'philosophical', 'thought-provoking'],
          dateAdded: new Date('2024-03-05'),
          favorite: true,
          notes: 'Makes me question everything I thought I knew about history.',
        },
        {
          id: 4,
          quote: 'The unexamined life is not worth living.',
          book: 'Apology',
          author: 'Plato',
          pageNumber: 38,
          tags: ['philosophy', 'classical', 'wisdom'],
          dateAdded: new Date('2024-01-20'),
          favorite: true,
        },
        {
          id: 5,
          quote:
            'In the midst of winter, I found there was, within me, an invincible summer.',
          book: 'The Stranger',
          author: 'Albert Camus',
          tags: ['existential', 'inspirational', 'resilience'],
          dateAdded: new Date('2024-02-15'),
          favorite: false,
        },
        {
          id: 6,
          quote: 'The way to get started is to quit talking and begin doing.',
          book: 'The Disney Way',
          author: 'Walt Disney',
          pageNumber: 12,
          tags: ['motivational', 'action', 'business'],
          dateAdded: new Date('2024-03-10'),
          favorite: true,
        },
      ];

      this.initializeFilters();
      this.applyFilters();
      this.calculateTagCounts();
      this.loading = false;
    }, 1000);
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

  navigateToAddQuote() {
    this.router.navigate(['/quotes/add']);
  }

  openTagDialog() {
    this.displayTagDialog = true;
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
    this.router.navigate(['/quotes/edit', quote.id]);
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

  getTagCount(): number {
    return Object.keys(this.tagCounts).length;
  }

  hasActiveFilters(): boolean {
    return !!(
      this.globalFilter ||
      this.selectedBook ||
      this.selectedTags.length > 0 ||
      this.showFavoritesOnly
    );
  }

  getFavoriteQuotes(): Quote[] {
    return this.quotes.filter((quote) => quote.favorite);
  }

  onPageChange(event: any): void {
    this.currentPageFirst = event.first;
  }

  getPaginatedQuotes(): Quote[] {
    const start = this.currentPageFirst;
    const end = start + this.pageSize;
    return this.filteredQuotes.slice(start, end);
  }

  // Tag Management Methods
  getMostUsedTag(): { tag: string; count: number } {
    let maxCount = 0;
    let mostUsedTag = '';

    Object.entries(this.tagCounts).forEach(([tag, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostUsedTag = tag;
      }
    });

    return { tag: mostUsedTag, count: maxCount };
  }

  getUnusedTags(): string[] {
    const allTags = Object.keys(this.tagCounts);
    return allTags.filter((tag) => this.tagCounts[tag] === 0);
  }

  addNewTag(): void {
    const tagName = this.newTagName.trim().toLowerCase();
    if (tagName && !this.tagCounts.hasOwnProperty(tagName)) {
      this.tagCounts[tagName] = 0;
      this.initializeFilters();
      this.newTagName = '';
    }
  }

  editTag(tagName: string): void {
    const newName = prompt(`Edit tag "${tagName}":`, tagName);
    if (newName && newName.trim() && newName.trim() !== tagName) {
      const trimmedName = newName.trim().toLowerCase();

      // Update all quotes with this tag
      this.quotes.forEach((quote) => {
        const tagIndex = quote.tags.indexOf(tagName);
        if (tagIndex > -1) {
          quote.tags[tagIndex] = trimmedName;
        }
      });

      // Update tag counts
      this.calculateTagCounts();
      this.initializeFilters();
      this.applyFilters();
    }
  }

  deleteTag(tagName: string): void {
    if (this.tagCounts[tagName] === 0) {
      if (confirm(`Delete unused tag "${tagName}"?`)) {
        delete this.tagCounts[tagName];
        this.initializeFilters();
      }
    }
  }

  openMergeDialog(): void {
    // Implementation for tag merging dialog
    alert('Tag merging feature - to be implemented');
  }

  cleanUnusedTags(): void {
    const unusedTags = this.getUnusedTags();
    if (
      unusedTags.length > 0 &&
      confirm(`Delete ${unusedTags.length} unused tags?`)
    ) {
      unusedTags.forEach((tag) => delete this.tagCounts[tag]);
      this.initializeFilters();
    }
  }

  exportTags(): void {
    const tagData = Object.entries(this.tagCounts).map(([tag, count]) => ({
      tag,
      count,
      severity: this.getTagSeverity(tag),
    }));

    const csvContent =
      'Tag,Usage Count,Severity\n' +
      tagData
        .map((item) => `${item.tag},${item.count},${item.severity}`)
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quote-tags.csv';
    link.click();
    window.URL.revokeObjectURL(url);
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
    this.router.navigate(['/quotes/view', quote.id]);
  }
}
