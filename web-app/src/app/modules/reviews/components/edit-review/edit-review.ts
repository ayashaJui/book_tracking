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
}

@Component({
  selector: 'app-edit-review',
  standalone: false,
  templateUrl: './edit-review.html',
  styleUrl: './edit-review.scss',
})
export class EditReview implements OnInit {
  review: Review = {
    id: 0,
    rating: 0,
    takeaways: '',
    wouldRecommend: null,
    date: new Date(),
    book: '',
    author: '',
    anonymous: false,
    tags: [],
    favoriteQuote: '',
    readingTime: 0,
    genre: '',
    notes: '',
  };

  originalReview: Review | null = null;
  isLoading = false;
  isSaving = false;
  hasUnsavedChanges = false;
  hoverRating = 0;
  availableTags = [
    'Fiction',
    'Non-Fiction',
    'Biography',
    'Self-Help',
    'Business',
    'Science',
    'History',
    'Philosophy',
    'Psychology',
    'Technology',
    'Romance',
    'Thriller',
    'Mystery',
    'Fantasy',
    'Sci-Fi',
  ];

  genres = [
    { label: 'Fiction', value: 'Fiction' },
    { label: 'Non-Fiction', value: 'Non-Fiction' },
    { label: 'Biography', value: 'Biography' },
    { label: 'Self-Help', value: 'Self-Help' },
    { label: 'Business', value: 'Business' },
    { label: 'Science', value: 'Science' },
    { label: 'History', value: 'History' },
    { label: 'Philosophy', value: 'Philosophy' },
    { label: 'Psychology', value: 'Psychology' },
    { label: 'Technology', value: 'Technology' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Mystery', value: 'Mystery' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Science Fiction', value: 'Science Fiction' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Adventure', value: 'Adventure' },
    { label: 'Classic', value: 'Classic' },
    { label: 'Contemporary', value: 'Contemporary' },
    { label: 'Young Adult', value: 'Young Adult' },
  ];

  selectedTags: string[] = [];

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
          'This book completely changed my perspective on productivity. The concept of "deep work" - the ability to focus without distraction on cognitively demanding tasks - is revolutionary.',
        wouldRecommend: true,
        date: new Date('2024-01-15'),
        book: 'Deep Work',
        author: 'Cal Newport',
        anonymous: false,
        tags: ['Non-Fiction', 'Self-Help', 'Business'],
        favoriteQuote:
          'Human beings, it seems, are at their best when immersed deeply in something challenging.',
        readingTime: 7,
        genre: 'Non-Fiction',
        notes: 'Great insights on focus and productivity in the digital age.',
      };

      this.review = { ...mockReview };
      this.originalReview = { ...mockReview };
      this.selectedTags = [...(mockReview.tags || [])];
      this.isLoading = false;
    }, 1000);
  }

  onFormChange(): void {
    this.hasUnsavedChanges = this.hasChanges();
  }

  hasChanges(): boolean {
    if (!this.originalReview) return false;
    return (
      JSON.stringify(this.review) !== JSON.stringify(this.originalReview) ||
      JSON.stringify(this.selectedTags) !==
        JSON.stringify(this.originalReview.tags || [])
    );
  }

  setRating(rating: number): void {
    this.review.rating = rating;
    this.onFormChange();
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  clearHoverRating(): void {
    this.hoverRating = 0;
  }

  addTag(tag: string): void {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
      this.review.tags = [...this.selectedTags];
      this.onFormChange();
    }
  }

  removeTag(tag: string): void {
    this.selectedTags = this.selectedTags.filter((t) => t !== tag);
    this.review.tags = [...this.selectedTags];
    this.onFormChange();
  }

  saveReview(): void {
    if (!this.isFormValid()) return;

    this.isSaving = true;
    this.review.tags = [...this.selectedTags];

    // Simulate API call - replace with actual service call
    setTimeout(() => {
      console.log('Saving review:', this.review);
      this.isSaving = false;
      this.hasUnsavedChanges = false;
      this.originalReview = { ...this.review };
      this.router.navigate(['/reviews']);
    }, 1500);
  }

  isFormValid(): boolean {
    return !!(
      this.review.book &&
      this.review.author &&
      this.review.rating > 0 &&
      this.review.takeaways &&
      this.review.wouldRecommend !== null
    );
  }

  cancel(): void {
    if (this.hasUnsavedChanges) {
      if (
        confirm(
          'You have unsaved changes. Are you sure you want to cancel editing?'
        )
      ) {
        this.goBack();
      }
    } else {
      this.goBack();
    }
  }

  goBack(): void {
    this.location.back();
  }

  previewReview(): void {
    this.router.navigate(['/reviews/view', this.review.id]);
  }

  deleteReview(): void {
    if (
      confirm(
        `Are you sure you want to delete the review for "${this.review.book}"? This action cannot be undone.`
      )
    ) {
      this.isLoading = true;
      // Simulate API call - replace with actual service call
      setTimeout(() => {
        console.log('Deleting review:', this.review.id);
        this.isLoading = false;
        this.router.navigate(['/reviews']);
      }, 1000);
    }
  }

  duplicateReview(): void {
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

  exportReview(): void {
    // Create a simple text export
    const exportData = `
Book Review Export
==================

Book: ${this.review.book}
Author: ${this.review.author}
Rating: ${this.review.rating}/5 stars
Genre: ${this.review.genre || 'Not specified'}
Reading Time: ${this.review.readingTime || 'Not specified'} days
Would Recommend: ${this.review.wouldRecommend ? 'Yes' : 'No'}

Tags: ${this.selectedTags.join(', ')}

Takeaways:
${this.review.takeaways}

${
  this.review.favoriteQuote
    ? `Favorite Quote:\n"${this.review.favoriteQuote}"`
    : ''
}

${this.review.notes ? `Additional Notes:\n${this.review.notes}` : ''}

Date: ${this.review.date.toLocaleDateString()}
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
}
