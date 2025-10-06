import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { WishlistService, WishlistStats, WishlistFilters } from '../../services/wishlist.service';
import { Book } from '../../../books/models/book.model';

type Priority = 'High' | 'Medium' | 'Low';
type WishStatus = 'Planned' | 'Purchased' | 'Reading' | 'On Hold';

@Component({
  selector: 'app-all-wishes',
  standalone: false,
  templateUrl: './all-wishes.html',
  styleUrl: './all-wishes.scss',
})
export class AllWishes {
  @ViewChild('dt') table!: Table;

  monthlyBudget = 100;
  budgetProgress = 0;

  wishlist: Book[] = [];
  filteredWishlist: Book[] = [];

  stats: WishlistStats = {
    totalItems: 0,
    totalValue: 0,
    averagePrice: 0,
    highPriorityCount: 0,
    mediumPriorityCount: 0,
    lowPriorityCount: 0
  };

  totalPrice = 0;

  globalFilter = '';
  selectedPriority: Priority | null = null;
  selectedStatus: WishStatus | null = null;
  selectedPriceRange: string | null = null;
  selectedDateRange: string | null = null;
  sortOrder: 'asc' | 'desc' = 'desc';
  selectedBooks: Book[] = [];

  // Budget-related properties
  showBudgetDialog = false;
  showBudgetHistoryDialog = false;
  newBudgetAmount: number = 100;

  // Import and view dialog properties
  showImportDialog = false;
  showViewDialog = false;
  selectedBook: Book | null = null;

  // Import properties
  importFile: File | null = null;
  importBooks: any[] = [];
  importPreview = false;
  importErrors: string[] = [];

  constructor(
    private router: Router,
    private wishlistService: WishlistService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadWishlist();
    this.loadBudgetSettings();
  }

  loadWishlist() {
    this.wishlist = this.wishlistService.getWishlistBooks();
    this.stats = this.wishlistService.getWishlistStats();
    this.applyFilters();
  }

  budgetSuggestions = [
    { label: '$50', value: 50 },
    { label: '$100', value: 100 },
    { label: '$150', value: 150 },
    { label: '$200', value: 200 },
    { label: '$300', value: 300 },
    { label: '$500', value: 500 },
  ];

  budgetHistory: Array<{
    amount: number;
    date: Date;
    reason: string;
  }> = [
      {
        amount: 100,
        date: new Date('2025-08-01'),
        reason: 'Initial budget setup',
      },
    ];

  priorityOptions = [
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  statusOptions = [
    { label: 'Planned', value: 'Planned' as WishStatus },
    { label: 'Purchased', value: 'Purchased' as WishStatus },
    { label: 'Reading', value: 'Reading' as WishStatus },
    { label: 'On Hold', value: 'On Hold' as WishStatus },
  ];

  priceRangeOptions = [
    { label: 'Under $15', value: '0-15' },
    { label: '$15 - $25', value: '15-25' },
    { label: '$25 - $35', value: '25-35' },
    { label: 'Over $35', value: '35+' },
  ];

  dateRangeOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 3 months', value: '3m' },
    { label: 'Last 6 months', value: '6m' },
    { label: 'This year', value: '1y' },
  ];

