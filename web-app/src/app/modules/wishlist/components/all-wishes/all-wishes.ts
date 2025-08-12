import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

interface WishlistBook {
  title: string;
  author: string;
  price: number;
  dateAdded: Date;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Purchased' | 'Purchased' | 'On Hold' | 'Planned';
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

  ngOnInit(): void {
    this.wishlist = [
      {
        title: 'Deep Work',
        author: 'Cal Newport',
        price: 20,
        dateAdded: new Date('2025-08-01'),
        priority: 'High',
        status: 'Planned',
        notes: 'Productivity classic',
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        price: 30,
        dateAdded: new Date('2025-08-05'),
        priority: 'Medium',
        status: 'Purchased',
      },
    ];

    this.applyFilters();
  }

  applyFilters() {
    const q = this.globalFilter?.trim().toLowerCase();

    this.filteredWishlist = this.wishlist.filter((book) => {
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q);

      const matchesPriority =
        !this.selectedPriority || book.priority === this.selectedPriority;
      const matchesStatus =
        !this.selectedStatus || book.status === this.selectedStatus;

      return matchesSearch && matchesPriority && matchesStatus;
    });

    this.totalPrice = this.filteredWishlist.reduce(
      (sum, b) => sum + b.price,
      0
    );
    this.budgetProgress = Math.min(
      (this.totalPrice / this.monthlyBudget) * 100,
      100
    );
  }

  clearFilters() {
    this.globalFilter = '';
    this.selectedPriority = null;
    this.selectedStatus = null;
    this.applyFilters();
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
    const title = prompt('Book title');
    if (!title) return;

    const author = prompt('Author') || 'Unknown';
    const price = parseFloat(prompt('Price (USD)') || '0') || 0;

    this.wishlist.unshift({
      title,
      author,
      price,
      dateAdded: new Date(),
      priority: 'Medium',
      status: 'Planned',
    });

    this.applyFilters();
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
