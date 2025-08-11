import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

interface ReadingLog {
  id: number;
  title: string;
  author: string;
  startDate: Date | null;
  finishDate: Date | null;
  status: 'Want to Read' | 'Reading' | 'Finished' | 'On Hold';
  estimatedTimeHrs?: number;
  actualTimeHrs?: number;
}

@Component({
  selector: 'app-all-logs',
  standalone: false,
  templateUrl: './all-logs.html',
  styleUrl: './all-logs.scss',
})
export class AllLogs implements OnInit {
  @ViewChild('dt') table!: Table;

  authorOptions!: any[];

  bookReadingLogs: ReadingLog[] = [];
  filteredLogs: ReadingLog[] = [];

  globalFilter: string = '';
  selectedStatus: string | null = null;
  selectedAuthors: string[] = [];

  ngOnInit(): void {
    this.authorOptions = this.authors.map((a) => ({ label: a, value: a }));
    this.bookReadingLogs = [
      {
        id: 1,
        title: 'Atomic Habits',
        author: 'James Clear',
        startDate: new Date('2024-02-11'),
        finishDate: new Date('2024-02-25'),
        status: 'Finished',
        estimatedTimeHrs: 15,
        actualTimeHrs: 13,
      },
      {
        id: 2,
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        startDate: new Date('2024-05-02'),
        finishDate: null,
        status: 'Reading',
        estimatedTimeHrs: 12,
      },
      {
        id: 3,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        startDate: null,
        finishDate: null,
        status: 'Want to Read',
      },
    ];
    this.filteredLogs = [...this.bookReadingLogs];
  }

  get readingLogs() {
    return this.filteredLogs.filter((log) => log.status === 'Reading');
  }

  get authors(): string[] {
    // Extract unique authors from logs for filtering
    return Array.from(new Set(this.readingLogs.map((log) => log.author)));
  }

  statusOptions = [
    { label: 'Want to Read', value: 'Want to Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Finished', value: 'Finished' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  applyFilters() {
    this.filteredLogs = this.readingLogs.filter((log) => {
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
    // implement viewing details modal/dialog here
    alert(`View details for: ${log.title}`);
  }

  editLog(log: ReadingLog) {
    // implement edit modal/dialog here
    alert(`Edit: ${log.title}`);
  }

  deleteLog(log: ReadingLog) {
    // implement delete confirmation here
    if (confirm(`Delete reading log for "${log.title}"?`)) {
      this.bookReadingLogs = this.readingLogs.filter((l) => l.id !== log.id);
      this.applyFilters();
    }
  }

  exportCSV() {
    // exports current filtered table (only works when p-table bound to filteredBooks)
    if (this.table) {
      this.table.exportCSV();
    }
  }
}
