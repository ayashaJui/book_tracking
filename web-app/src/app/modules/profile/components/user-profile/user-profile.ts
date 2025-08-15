import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss'],
})
export class UserProfile {
  user = {
    name: 'Ayasha Hossain',
    location: 'Dhaka, Bangladesh',
    joined: 'Jan 2023',
    avatarUrl: '',
    stats: { booksRead: 120, quotes: 60, avgRating: 4.5 },
    goals: { annual: 150, streak: 12 },
    readerStats: { topGenre: 'Fiction' },
  };

  featured = {
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'assets/atomic-habits.jpg',
    quote:
      'You do not rise to the level of your goals. You fall to the level of your systems.',
  };

  annualProgressPct = 80;
  streakProgressPct = 60;

  constructor(private router: Router) {}

  copyShareLink() {
    navigator.clipboard.writeText('https://mybooks.app/ayasha');
    alert('Link copied!');
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // implement avatar upload logic
      console.log('Avatar selected:', file.name);
    }
  }
}
