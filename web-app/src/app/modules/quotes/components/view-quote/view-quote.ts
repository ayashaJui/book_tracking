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
  selector: 'app-view-quote',
  standalone: false,
  templateUrl: './view-quote.html',
  styleUrl: './view-quote.scss',
})
export class ViewQuote implements OnInit {
  quote: Quote | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadQuote(parseInt(id));
    } else {
      this.router.navigate(['/quotes']);
    }
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

  editQuote(): void {
    if (this.quote) {
      this.router.navigate(['/quotes/edit', this.quote.id]);
    }
  }

  deleteQuote(): void {
    if (!this.quote) return;

    if (
      confirm(
        `Are you sure you want to delete this quote?\n\n"${this.quote.quote}"`
      )
    ) {
      // Simulate delete API call
      console.log('Deleting quote:', this.quote.id);
      this.router.navigate(['/quotes']);
    }
  }

  toggleFavorite(): void {
    if (this.quote) {
      this.quote.favorite = !this.quote.favorite;
      // In real app, call service to update the quote
      console.log('Toggling favorite for quote:', this.quote.id);
    }
  }

  shareQuote(): void {
    if (!this.quote) return;

    const text = `"${this.quote.quote}" — ${this.quote.author}, ${this.quote.book}`;
    const url = encodeURIComponent(window.location.href);

    if (navigator.share) {
      navigator.share({
        title: 'Favorite Quote',
        text,
        url,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert('Quote copied to clipboard!');
        })
        .catch(() => {
          // Fallback: open twitter share
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
            '_blank'
          );
        });
    }
  }

  backToQuotes(): void {
    this.router.navigate(['/quotes']);
  }

  getTagSeverity(
    tag: string
  ): 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (tag.toLowerCase()) {
      case 'inspirational':
        return 'success';
      case 'self-help':
        return 'info';
      case 'fiction':
        return 'warn';
      case 'classic':
        return 'secondary';
      case 'history':
        return 'danger';
      case 'philosophical':
        return 'contrast';
      default:
        return 'info';
    }
  }
}
