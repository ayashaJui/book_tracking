import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Publisher, PublisherCreateRequest } from '../../../publishers/models/publisher.model';
import { PublisherService } from '../../../publishers/services/publisher.service';

@Component({
    selector: 'app-publisher-form',
    standalone: false,
    templateUrl: './publisher-form.component.html',
    styleUrls: ['./publisher-form.component.scss']
})
export class PublisherFormComponent implements OnInit {
    @Input() publisher?: Publisher;
    @Input() mode: 'add' | 'edit' = 'add';
    @Input() showCancelButton: boolean = true;
    @Output() publisherSaved = new EventEmitter<Publisher>();
    @Output() cancelled = new EventEmitter<void>();

    publisherForm!: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private publisherService: PublisherService
    ) { }

    ngOnInit() {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.publisherForm = this.fb.group({
            name: [this.publisher?.name || '', [Validators.required, Validators.minLength(2)]],
            location: [this.publisher?.location || ''],
            website: [this.publisher?.website || '', [Validators.pattern(/^https?:\/\/.*$/)]],
            description: [this.publisher?.description || '']
        });
    }

    get formTitle(): string {
        return this.mode === 'edit' ? 'Edit Publisher' : 'Add New Publisher';
    }

    get submitButtonLabel(): string {
        return this.mode === 'edit' ? 'Update Publisher' : 'Create Publisher';
    }

    onSubmit(): void {
        if (this.publisherForm.valid) {
            this.loading = true;
            const publisherData: PublisherCreateRequest = this.publisherForm.value;

            const operation = this.mode === 'edit' && this.publisher?.id
                ? this.publisherService.updatePublisher(this.publisher.id, publisherData)
                : this.publisherService.createPublisherOld(publisherData);

            operation.subscribe({
                next: (publisher) => {
                    this.publisherSaved.emit(publisher);
                    this.loading = false;
                    this.resetForm();
                },
                error: (error) => {
                    console.error('Error saving publisher:', error);
                    this.loading = false;
                    // Handle error - could emit an error event or show a message
                }
            });
        } else {
            this.markFormGroupTouched();
        }
    }

    onCancel(): void {
        this.cancelled.emit();
        this.resetForm();
    }

    private resetForm(): void {
        if (this.mode === 'add') {
            this.publisherForm.reset();
        }
    }

    private markFormGroupTouched(): void {
        Object.keys(this.publisherForm.controls).forEach(key => {
            const control = this.publisherForm.get(key);
            control?.markAsTouched();
        });
    }

    // Getter methods for template
    get nameControl() { return this.publisherForm.get('name'); }
    get locationControl() { return this.publisherForm.get('location'); }
    get websiteControl() { return this.publisherForm.get('website'); }
    get descriptionControl() { return this.publisherForm.get('description'); }
}