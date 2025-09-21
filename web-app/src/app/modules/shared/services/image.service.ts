import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ImageData {
  entityType: string;
  entityId: number;
  imageUrl: string;
  uploadDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly STORAGE_KEY = 'book_tracking_images';
  private imagesSubject = new BehaviorSubject<ImageData[]>([]);

  constructor() {
    this.loadImagesFromStorage();
  }

  // Get image URL for a specific entity
  getImageUrl(entityType: string, entityId: number): string | null {
    const images = this.imagesSubject.value;
    const imageData = images.find(img => 
      img.entityType === entityType && img.entityId === entityId
    );
    return imageData?.imageUrl || null;
  }

  // Set image for an entity
  setImage(entityType: string, entityId: number, imageUrl: string): void {
    const images = this.imagesSubject.value;
    const existingIndex = images.findIndex(img => 
      img.entityType === entityType && img.entityId === entityId
    );

    const imageData: ImageData = {
      entityType,
      entityId,
      imageUrl,
      uploadDate: new Date()
    };

    if (existingIndex >= 0) {
      // Update existing image
      images[existingIndex] = imageData;
    } else {
      // Add new image
      images.push(imageData);
    }

    this.saveImagesToStorage(images);
    this.imagesSubject.next(images);
  }

  // Remove image for an entity
  removeImage(entityType: string, entityId: number): void {
    const images = this.imagesSubject.value;
    const filteredImages = images.filter(img => 
      !(img.entityType === entityType && img.entityId === entityId)
    );

    this.saveImagesToStorage(filteredImages);
    this.imagesSubject.next(filteredImages);
  }

  // Get all images for a specific entity type
  getImagesForType(entityType: string): ImageData[] {
    return this.imagesSubject.value.filter(img => img.entityType === entityType);
  }

  // Upload image (simulated - stores base64 in localStorage)
  async uploadImage(file: File, entityType: string, entityId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Invalid file type. Please select an image.'));
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        reject(new Error('File size too large. Maximum size is 5MB.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        this.setImage(entityType, entityId, imageUrl);
        resolve(imageUrl);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  // Get display URL with fallback
  getDisplayUrl(entityType: string, entityId: number): string {
    const imageUrl = this.getImageUrl(entityType, entityId);
    return imageUrl || 'assets/images/product-not-found.png';
  }

  // Cleanup old images (optional - for maintenance)
  cleanupOldImages(daysOld: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const images = this.imagesSubject.value;
    const filteredImages = images.filter(img => 
      new Date(img.uploadDate) > cutoffDate
    );

    if (filteredImages.length !== images.length) {
      this.saveImagesToStorage(filteredImages);
      this.imagesSubject.next(filteredImages);
    }
  }

  private loadImagesFromStorage(): void {
    try {
      const storedImages = localStorage.getItem(this.STORAGE_KEY);
      if (storedImages) {
        const images: ImageData[] = JSON.parse(storedImages);
        this.imagesSubject.next(images);
      }
    } catch (error) {
      console.error('Failed to load images from storage:', error);
      this.imagesSubject.next([]);
    }
  }

  private saveImagesToStorage(images: ImageData[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
      console.error('Failed to save images to storage:', error);
    }
  }
}