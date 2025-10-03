import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SeriesService } from '../../services/series.service';
import { Series, SeriesBook, SeriesAuthor } from '../../models/series.model';
import { GenreService } from '../../../shared/services/genre.service';
import { Author } from '../../../authors/models/author.model';

@Component({
  selector: 'app-add-series',
  standalone: false,
  templateUrl: './add-series.html',
  styleUrl: './add-series.scss',
})
export class AddSeries implements OnInit {
  seriesForm!: FormGroup;
  isSubmitting = false;
  previewMode = false;

  // Genre options for dropdown - now handled by the unified component
  genreOptions: { label: string; value: string }[] = [];

  // Status options for books
  statusOptions = [
    { label: 'Want to Read', value: 'Want to Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Finished', value: 'Finished' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  // Role options for authors
  roleOptions = [
    { label: 'Author', value: 'Author' },
    { label: 'Co-Author', value: 'Co-Author' },
    { label: 'Editor', value: 'Editor' },
    { label: 'Illustrator', value: 'Illustrator' },
    { label: 'Translator', value: 'Translator' },
    { label: 'Contributor', value: 'Contributor' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private seriesService: SeriesService,
    private genreService: GenreService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.loadGenreOptions();
  }

  loadGenreOptions() {
    this.genreOptions = this.genreService.getGenreOptions();
  }

  onGenreCreated(genreName: string) {
    // Refresh genre options when a new genre is created
    this.loadGenreOptions();
  }

  onCustomTagCreated(tagName: any) {
    // Handle custom tag creation if needed
    console.log('Custom tag created:', tagName);
  }

  initializeForm() {
    this.seriesForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      authors: this.fb.array([]), // Changed from single author to authors array
      totalBooks: [
        null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      genres: [[], [Validators.required, Validators.minLength(1)]],
      customTags: [[]],
      description: [''],
      coverUrl: [''],
      books: this.fb.array([]),
    });

    // Add initial author
    this.addAuthor();
    // Add initial book
    this.addBook();
  }

  get booksArray(): FormArray {
    return this.seriesForm.get('books') as FormArray;
  }

  get authorsArray(): FormArray {
    return this.seriesForm.get('authors') as FormArray;
  }

  addAuthor() {
    const authorForm = this.fb.group({
      author: [null, [Validators.required]], // Store the complete Author object
      name: [''], // This will be set when author is selected
      role: ['Author', Validators.required],
    });

    this.authorsArray.push(authorForm);
  }

  removeAuthor(index: number) {
    if (this.authorsArray.length > 1) {
      this.authorsArray.removeAt(index);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'A series must have at least one author',
      });
    }
  }

  onAuthorSelected(author: Author | Author[], index: number) {
    const authorControl = this.authorsArray.at(index);
    if (author && authorControl) {
      // Since we're using single mode, author should be a single Author object
      const selectedAuthor = Array.isArray(author) ? author[0] : author;
      if (selectedAuthor) {
        authorControl.patchValue({
          author: selectedAuthor,
          name: selectedAuthor.name
        });
      }
    }
  }

