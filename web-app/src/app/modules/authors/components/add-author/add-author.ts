import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthorCreateRequestDTO, AuthorUpdateRequestDTO, CatalogAuthorCreateRequestDTO, CatalogAuthorUpdateRequestDTO } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
import {
  CatalogSearchResult
} from '../../../shared/models/catalog.model';
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
  userAuthorPreference: any = null;
  catalogAuthor: any = null;

  today = new Date();

  catalogSearchPerformed = false;
  selectedCatalogAuthor: CatalogSearchResult | null = null;
  isFromCatalog = false;
  showForm = false;


  preferenceLevelOptions = [
    { label: '💤 Not for Me', value: 1 },
    { label: '⚖️ Neutral', value: 2 },
    { label: '🙂 Interested', value: 3 },
    { label: '❤️ Favorite', value: 4 },
    { label: '💎 Top Favorite', value: 5 }
  ];

  constructor(
    public authorService: AuthorService,
    private router: Router,
    private route: ActivatedRoute,
    private uiService: UiService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.showForm = true;
        this.authorId = +params['id'];
        this.loadAuthor();
      }
    });
  }

  loadAuthor() {
    if (!this.authorId) return;

    this.loading = true;

    this.authorService.getUserAuhtorPreferenceById(this.authorId).subscribe({
      next: (response) => {
        if (response.data) {
          this.userAuthorPreference = response.data;

          this.authorService.getCatalogAuthorDetailsById(this.userAuthorPreference.catalogAuthorId).subscribe({
            next: (catalogResponse) => {
              if (catalogResponse.data) {
                this.catalogAuthor = catalogResponse.data;

                this.authorService.authorForm.patchValue({
                  name: this.catalogAuthor.name,
                  nationality: this.catalogAuthor.nationality || '',
                  bio: this.catalogAuthor.bio || '',
                  birthDate: this.catalogAuthor.birthDate ? new Date(this.catalogAuthor.birthDate) : null,
                  deathDate: this.catalogAuthor.deathDate ? new Date(this.catalogAuthor.deathDate) : null,
                  website: this.catalogAuthor.website || '',
                  instagramUrl: this.catalogAuthor.instagramUrl || '',
                  threadsUrl: this.catalogAuthor.threadsUrl || '',
                  goodreadUrl: this.catalogAuthor.goodreadUrl || '',


                  preferenceLevel: this.userAuthorPreference.preferenceLevel || 1,
                  isFavorite: this.userAuthorPreference.isFavorite || false,
                  isExcluded: this.userAuthorPreference.isExcluded || false,
                  personalNotes: this.userAuthorPreference.personalNotes || ''
                });
              }
            },
            error: (error) => {
              console.error('Error fetching catalog author:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching author:', error);
        this.uiService.setCustomError('Error', 'Failed to load author details');
        this.router.navigate(['/authors']);
      }
    })

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
        this.updateAuthor(formValue);
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

      this.authorService.createCatalogAuthor(catalogAuthorData).subscribe({
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

  updateAuthor(formValue: any) {
    if (!this.authorId) return;

    let catalogAuthorData: CatalogAuthorUpdateRequestDTO = {
      id: this.catalogAuthor ? this.catalogAuthor.id : 0,
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

    const authorData: AuthorUpdateRequestDTO = {
      id: this.authorId,
      userId: localStorage.getItem('userId') ? +localStorage.getItem('userId')! : 0,
      catalogAuthorId: this.catalogAuthor ? this.catalogAuthor.id : 0,
      preferenceLevel: formValue.preferenceLevel.value || 1,
      isFavorite: formValue.isFavorite || false,
      isExcluded: formValue.isExcluded || false,
      personalNotes: formValue.personalNotes?.trim() || '',
    };

    this.authorService.updateCatalogAuthor(catalogAuthorData).subscribe({
      next: (response) => {
        if (response.data) {
          this.uiService.setCustomSuccess('Success', 'Catalog Author updated successfully');
          this.router.navigate(['/authors']);
        }
      },
      error: (error) => {
        console.error('Error updating catalog author:', error);
        this.uiService.setCustomError('Error', 'Failed to update catalog author');
      }
    });

    this.authorService.updateUserAuthorPreference(authorData).subscribe({
      next: (response) => {
        if (response.data) {
          this.uiService.setCustomSuccess('Success', 'Author preferences updated successfully');
          this.submitting = false;
          this.router.navigate(['/authors']);
        }
      },
      error: (error) => {
        console.error('Error updating user author preferences:', error);
        this.uiService.setCustomError('Error', 'Failed to update author preferences');
      }
    });
  }



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
    if (author.type === 'author') {
      this.selectedCatalogAuthor = author;
      this.isFromCatalog = true;
      this.showForm = true;

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
    this.isFromCatalog = false;
    this.showForm = true;
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
      catalogFields.forEach(field => {
        const control = this.authorService.authorForm.get(field);
        if (control) {
          control.disable();
        }
      });
    } else {
      catalogFields.forEach(field => {
        const control = this.authorService.authorForm.get(field);
        if (control) {
          control.enable();
        }
      });
    }
  }

}