  loadBudgetSettings(): void {
    // Load saved budget from localStorage
    const savedBudget = localStorage.getItem('monthlyBudget');
    if (savedBudget) {
      this.monthlyBudget = parseFloat(savedBudget);
    }

    const savedBudgetHistory = localStorage.getItem('budgetHistory');
    if (savedBudgetHistory) {
      try {
        this.budgetHistory = JSON.parse(savedBudgetHistory).map(
          (entry: any) => ({
            ...entry,
            date: new Date(entry.date),
          })
        );
      } catch (e) {
        console.warn('Could not parse budget history from localStorage');
      }
    }

    this.wishlist = [
      {
        id: 1,
        title: 'Deep Work',
        authorIds: [1],
        authorNames: ['Cal Newport'],
        genres: ['Productivity', 'Self-Help'],
        status: 'Want to Read',
        price: 20,
        dateAdded: '2025-08-01',
        wishlistPriority: 'High',
        wishlistNotes: 'Productivity classic for focus improvement',
      },
      {
        id: 2,
        title: 'Clean Code',
        authorIds: [2],
        authorNames: ['Robert C. Martin'],
        genres: ['Programming', 'Software Engineering'],
        status: 'Want to Read',
        price: 30,
        dateAdded: '2025-08-05',
        wishlistPriority: 'Medium',
        wishlistNotes: 'Essential for software development best practices',
      },
      {
        id: 3,
        title: 'The Psychology of Money',
        authorIds: [3],
        authorNames: ['Morgan Housel'],
        genres: ['Finance', 'Psychology'],
        status: 'Want to Read',
        price: 25,
        dateAdded: '2025-07-20',
        wishlistPriority: 'High',
        wishlistNotes: 'Understanding financial decision making',
      },
      {
        id: 4,
        title: 'Atomic Habits',
        authorIds: [4],
        authorNames: ['James Clear'],
        genres: ['Self-Help', 'Psychology'],
        status: 'Want to Read',
        price: 18,
        dateAdded: '2025-07-15',
        wishlistPriority: 'Low',
        wishlistNotes: 'Building better habits and breaking bad ones',
      },
      {
        id: 5,
        title: 'Sapiens',
        authorIds: [5],
        authorNames: ['Yuval Noah Harari'],
        genres: ['History', 'Anthropology'],
        status: 'Want to Read',
        price: 22,
        dateAdded: '2025-08-10',
        wishlistPriority: 'Medium',
        wishlistNotes: 'A brief history of humankind',
      },
    ] as Book[];

    this.applyFilters();

    // Debug logging to check if budget calculation is working
    console.log('Budget calculation:', {
      totalPrice: this.totalPrice,
      monthlyBudget: this.monthlyBudget,
      budgetProgress: this.budgetProgress,
      wishlistLength: this.wishlist.length,
      filteredLength: this.filteredWishlist.length,
    });
  }

  applyFilters() {
    const q = this.globalFilter?.trim().toLowerCase();

    this.filteredWishlist = this.wishlist.filter((book) => {
      // Search filter
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.authorNames?.some(author => author.toLowerCase().includes(q)) ||
        (book.wishlistNotes && book.wishlistNotes.toLowerCase().includes(q));

      // Priority filter
      const matchesPriority =
        !this.selectedPriority || book.wishlistPriority === this.selectedPriority;

      // Status filter
      const matchesStatus =
        !this.selectedStatus || book.status === this.selectedStatus;

      // Price range filter
      const matchesPriceRange = this.matchesPriceRange(book.price || 0);

      // Date range filter
      const matchesDateRange = this.matchesDateRange(book.dateAdded ? new Date(book.dateAdded) : new Date());

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus &&
        matchesPriceRange &&
        matchesDateRange
      );
    });

    // Apply sorting
    this.applySorting();

    // Update totals
    // Calculate total for all books in current filtered view
    this.totalPrice = this.filteredWishlist.reduce(
      (sum, b) => sum + (b.price || 0),
      0
    );

