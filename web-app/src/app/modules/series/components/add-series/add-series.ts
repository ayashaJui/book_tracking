import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SeriesService } from '../../services/series.service';
import { SeriesDTO, SeriesAuthorDTO, SeriesBookDTO } from '../../models/series.model';
import { Author } from '../../../authors/models/author.model';
import { CatalogSearchResult } from '../../../shared/models/catalog.model';
import { GenreService } from '../../../settings/services/genre.service';

@Component({
  selector: 'app-add-series',
  standalone: false,
  templateUrl: './add-series.html',
  styleUrl: './add-series.scss',
})
export class AddSeries implements OnInit {
  isSubmitting = false;
  previewMode = false;

  // Catalog search functionality
  catalogSearchPerformed = false;
  selectedCatalogSeries: CatalogSearchResult | null = null;
  isFromCatalog = false;
  showForm = false;

  // Genre options for dropdown - now handled by the unified component
  genreOptions: { label: string; value: number }[] = [];

  // Status options for books
  statusOptions = [
    { label: 'Want to Read', value: 'Want to Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Finished', value: 'Finished' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  // Status options for series
  seriesStatusOptions = [
    { label: 'Want to Read', value: 'Want to Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Completed', value: 'Completed' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  // Reading order preferences
  readingOrderOptions = [
    { label: 'Publication Order', value: 'Publication Order' },
    { label: 'Chronological Order', value: 'Chronological Order' },
    { label: 'Custom Order', value: 'Custom Order' },
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
    public seriesService: SeriesService,
    private genreService: GenreService
  ) { }

  ngOnInit() {
    // this.initializeForm();
    this.loadGenreOptions();
    this.setupFormValidation();
  }

  setupFormValidation() {
    // Watch status changes to manage completion date field
    this.seriesService.seriesForm.get('status')?.valueChanges.subscribe((status) => {
      const completionDateControl = this.seriesService.seriesForm.get('completionDate');
      if (status === 'Completed') {
        completionDateControl?.enable();
      } else {
        completionDateControl?.setValue('');
        completionDateControl?.disable();
      }
    });
  }

  loadGenreOptions() {
    this.genreService.getAllCatalogGenres().subscribe((response) => {
      if (response.data) {
       
        this.genreOptions = response.data.map((genre: any) => ({
          label: genre.name,
          value: genre.id,
        }));

        console.log('Fetched genres for dropdown:', this.genreOptions);
      }
    })
  }

  onGenreCreated(genreName: string) {
    // Refresh genre options when a new genre is created
    this.loadGenreOptions();
  }

  onCustomTagCreated(tagName: any) {
    // Handle custom tag creation if needed
    console.log('Custom tag created:', tagName);
  }

  get booksArray(): FormArray {
    return this.seriesService.seriesForm.get('books') as FormArray;
  }

  get authorsArray(): FormArray {
    return this.seriesService.seriesForm.get('authors') as FormArray;
  }

  addAuthor() {
    const authorForm = this.fb.group({
      authorId: [null, [Validators.required]], // Store the complete Author object
      // name: [''], // This will be set when author is selected
      authorRole: ['Author', Validators.required],
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
          name: selectedAuthor.name,

        });
      }
    }
  }

  // addBook() {
  //   const bookForm = this.fb.group({
  //     title: ['', [Validators.required, Validators.minLength(2)]],
  //     status: ['Want to Read', Validators.required],
  //     pagesRead: [null, [Validators.min(0)]],
  //     rating: [null, [Validators.min(1), Validators.max(5)]],
  //     finishedDate: [''],
  //     orderInSeries: [this.booksArray.length + 1, Validators.required],
  //   });

  //   this.booksArray.push(bookForm);
  // }

  // removeBook(index: number) {
  //   if (this.booksArray.length > 1) {
  //     this.booksArray.removeAt(index);
  //     // Update order numbers
  //     this.updateBookOrders();
  //   } else {
  //     this.messageService.add({
  //       severity: 'warn',
  //       summary: 'Warning',
  //       detail: 'A series must have at least one book',
  //     });
  //   }
  // }

  // updateBookOrders() {
  //   this.booksArray.controls.forEach((control, index) => {
  //     control.get('orderInSeries')?.setValue(index + 1);
  //   });
  // }

  // moveBookUp(index: number) {
  //   if (index > 0) {
  //     const book = this.booksArray.at(index);
  //     this.booksArray.removeAt(index);
  //     this.booksArray.insert(index - 1, book);
  //     this.updateBookOrders();
  //   }
  // }

  // moveBookDown(index: number) {
  //   if (index < this.booksArray.length - 1) {
  //     const book = this.booksArray.at(index);
  //     this.booksArray.removeAt(index);
  //     this.booksArray.insert(index + 1, book);
  //     this.updateBookOrders();
  //   }
  // }

  // togglePreview() {
  //   this.previewMode = !this.previewMode;
  // }

  onSubmit() {
    if (this.seriesService.seriesForm.valid) {
      this.isSubmitting = true;

      const formValue = this.seriesService.seriesForm.value;

      // Transform authors from form format to SeriesAuthor format
      const authors: SeriesAuthorDTO[] = formValue.authors.map((authorForm: any) => ({
        authorId: authorForm.author?.id,
        name: authorForm.name || authorForm.author?.name,
        role: authorForm.role
      }));

      const newSeries: SeriesDTO = {
        // Catalog series fields
        title: formValue.title,
        authors: authors,
        genres: formValue.genres,
        description: formValue.description,
        coverUrl: formValue.coverUrl || 'assets/images/product-not-found.png',
        totalBooks: formValue.totalBooks, // Use the form value instead of calculating
        readBooks: formValue.booksRead || 0,
        books: formValue.books,
        isComplete: formValue.isComplete || false,

        // User series related fields
        booksOwned: formValue.booksOwned || 0,
        status: formValue.status,
        startDate: formValue.startDate || null,
        completionDate: formValue.completionDate || null,
        isFavorite: formValue.isFavorite || false,
        readingOrderPreference: formValue.readingOrderPreference,
        notes: formValue.notes || '',
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
    Object.keys(this.seriesService.seriesForm.controls).forEach((key) => {
      const control = this.seriesService.seriesForm.get(key);
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

  // Helper method to get default status based on reading progress
  getDefaultSeriesStatus(): string {
    const booksRead = this.seriesService.seriesForm.get('booksRead')?.value || 0;
    const totalBooks = this.seriesService.seriesForm.get('totalBooks')?.value || 0;

    if (booksRead === 0) {
      return 'Want to Read';
    } else if (booksRead === totalBooks && totalBooks > 0) {
      return 'Completed';
    } else {
      return 'Reading';
    }
  }

  // Helper method to update series status when books change
  updateSeriesStatusFromBooks(): void {
    // Note: booksRead is now manual input, not auto-calculated
    const currentStatus = this.seriesService.seriesForm.get('status')?.value;
    // Only auto-update if the user hasn't manually set a specific status
    if (!currentStatus || currentStatus === 'Want to Read') {
      const suggestedStatus = this.getDefaultSeriesStatus();
      this.seriesService.seriesForm.get('status')?.setValue(suggestedStatus);
    }
  }

  // Helper method to check if books count matches expected total
  getBooksCountMessage(): string {
    const totalBooks = this.seriesService.seriesForm.get('totalBooks')?.value;
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
    const totalBooks = this.seriesService.seriesForm.get('totalBooks')?.value;
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
    const field = this.seriesService.seriesForm.get(fieldName);
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
    const field = this.seriesService.seriesForm.get(fieldName);
    if (field?.errors?.['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
    if (field?.errors?.['minlength'])
      return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
    if (field?.errors?.['min'])
      return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['min'].min}`;
    if (field?.errors?.['max'])
      return `${this.getFieldDisplayName(fieldName)} must be at most ${field.errors['max'].max}`;
    if (field?.errors?.['exceedsTotal'])
      return `Books read cannot exceed total books in the series`;
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'title': 'Title',
      'totalBooks': 'Total Books',
      'genres': 'Genres',
      'isComplete': 'Series Completion Status',
      'booksRead': 'Books Read',
      'status': 'Series Status',
      'booksOwned': 'Books Owned',
      'startDate': 'Start Date',
      'completionDate': 'Completion Date',
      'readingOrderPreference': 'Reading Order Preference',
      'notes': 'Notes'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Helper method to validate booksRead doesn't exceed totalBooks
  validateBooksRead(): void {
    const booksRead = this.seriesService.seriesForm.get('booksRead')?.value || 0;
    const totalBooks = this.seriesService.seriesForm.get('totalBooks')?.value || 0;

    if (totalBooks > 0 && booksRead > totalBooks) {
      this.seriesService.seriesForm.get('booksRead')?.setErrors({ exceedsTotal: true });
    }
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

  // Catalog search methods (following add-author pattern)
  onCatalogSeriesSelected(series: CatalogSearchResult) {
    if (series.type === 'series') {
      this.selectedCatalogSeries = series;
      this.isFromCatalog = true;
      this.showForm = true;

      console.log('Selected catalog series:', series);

      // Store current user preferences before updating catalog fields
      const userPreferences = {
        booksRead: this.seriesService.seriesForm.get('booksRead')?.value,
        status: this.seriesService.seriesForm.get('status')?.value,
        booksOwned: this.seriesService.seriesForm.get('booksOwned')?.value,
        startDate: this.seriesService.seriesForm.get('startDate')?.value,
        completionDate: this.seriesService.seriesForm.get('completionDate')?.value,
        isFavorite: this.seriesService.seriesForm.get('isFavorite')?.value,
        readingOrderPreference: this.seriesService.seriesForm.get('readingOrderPreference')?.value,
        notes: this.seriesService.seriesForm.get('notes')?.value,
      };

      this.seriesService.seriesForm.patchValue({
        title: series.name || series.title || '',
        description: series.description || '',
        // Note: isComplete will need to be fetched from full series details
        // For now, leave as default false - this can be updated when we integrate full catalog API
        // Preserve user preferences
        ...userPreferences
      });

      this.updateFieldsEnabledState();

      this.messageService.add({
        severity: 'success',
        summary: 'Series Selected',
        detail: `Selected "${series.name || series.title}" from catalog`
      });
    }
  }

  onCreateNewFromCatalog(searchTerm: string) {
    this.isFromCatalog = false;
    this.showForm = true;
    this.updateFieldsEnabledState();
    this.proceedWithNewSeries(searchTerm);
  }

  private proceedWithNewSeries(searchTerm: string) {
    this.seriesService.seriesForm.patchValue({
      name: searchTerm
    });

    this.messageService.add({
      severity: 'info',
      summary: 'Create New Series',
      detail: `Creating new series: "${searchTerm}"`
    });
  }

  private updateFieldsEnabledState(): void {
    // Only catalog-related fields should be disabled when using catalog data
    const catalogFields = ['name', 'description', 'isCompleted', 'totalBooks', 'genres', 'authors'];
    // User preference fields should always remain enabled
    const userFields = ['booksRead', 'status', 'booksOwned', 'startDate', 'completionDate',
      'isFavorite', 'readingOrderPreference', 'notes'];

    if (this.isFromCatalog) {
      catalogFields.forEach(field => {
        const control = this.seriesService.seriesForm.get(field);
        if (control) {
          control.disable();
        }
      });

      // Ensure user fields are always enabled
      userFields.forEach(field => {
        const control = this.seriesService.seriesForm.get(field);
        if (control) {
          control.enable();
        }
      });
    } else {
      // Enable all fields when creating manually
      [...catalogFields, ...userFields].forEach(field => {
        const control = this.seriesService.seriesForm.get(field);
        if (control) {
          control.enable();
        }
      });
    }
  }
}
