import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss'],
})
export class UserProfile implements OnInit {
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
  isEditMode = false;

  constructor(private router: Router) {}

  // Edit Profile functionality
  editProfile() {
    // Toggle edit mode for inline editing
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      console.log('Entering edit mode');
    } else {
      console.log('Exiting edit mode - changes saved');
      alert('Profile updated successfully!');
    }
  }

  // Update user name
  updateUserName() {
    const newName = prompt('Enter your name:', this.user.name);
    if (newName && newName.trim()) {
      this.user.name = newName.trim();
      console.log('Name updated:', this.user.name);
    }
  }

  // Update user location
  updateUserLocation() {
    const newLocation = prompt('Enter your location:', this.user.location);
    if (newLocation && newLocation.trim()) {
      this.user.location = newLocation.trim();
      console.log('Location updated:', this.user.location);
    }
  }

  // Update social links
  updateSocialLink(platform: string) {
    let currentUrl = '';
    let placeholder = '';

    switch (platform) {
      case 'goodreads':
        currentUrl = this.user.social.goodreads;
        placeholder = 'https://www.goodreads.com/user/show/your-profile';
        break;
      case 'instagram':
        currentUrl = this.user.social.instagram;
        placeholder = 'https://www.instagram.com/your-username';
        break;
      case 'linkedin':
        currentUrl = this.user.social.linkedin;
        placeholder = 'https://www.linkedin.com/in/your-profile';
        break;
    }

    const newUrl = prompt(
      `Enter your ${platform} URL:`,
      currentUrl || placeholder
    );
    if (newUrl !== null) {
      switch (platform) {
        case 'goodreads':
          this.user.social.goodreads = newUrl;
          break;
        case 'instagram':
          this.user.social.instagram = newUrl;
          break;
        case 'linkedin':
          this.user.social.linkedin = newUrl;
          break;
      }
      console.log(`${platform} URL updated:`, newUrl);
    }
  }

  // Featured Book - View Details
  viewFeaturedBookDetails() {
    // Navigate to book details page
    this.router.navigate(['/books/details'], {
      queryParams: {
        title: this.featured.title,
        author: this.featured.author,
      },
    });
  }

  // Featured Book - Add Note
  addNoteToFeaturedBook() {
    // Open note-taking interface or modal
    const note = prompt(`Add a note for "${this.featured.title}":`);
    if (note && note.trim()) {
      // Here you would typically save to a service/database
      console.log(`Note added for ${this.featured.title}: ${note}`);
      // You can show a success message here
      alert('Note added successfully!');
    }
  }

  // Enhanced copy functionality with better user feedback
  copyShareLink() {
    // Enhanced copy functionality with toast message
    const profileUrl = `https://mybooks.app/${this.user.name
      .toLowerCase()
      .replace(' ', '-')}`;
    navigator.clipboard
      .writeText(profileUrl)
      .then(() => {
        // You can add a toast notification here
        console.log('Profile link copied to clipboard!');
        alert('Profile link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
        // Fallback for older browsers
        this.fallbackCopyTextToClipboard(profileUrl);
      });
  }

  // Fallback copy method for older browsers
  private fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('Profile link copied to clipboard!');
      } else {
        console.error('Fallback: Oops, unable to copy');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  // Navigation helper with enhanced routing
  navigateTo(page: string) {
    switch (page) {
      case 'reading-log':
        this.router.navigate(['/reading-logs']);
        break;
      case 'tags':
        this.router.navigate(['/settings'], { fragment: 'tags' });
        break;
      case 'budget':
        this.router.navigate(['/spendings']);
        break;
      default:
        this.router.navigate([`/${page}`]);
    }
  }

  // Enhanced avatar change with better validation and preview
  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please select a JPEG, PNG, or WebP image.');
        return;
      }

      if (file.size > maxSize) {
        alert('File too large. Please select an image under 5MB.');
        return;
      }

      // Create preview and upload logic here
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatarUrl = e.target.result;
        console.log('Avatar updated successfully');
        alert('Avatar updated successfully!');
      };
      reader.readAsDataURL(file);

      console.log('Avatar selected:', file.name);
    }
  }

  // Calculate progress percentages dynamically
  ngOnInit() {
    this.calculateProgress();
  }

  private calculateProgress() {
    // Calculate annual reading progress
    this.annualProgressPct = Math.round(
      (this.user.stats.booksRead / this.user.goals.annual) * 100
    );

    // Calculate streak progress (assuming 30 days is 100%)
    this.streakProgressPct = Math.min(
      Math.round((this.user.goals.streak / 30) * 100),
      100
    );
  }

  // Update reading goals
  updateAnnualGoal() {
    const newGoal = prompt(
      `Current annual goal: ${this.user.goals.annual} books. Enter new goal:`,
      this.user.goals.annual.toString()
    );

    if (newGoal && !isNaN(Number(newGoal)) && Number(newGoal) > 0) {
      this.user.goals.annual = Number(newGoal);
      this.calculateProgress();
      alert('Annual goal updated successfully!');
    }
  }

  // Add quick actions for social links
  openSocialLink(platform: string) {
    let url = '';
    switch (platform) {
      case 'goodreads':
        url = this.user.social.goodreads;
        break;
      case 'instagram':
        url = this.user.social.instagram;
        break;
      case 'linkedin':
        url = this.user.social.linkedin;
        break;
    }

    if (url) {
      window.open(url, '_blank');
    }
  }

  // Stats card interactions
  onStatsCardClick(statType: string) {
    switch (statType) {
      case 'booksRead':
        this.router.navigate(['/books'], { queryParams: { filter: 'read' } });
        break;
      case 'totalOwned':
        this.router.navigate(['/books'], { queryParams: { filter: 'owned' } });
        break;
      case 'quotes':
        this.router.navigate(['/quotes']);
        break;
      case 'avgRating':
        this.router.navigate(['/reviews']);
        break;
    }
  }

  // Featured book interactions
  onFeaturedBookClick() {
    this.viewFeaturedBookDetails();
  }
}
