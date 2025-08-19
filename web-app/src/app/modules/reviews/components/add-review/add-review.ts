import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

interface Review {
  id: number;
  rating: number;
  takeaways: string;
  wouldRecommend: boolean | null;
  date: Date;
  book: string;
  author: string;
  tags?: string[];
  notes?: string;
}

@Component({
  selector: 'app-add-review',
  standalone: false,
  templateUrl: './add-review.html',
  styleUrl: './add-review.scss',
})
export class AddReview implements OnInit {
  newReview: Partial<Review> = {
    rating: 0,
    takeaways: '',
    wouldRecommend: null,
    book: '',
    author: '',
    tags: [],
    notes: '',
  };

  tagSuggestions = [
    'Self-Help',
    'Fiction',
    'Non-Fiction',
    'Business',
    'Technology',
    'History',
    'Biography',
    'Science',
    'Philosophy',
    'Psychology',
    'Health',
    'Finance',
    'Leadership',
    'Productivity',
    'Mindfulness',
  ];

  availableTags: string[] = [...this.tagSuggestions];
  filteredTags: string[] = [];

  isSubmitting = false;
  maxDate = new Date();
  tagsInput = '';

  constructor(private router: Router, private messageService: MessageService) {}

  ngOnInit(): void {
    this.filteredTags = [...this.availableTags];
  }

  submitReview() {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Incomplete Form',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      const review: Review = {
        id: Date.now(),
        rating: this.newReview.rating!,
        takeaways: this.newReview.takeaways!,
        wouldRecommend: this.newReview.wouldRecommend!,
        date: new Date(),
        book: this.newReview.book!,
        author: this.newReview.author!,
        tags: this.newReview.tags,
        notes: this.newReview.notes,
      };

      // TODO: Save to service/backend
      console.log('Saving review:', review);

      this.messageService.add({
        severity: 'success',
        summary: 'Review Added',
        detail: 'Your review has been saved successfully!',
      });

      this.isSubmitting = false;
      this.router.navigate(['/reviews']);
    }, 1500);
  }

  isFormValid(): boolean {
    return !!(
      this.newReview.rating &&
      this.newReview.book &&
      this.newReview.author &&
      this.newReview.takeaways &&
      this.newReview.wouldRecommend !== null
    );
  }

  clearForm() {
    this.newReview = {
      rating: 0,
      takeaways: '',
      wouldRecommend: null,
      book: '',
      author: '',
      tags: [],
      notes: '',
    };
  }

  goBack() {
    this.router.navigate(['/reviews']);
  }

  filterTags(event: any) {
    const query = event.query.toLowerCase();
    this.filteredTags = this.availableTags.filter((tag) =>
      tag.toLowerCase().includes(query)
    );
  }

  onTagSelect(tag: string) {
    if (!this.newReview.tags?.includes(tag)) {
      this.newReview.tags = [...(this.newReview.tags || []), tag];
    }
  }

  removeTag(tag: string) {
    this.newReview.tags = this.newReview.tags?.filter((t) => t !== tag) || [];
  }

  getRatingLabel(): string {
    const rating = this.newReview.rating || 0;
    if (rating >= 4) return 'Excellent';
    if (rating >= 3) return 'Good';
    if (rating >= 2) return 'Average';
    if (rating >= 1) return 'Poor';
    return 'Rate this book';
  }

  updateTagsFromInput() {
    if (this.tagsInput.trim()) {
      const newTags = this.tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      this.newReview.tags = [...(this.newReview.tags || []), ...newTags];
      this.tagsInput = '';
    }
  }
}
