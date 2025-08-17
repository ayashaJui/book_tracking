import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

interface WishlistBook {
  title: string;
  author: string;
  price: number;
  dateAdded: Date;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Planned' | 'Purchased' | 'Reading' | 'On Hold';
  notes?: string;
}

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

  wishlist: WishlistBook[] = [];
  filteredWishlist: WishlistBook[] = [];

  totalPrice = 0;

  globalFilter = '';
  selectedPriority: Priority | null = null;
  selectedStatus: WishStatus | null = null;
  selectedPriceRange: string | null = null;
  selectedDateRange: string | null = null;
  sortOrder: 'asc' | 'desc' = 'desc';
  selectedBooks: WishlistBook[] = [];

  // Budget-related properties
  showBudgetDialog = false;
  showBudgetHistoryDialog = false;
  newBudgetAmount: number = 100;

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

  constructor(private router: Router) {}

  ngOnInit(): void {
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
        title: 'Deep Work',
        author: 'Cal Newport',
        price: 20,
        dateAdded: new Date('2025-08-01'),
        priority: 'High',
        status: 'Planned',
        notes: 'Productivity classic for focus improvement',
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        price: 30,
        dateAdded: new Date('2025-08-05'),
        priority: 'Medium',
        status: 'Purchased',
        notes: 'Essential for software development best practices',
      },
      {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        price: 25,
        dateAdded: new Date('2025-07-20'),
        priority: 'High',
        status: 'Reading',
        notes: 'Understanding financial decision making',
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        price: 18,
        dateAdded: new Date('2025-07-15'),
        priority: 'Low',
        status: 'On Hold',
        notes: 'Building better habits and breaking bad ones',
      },
      {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        price: 22,
        dateAdded: new Date('2025-08-10'),
        priority: 'Medium',
        status: 'Planned',
        notes: 'A brief history of humankind',
      },
    ];

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
        book.author.toLowerCase().includes(q) ||
        (book.notes && book.notes.toLowerCase().includes(q));

      // Priority filter
      const matchesPriority =
        !this.selectedPriority || book.priority === this.selectedPriority;

      // Status filter
      const matchesStatus =
        !this.selectedStatus || book.status === this.selectedStatus;

      // Price range filter
      const matchesPriceRange = this.matchesPriceRange(book.price);

      // Date range filter
      const matchesDateRange = this.matchesDateRange(book.dateAdded);

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
      (sum, b) => sum + b.price,
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
      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();

      if (this.sortOrder === 'desc') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  }

  // New methods for enhanced functionality
  getBooksByStatus(status: WishStatus): WishlistBook[] {
    return this.wishlist.filter((book) => book.status === status);
  }

  getBooksByPriority(priority: Priority): WishlistBook[] {
    return this.wishlist.filter((book) => book.priority === priority);
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
    // TODO: Implement import functionality
    console.log('Import data functionality would be implemented here');
    alert('Import feature coming soon!');
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

  getRecentBooks(days: number): WishlistBook[] {
    const now = new Date();
    return this.wishlist.filter((book) => {
      const bookDate = new Date(book.dateAdded);
      const diffInDays = Math.floor(
        (now.getTime() - bookDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffInDays <= days;
    });
  }

  getAveragePrice(): number {
    if (this.wishlist.length === 0) return 0;
    const total = this.wishlist.reduce((sum, book) => sum + book.price, 0);
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

  viewBook(book: WishlistBook) {
    // TODO: open a dialog with full details (review/rating/quotes)
    alert(`Viewing ${book.title}`);
  }

  editBook(book: WishlistBook) {
    // TODO: open edit dialog
    alert(`Editing ${book.title}`);
  }

  deleteBook(book: WishlistBook) {
    if (confirm(`Delete "${book.title}" from wishlist?`)) {
      this.wishlist = this.wishlist.filter((b) => b !== book);
      this.applyFilters();
    }
  }

  addWish() {
    // quick prompt-based add (replace with dialog/form as needed)
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
      this.escapeCsv(b.author),
      b.price.toString(),
      b.dateAdded.toISOString(),
      b.priority,
      b.status,
      this.escapeCsv(b.notes || ''),
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
