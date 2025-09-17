import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PublisherService } from '../../services/publisher.service';
import { PublisherCreateRequest } from '../../models/publisher.model';

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

  constructor(
    private fb: FormBuilder,
    private publisherService: PublisherService,
    private router: Router,
    private messageService: MessageService
  ) {}

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
