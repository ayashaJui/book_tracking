import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { ReadingLogService } from '../../services/reading-log.service';
import { ReadingLog, ReadingLogFilters, ReadingStats } from '../../models/reading-log.model';

@Component({
  selector: 'app-all-logs',
  standalone: false,
  templateUrl: './all-logs.html',
  styleUrl: './all-logs.scss',
})
export class AllLogs implements OnInit, OnDestroy {
  @ViewChild('dt') table!: Table;
  private destroy$ = new Subject<void>();

  authorOptions!: any[];
  bookReadingLogs: ReadingLog[] = [];
  filteredLogs: ReadingLog[] = [];
  stats: ReadingStats | null = null;
  loading = false;

  globalFilter: string = '';
  selectedStatus: string | null = null;
  selectedAuthors: string[] = [];

  constructor(
    private router: Router,
    private readingLogService: ReadingLogService
  ) { }

  ngOnInit(): void {
    this.loadReadingLogs();
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReadingLogs(): void {
    this.loading = true;
    this.readingLogService.getReadingLogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (logs) => {
          this.bookReadingLogs = logs;
          this.filteredLogs = [...logs];
          this.authorOptions = this.authors.map((a) => ({ label: a, value: a }));
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading reading logs:', error);
          this.loading = false;
          // Fallback to mock data for development
          this.loadMockData();
        }
      });
  }

  loadStats(): void {
    this.readingLogService.getReadingStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
        },
        error: (error) => {
          console.error('Error loading reading stats:', error);
        }
      });
  }

  private loadMockData(): void {
    // Fallback mock data for development
    this.bookReadingLogs = [
      {
        id: 1,
        userId: 1,
        catalogBookId: 1,
        title: 'Atomic Habits',
        author: 'James Clear',
        authorNames: ['James Clear'],
        startDate: new Date('2024-02-11'),
        finishDate: new Date('2024-02-25'),
        status: 'read',
        estimatedTimeHrs: 15,
        actualTimeHrs: 13,
        rating: 5,
        progressPercentage: 100,
        totalPages: 320,
        currentPage: 320
      },
      {
        id: 2,
        userId: 1,
        catalogBookId: 2,
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        authorNames: ['J.R.R. Tolkien'],
        startDate: new Date('2024-05-02'),
        finishDate: null,
        status: 'currently_reading',
        estimatedTimeHrs: 12,
        progressPercentage: 45,
        totalPages: 310,
        currentPage: 140
      },
      {
        id: 3,
        userId: 1,
        catalogBookId: 3,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        authorNames: ['Yuval Noah Harari'],
        startDate: null,
        finishDate: null,
        status: 'want_to_read',
        totalPages: 443
      },
    ];
    this.filteredLogs = [...this.bookReadingLogs];
    this.authorOptions = this.authors.map((a) => ({ label: a, value: a }));
  }

  get readingLogs() {
    return this.filteredLogs.filter((log) => log.status === 'currently_reading');
  }

  get authors(): string[] {
    // Extract unique authors from logs for filtering
    return Array.from(new Set(this.bookReadingLogs.map((log) => log.author)));
  }

  statusOptions = [
    { label: 'Want to Read', value: 'want_to_read' },
    { label: 'Currently Reading', value: 'currently_reading' },
    { label: 'Finished', value: 'read' },
    { label: 'On Hold', value: 'on_hold' },
    { label: 'Did Not Finish', value: 'did_not_finish' },
  ];

  applyFilters() {
    const filters: ReadingLogFilters = {
      searchQuery: this.globalFilter?.trim(),
      status: this.selectedStatus || undefined,
      authors: this.selectedAuthors.length > 0 ? this.selectedAuthors : undefined
    };

    if (this.globalFilter || this.selectedStatus || this.selectedAuthors.length > 0) {
      // Use service for filtering when backend is available
      this.readingLogService.getReadingLogs(filters)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (logs) => {
            this.filteredLogs = logs;
          },
          error: (error) => {
            console.error('Error filtering logs:', error);
            // Fallback to client-side filtering
            this.clientSideFilter();
          }
        });
    } else {
      // No filters, show all
      this.filteredLogs = [...this.bookReadingLogs];
    }
  }

  private clientSideFilter() {
    this.filteredLogs = this.bookReadingLogs.filter((log) => {
      const matchesGlobalFilter =
        !this.globalFilter ||
        log.title.toLowerCase().includes(this.globalFilter.toLowerCase()) ||
        log.author.toLowerCase().includes(this.globalFilter.toLowerCase());

      const matchesStatus =
        !this.selectedStatus || log.status === this.selectedStatus;

      const matchesAuthors =
        this.selectedAuthors.length === 0 ||
        this.selectedAuthors.includes(log.author);

      return matchesGlobalFilter && matchesStatus && matchesAuthors;
    });
  }

  onGlobalFilter() {
    this.applyFilters();
  }

  onStatusFilter() {
    this.applyFilters();
  }

  onAuthorFilter() {
    this.applyFilters();
  }

  clearFilters() {
    this.globalFilter = '';
    this.selectedStatus = null;
    this.selectedAuthors = [];
    this.applyFilters();
  }

  formatDate(date: Date | null): string {
    return date ? date.toLocaleDateString() : '-';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Finished':
        return 'bg-green-100 text-green-800';
      case 'Reading':
        return 'bg-yellow-100 text-yellow-800';
      case 'Want to Read':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  viewLog(log: ReadingLog) {
    this.router.navigate([`/reading-logs/view-log/${log.id}`]);
  }

  editLog(log: ReadingLog) {
    this.router.navigate([`/reading-logs/edit-log/${log.id}`]);
  }

  deleteLog(log: ReadingLog) {
    // implement delete confirmation here
    if (confirm(`Delete reading log for "${log.title}"?`)) {
      this.bookReadingLogs = this.bookReadingLogs.filter(
        (l) => l.id !== log.id
      );
      this.applyFilters();
    }
  }

  exportCSV() {
    // exports current filtered table (only works when p-table bound to filteredBooks)
    if (this.table) {
      this.table.exportCSV();
    }
  }

  addLog() {
    this.router.navigate(['/reading-logs/add-log']);
  }

  getLogsByStatus(status: string): ReadingLog[] {
    return this.bookReadingLogs.filter((log) => log.status === status);
  }
}
