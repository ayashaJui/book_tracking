import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-log',
  standalone: false,
  templateUrl: './add-log.html',
  styleUrl: './add-log.scss',
})
export class AddLog {
  newLog: any = {
    title: '',
    author: '',
    status: null,
    startDate: null,
    finishDate: null,
    estimatedTimeHrs: null,
    actualTimeHrs: null,
    notes: '',
  };

  statusOptions = [
    { label: 'Want to Read', value: 'Want to Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Finished', value: 'Finished' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  constructor(private router: Router) {}

  saveLog() {
    // TODO: replace with API call to save log
    console.log('New Log:', this.newLog);

    // Navigate back to logs list
    this.router.navigate(['/reading-logs']);
  }

  cancel() {
    // Navigate back to logs list without saving
    this.router.navigate(['/reading-logs']);
  }
}
