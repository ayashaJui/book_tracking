import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface ReadingLog {
  id: number;
  title: string;
  author: string;
  startDate: Date | null;
  finishDate: Date | null;
  status: 'Want to Read' | 'Reading' | 'Finished' | 'On Hold';
  estimatedTimeHrs?: number;
  actualTimeHrs?: number;
  notes?: string;
}

@Component({
  selector: 'app-view-log',
  standalone: false,
  templateUrl: './view-log.html',
  styleUrl: './view-log.scss',
})
export class ViewLog implements OnInit {
  log: ReadingLog | null = null;
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Get the log ID from the route parameters
    this.route.paramMap.subscribe((params) => {
      const logId = Number(params.get('id'));
      if (!logId) {
        this.router.navigate(['/reading-logs']);
        return;
      }

      // In a real app, fetch the log from a service
      // For this example, use mock data
      this.loadLog(logId);
    });
  }

  loadLog(id: number): void {
    // Simulate API call with timeout
    setTimeout(() => {
      // This would be a service call in a real app
      const mockLogs: ReadingLog[] = [
        {
          id: 1,
          title: 'Atomic Habits',
          author: 'James Clear',
          startDate: new Date('2024-02-11'),
          finishDate: new Date('2024-02-25'),
          status: 'Finished',
          estimatedTimeHrs: 15,
          actualTimeHrs: 13,
          notes:
            'This book provided practical strategies for building good habits and breaking bad ones. I especially liked the concept of habit stacking and environment design. Will definitely revisit some chapters in the future.',
        },
        {
          id: 2,
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          startDate: new Date('2024-05-02'),
          finishDate: null,
          status: 'Reading',
          estimatedTimeHrs: 12,
          notes:
            'Reading this classic for the first time. Enjoying the adventure and world-building so far.',
        },
        {
          id: 3,
          title: 'Sapiens',
          author: 'Yuval Noah Harari',
          startDate: null,
          finishDate: null,
          status: 'Want to Read',
          notes: 'Recommended by a friend. Planning to start next month.',
        },
      ];

      this.log = mockLogs.find((log) => log.id === id) || null;
      this.isLoading = false;

      if (!this.log) {
        this.router.navigate(['/reading-logs']);
      }
    }, 500); // Simulate network delay
  }

  getStatusClass(status: string): string {
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

  formatDate(date: Date | null): string {
    return date ? date.toLocaleDateString() : '-';
  }

  calculateProgress(): number {
    if (!this.log || !this.log.actualTimeHrs || !this.log.estimatedTimeHrs) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((this.log.actualTimeHrs / this.log.estimatedTimeHrs) * 100)
    );
  }

  goBack(): void {
    this.router.navigate(['/reading-logs']);
  }

  editLog(): void {
    if (this.log) {
      this.router.navigate([`/reading-logs/edit-log/${this.log.id}`]);
    }
  }
}