    this.budgetProgress =
      this.monthlyBudget > 0 ? (this.totalPrice / this.monthlyBudget) * 100 : 0;
  }

  private matchesPriceRange(price: number): boolean {
    if (!this.selectedPriceRange) return true;

    switch (this.selectedPriceRange) {
      case '0-15':
        return price < 15;
      case '15-25':
        return price >= 15 && price <= 25;
      case '25-35':
        return price > 25 && price <= 35;
      case '35+':
        return price > 35;
      default:
        return true;
    }
  }

  private matchesDateRange(dateAdded: Date): boolean {
    if (!this.selectedDateRange) return true;

    const now = new Date();
    const bookDate = new Date(dateAdded);
    const diffInDays = Math.floor(
      (now.getTime() - bookDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (this.selectedDateRange) {
      case '7d':
        return diffInDays <= 7;
      case '30d':
        return diffInDays <= 30;
      case '3m':
        return diffInDays <= 90;
      case '6m':
        return diffInDays <= 180;
      case '1y':
        return diffInDays <= 365;
      default:
        return true;
    }
  }

  private applySorting() {
    this.filteredWishlist.sort((a, b) => {
      const dateA = new Date(a.dateAdded || Date.now()).getTime();
      const dateB = new Date(b.dateAdded || Date.now()).getTime();

      if (this.sortOrder === 'desc') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  }

  // New methods for enhanced functionality
  getBooksByStatus(status: WishStatus): Book[] {
    return this.wishlist.filter((book) => book.status === status);
  }

  getBooksByPriority(priority: Priority): Book[] {
    return this.wishlist.filter((book) => book.wishlistPriority === priority);
  }

  getRemainingBudget(): number {
    return this.monthlyBudget - this.totalPrice;
  }

  clearFilters() {
    this.globalFilter = '';
    this.selectedPriority = null;
    this.selectedStatus = null;
    this.selectedPriceRange = null;
    this.selectedDateRange = null;
    this.applyFilters();
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.globalFilter) count++;
    if (this.selectedPriority) count++;
    if (this.selectedStatus) count++;
    if (this.selectedPriceRange) count++;
    if (this.selectedDateRange) count++;
    return count;
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    this.applyFilters();
  }

  refreshData() {
    // In a real app, this would refresh from the backend
    console.log('Refreshing data...');
    this.applyFilters();
  }

  importData() {
    this.showImportDialog = true;
    this.resetImport();
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.importFile = file;
      this.parseCSVFile(file);
    }
  }

  parseCSVFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map((h: string) => h.trim());

      this.importBooks = [];
      this.importErrors = [];

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
          const book: any = {};

          headers.forEach((header: string, index: number) => {
            book[header.toLowerCase()] = values[index]?.trim() || '';
          });

          // Validate required fields
          if (!book.title || !book.author) {
            this.importErrors.push(`Row ${i + 1}: Missing title or author`);
          } else {
            // Set defaults and validate
            book.price = parseFloat(book.price) || 0;
            book.priority = ['High', 'Medium', 'Low'].includes(book.priority)
              ? book.priority
              : 'Medium';
            book.status = [
              'Planned',
              'Purchased',
              'Reading',
              'On Hold',
            ].includes(book.status)
              ? book.status
              : 'Planned';
            book.dateAdded = new Date();

            this.importBooks.push(book);
          }
        }
      }

      this.importPreview = true;
    };
    reader.readAsText(file);
  }

  confirmImport() {
    this.wishlist = [...this.wishlist, ...this.importBooks];
    this.applyFilters();
    this.showImportDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Import Successful',
      detail: `Successfully imported ${this.importBooks.length} books to your wishlist`,
      life: 4000,
    });
    this.resetImport();
  }

  cancelImport() {
    this.showImportDialog = false;
    this.resetImport();
  }

  resetImport() {
    this.importFile = null;
    this.importBooks = [];
    this.importPreview = false;
    this.importErrors = [];
  }

  downloadSampleCSV() {
    const sampleData = [
      'title,author,price,priority,status,notes',
      'Clean Code,Robert C. Martin,30,High,Planned,Essential reading for software developers',
      'The Psychology of Money,Morgan Housel,25,Medium,Planned,Understanding financial behavior',
      'Atomic Habits,James Clear,18,Low,Reading,Building better habits',
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wishlist_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'info',
      summary: 'Sample Downloaded',
      detail:
        'Sample CSV file has been downloaded. Use it as a template for your import.',
      life: 3000,
    });
  }

  // Quick filter methods
  filterByPriority(priority: Priority) {
    this.selectedPriority = priority;
    this.applyFilters();
  }

  filterByStatus(status: WishStatus) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  filterByDateRange(dateRange: string) {
    this.selectedDateRange = dateRange;
    this.applyFilters();
  }

  getRecentBooks(days: number): Book[] {
    const now = new Date();
    return this.wishlist.filter((book) => {
      const bookDate = new Date(book.dateAdded || Date.now());
      const diffInDays = Math.floor(
        (now.getTime() - bookDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffInDays <= days;
    });
  }

  getAveragePrice(): number {
    if (this.wishlist.length === 0) return 0;
    const total = this.wishlist.reduce((sum, book) => sum + (book.price || 0), 0);
    return total / this.wishlist.length;
  }

  getDailyBudget(): number {
    return this.monthlyBudget / 30;
  }

  getProgressBarWidth(): number {
    return Math.min(this.budgetProgress, 100);
  }

  // Budget management methods
  editBudget() {
    this.newBudgetAmount = this.monthlyBudget;
    this.showBudgetDialog = true;
  }

  viewBudgetHistory() {
    this.showBudgetHistoryDialog = true;
  }

  setBudgetSuggestion(amount: number) {
    this.newBudgetAmount = amount;
  }

  saveBudget() {
    if (this.newBudgetAmount && this.newBudgetAmount > 0) {
      const oldBudget = this.monthlyBudget;
      this.monthlyBudget = this.newBudgetAmount;

      // Add to budget history
      this.budgetHistory.unshift({
        amount: this.newBudgetAmount,
        date: new Date(),
        reason:
          oldBudget === this.newBudgetAmount
            ? 'Budget unchanged'
            : oldBudget < this.newBudgetAmount
              ? 'Budget increased'
              : 'Budget decreased',
      });

      // Keep only last 10 entries
      if (this.budgetHistory.length > 10) {
        this.budgetHistory = this.budgetHistory.slice(0, 10);
      }

      // Recalculate budget progress
      this.applyFilters();

      // TODO: Save to backend/localStorage
      localStorage.setItem('monthlyBudget', this.monthlyBudget.toString());
      localStorage.setItem('budgetHistory', JSON.stringify(this.budgetHistory));

      this.showBudgetDialog = false;

      // Show success message
      console.log(`Budget updated to ${this.monthlyBudget}`);
    }
  }

  cancelBudgetEdit() {
    this.newBudgetAmount = this.monthlyBudget;
    this.showBudgetDialog = false;
  }

  // PrimeNG allowed severity return type
  getPrioritySeverity(
    priority: Priority
  ): 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    return priority === 'High'
      ? 'danger'
      : priority === 'Medium'
        ? 'warn'
        : 'success';
  }

  getStatusSeverity(
    status: WishStatus
  ): 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'Planned':
        return 'info';
      case 'Purchased':
        return 'success';
      case 'Reading':
        return 'warn';
      case 'On Hold':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  viewBook(book: Book) {
    this.selectedBook = { ...book };
    this.showViewDialog = true;
  }

  editBook(book: Book) {
    // Navigate to edit page with book data
    this.router.navigate(['/wishlist/edit'], {
      queryParams: {
        title: book.title,
        author: book.authorNames?.[0] || '',
      },
    });
  }

  editBookFromView() {
    if (this.selectedBook) {
      this.showViewDialog = false;
      this.editBook(this.selectedBook);
    }
  }

  deleteBookFromView() {
    if (this.selectedBook) {
      this.showViewDialog = false;
      this.deleteBook(this.selectedBook);
    }
  }

  deleteBook(book: Book) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${book.title}" from your wishlist?`,
      header: 'Delete Book',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-text p-button-sm',
      accept: () => {
        this.wishlist = this.wishlist.filter((b) => b !== book);
        this.applyFilters();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `"${book.title}" removed from wishlist`,
          life: 3000,
        });
      },
    });
  }

  addWish() {
    this.router.navigate(['/wishlist/add-wishlist']);
  }

  exportCSV() {
    // prefer PrimeNG table export if available
    if (this.table && typeof this.table.exportCSV === 'function') {
      try {
        this.table.exportCSV();
        return;
      } catch (e) {
        // fallback to manual CSV if PrimeNG export fails
        console.warn('PrimeNG export failed, fallback to manual CSV', e);
      }
    }

    // manual CSV fallback (filteredWishlist)
    const headers = [
      'Title',
      'Author',
      'Price',
      'Date Added',
      'Priority',
      'Status',
      'Notes',
    ];
    const rows = this.filteredWishlist.map((b) => [
      this.escapeCsv(b.title),
      this.escapeCsv(b.authorNames?.join(', ') || ''),
      (b.price || 0).toString(),
      b.dateAdded || '',
      b.wishlistPriority || '',
      b.status,
      this.escapeCsv(b.wishlistNotes || ''),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wishlist_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private escapeCsv(value: string) {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
