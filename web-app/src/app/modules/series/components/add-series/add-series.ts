import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SeriesService } from '../../services/series.service';
import { CatalogSeriesCreateRequestDTO, UserSeriesCreateRequestDTO } from '../../models/series.model';
import { CatalogAuthorDTO } from '../../../authors/models/author.model';
import { CatalogSearchResult } from '../../../shared/models/catalog.model';
import { UiService } from '../../../shared/services/ui.service.service';

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

  // Status options for series
  seriesStatusOptions = [
    { label: 'Want to Read', value: 'WANT_TO_READ' },
    { label: 'Reading', value: 'READING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Paused', value: 'PAUSED' },
    {label: 'Dropped', value: 'DROPPED' },
  ];

  // Reading order preferences
  readingOrderOptions = [
    { label: 'Publication Order', value: 'Publication Order' },
    { label: 'Chronological Order', value: 'Chronological Order' },
    { label: 'Custom Order', value: 'Custom Order' },
  ];

  // Role options for authors
  roleOptions = [
    { label: 'Author', value: 'AUTHOR' },
    { label: 'Co-Author', value: 'CO_AUTHOR' },
    { label: 'Editor', value: 'EDITOR' },
    { label: 'Illustrator', value: 'ILLUSTRATOR' },
    { label: 'Translator', value: 'TRANSLATOR' },
    { label: 'Contributor', value: 'CONTRIBUTOR' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    public seriesService: SeriesService,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.setupFormValidation();

    // Add one default author row
    if (this.authorsArray.length === 0) {
      this.addAuthor();
    }
  }

  setupFormValidation() {
    this.seriesService.seriesForm.get('status')?.valueChanges.subscribe((status) => {
      const completionDateControl = this.seriesService.seriesForm.get('completionDate');
      if (status == 'COMPLETED') {
        completionDateControl?.enable();
      } else {
        completionDateControl?.setValue(null);
        completionDateControl?.disable();
      }
    });
  }


  get authorsArray(): FormArray {
    return this.seriesService.seriesForm.get('authors') as FormArray;
  }

  addAuthor() {
    const authorForm = this.fb.group({
      authorId: [null, [Validators.required]],
      authorRole: ['Author', Validators.required],
    });

    this.authorsArray.push(authorForm);

    authorForm.markAsUntouched();
    authorForm.markAsPristine();
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

  onAuthorSelected(author: CatalogAuthorDTO | CatalogAuthorDTO[], index: number) {
    const authorControl = this.authorsArray.at(index);
    if (author && authorControl) {

      const selectedAuthor = Array.isArray(author) ? author[0] : author;
      if (selectedAuthor) {
        authorControl.patchValue({
          authorId: selectedAuthor,
        });
        // Mark the authorId field as touched and update validity
        const authorIdControl = authorControl.get('authorId');
        if (authorIdControl) {
          authorIdControl.markAsTouched();
          authorIdControl.updateValueAndValidity();
        }
      }
    }
  }

  onSubmit() {
    
    if (!this.seriesService.seriesForm.valid) {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields correctly',
      });
      return;
    }

    let formValue = this.seriesService.seriesForm.value;

    const newCatalogAuthor: CatalogSeriesCreateRequestDTO = {
      name: formValue.name,
      description: formValue.description,
      totalBooks: formValue.totalBooks,
      isCompleted: formValue.isCompleted,
      seriesGenreCreateDTOS: formValue.genres?.map((genreId: number) => ({ genreId })),
      seriesAuthorCreateDTOS: formValue.authors?.map((authorForm: any) => ({
        authorId: authorForm.authorId?.id,
        authorRole: authorForm.authorRole,
      })),
    }

    const userSeriesData: UserSeriesCreateRequestDTO = {
      userId: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 0,
      catalogSeriesId: 0, // Will be set after catalog series creation
      seriesTotalBooks: formValue.totalBooks,
      booksRead: formValue.booksRead || 0,
      booksOwned: formValue.booksOwned || 0,
      status: formValue.status,
      startDate: formValue.startDate ? new Date(formValue.startDate).toISOString() : undefined,
      completionDate: formValue.completionDate ? new Date(formValue.completionDate).toISOString() : undefined,
      isFavorite: formValue.isFavorite || false,
      readingOrderPreference: formValue.readingOrderPreference,
      notes: formValue.notes || '',
    }

    console.log('Catalog Series Data:', newCatalogAuthor);
    console.log('User Series Data:', userSeriesData);

    if (this.isFromCatalog && this.selectedCatalogSeries) {
      userSeriesData.catalogSeriesId = this.selectedCatalogSeries.id!;

      this.seriesService.createUserSeries(userSeriesData).subscribe(userSeriesResponse => {
        if (userSeriesResponse.data) {
          this.uiService.setCustomSuccess("Success", "User Series created successfully!");
          this.seriesService.seriesForm.reset();
          this.router.navigate(['/series']);
        }
      });
    } else {
      this.seriesService.createCatalogSeries(newCatalogAuthor).subscribe((response) => {
        if (response.data) {
          userSeriesData.catalogSeriesId = response.data.id;

          this.seriesService.createUserSeries(userSeriesData).subscribe(userSeriesResponse => {
            if (userSeriesResponse.data) {
              this.uiService.setCustomSuccess("Success", "User Series created successfully!");
            }
          });

          this.uiService.setCustomSuccess("Success", "Catalog Series created successfully!");
          this.seriesService.seriesForm.reset();
          this.router.navigate(['/series']);
        }
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.seriesService.seriesForm.get(fieldName);
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
      'name': 'Series Title',
      'description': 'Description',
      'totalBooks': 'Total Books',
      'genres': 'Genres',
      'authors': 'Authors',
      'isCompleted': 'Series Completion Status',

      'booksRead': 'Books Read',
      'booksOwned': 'Books Owned',
      'status': 'Series Status',
      'startDate': 'Start Date',
      'completionDate': 'Completion Date',
      'isFavorite': 'Favorite',
      'readingOrderPreference': 'Reading Order Preference',
      'notes': 'Notes'
    };

    return displayNames[fieldName] || fieldName;
  }

  validateBooksRead(): boolean {
    const booksRead = this.seriesService.seriesForm.get('booksRead')?.value || 0;
    const totalBooks = this.seriesService.seriesForm.get('totalBooks')?.value || 0;

    if (totalBooks > 0 && booksRead > totalBooks) {
      this.seriesService.seriesForm.get('booksRead')?.setErrors({ exceedsTotal: true });
      return false;
    }
    return true;
  }

  validateBooksOwned(): boolean {
    const booksOwned = this.seriesService.seriesForm.get('booksOwned')?.value || 0;
    const totalBooks = this.seriesService.seriesForm.get('totalBooks')?.value || 0;

    if (totalBooks > 0 && booksOwned > totalBooks) {
      this.seriesService.seriesForm.get('booksOwned')?.setErrors({ exceedsTotal: true });
      return false;
    }
    return true;
  }


  getAuthorFieldError(index: number, fieldName: string): string {
    const field = this.authorsArray.at(index).get(fieldName);
    if (field?.errors?.['required']) return `${fieldName} is required`;
    if (field?.errors?.['minlength'])
      return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    return '';
  }

  // Catalog search methods (following add-author pattern)
  onCatalogSeriesSelected(series: any) {
    if (series.type === 'series') {
      this.selectedCatalogSeries = series;
      this.isFromCatalog = true;
      this.showForm = true;

      const genreIds = series.seriesGenres?.map((g: any) => {
        // If genreId is an object with id property, use that
        if (typeof g.genreId === 'object' && g.genreId !== null && g.genreId.id) {
          return g.genreId.id.toString();
        }

        return g.genreId.toString();
      }) || [];

      this.seriesService.seriesForm.patchValue({
        name: series.name ,
        description: series.description || '',
        totalBooks: series.totalBooks || 0,
        isCompleted: series.isCompleted || false,
        genres: genreIds,
        authors: series.seriesAuthors?.map((a: any) => ({
          authorId: a.authorId,
          authorRole: a.authorRole || 'Author',
        })) || [],
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
          control.disable({ emitEvent: false });
        }
      });

      // Ensure user fields are always enabled
      userFields.forEach(field => {
        const control = this.seriesService.seriesForm.get(field);
        if (control) {
          control.enable({ emitEvent: false });
        }
      });
    } else {
      // Enable all fields when creating manually
      [...catalogFields, ...userFields].forEach(field => {
        const control = this.seriesService.seriesForm.get(field);
        if (control) {
          control.enable({ emitEvent: false });
        }
      });
    }
  }

  // get booksArray(): FormArray {
  //   return this.seriesService.seriesForm.get('books') as FormArray;
  // }

  // onCustomTagCreated(tagName: any) {
  //   // Handle custom tag creation if needed
  //   console.log('Custom tag created:', tagName);
  // }

  // isBookFieldInvalid(index: number, fieldName: string): boolean {
  //   const field = this.booksArray.at(index).get(fieldName);
  //   return !!(field?.invalid && field?.touched);
  // }

  // getBookFieldError(index: number, fieldName: string): string {
  //   const field = this.booksArray.at(index).get(fieldName);
  //   if (field?.errors?.['required']) return `${fieldName} is required`;
  //   if (field?.errors?.['min'])
  //     return `${fieldName} must be at least ${field.errors['min'].min}`;
  //   if (field?.errors?.['max'])
  //     return `${fieldName} must be at most ${field.errors['max'].max}`;
  //   return '';
  // }

  // getCompletedBooksCount(): number {
  //   return this.booksArray.controls.filter(
  //     (book) => book.get('status')?.value === 'Finished'
  //   ).length;
  // }

  // Helper method to get default status based on reading progress
  // getDefaultSeriesStatus(): string {
  //   const booksRead = this.seriesService.seriesForm.get('booksRead')?.value || 0;
  //   const totalBooks = this.seriesService.seriesForm.get('totalBooks')?.value || 0;

  //   if (booksRead === 0) {
  //     return 'Want to Read';
  //   } else if (booksRead === totalBooks && totalBooks > 0) {
  //     return 'Completed';
  //   } else {
  //     return 'Reading';
  //   }
  // }

  // Helper method to update series status when books change
  // updateSeriesStatusFromBooks(): void {
  //   // Note: booksRead is now manual input, not auto-calculated
  //   const currentStatus = this.seriesService.seriesForm.get('status')?.value;
  //   // Only auto-update if the user hasn't manually set a specific status
  //   if (!currentStatus || currentStatus === 'Want to Read') {
  //     const suggestedStatus = this.getDefaultSeriesStatus();
  //     this.seriesService.seriesForm.get('status')?.setValue(suggestedStatus);
  //   }
  // }

  // Helper method to check if books count matches expected total
  // getBooksCountMessage(): string {
  //   const totalBooks = this.seriesService.seriesForm.get('totalBooks')?.value;
  //   const addedBooks = this.booksArray.length;

  //   if (!totalBooks) return '';

  //   if (addedBooks < totalBooks) {
  //     return `You have added ${addedBooks} out of ${totalBooks} expected books.`;
  //   } else if (addedBooks > totalBooks) {
  //     return `You have added ${addedBooks} books, but expected total is ${totalBooks}. Consider updating the total.`;
  //   } else {
  //     return `Perfect! You have added all ${totalBooks} expected books.`;
  //   }
  // }

  // getCountMessageSeverity(): 'info' | 'warn' | 'success' {
  //   const totalBooks = this.seriesService.seriesForm.get('totalBooks')?.value;
  //   const addedBooks = this.booksArray.length;

  //   if (!totalBooks) return 'info';

  //   if (addedBooks < totalBooks) {
  //     return 'info';
  //   } else if (addedBooks > totalBooks) {
  //     return 'warn';
  //   } else {
  //     return 'success';
  //   }
  // }

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

}
