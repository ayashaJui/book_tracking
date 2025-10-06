import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { Author, AuthorCreateRequest, AuthorUpdateRequest } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
import { CatalogService } from '../../../shared/services/catalog.service';
import {
  CatalogSearchResult,
  DuplicateDetectionResult
} from '../../../shared/models/catalog.model';
import { DuplicateDialogAction } from '../../../shared/components/duplicate-dialog/duplicate-dialog.component';

@Component({
  selector: 'app-add-author',
  standalone: false,
  templateUrl: './add-author.html',
  styleUrl: './add-author.scss',
  providers: [MessageService]
})
export class AddAuthorComponent implements OnInit {
  authorForm: FormGroup;
  isEditMode = false;
  authorId: number | null = null;
  loading = false;
  submitting = false;

  // Date constraints
  today = new Date();

  // Available genres (could be fetched from a service)
  availableGenres = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller', 'Horror',
    'Self-help', 'History', 'Non-Fiction', 'Biography', 'Science', 'Philosophy',
    'Poetry', 'Drama', 'Young Adult', 'Children', 'Historical Fiction',
    'Adventure', 'Crime', 'Literary Fiction', 'Contemporary Fiction',
    'Dystopian', 'Memoir', 'True Crime', 'Psychology', 'Business',
    'Technology', 'Health', 'Cooking', 'Travel', 'Art'
  ];

  // Nationality options (common ones)
  nationalityOptions = [
    'American', 'British', 'Canadian', 'Australian', 'German', 'French',
    'Italian', 'Spanish', 'Japanese', 'Chinese', 'Indian', 'Russian',
    'Brazilian', 'Mexican', 'Argentine', 'South African', 'Nigerian',
    'Egyptian', 'Turkish', 'Greek', 'Irish', 'Scottish', 'Welsh',
    'Dutch', 'Belgian', 'Swedish', 'Norwegian', 'Danish', 'Finnish',
    'Polish', 'Czech', 'Hungarian', 'Portuguese', 'Swiss', 'Austrian'
  ].sort();

  // Catalog search properties
  catalogSearchPerformed = false;
  selectedCatalogAuthor: CatalogSearchResult | null = null;
  showDuplicateDialog = false;
  duplicateResult?: DuplicateDetectionResult;
  searchTerm = '';
  isFromCatalog = false; // Track if author is from catalog

  // Preference level options
  preferenceLevelOptions = [
    { label: 'Not Set', value: 1 },
    { label: 'Like', value: 2 },
    { label: 'Love', value: 3 },
    { label: 'Favorite', value: 4 },
    { label: 'Top Favorite', value: 5 }
  ];

  constructor(
    private fb: FormBuilder,
    private authorService: AuthorService,
    private catalogService: CatalogService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.authorForm = this.createForm();
  }

  ngOnInit() {
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.authorId = +params['id'];
        this.loadAuthor();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      biography: ['', [Validators.maxLength(1000)]],
      birthDate: [null],
      deathDate: [null],
      nationality: [''],
      website: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      socialLinks: this.fb.group({
        twitter: ['', [Validators.pattern(/^@?[\w]+$/)]],
        instagram: ['', [Validators.pattern(/^@?[\w.]+$/)]],
        goodreads: ['', [Validators.pattern(/^https?:\/\/.+/)]],
        facebook: ['', [Validators.pattern(/^https?:\/\/.+/)]],
        linkedin: ['', [Validators.pattern(/^https?:\/\/.+/)]]
      }),
      genres: [[]],
      isActive: [true],
      notes: ['', [Validators.maxLength(500)]],
      // User preference fields
      preferenceLevel: [3, [Validators.min(1), Validators.max(5)]],
      isFavorite: [false],
      isExcluded: [false],
      personalNotes: ['', [Validators.maxLength(1000)]]
    });
  }

  /**
   * Enables or disables catalog fields based on whether author is from catalog
   */
  private updateFieldsEnabledState(): void {
    const catalogFields = ['name', 'biography', 'birthDate', 'deathDate', 'nationality', 'website', 'genres', 'notes'];
    
    if (this.isFromCatalog) {
      // Disable catalog fields if author is from catalog
      catalogFields.forEach(field => {
        const control = this.authorForm.get(field);
        if (control) {
          control.disable();
        }
      });
      
      // Also disable social links
      const socialLinksGroup = this.authorForm.get('socialLinks') as FormGroup;
      if (socialLinksGroup) {
        Object.keys(socialLinksGroup.controls).forEach(key => {
          socialLinksGroup.get(key)?.disable();
        });
      }
    } else {
      // Enable all fields if not from catalog
      catalogFields.forEach(field => {
        const control = this.authorForm.get(field);
        if (control) {
          control.enable();
        }
      });
      
      // Also enable social links
      const socialLinksGroup = this.authorForm.get('socialLinks') as FormGroup;
      if (socialLinksGroup) {
        Object.keys(socialLinksGroup.controls).forEach(key => {
          socialLinksGroup.get(key)?.enable();
        });
      }
    }
  }

  loadAuthor() {
    if (!this.authorId) return;

    this.loading = true;
    const author = this.authorService.getAuthorById(this.authorId);

    if (author) {
      // Track if this author is from catalog
      this.isFromCatalog = author.isFromCatalog || false;
      
      this.authorForm.patchValue({
        name: author.name,
        biography: author.biography || '',
        birthDate: author.birthDate || null,
        deathDate: author.deathDate || null,
        nationality: author.nationality || '',
        website: author.website || '',
        socialLinks: {
          twitter: author.socialLinks?.twitter || '',
          instagram: author.socialLinks?.instagram || '',
          goodreads: author.socialLinks?.goodreads || '',
          facebook: author.socialLinks?.facebook || '',
          linkedin: author.socialLinks?.linkedin || ''
        },
        genres: author.genres || [],
        isActive: author.isActive !== false,
        notes: author.notes || '',
        // User preference fields
        preferenceLevel: author.preferenceLevel || 1,
        isFavorite: author.isFavorite || false,
        isExcluded: author.isExcluded || false,
        personalNotes: author.personalNotes || ''
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Author not found'
      });
      this.router.navigate(['/authors']);
      
      // Update field states based on catalog status
      this.updateFieldsEnabledState();
    }

    this.loading = false;
  }

  onSubmit() {
    if (this.authorForm.invalid) {
      this.markFormGroupTouched(this.authorForm);
      return;
    }

    this.submitting = true;
    const formValue = this.authorForm.value;

    try {
      if (this.isEditMode) {
        this.updateAuthor(formValue);
      } else {
        this.createAuthor(formValue);
      }
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to save author'
      });
      this.submitting = false;
    }
  }

  createAuthor(formValue: any) {
    const authorData: AuthorCreateRequest = {
      name: formValue.name.trim(),
      biography: formValue.biography?.trim(),
      photoUrl: formValue.photoUrl?.trim(),
      birthDate: formValue.birthDate,
      deathDate: formValue.deathDate,
      nationality: formValue.nationality,
      website: formValue.website?.trim(),
      socialLinks: this.cleanSocialLinks(formValue.socialLinks),
      genres: formValue.genres || [],
      isActive: formValue.isActive,
      notes: formValue.notes?.trim(),
      // User preference fields
      preferenceLevel: formValue.preferenceLevel || 1,
      isFavorite: formValue.isFavorite || false,
      isExcluded: formValue.isExcluded || false,
      personalNotes: formValue.personalNotes?.trim() || '',
      isFromCatalog: this.isFromCatalog
    };

    const newAuthor = this.authorService.addAuthor(authorData);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Author "${newAuthor.name}" created successfully`
    });

    this.submitting = false;
    this.router.navigate(['/authors']);
  }

  updateAuthor(formValue: any) {
    if (!this.authorId) return;

    const authorData: AuthorUpdateRequest = {
      id: this.authorId,
      name: formValue.name.trim(),
      biography: formValue.biography?.trim(),
      photoUrl: formValue.photoUrl?.trim(),
      birthDate: formValue.birthDate,
      deathDate: formValue.deathDate,
      nationality: formValue.nationality,
      website: formValue.website?.trim(),
      socialLinks: this.cleanSocialLinks(formValue.socialLinks),
      genres: formValue.genres || [],
      isActive: formValue.isActive,
      notes: formValue.notes?.trim(),
      // User preference fields
      preferenceLevel: formValue.preferenceLevel || 1,
      isFavorite: formValue.isFavorite || false,
      isExcluded: formValue.isExcluded || false,
      personalNotes: formValue.personalNotes?.trim() || '',
      isFromCatalog: this.isFromCatalog
    };

    const success = this.authorService.updateAuthor(authorData);

    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Author "${authorData.name}" updated successfully`
      });

      this.submitting = false;
      this.router.navigate(['/authors']);
    } else {
      throw new Error('Failed to update author');
    }
  }

  cleanSocialLinks(socialLinks: any) {
    const cleaned: any = {};
    Object.keys(socialLinks).forEach(key => {
      const value = socialLinks[key]?.trim();
      if (value) {
        cleaned[key] = value;
      }
    });
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }

  onCancel() {
    this.router.navigate(['/authors']);
  }

  onReset() {
    if (this.isEditMode) {
      this.loadAuthor();
    } else {
      this.authorForm.reset({
        isActive: true,
        genres: []
      });
    }
  }

  // Custom validators
  dateRangeValidator() {
    const birthDate = this.authorForm.get('birthDate')?.value;
    const deathDate = this.authorForm.get('deathDate')?.value;

    if (birthDate && deathDate && birthDate >= deathDate) {
      return { dateRange: true };
    }
    return null;
  }

  // Utility methods
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.authorForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.authorForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['maxlength']) return `${fieldName} is too long`;
      if (field.errors['pattern']) return `Invalid ${fieldName} format`;
    }
    return '';
  }

  clearForm(): void {
    this.authorForm.reset();
    this.authorForm.patchValue({
      isActive: true,
      genres: [],
      socialLinks: {
        twitter: '',
        instagram: '',
        goodreads: '',
        facebook: '',
        linkedin: ''
      }
    });
    this.messageService.add({
      severity: 'info',
      summary: 'Form Cleared',
      detail: 'All form fields have been reset'
    });
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Edit Author' : 'Add New Author';
  }

  get submitButtonLabel(): string {
    return this.isEditMode ? 'Update Author' : 'Create Author';
  }

  get nationalitySelectOptions() {
    return this.nationalityOptions.map(n => ({ label: n, value: n }));
  }

  get genreSelectOptions() {
    return this.availableGenres.map(g => ({ label: g, value: g }));
  }

  // Catalog search methods
  onCatalogAuthorSelected(author: CatalogSearchResult) {
    if (author.type === 'author') {
      this.selectedCatalogAuthor = author;
      this.isFromCatalog = true; // Mark as from catalog

      // Pre-fill form with catalog data
      this.authorForm.patchValue({
        name: author.name || author.title,
        biography: author.description || '',
        // Add other mappings as needed
      });

      // Update field states - disable catalog fields since it's from catalog
      this.updateFieldsEnabledState();

      this.messageService.add({
        severity: 'success',
        summary: 'Author Selected',
        detail: `Selected "${author.name || author.title}" from catalog`
      });
    }
  }

  onCreateNewFromCatalog(searchTerm: string) {
    this.searchTerm = searchTerm;

    // Search for potential duplicates
    this.catalogService.search({
      query: searchTerm,
      type: 'author',
      limit: 10
    }).subscribe({
      next: (results) => {
        if (results.length > 0) {
          // Create a simple duplicate result structure
          this.duplicateResult = {
            hasMatches: true,
            exactMatches: results.filter(r =>
              r.name?.toLowerCase() === searchTerm.toLowerCase() ||
              r.title?.toLowerCase() === searchTerm.toLowerCase()
            ),
            similarMatches: results.filter(r =>
              r.name?.toLowerCase() !== searchTerm.toLowerCase() &&
              r.title?.toLowerCase() !== searchTerm.toLowerCase()
            ),
            confidence: 'medium' as const,
            suggestion: 'review_required' as const
          };
          this.showDuplicateDialog = true;
        } else {
          this.proceedWithNewAuthor(searchTerm);
        }
      },
      error: (error) => {
        console.error('Error checking for duplicates:', error);
        this.proceedWithNewAuthor(searchTerm);
      }
    });
  }

  onDuplicateAction(action: DuplicateDialogAction) {
    this.showDuplicateDialog = false;

    switch (action.action) {
      case 'use_existing':
        if (action.selectedItem) {
          this.onCatalogAuthorSelected(action.selectedItem);
        }
        break;
      case 'create_new':
        this.proceedWithNewAuthor(this.searchTerm);
        break;
      case 'cancel':
        // User cancelled, do nothing
        break;
    }
  }

  private proceedWithNewAuthor(searchTerm: string) {
    // Pre-fill the name field with the search term
    this.authorForm.patchValue({
      name: searchTerm
    });

    this.messageService.add({
      severity: 'info',
      summary: 'Create New Author',
      detail: `Creating new author: "${searchTerm}"`
    });
  }
}
