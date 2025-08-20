import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

interface Review {
  id: number;
  rating: number;
  takeaways: string;
  wouldRecommend: boolean | null;
  date: Date;
  book: string;
  author: string;
  anonymous?: boolean;
  tags?: string[];
  favoriteQuote?: string;
  readingTime?: number; // in days
  genre?: string;
  notes?: string;
  featured?: boolean;
  likes?: number;
  shares?: number;
}

@Component({
  selector: 'app-view-review',
  standalone: false,
  templateUrl: './view-review.html',
  styleUrl: './view-review.scss',
})
export class ViewReview implements OnInit {
  review: Review | null = null;
  isLoading = false;
  isLiked = false;
  isBookmarked = false;
  showShareMenu = false;

  relatedReviews: Review[] = [];

  trackByIndex(index: number, item: any): number {
    return index;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    const reviewId = this.route.snapshot.params['id'];
    if (reviewId) {
      this.loadReview(parseInt(reviewId));
      this.loadRelatedReviews();
    }
  }

  loadReview(id: number): void {
    this.isLoading = true;
    // Simulate API call - replace with actual service call
    setTimeout(() => {
      // Mock data - replace with actual service
      const mockReview: Review = {
        id: id,
        rating: 5,
        takeaways:
          'This book completely changed my perspective on productivity. The concept of "deep work" - the ability to focus without distraction on cognitively demanding tasks - is revolutionary. Newport argues that this skill is becoming increasingly rare and valuable in our economy. The book is divided into two parts: the first makes the case for deep work\'s value, and the second provides practical strategies for cultivating this skill. Key insights include the importance of scheduled solitude, the power of ritualistic approaches to deep work, and the need to be strategic about technology use.',
        wouldRecommend: true,
        date: new Date('2024-01-15'),
        book: 'Deep Work: Rules for Focused Success in a Distracted World',
        author: 'Cal Newport',
        anonymous: false,
        tags: ['Non-Fiction', 'Productivity', 'Business', 'Self-Help'],
        favoriteQuote:
          'Human beings, it seems, are at their best when immersed deeply in something challenging.',
        readingTime: 7,
        genre: 'Non-Fiction',
        notes:
          "This book is particularly relevant in our current digital age. Newport's arguments about the attention economy are compelling, and his practical advice on creating deep work habits is actionable. I especially appreciated the case studies of successful people who practice deep work.",
        featured: true,
        likes: 24,
        shares: 8,
      };

      this.review = mockReview;
      this.isLoading = false;
    }, 1000);
  }

  loadRelatedReviews(): void {
    // Mock related reviews - replace with actual service call
    this.relatedReviews = [
      {
        id: 2,
        rating: 4,
        takeaways: 'Great insights on habit formation...',
        wouldRecommend: true,
        date: new Date('2024-02-03'),
        book: 'Atomic Habits',
        author: 'James Clear',
        tags: ['Self-Help', 'Productivity'],
      },
      {
        id: 3,
        rating: 4,
        takeaways: 'Excellent book on focus and minimalism...',
        wouldRecommend: true,
        date: new Date('2024-01-28'),
        book: 'Digital Minimalism',
        author: 'Cal Newport',
        tags: ['Technology', 'Minimalism'],
      },
    ];
  }

  goBack(): void {
    this.location.back();
  }

  editReview(): void {
    if (this.review) {
      this.router.navigate(['/reviews/edit', this.review.id]);
    }
  }

  toggleLike(): void {
    this.isLiked = !this.isLiked;
    if (this.review) {
      this.review.likes = (this.review.likes || 0) + (this.isLiked ? 1 : -1);
    }
    // TODO: Call API to update like status
  }

  toggleBookmark(): void {
    this.isBookmarked = !this.isBookmarked;
    // TODO: Call API to update bookmark status
  }

  shareReview(): void {
    if (!this.review) return;

    const shareData = {
      title: `Review: ${this.review.book}`,
      text: `Check out this review of "${this.review.book}" by ${this.review.author}. Rating: ${this.review.rating}/5 stars.`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      // TODO: Show toast message
      console.log('Review link copied to clipboard');
    }

    this.showShareMenu = false;
    if (this.review) {
      this.review.shares = (this.review.shares || 0) + 1;
    }
  }

  shareToTwitter(): void {
    if (!this.review) return;

    const text = `Just read "${this.review.book}" by ${this.review.author}. ${
      this.review.rating
    }/5 stars! ${this.review.wouldRecommend ? 'Highly recommended!' : ''}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
    this.showShareMenu = false;
  }

  shareToLinkedIn(): void {
    if (!this.review) return;

    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(url, '_blank');
    this.showShareMenu = false;
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href);
    // TODO: Show toast message
    console.log('Link copied to clipboard');
    this.showShareMenu = false;
  }

  exportReview(): void {
    if (!this.review) return;

    const exportData = `
Book Review
===========

Book: ${this.review.book}
Author: ${this.review.author}
Rating: ${this.review.rating}/5 stars
Genre: ${this.review.genre || 'Not specified'}
Reading Time: ${this.review.readingTime || 'Not specified'} days
Would Recommend: ${this.review.wouldRecommend ? 'Yes' : 'No'}
Date: ${this.review.date.toLocaleDateString()}

Tags: ${this.review.tags?.join(', ') || 'None'}

Takeaways:
${this.review.takeaways}

${
  this.review.favoriteQuote
    ? `Favorite Quote:\n"${this.review.favoriteQuote}"`
    : ''
}

${this.review.notes ? `Additional Notes:\n${this.review.notes}` : ''}
    `.trim();

    // Create and download file
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `review-${this.review.book
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  printReview(): void {
    window.print();
  }

  viewRelatedReview(review: Review): void {
    this.router.navigate(['/reviews/view', review.id]);
  }

  duplicateReview(): void {
    if (!this.review) return;

    const duplicatedReview = {
      ...this.review,
      id: 0, // Will be assigned by backend
      book: `Copy of ${this.review.book}`,
      date: new Date(),
    };

    // Navigate to add-review with pre-filled data
    this.router.navigate(['/reviews/add-review'], {
      state: { reviewData: duplicatedReview },
    });
  }

  deleteReview(): void {
    if (!this.review) return;

    if (
      confirm(
        `Are you sure you want to delete the review for "${this.review.book}"? This action cannot be undone.`
      )
    ) {
      // TODO: Call API to delete review
      console.log('Deleting review:', this.review.id);
      this.router.navigate(['/reviews']);
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  getReadingTimeText(): string {
    if (!this.review?.readingTime) return '';
    const days = this.review.readingTime;
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return weeks === 1 ? '1 week' : `${weeks} weeks`;
    }
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month' : `${months} months`;
  }
}
