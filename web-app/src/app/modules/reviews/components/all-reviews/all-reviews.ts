import { Component, OnInit } from '@angular/core';

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

  ngOnInit(): void {}

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
}
