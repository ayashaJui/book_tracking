import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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

interface BookSuggestion {
  title: string;
  author: string;
}

@Component({
  selector: 'app-add-quote',
  standalone: false,
  templateUrl: './add-quote.html',
  styleUrl: './add-quote.scss',
})
export class AddQuote implements OnInit {
  quoteForm!: FormGroup;
  availableTags: string[] = [
    'inspirational',
    'motivational',
    'wisdom',
    'life',
    'love',
    'success',
    'happiness',
    'philosophical',
    'spiritual',
    'funny',
    'thought-provoking',
    'self-help',
    'business',
    'leadership',
    'creativity',
    'science',
    'history',
    'fiction',
    'classic',
    'modern',
    'poetry',
  ];

  bookSuggestions: BookSuggestion[] = [
    { title: 'Atomic Habits', author: 'James Clear' },
    {
      title: 'The 7 Habits of Highly Effective People',
      author: 'Stephen Covey',
    },
    { title: 'Think and Grow Rich', author: 'Napoleon Hill' },
    { title: 'The Power of Now', author: 'Eckhart Tolle' },
    { title: 'Sapiens', author: 'Yuval Noah Harari' },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
    { title: '1984', author: 'George Orwell' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { title: 'Pride and Prejudice', author: 'Jane Austen' },
  ];

  filteredBookSuggestions: BookSuggestion[] = [];

  selectedTags: string[] = [];
  customTag: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.filteredBookSuggestions = [...this.bookSuggestions];
  }

  initializeForm(): void {
    this.quoteForm = this.fb.group({
      quote: ['', [Validators.required, Validators.minLength(10)]],
      book: ['', Validators.required],
      author: ['', Validators.required],
      pageNumber: [null, [Validators.min(1)]],
      notes: [''],
      favorite: [false],
    });
  }

  onBookInput(event: any): void {
    const value = event.target.value.toLowerCase();
    if (value) {
      this.filteredBookSuggestions = this.bookSuggestions.filter(
        (book) =>
          book.title.toLowerCase().includes(value) ||
          book.author.toLowerCase().includes(value)
      );
    } else {
      this.filteredBookSuggestions = [...this.bookSuggestions];
    }
  }

  selectBookSuggestion(book: BookSuggestion): void {
    this.quoteForm.patchValue({
      book: book.title,
      author: book.author,
    });
    this.filteredBookSuggestions = [];
  }

  toggleTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }
  }

  addCustomTag(): void {
    const tag = this.customTag.trim().toLowerCase();
    if (
      tag &&
      !this.selectedTags.includes(tag) &&
      !this.availableTags.includes(tag)
    ) {
      this.selectedTags.push(tag);
      this.availableTags.push(tag);
      this.customTag = '';
    }
  }

  removeTag(tag: string): void {
    this.selectedTags = this.selectedTags.filter((t) => t !== tag);
  }

  getTagSeverity(
    tag: string
  ): 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const tagMap: Record<string, any> = {
      inspirational: 'success',
      motivational: 'success',
      wisdom: 'info',
      philosophical: 'contrast',
      spiritual: 'contrast',
      funny: 'warn',
      'self-help': 'info',
      business: 'secondary',
      leadership: 'secondary',
      creativity: 'warn',
      science: 'info',
      history: 'danger',
      fiction: 'warn',
      classic: 'secondary',
      modern: 'info',
      poetry: 'contrast',
    };
    return tagMap[tag] || 'info';
  }

  onSubmit(): void {
    if (this.quoteForm.valid) {
      const formValue = this.quoteForm.value;
      const newQuote: Quote = {
        id: Date.now(), // Simple ID generation
        quote: formValue.quote.trim(),
        book: formValue.book.trim(),
        author: formValue.author.trim(),
        pageNumber: formValue.pageNumber || undefined,
        tags: [...this.selectedTags],
        dateAdded: new Date(),
        notes: formValue.notes?.trim() || '',
        favorite: formValue.favorite || false,
      };

      // In a real app, you'd save this to a service or API
      console.log('New quote created:', newQuote);

      // Show success message
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Quote added successfully!',
      });

      // Navigate back to quotes list after a brief delay
      setTimeout(() => {
        this.router.navigate(['/quotes']);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/quotes']);
  }

  resetForm(): void {
    this.quoteForm.reset();
    this.selectedTags = [];
    this.customTag = '';
    this.filteredBookSuggestions = [...this.bookSuggestions];
  }

  private markFormGroupTouched(): void {
    Object.keys(this.quoteForm.controls).forEach((key) => {
      const control = this.quoteForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.quoteForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.quoteForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      if (field.errors['minlength']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${
          field.errors['minlength'].requiredLength
        } characters`;
      }
      if (field.errors['min']) {
        return `Page number must be greater than 0`;
      }
    }
    return '';
  }
}
