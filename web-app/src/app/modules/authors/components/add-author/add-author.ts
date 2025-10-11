import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Author, AuthorCreateRequestDTO, CatalogAuthorCreateRequestDTO } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
import { CatalogService } from '../../../shared/services/catalog.service';
import {
  CatalogSearchResult
} from '../../../shared/models/catalog.model';
import { CatalogApiService } from '../../../shared/services/catalog.api.service';
import { UiService } from '../../../shared/services/ui.service.service';

@Component({
  selector: 'app-add-author',
  standalone: false,
  templateUrl: './add-author.html',
  styleUrl: './add-author.scss'
})
export class AddAuthorComponent implements OnInit {
  isEditMode = false;
  authorId: number | null = null;
  loading = false;
  submitting = false;

  // Date constraints
  today = new Date();

  // Catalog search properties
  catalogSearchPerformed = false;
  selectedCatalogAuthor: CatalogSearchResult | null = null;
  isFromCatalog = false; // Track if author is from catalog

  // Preference level options
  preferenceLevelOptions = [
    { label: '💤 Not for Me', value: 1 },
    { label: '⚖️ Neutral', value: 2 },
    { label: '🙂 Interested', value: 3 },
    { label: '❤️ Favorite', value: 4 },
    { label: '💎 Top Favorite', value: 5 }
  ];

