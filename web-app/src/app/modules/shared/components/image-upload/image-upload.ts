import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-upload',
  standalone: false,
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss',
})
export class ImageUploadComponent implements OnInit, OnChanges {
  @Input() currentImageUrl: string | null = null;
  @Input() entityType: 'book' | 'series' | 'author' | 'publisher' = 'book';
  @Input() entityId: number | null = null;
  @Input() entityName: string = '';
  @Input() maxFileSize: number = 5000000; // 5MB default
  @Input() acceptedFormats: string = 'image/*';
  @Input() showDialog: boolean = false;
  
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploading: boolean = false;
  dragOver: boolean = false;

  constructor(
    private messageService: MessageService,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.loadCurrentImage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entityId'] || changes['entityType']) {
      this.loadCurrentImage();
    }
  }

  private loadCurrentImage() {
    if (this.entityId && this.entityType) {
      const imageUrl = this.imageService.getImageUrl(this.entityType, this.entityId);
      if (imageUrl) {
        this.currentImageUrl = imageUrl;
      }
    }
  }

  get hasCurrentImage(): boolean {
    return !!this.currentImageUrl && this.currentImageUrl !== 'assets/images/product-not-found.png';
  }

  get displayImageUrl(): string {
    return this.previewUrl || this.currentImageUrl || 'assets/images/product-not-found.png';
  }

  openDialog() {
    this.showDialog = true;
    this.showDialogChange.emit(true);
    this.resetUpload();
  }

  closeDialog() {
    this.showDialog = false;
    this.showDialogChange.emit(false);
    this.resetUpload();
  }

  onFileSelect(event: any) {
    const file = event.files?.[0] || event.target?.files?.[0];
    if (file) {
      this.handleFileSelection(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  private handleFileSelection(file: File) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File',
        detail: 'Please select a valid image file'
      });
      return;
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'File Too Large',
        detail: `File size must be less than ${this.maxFileSize / 1000000}MB`
      });
      return;
    }

    this.selectedFile = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async uploadImage() {
    if (!this.selectedFile || !this.entityId) {
      return;
    }

    this.isUploading = true;

    try {
      const imageUrl = await this.imageService.uploadImage(
        this.selectedFile, 
        this.entityType, 
        this.entityId
      );
      
      this.currentImageUrl = imageUrl;
      this.imageUploaded.emit(imageUrl);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${this.entityType.charAt(0).toUpperCase() + this.entityType.slice(1)} image uploaded successfully`
      });
      
      this.closeDialog();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Upload Failed',
        detail: error instanceof Error ? error.message : 'Failed to upload image. Please try again.'
      });
    } finally {
      this.isUploading = false;
    }
  }

  removeImage() {
    if (!this.entityId) return;

    this.imageService.removeImage(this.entityType, this.entityId);
    this.currentImageUrl = null;
    this.imageRemoved.emit();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `${this.entityType.charAt(0).toUpperCase() + this.entityType.slice(1)} image removed successfully`
    });
    
    this.closeDialog();
  }

  resetUpload() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.isUploading = false;
    this.dragOver = false;
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/product-not-found.png';
    }
  }
}