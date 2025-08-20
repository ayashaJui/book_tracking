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
  selector: 'app-edit-log',
  standalone: false,
  templateUrl: './edit-log.html',
  styleUrl: './edit-log.scss',
})
export class EditLog implements OnInit {
  log: ReadingLog = {
    id: 0,
    title: '',
    author: '',
    status: 'Want to Read',
    startDate: null,
    finishDate: null,
    estimatedTimeHrs: undefined,
    actualTimeHrs: undefined,
    notes: '',
  };

  isLoading: boolean = true;

  statusOptions = [
    { label: 'Want to Read', value: 'Want to Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Finished', value: 'Finished' },
    { label: 'On Hold', value: 'On Hold' },
  ];

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

      const foundLog = mockLogs.find((log) => log.id === id);

      if (foundLog) {
        this.log = { ...foundLog }; // Create a copy to avoid modifying the original
        this.isLoading = false;
      } else {
        this.router.navigate(['/reading-logs']);
      }
    }, 500); // Simulate network delay
  }

  saveLog(): void {
    // In a real app, this would call an API to update the log
    console.log('Updated log:', this.log);

    // Navigate back to the log details
    this.router.navigate(['/reading-logs/view-log', this.log.id]);
  }

  cancel(): void {
    // Navigate back to the log details without saving
    this.router.navigate(['/reading-logs/view-log', this.log.id]);
  }
}
