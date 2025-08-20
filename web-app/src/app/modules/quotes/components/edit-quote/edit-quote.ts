import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Quote {
  id: number;
  quote: string;
  book: string;
  author: string;
  pageNumber?: number;
  tags: string[];
  dateAdded: Date;
  notes?: string;
  favorite?: boolean;
}

@Component({
  selector: 'app-edit-quote',
  standalone: false,
  templateUrl: './edit-quote.html',
  styleUrl: './edit-quote.scss',
})
export class EditQuote implements OnInit {
  quote: Quote | null = null;
  loading = true;
  saving = false;
  tagOptions: { label: string; value: string }[] = [];
  currentTime = new Date();

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadQuote(parseInt(id));
    } else {
      this.router.navigate(['/quotes']);
    }
    this.loadTagOptions();
  }

  loadQuote(id: number): void {
    this.loading = true;

    // Simulate API call - in real app, this would come from a service
    setTimeout(() => {
      // Sample data - replace with actual service call
      const mockQuotes: Quote[] = [
        {
          id: 1,
          quote:
            'The quality of your life is determined by the quality of your thoughts.',
          book: 'Atomic Habits',
          author: 'James Clear',
          pageNumber: 45,
          tags: ['inspirational', 'self-help', 'mindset'],
          dateAdded: new Date('2024-01-15'),
          favorite: true,
          notes:
            'This really resonated with me during my morning routine development.',
        },
        {
          id: 2,
          quote: 'Not all those who wander are lost.',
          book: 'The Fellowship of the Ring',
          author: 'J.R.R. Tolkien',
          tags: ['fiction', 'classic', 'adventure'],
          dateAdded: new Date('2024-02-10'),
          favorite: false,
          notes: "Beautiful metaphor for life's journey.",
        },
        {
          id: 3,
          quote: 'History is written by the victors.',
          book: 'Sapiens',
          author: 'Yuval Noah Harari',
          pageNumber: 103,
          tags: ['history', 'philosophical', 'thought-provoking'],
          dateAdded: new Date('2024-03-05'),
          favorite: true,
          notes: 'Makes me question everything I thought I knew about history.',
        },
      ];

      this.quote = mockQuotes.find((q) => q.id === id) || null;

      if (!this.quote) {
        this.router.navigate(['/quotes']);
        return;
      }

      this.loading = false;
    }, 500);
  }

  loadTagOptions(): void {
    // Sample tags - in real app, this would come from a service
    const allTags = [
      'inspirational',
      'self-help',
      'mindset',
      'fiction',
      'classic',
      'adventure',
      'history',
      'philosophical',
      'thought-provoking',
      'motivational',
      'business',
      'wisdom',
      'existential',
      'resilience',
    ];

    this.tagOptions = allTags.map((tag) => ({
      label: this.capitalize(tag),
      value: tag,
    }));
  }

  saveQuote(): void {
    if (!this.quote) return;

    // Validate required fields
    if (
      !this.quote.quote?.trim() ||
      !this.quote.book?.trim() ||
      !this.quote.author?.trim()
    ) {
      alert('Please fill in all required fields (Quote, Book, and Author).');
      return;
    }

    this.saving = true;

    // Simulate API call
    setTimeout(() => {
      // In real app, call service to save the quote
      console.log('Saving quote:', this.quote);
      this.saving = false;
      this.router.navigate(['/quotes']);
    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/quotes']);
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
