import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PublisherService } from '../../services/publisher.service';
import { PublisherCreateRequest } from '../../models/publisher.model';
import { CatalogService } from '../../../shared/services/catalog.service';
import { CatalogSearchResult, CatalogSearchQuery } from '../../../shared/models/catalog.model';
import { DuplicateDialogAction } from '../../../shared/components/duplicate-dialog/duplicate-dialog.component';

@Component({
  selector: 'app-add-publisher',
  standalone: false,
  templateUrl: './add-publisher.html',
  styleUrls: ['./add-publisher.scss'],
  providers: [MessageService]
})
export class AddPublisherComponent implements OnInit {
  publisherForm!: FormGroup;
  loading: boolean = false;
  logoFile: File | null = null;

  // Catalog-related properties
  showCatalogSearch: boolean = true;
  showDuplicateDialog: boolean = false;
  selectedCatalogPublisher: CatalogSearchResult | null = null;
  potentialDuplicates: CatalogSearchResult[] = [];

  constructor(
    private fb: FormBuilder,
    private publisherService: PublisherService,
    private router: Router,
    private messageService: MessageService,
    private catalogService: CatalogService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.publisherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      location: [''],
      website: ['', [Validators.pattern(/^https?:\/\/.*$/)]],
      description: ['']
    });
  }

  onLogoUpload(event: any): void {
    const file = event.files[0];
    if (file) {
      this.logoFile = file;
      // In a real app, you would upload to a server and get back a URL
      // For now, we'll create a local object URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Store the data URL for display (in production, you'd upload to a server)
        this.publisherForm.patchValue({ logo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.publisherForm.invalid) {
      Object.keys(this.publisherForm.controls).forEach(key => {
        this.publisherForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formData = this.publisherForm.value;

    const publisherData: PublisherCreateRequest = {
      name: formData.name.trim(),
      location: formData.location?.trim(),
      website: formData.website?.trim(),
      description: formData.description?.trim(),
      logo: formData.logo
    };

    try {
      const newPublisher = this.publisherService.createPublisher(publisherData);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Publisher added successfully'
      });

      // Navigate to publisher details
      setTimeout(() => {
        this.router.navigate(['/publishers/details', newPublisher.id]);
      }, 1000);

    } catch (error) {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add publisher'
      });
    }
  }

  // Catalog event handlers
  onCatalogPublisherSelected(result: CatalogSearchResult): void {
    this.selectedCatalogPublisher = result;

    // Search for potential duplicates
    const searchQuery: CatalogSearchQuery = {
      query: result.name || result.title || '',
      type: 'publisher'
    };

    this.catalogService.search(searchQuery).subscribe({
      next: (searchResults) => {
        if (searchResults.length > 0) {
          this.potentialDuplicates = searchResults;
          this.showDuplicateDialog = true;
        } else {
          this.prefillFormFromCatalog(result);
        }
      },
      error: (error) => {
        console.error('Error checking for duplicates:', error);
        this.prefillFormFromCatalog(result);
      }
    });
  }

  onCreateNewFromCatalog(): void {
    this.showCatalogSearch = false;
  }

  onDuplicateAction(action: DuplicateDialogAction): void {
    this.showDuplicateDialog = false;

    switch (action.action) {
      case 'use_existing':
        if (action.selectedItem) {
          this.router.navigate(['/publishers/details', action.selectedItem.id]);
        }
        break;
      case 'create_new':
        if (this.selectedCatalogPublisher) {
          this.prefillFormFromCatalog(this.selectedCatalogPublisher);
        }
        break;
      case 'cancel':
        this.showCatalogSearch = true;
        break;
    }
  }

  private prefillFormFromCatalog(result: CatalogSearchResult): void {
    this.showCatalogSearch = false;

    this.publisherForm.patchValue({
      name: result.name || result.title,
      description: result.description
      // Note: Additional fields like location and website would need to be fetched
      // from the full publisher details using the catalog service
    });
  }

  goBack(): void {
    this.router.navigate(['/publishers']);
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.publisherForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.publisherForm.get(fieldName);
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
      description: 'Description'
    };
    return labels[fieldName] || fieldName;
  }
}
