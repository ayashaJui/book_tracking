import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PublisherService } from '../../services/publisher.service';

@Component({
  selector: 'app-edit-publisher',
  standalone: false,
  templateUrl: './edit-publisher.html',
  styleUrls: ['./edit-publisher.scss'],
  providers: [MessageService]
})
export class EditPublisherComponent implements OnInit {
  publisherForm!: FormGroup;
  loading: boolean = false;
  publisherId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private publisherService: PublisherService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.publisherId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    this.initializeForm();
    if (this.publisherId) {
      const publisher = this.publisherService.getPublisherById(this.publisherId);
      if (publisher) {
        this.publisherForm.patchValue(publisher as any);
      }
    }
  }

  private initializeForm(): void {
    this.publisherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      location: [''],
      website: ['', [Validators.pattern(/^https?:\/\/.*$/)]],
      description: [''],
      logo: ['']
    });
  }

  onSubmit(): void {
    if (!this.publisherForm.valid || !this.publisherId) return;
    this.loading = true;
    const data = { id: this.publisherId, ...this.publisherForm.value };
    const updated = this.publisherService.updatePublisher(data as any);
    this.loading = false;
    if (updated) {
      this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Publisher updated' });
      this.router.navigate(['/publishers']);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update publisher' });
    }
  }

  cancel(): void {
    this.router.navigate(['/publishers']);
  }
}
