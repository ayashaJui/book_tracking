import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

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
  @ViewChild('reviewMenu') reviewMenu!: Menu;

  Math = Math;
  reviews: Review[] = [];
  selectedReview: Review | null = null;

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
  viewMode: 'grid' | 'list' = 'grid';

  // Menu items for review actions
  reviewMenuItems: MenuItem[] = [
    {
      label: 'View Details',
      icon: 'pi pi-eye',
      command: () => this.viewReviewDetails(this.selectedReview!),
    },
    {
      label: 'Edit Review',
      icon: 'pi pi-pencil',
      command: () => this.editReview(this.selectedReview!),
    },
    {
      separator: true,
    },
    {
      label: 'Duplicate Review',
      icon: 'pi pi-copy',
      command: () => this.duplicateReview(this.selectedReview!),
    },
    {
      label: 'Share Review',
      icon: 'pi pi-share-alt',
      command: () => this.shareReview(this.selectedReview!),
    },
    {
      label: 'Export as PDF',
      icon: 'pi pi-file-pdf',
      command: () => this.exportReviewAsPDF(this.selectedReview!),
    },
    {
      separator: true,
    },
    {
      label: 'Mark as Featured',
      icon: 'pi pi-star',
      command: () => this.toggleFeatured(this.selectedReview!),
    },
    {
      label: 'Archive Review',
      icon: 'pi pi-archive',
      command: () => this.archiveReview(this.selectedReview!),
    },
    {
      separator: true,
    },
    {
      label: 'Delete Review',
      icon: 'pi pi-trash',
      command: () => this.deleteReview(this.selectedReview!),
      styleClass: 'text-red-600 dark:text-red-400',
    },
  ];

  // Sorting properties
  sortBy = 'date-desc';
  sortOptions = [
    { label: 'Date (newest first)', value: 'date-desc' },
    { label: 'Date (oldest first)', value: 'date-asc' },
    { label: 'Rating (highest first)', value: 'rating-desc' },
    { label: 'Rating (lowest first)', value: 'rating-asc' },
    { label: 'Book title (A-Z)', value: 'book-asc' },
    { label: 'Book title (Z-A)', value: 'book-desc' },
  ];

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

    // Apply sorting after filtering
    this.applySorting();
  }

  applySorting() {
    this.filteredReviews.sort((a, b) => {
      switch (this.sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'book-asc':
          return a.book.localeCompare(b.book);
        case 'book-desc':
          return b.book.localeCompare(a.book);
        default:
          return 0;
      }
    });
  }

  getMonthlyReviews(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return this.reviews.filter((review) => {
      const reviewDate = new Date(review.date);
      return (
        reviewDate.getMonth() === currentMonth &&
        reviewDate.getFullYear() === currentYear
      );
    }).length;
  }

  getMonthlyTrend(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthCount = this.reviews.filter((review) => {
      const reviewDate = new Date(review.date);
      return (
        reviewDate.getMonth() === currentMonth &&
        reviewDate.getFullYear() === currentYear
      );
    }).length;

    const lastMonthCount = this.reviews.filter((review) => {
      const reviewDate = new Date(review.date);
      return (
        reviewDate.getMonth() === lastMonth &&
        reviewDate.getFullYear() === lastMonthYear
      );
    }).length;

    if (lastMonthCount === 0) return currentMonthCount > 0 ? 100 : 0;
    return Math.round(
      ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100
    );
  }

  clearFilters() {
    this.filterText = '';
    this.filterRating = null;
    this.filterRecommend = null;
    this.sortBy = 'date-desc';
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

  showReviewOptions(event: Event, review: Review) {
    // TODO: Implement options menu (delete, duplicate, share, etc.)
    console.log('Show options for review:', review, event);
    // You could show a context menu or popup with additional actions
  }

  toggleReviewMenu(event: Event, review: Review) {
    this.selectedReview = review;
    this.reviewMenu.toggle(event);
  }

  duplicateReview(review: Review) {
    const duplicatedReview: Review = {
      ...review,
      id: Date.now(),
      date: new Date(),
      book: `Copy of ${review.book}`,
    };
    this.reviews.unshift(duplicatedReview);
    this.applyFilters();
    console.log('Review duplicated:', duplicatedReview);
  }

  shareReview(review: Review) {
    const shareData = {
      title: `Review: ${review.book}`,
      text: `Check out my review of "${review.book}" by ${
        review.author
      }. Rating: ${review.rating}/5 stars. ${
        review.wouldRecommend ? 'Highly recommended!' : 'Not recommended.'
      }`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      console.log('Review details copied to clipboard');
      // You could show a toast message here
    }
  }

  exportReviewAsPDF(review: Review) {
    // TODO: Implement PDF export functionality
    console.log('Exporting review as PDF:', review);
    // You could use libraries like jsPDF or call a backend service
  }

  toggleFeatured(review: Review) {
    // TODO: Implement featured toggle functionality
    console.log('Toggle featured status for review:', review);
    // You could add a 'featured' property to the Review interface
  }

  archiveReview(review: Review) {
    // TODO: Implement archive functionality
    console.log('Archiving review:', review);
    // You could add an 'archived' property and filter them out
  }

  deleteReview(review: Review) {
    if (
      confirm(
        `Are you sure you want to delete the review for "${review.book}"?`
      )
    ) {
      this.reviews = this.reviews.filter((r) => r.id !== review.id);
      this.applyFilters();
      console.log('Review deleted:', review);
    }
  }
}