  addBook() {
    const bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      status: ['Want to Read', Validators.required],
      pagesRead: [null, [Validators.min(0)]],
      rating: [null, [Validators.min(1), Validators.max(5)]],
      finishedDate: [''],
      orderInSeries: [this.booksArray.length + 1, Validators.required],
    });

    this.booksArray.push(bookForm);
  }

  removeBook(index: number) {
    if (this.booksArray.length > 1) {
      this.booksArray.removeAt(index);
      // Update order numbers
      this.updateBookOrders();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'A series must have at least one book',
      });
    }
  }

  updateBookOrders() {
    this.booksArray.controls.forEach((control, index) => {
      control.get('orderInSeries')?.setValue(index + 1);
    });
  }

  moveBookUp(index: number) {
    if (index > 0) {
      const book = this.booksArray.at(index);
      this.booksArray.removeAt(index);
      this.booksArray.insert(index - 1, book);
      this.updateBookOrders();
    }
  }

  moveBookDown(index: number) {
    if (index < this.booksArray.length - 1) {
      const book = this.booksArray.at(index);
      this.booksArray.removeAt(index);
      this.booksArray.insert(index + 1, book);
      this.updateBookOrders();
    }
  }

  togglePreview() {
    this.previewMode = !this.previewMode;
  }

  onSubmit() {
    if (this.seriesForm.valid) {
      this.isSubmitting = true;

      const formValue = this.seriesForm.value;

      // Transform authors from form format to SeriesAuthor format
      const authors: SeriesAuthor[] = formValue.authors.map((authorForm: any) => ({
        authorId: authorForm.author?.id,
        name: authorForm.name || authorForm.author?.name,
        role: authorForm.role
      }));

      const newSeries: Series = {
        title: formValue.title,
        authors: authors,
        genres: formValue.genres,
        description: formValue.description,
        coverUrl: formValue.coverUrl || 'assets/images/product-not-found.png',
        totalBooks: formValue.totalBooks, // Use the form value instead of calculating
        readBooks: formValue.books.filter(
          (book: SeriesBook) => book.status === 'Finished'
        ).length,
        books: formValue.books,
      };

      // Simulate API call
      setTimeout(() => {
        this.seriesService.addSeries(newSeries);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Series "${newSeries.title}" has been added successfully!`,
        });
        this.router.navigate(['/series']);
        this.isSubmitting = false;
      }, 1000);
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields correctly',
      });
    }
  }

  markFormGroupTouched() {
    Object.keys(this.seriesForm.controls).forEach((key) => {
      const control = this.seriesForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach((arrayControl) => {
          Object.keys(arrayControl.value).forEach((arrayKey) => {
            arrayControl.get(arrayKey)?.markAsTouched();
          });
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/series']);
  }

  createSeries() {
    console.log('Create series clicked');
    alert('Series creation functionality will be implemented here');
    // For now, just navigate back
    this.router.navigate(['/series']);
  }

  getCompletedBooksCount(): number {
    return this.booksArray.controls.filter(
      (book) => book.get('status')?.value === 'Finished'
    ).length;
  }

  // Helper method to check if books count matches expected total
  getBooksCountMessage(): string {
    const totalBooks = this.seriesForm.get('totalBooks')?.value;
    const addedBooks = this.booksArray.length;

    if (!totalBooks) return '';

    if (addedBooks < totalBooks) {
      return `You have added ${addedBooks} out of ${totalBooks} expected books.`;
    } else if (addedBooks > totalBooks) {
      return `You have added ${addedBooks} books, but expected total is ${totalBooks}. Consider updating the total.`;
    } else {
      return `Perfect! You have added all ${totalBooks} expected books.`;
    }
  }

  getCountMessageSeverity(): 'info' | 'warn' | 'success' {
    const totalBooks = this.seriesForm.get('totalBooks')?.value;
    const addedBooks = this.booksArray.length;

    if (!totalBooks) return 'info';

    if (addedBooks < totalBooks) {
      return 'info';
    } else if (addedBooks > totalBooks) {
      return 'warn';
    } else {
      return 'success';
    }
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.seriesForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  isBookFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.booksArray.at(index).get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  isAuthorFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.authorsArray.at(index).get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.seriesForm.get(fieldName);
    if (field?.errors?.['required']) return `${fieldName} is required`;
    if (field?.errors?.['minlength'])
      return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    if (field?.errors?.['min'])
      return `${fieldName} must be at least ${field.errors['min'].min}`;
    if (field?.errors?.['max'])
      return `${fieldName} must be at most ${field.errors['max'].max}`;
    return '';
  }

  getBookFieldError(index: number, fieldName: string): string {
    const field = this.booksArray.at(index).get(fieldName);
    if (field?.errors?.['required']) return `${fieldName} is required`;
    if (field?.errors?.['min'])
      return `${fieldName} must be at least ${field.errors['min'].min}`;
    if (field?.errors?.['max'])
      return `${fieldName} must be at most ${field.errors['max'].max}`;
    return '';
  }

  getAuthorFieldError(index: number, fieldName: string): string {
    const field = this.authorsArray.at(index).get(fieldName);
    if (field?.errors?.['required']) return `${fieldName} is required`;
    if (field?.errors?.['minlength'])
      return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    return '';
  }
}