  constructor(
    public authorService: AuthorService,
    private catalogApiService: CatalogApiService,
    private router: Router,
    private route: ActivatedRoute,
    private uiService: UiService
  ) {
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

  loadAuthor() {
    if (!this.authorId) return;

    this.loading = true;
    const author = this.authorService.getAuthorById(this.authorId);

    if (author) {
      // Track if this author is from catalog
      this.isFromCatalog = author.isFromCatalog || false;

      this.authorService.authorForm.patchValue({
        name: author.name,
        biography: author.biography || '',
        birthDate: author.birthDate || null,
        deathDate: author.deathDate || null,
        nationality: author.nationality || '',
        website: author.website || '',
        threadsUrl: author.threadsUrl || '',
        instagramUrl: author.instagramUrl || '',
        goodreadUrl: author.goodreadUrl || '',
        isActive: author.isActive !== false,
        notes: author.notes || '',
        // User preference fields
        preferenceLevel: author.preferenceLevel || 1,
        isFavorite: author.isFavorite || false,
        isExcluded: author.isExcluded || false,
        personalNotes: author.personalNotes || ''
      });
    } else {
      this.uiService.setCustomError('Error', 'Author not found');
      this.router.navigate(['/authors']);

      // Update field states based on catalog status
      this.updateFieldsEnabledState();
    }

    this.loading = false;
  }

  onSubmit() {
    if (this.authorService.authorForm.invalid) {
      this.markFormGroupTouched(this.authorService.authorForm);
      return;
    }

    this.submitting = true;
    const formValue = this.authorService.authorForm.value;

    try {
      if (this.isEditMode) {
        // this.updateAuthor(formValue);
      } else {
        this.createAuthor(formValue, this.isFromCatalog);
      }
    } catch (error: any) {
      this.uiService.setCustomError('Error', error.message || 'Failed to save author');
      this.submitting = false;
    }
  }

  createAuthor(formValue: any, isFromCatalog: boolean) {
    const authorData: AuthorCreateRequestDTO = {
      userId: localStorage.getItem('userId') ? +localStorage.getItem('userId')! : 0,
      catalogAuthorId: this.selectedCatalogAuthor ? this.selectedCatalogAuthor.id : 0,
      preferenceLevel: formValue.preferenceLevel.value || 1,
      isFavorite: formValue.isFavorite || false,
      isExcluded: formValue.isExcluded || false,
      personalNotes: formValue.personalNotes?.trim() || '',
    };


    if (isFromCatalog) {
      this.saveUserAuthorPreferences(authorData);
    } else {
      let catalogAuthorData: CatalogAuthorCreateRequestDTO = {
        name: formValue.name.trim(),
        bio: formValue.bio?.trim() || '',
        birthDate: formValue.birthDate ? formValue.birthDate.toISOString().split('T')[0] : '',
        deathDate: formValue.deathDate ? formValue.deathDate.toISOString().split('T')[0] : '',
        nationality: formValue.nationality?.trim() || '',
        website: formValue.website?.trim() || '',
        instagramUrl: formValue.instagramUrl?.trim() || '',
        goodreadUrl: formValue.goodreadUrl?.trim() || '',
        threadsUrl: formValue.threadsUrl?.trim() || ''
      }
      
      this.catalogApiService.createCatalogAuthor(catalogAuthorData).subscribe({
        next: (response) => {
          if (response.data) {
            authorData.catalogAuthorId = response.data.id;
            this.saveUserAuthorPreferences(authorData);
          } else {
            this.uiService.setCustomError('Error', 'Failed to create catalog author');
            this.submitting = false;

          }
        },
        error: (error) => {
          console.error('Error creating catalog author:', error);
          this.uiService.setCustomError('Error', 'Failed to create catalog author');
          this.submitting = false;
        }
      });
    }
  }

  saveUserAuthorPreferences(data: AuthorCreateRequestDTO) {
    this.authorService.createUserAuthorPreference(data).subscribe({
      next: (response) => {
        if (response.data) {
          this.uiService.setCustomSuccess('Success', 'Author Saved successfully');
          this.submitting = false;
          this.authorService.authorForm.reset();
          this.selectedCatalogAuthor = null;
          this.isFromCatalog = false;
          this.updateFieldsEnabledState();
          this.router.navigate(['/authors']);
        } else {
          this.uiService.setCustomError('Error', 'Failed to save author preferences');
          this.submitting = false;
        }
      },
      error: (error) => {
        console.error('Error saving user author preferences:', error);
        this.uiService.setCustomError('Error', error.message || 'Failed to save author preferences');
        this.submitting = false;
      }
    });
  }

  // updateAuthor(formValue: any) {
  //   if (!this.authorId) return;

  //   const authorData: AuthorUpdateRequest = {
  //     id: this.authorId,
  //     name: formValue.name.trim(),
  //     biography: formValue.biography?.trim(),
  //     photoUrl: formValue.photoUrl?.trim(),
  //     birthDate: formValue.birthDate,
  //     deathDate: formValue.deathDate,
  //     nationality: formValue.nationality,
  //     website: formValue.website?.trim(),
  //     // socialLinks: this.cleanSocialLinks(formValue.socialLinks),
  //     genres: formValue.genres || [],
  //     isActive: formValue.isActive,
  //     notes: formValue.notes?.trim(),
  //     // User preference fields
  //     preferenceLevel: formValue.preferenceLevel || 1,
  //     isFavorite: formValue.isFavorite || false,
  //     isExcluded: formValue.isExcluded || false,
  //     personalNotes: formValue.personalNotes?.trim() || '',
  //     isFromCatalog: this.isFromCatalog
  //   };

  //   const success = this.authorService.updateAuthor(authorData);

  //   if (success) {
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Success',
  //       detail: `Author "${authorData.name}" updated successfully`
  //     });

  //     this.submitting = false;
  //     this.router.navigate(['/authors']);
  //   } else {
  //     throw new Error('Failed to update author');
  //   }
  // }



  onCancel() {
    this.router.navigate(['/authors']);
  }

  clearForm(): void {
    this.authorService.authorForm.reset();
    this.uiService.setCustomInfo('Form Cleared', 'All form fields have been reset');
  }

  cleanSocialLinks(socialLink: string | any) {
    const cleaned: any = socialLink.trim();

    return cleaned ? cleaned : undefined;
  }

  dateRangeValidator() {
    const birthDate = this.authorService.authorForm.get('birthDate')?.value;
    const deathDate = this.authorService.authorForm.get('deathDate')?.value;

    if (birthDate && deathDate && birthDate >= deathDate) {
      return { dateRange: true };
    }
    return null;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get minDeathDate(): Date | null {
    const birthValue = this.authorService.authorForm.get('birthDate')?.value;
    if (!birthValue) return null;
    return new Date(birthValue);
  }

  // Catalog search methods
  onCatalogAuthorSelected(author: any) {
    console.log('Catalog Author Selected:', author);
    if (author.type === 'author') {
      this.selectedCatalogAuthor = author;
      this.isFromCatalog = true; // Mark as from catalog

      // Pre-fill form with catalog data
      this.authorService.authorForm.patchValue({
        ...author,
        birthDate: author.birthDate ? new Date(author.birthDate) : null,
        deathDate: author.deathDate ? new Date(author.deathDate) : null,
      });


      this.updateFieldsEnabledState();

      this.uiService.setCustomSuccess('Author Selected', `Selected "${author.name || author.title}" from catalog`);
    }
  }

  onCreateNewFromCatalog(searchTerm: string) {
    this.isFromCatalog = false; // Mark as not from catalog
    this.updateFieldsEnabledState();
    this.proceedWithNewAuthor(searchTerm);
  }

  private proceedWithNewAuthor(searchTerm: string) {

    this.authorService.authorForm.patchValue({
      name: searchTerm
    });

    this.uiService.setCustomInfo('Create New Author', `Creating new author: "${searchTerm}"`);
  }

  private updateFieldsEnabledState(): void {
    const catalogFields = ['name', 'bio', 'birthDate', 'deathDate', 'nationality', 'website', 'instagramUrl', 'goodreadUrl', 'threadsUrl'];

    if (this.isFromCatalog) {
      // Disable catalog fields if author is from catalog
      catalogFields.forEach(field => {
        const control = this.authorService.authorForm.get(field);
        if (control) {
          control.disable();
        }
      });
    } else {
      // Enable all fields if not from catalog
      catalogFields.forEach(field => {
        const control = this.authorService.authorForm.get(field);
        if (control) {
          control.enable();
        }
      });
    }
  }

}
