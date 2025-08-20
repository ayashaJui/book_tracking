import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-wishlist',
  standalone: false,
  templateUrl: './add-wishlist.html',
  styleUrl: './add-wishlist.scss',
})
export class AddWishlist implements OnInit {
  isEditMode = false;
  pageTitle = 'Add New Book to Wishlist';

  newWish: any = {
    title: '',
    author: '',
    price: null,
    targetPrice: null,
    priority: null,
    status: null,
    genres: [],
    notes: '',
  };

  priorityOptions = [
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  statusOptions = [
    { label: 'Planned', value: 'Planned' },
    { label: 'Ordered', value: 'Ordered' },
    { label: 'Dropped', value: 'Dropped' },
  ];

  genreOptions = [
    { label: 'Fiction', value: 'Fiction' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Non-Fiction', value: 'Non-Fiction' },
    { label: 'Science', value: 'Science' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Mystery', value: 'Mystery' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Biography', value: 'Biography' },
    { label: 'History', value: 'History' },
    { label: 'Self-Help', value: 'Self-Help' },
    { label: 'Technology', value: 'Technology' },
    { label: 'Philosophy', value: 'Philosophy' },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Check if this is edit mode based on route
    this.isEditMode = this.router.url.includes('/edit');
    this.pageTitle = this.isEditMode ? 'Edit Book' : 'Add New Book to Wishlist';

    if (this.isEditMode) {
      // Get book data from query parameters
      this.route.queryParams.subscribe((params) => {
        if (params['title'] && params['author']) {
          // In a real app, you'd fetch the full book data from a service
          // For now, we'll populate with the basic info
          this.newWish.title = params['title'];
          this.newWish.author = params['author'];
          // Note: You'd need to implement a service to get the full book data
          this.loadBookData(params['title'], params['author']);
        }
      });
    }
  }

  loadBookData(title: string, author: string) {
    // This is a placeholder - in a real app, you'd call a service
    // For now, we'll just set some default values
    console.log('Loading book data for editing:', title, author);
    // You could implement a service call here to get the full book data
  }

  saveWish() {
    if (this.isEditMode) {
      console.log('Updating book:', this.newWish);
      // TODO: call backend or service to update
    } else {
      console.log('Adding new book:', this.newWish);
      // TODO: call backend or service to add
    }
    this.router.navigate(['/wishlist']);
  }

  // New methods for enhanced functionality
  quickSave() {
    if (this.isQuickSaveValid()) {
      // Set default values for quick save
      if (!this.newWish.priority) this.newWish.priority = 'Medium';
      if (!this.newWish.status) this.newWish.status = 'Planned';
      this.saveWish();
    }
  }

  isQuickSaveValid(): boolean {
    return this.newWish.title && this.newWish.author;
  }

  saveDraft() {
    console.log('Saving as draft:', this.newWish);
    // TODO: Save as draft functionality
    // Could save to localStorage or backend with draft status
    localStorage.setItem('wishlist_draft', JSON.stringify(this.newWish));
    alert('Draft saved successfully!');
  }

  getPriceDifference(): string {
    if (!this.newWish.price || !this.newWish.targetPrice) return '';

    const difference = this.newWish.price - this.newWish.targetPrice;
    const percentage = ((difference / this.newWish.price) * 100).toFixed(1);

    if (difference > 0) {
      return `$${difference.toFixed(2)} (${percentage}%) above target`;
    } else if (difference < 0) {
      return `$${Math.abs(difference).toFixed(2)} (${Math.abs(
        parseFloat(percentage)
      )}%) below target`;
    } else {
      return 'At target price';
    }
  }

  getPriceDifferenceClass(): string {
    if (!this.newWish.price || !this.newWish.targetPrice) return '';

    const difference = this.newWish.price - this.newWish.targetPrice;

    if (difference > 0) {
      return 'text-red-600 dark:text-red-400';
    } else if (difference < 0) {
      return 'text-green-600 dark:text-green-400';
    } else {
      return 'text-blue-600 dark:text-blue-400';
    }
  }

  getFormStatusText(): string {
    const requiredFields = ['title', 'author', 'priority', 'status'];
    const filledRequired = requiredFields.filter(
      (field) => this.newWish[field]
    ).length;

    if (filledRequired === requiredFields.length) {
      return 'Form is complete and ready to submit';
    } else if (filledRequired > 0) {
      return `${filledRequired}/${requiredFields.length} required fields completed`;
    } else {
      return 'Please fill in the required fields';
    }
  }

  getFormStatusIcon(): string {
    const requiredFields = ['title', 'author', 'priority', 'status'];
    const filledRequired = requiredFields.filter(
      (field) => this.newWish[field]
    ).length;

    if (filledRequired === requiredFields.length) {
      return 'pi pi-check-circle text-green-500';
    } else if (filledRequired > 0) {
      return 'pi pi-info-circle text-blue-500';
    } else {
      return 'pi pi-exclamation-triangle text-orange-500';
    }
  }

  getFormStatusTextClass(): string {
    const requiredFields = ['title', 'author', 'priority', 'status'];
    const filledRequired = requiredFields.filter(
      (field) => this.newWish[field]
    ).length;

    if (filledRequired === requiredFields.length) {
      return 'text-green-600 dark:text-green-400';
    } else if (filledRequired > 0) {
      return 'text-blue-600 dark:text-blue-400';
    } else {
      return 'text-orange-600 dark:text-orange-400';
    }
  }
}
