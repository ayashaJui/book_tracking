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
    stats: {
      booksRead: 120,
      totalOwned: 200,
      quotes: 60,
      avgRating: 4.5,
    },
    goals: { annual: 150, streak: 12 },
    readerStats: { topGenre: 'Fiction' },
    social: {
      goodreads: 'https://www.goodreads.com/user/show/1234567-ayasha',
      instagram: 'https://www.instagram.com/ayasha',
      linkedin: 'https://www.linkedin.com/in/ayasha-hossain',
    },
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
    // Enhanced copy functionality with toast message
    const profileUrl = 'https://mybooks.app/ayasha';
    navigator.clipboard
      .writeText(profileUrl)
      .then(() => {
        // You can add a toast notification here
        console.log('Profile link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
      });
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        console.error(
          'Invalid file type. Please select a JPEG, PNG, or WebP image.'
        );
        return;
      }

      if (file.size > maxSize) {
        console.error('File too large. Please select an image under 5MB.');
        return;
      }

      // Create preview and upload logic here
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      console.log('Avatar selected:', file.name);
    }
  }
}
