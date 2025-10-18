import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PublisherService } from '../../services/publisher.service';
import { CatalogPublisherCreateRequestDTO, CatalogPublisherUpdateRequestDTO, PublisherCreateRequest } from '../../models/publisher.model';
import { CatalogService } from '../../../shared/services/catalog.service';
import { CatalogApiService } from '../../../shared/services/catalog.api.service';
import { CatalogSearchResult, CatalogSearchQuery } from '../../../shared/models/catalog.model';
import { DuplicateDialogAction } from '../../../shared/components/duplicate-dialog/duplicate-dialog.component';
import { UiService } from '../../../shared/services/ui.service.service';

@Component({
  selector: 'app-add-publisher',
  standalone: false,
  templateUrl: './add-publisher.html',
  styleUrls: ['./add-publisher.scss'],
  providers: [MessageService]
})
export class AddPublisherComponent implements OnInit {
  loading: boolean = false;
  logoFile: File | null = null;
  isEditMode: boolean = false;
  publisherId?: number;

  // Catalog-related properties
  // showCatalogSearch: boolean = true;
  // showDuplicateDialog: boolean = false;
  // selectedCatalogPublisher: CatalogSearchResult | null = null;
  // potentialDuplicates: CatalogSearchResult[] = [];
  // catalogSearchPerformed: boolean = false;
  // canCreatePublisher: boolean = false;

  constructor(
    public publisherService: PublisherService,
    private router: Router,
    private route: ActivatedRoute,
    private uiService: UiService,
    private messageService: MessageService,
    private catalogApiService: CatalogApiService,
  ) { }

  ngOnInit(): void {
    this.publisherId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    this.isEditMode = !!this.publisherId;

    if (this.isEditMode && this.publisherId) {
      this.publisherService.getCatalogPublisherById(this.publisherId).subscribe((response) => {
        if (response.data) {
          let publisher = response.data;
          this.publisherService.publisherForm.patchValue({
            name: publisher.name,
            location: publisher.location,
            website: publisher.website,
            description: publisher.description
          });
        }
      })
    } else {
      this.publisherService.publisherForm.reset();
    }
  }


  onSubmit(): void {
    if (this.publisherService.publisherForm.invalid) {
      Object.keys(this.publisherService.publisherForm.controls).forEach(key => {
        this.publisherService.publisherForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formData = this.publisherService.publisherForm.value;

    if (this.isEditMode && this.publisherId) {
      // Update existing publisher
      const updateData: CatalogPublisherUpdateRequestDTO = {
        id: this.publisherId,
        name: formData.name.trim(),
        location: formData.location?.trim(),
        website: formData.website?.trim(),
        description: formData.description?.trim(),
      };

      this.publisherService.updateCatalogPublisher(updateData).subscribe((response) => {
        if (response.data) {
          this.loading = false;
          this.publisherService.publisherForm.reset();
          this.router.navigate(['publishers']);
          this.uiService.setCustomSuccess('Success', 'Publisher updated successfully.');
        }
      });
    } else {
      // Create new publisher
      const publisherData: CatalogPublisherCreateRequestDTO = {
        name: formData.name.trim(),
        location: formData.location?.trim(),
        website: formData.website?.trim(),
        description: formData.description?.trim(),
      };

      this.publisherService.createCatalogPublisher(publisherData).subscribe({
        next: (response) => {
          if (response.data) {
            this.loading = false;
            this.publisherService.publisherForm.reset();
            this.router.navigate(['publishers']);
            this.uiService.setCustomSuccess('Success', 'Publisher added successfully.');
          }
        },
        error: (error) => {
          this.loading = false;
          this.uiService.setCustomError('Error', "Failed to add publisher.");
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/publishers']);
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Edit Publisher' : 'Add New Publisher';
  }

  get pageDescription(): string {
    return this.isEditMode ? 'Edit publisher information' : 'Add a new publisher';
  }

  get submitButtonLabel(): string {
    return this.isEditMode ? 'Update Publisher' : 'Add Publisher';
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.publisherService.publisherForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.publisherService.publisherForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid URL (starting with http:// or https://)';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Publisher name',
      location: 'Location',
      website: 'Website',
      description: 'Description',
    };
    return labels[fieldName] || fieldName;
  }
}
