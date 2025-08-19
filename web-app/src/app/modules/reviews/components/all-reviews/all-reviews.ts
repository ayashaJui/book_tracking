import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Review {
  id: number;
  rating: number;
  takeaways: string;
  wouldRecommend: boolean | null;
  date: Date;
  book: string;
  author: string;
  anonymous?: boolean;
}

@Component({
  selector: 'app-all-reviews',
  standalone: false,
  templateUrl: './all-reviews.html',
  styleUrl: './all-reviews.scss',
})
export class AllReviews implements OnInit {
  Math = Math;
  reviews: Review[] = [];

  filteredReviews: Review[] = [];

  filterText = '';
  filterRating: number | null = null;
  filterRecommend: boolean | null = null;

  newReview: Partial<Review> = {
    rating: 0,
    takeaways: '',
    wouldRecommend: null,
    book: '',
    author: '',
  };

  hoverRating = 0;

  showReviewForm = false;

  ratingOptions = [
    { label: '1 Star', value: 1 },
    { label: '2 Stars', value: 2 },
    { label: '3 Stars', value: 3 },
    { label: '4 Stars', value: 4 },
    { label: '5 Stars', value: 5 },
  ];

  recommendOptions = [
    { label: 'Would Recommend', value: true },
    { label: 'Would Not Recommend', value: false },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Add some sample data for demonstration
    this.reviews = [
      {
        id: 1,
        rating: 5,
        takeaways:
          'This book completely changed my perspective on productivity. The concept of "deep work" - the ability to focus without distraction on cognitively demanding tasks - is revolutionary. Newport argues that this skill is becoming increasingly rare and valuable. Key insight: shallow work is inevitable, but deep work is optional - and that\'s what makes it so powerful.',
        wouldRecommend: true,
        date: new Date('2024-01-15'),
        book: 'Deep Work',
        author: 'Cal Newport',
      },
      {
        id: 2,
        rating: 4,
        takeaways:
          'Atomic Habits breaks down the science of habit formation into actionable steps. The 1% improvement philosophy is powerful - small changes compound over time. The habit loop (cue, craving, response, reward) provides a clear framework for building good habits and breaking bad ones. The book emphasizes systems over goals.',
        wouldRecommend: true,
        date: new Date('2024-02-03'),
        book: 'Atomic Habits',
        author: 'James Clear',
      },
      {
        id: 3,
        rating: 3,
        takeaways:
          'While the book has some interesting points about mindset and persistence, I found the examples repetitive and the writing style overly promotional. The core message about viewing challenges as opportunities for growth is valuable, but could have been conveyed more concisely.',
        wouldRecommend: false,
        date: new Date('2024-03-12'),
        book: 'Mindset Revolution',
        author: 'Sarah Johnson',
      },
    ];

    // Ensure filtered list reflects any preloaded reviews
    this.applyFilters();
  }

  get averageRating(): number {
    if (!this.reviews.length) return 0;
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / this.reviews.length;
  }

  get recommendRate(): number {
    if (!this.reviews.length) return 0;
    const count = this.reviews.filter((r) => r.wouldRecommend).length;
    return Math.round((count / this.reviews.length) * 100);
  }

  get recommendedCount(): number {
    return this.reviews.filter((r) => r.wouldRecommend).length;
  }

  submitReview() {
    if (
      !this.newReview.rating ||
      !this.newReview.takeaways ||
      !this.newReview.book ||
      !this.newReview.author ||
      this.newReview.wouldRecommend === null
    ) {
      return;
    }
    const review: Review = {
      id: Date.now(),
      rating: this.newReview.rating,
      takeaways: this.newReview.takeaways,
      wouldRecommend: this.newReview.wouldRecommend ?? false,
      date: new Date(),
      book: this.newReview.book,
      author: this.newReview.author,
    };
    this.reviews.unshift(review);
    this.clearNewReview();
    this.applyFilters();
    this.showReviewForm = false;
  }

  clearNewReview() {
    this.newReview = {
      rating: 0,
      takeaways: '',
      wouldRecommend: null,
      book: '',
      author: '',
    };
    this.hoverRating = 0;
  }

  applyFilters() {
    this.filteredReviews = this.reviews.filter((review) => {
      const matchesText =
        !this.filterText ||
        review.takeaways
          .toLowerCase()
          .includes(this.filterText.toLowerCase()) ||
        review.book.toLowerCase().includes(this.filterText.toLowerCase()) ||
        review.author.toLowerCase().includes(this.filterText.toLowerCase());

      const matchesRating =
        this.filterRating === null || review.rating === this.filterRating;

      const matchesRecommend =
        this.filterRecommend === null ||
        review.wouldRecommend === this.filterRecommend;

      return matchesText && matchesRating && matchesRecommend;
    });
  }

  clearFilters() {
    this.filterText = '';
    this.filterRating = null;
    this.filterRecommend = null;
    this.applyFilters();
  }

  trackByReviewId(_index: number, review: Review) {
    return review.id;
  }

  viewReviewDetails(review: Review) {
    // TODO: Implement review details view
    console.log('View details for review:', review);
    // You could open a dialog with full review details here
  }

  editReview(review: Review) {
    // Populate the form with the review data for editing
    this.newReview = {
      rating: review.rating,
      takeaways: review.takeaways,
      wouldRecommend: review.wouldRecommend,
      book: review.book,
      author: review.author,
    };
    this.showReviewForm = true;

    // TODO: Add logic to update existing review instead of creating new one
    console.log('Edit review:', review);
  }

  addReviewPage() {
    this.router.navigate(['/reviews/add-review']);
  }

  goToFullForm() {
    this.showReviewForm = false;
    this.router.navigate(['/reviews/add-review']);
  }

  isQuickFormValid(): boolean {
    return !!(
      this.newReview.rating &&
      this.newReview.book &&
      this.newReview.author &&
      this.newReview.takeaways &&
      this.newReview.wouldRecommend !== null
    );
  }
}
