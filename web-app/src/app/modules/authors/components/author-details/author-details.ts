import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';

import { Author, AuthorStats } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
import { ImageService } from '../../../shared/services/image.service';

@Component({
  selector: 'app-author-details',
  standalone: false,
  templateUrl: './author-details.html',
  styleUrl: './author-details.scss',
  providers: [MessageService, ConfirmationService]
})
export class AuthorDetailsComponent implements OnInit, OnDestroy {
  author: Author | null = null;
  authorStats: AuthorStats | null = null;
  loading = false;
  authorId: number | null = null;
  
  // Active tab
  activeTab = 'overview';
  
  // Mock books data (would come from book service)
  authorBooks: any[] = [];
  
  private routeSubscription: Subscription | null = null;

  constructor(
    private authorService: AuthorService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      if (params['id']) {
        this.authorId = +params['id'];
        this.loadAuthor();
        this.loadAuthorStats();
        this.loadAuthorBooks();
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadAuthor() {
    if (!this.authorId) return;

    this.loading = true;
    const foundAuthor = this.authorService.getAuthorById(this.authorId);
    this.author = foundAuthor || null;

    if (!this.author) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Author not found'
      });
      this.router.navigate(['/authors']);
      return;
    }

    this.loading = false;
  }

  loadAuthorStats() {
    if (!this.authorId) return;

    // In a real implementation, this would calculate actual stats from books
    this.authorStats = this.authorService.calculateAuthorStats(this.authorId);
  }

  loadAuthorBooks() {
    if (!this.authorId || !this.author) return;

    // Mock data - in real implementation, would query book service by author
    // Generate sample books based on the author name for demonstration
    this.authorBooks = this.generateSampleBooks(this.author.name);
  }

  private generateSampleBooks(authorName: string): any[] {
    // Sample book titles that could be associated with any author
    const sampleTitles = [
      'The Journey Begins',
      'Whispers in the Dark',
      'Beyond the Horizon',
      'Tales of Wonder',
      'The Last Chapter',
      'Echoes of Time',
      'Shadows and Light',
      'The Hidden Truth',
      'Mysteries Unfold',
      'The Final Quest'
    ];

    const statuses = ['Read', 'Currently Reading', 'Want to Read', 'On Hold'];
    const genres = ['Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller'];

    // Generate 2-5 books per author
    const bookCount = Math.floor(Math.random() * 4) + 2;
    const books = [];

    for (let i = 0; i < bookCount; i++) {
      const title = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const genre = genres[Math.floor(Math.random() * genres.length)];
      const rating = Math.floor(Math.random() * 5) + 1;
      const pages = Math.floor(Math.random() * 400) + 200;

      books.push({
        id: Date.now() + i,
        title: `${title} ${i + 1}`,
        author: authorName,
        status: status,
        genre: genre,
        rating: status === 'Read' ? rating : null,
        pages: pages,
        coverUrl: null,
        publishedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1),
        description: `A captivating ${genre.toLowerCase()} novel by ${authorName}.`
      });
    }

    return books;
  }

  // Navigation methods
  navigateBack() {
    this.router.navigate(['/authors']);
  }

  navigateToEdit() {
    if (this.authorId) {
      this.router.navigate(['/authors/edit', this.authorId]);
    }
  }

  navigateToBook(bookId: number) {
    this.router.navigate(['/books', bookId]);
  }

  // Tab navigation
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Utility methods
  getAuthorAge(): string {
    if (!this.author?.birthDate) return '';
    
    const birthYear = this.author.birthDate.getFullYear();
    const currentYear = this.author.deathDate ? this.author.deathDate.getFullYear() : new Date().getFullYear();
    
    const age = currentYear - birthYear;
    return this.author.deathDate ? `(${age} years)` : `(Age ${age})`;
  }

  getAuthorInitials(): string {
    if (!this.author) return '';
    return this.getInitials(this.author.name);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  formatShortDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short'
    }).format(date);
  }

  openLink(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  getSocialIcon(platform: string): string {
    const icons: { [key: string]: string } = {
      twitter: 'pi-twitter',
      instagram: 'pi-instagram', 
      facebook: 'pi-facebook',
      linkedin: 'pi-linkedin',
      goodreads: 'pi-book'
    };
    return icons[platform] || 'pi-link';
  }

  getSocialUrl(platform: string, handle: string): string {
    if (!handle) return '';
    
    const baseUrls: { [key: string]: string } = {
      twitter: 'https://twitter.com/',
      instagram: 'https://instagram.com/',
      facebook: 'https://facebook.com/',
      linkedin: 'https://linkedin.com/in/',
      goodreads: ''
    };
    
    if (platform === 'goodreads' || handle.startsWith('http')) {
      return handle;
    }
    
    const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
    return baseUrls[platform] + cleanHandle;
  }

  getGenreColor(genre: string): string {
    const colors: { [key: string]: string } = {
      'Fantasy': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Science Fiction': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Mystery': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      'Romance': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Thriller': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Horror': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Non-Fiction': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[genre] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Read':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Currently Reading':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Want to Read':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'On Hold':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  }

  getBookStatusBadgeClass(status: string): string {
    return this.getBadgeClass(status);
  }

  navigateToEditBook(bookId: number) {
    this.router.navigate(['/books/edit', bookId]);
  }

  navigateToAddBook() {
    this.router.navigate(['/books/add'], { 
      queryParams: { authorId: this.authorId } 
    });
  }

  confirmDeleteAuthor() {
    if (!this.author) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${this.author.name}"? This action cannot be undone.`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteAuthor();
      }
    });
  }

  deleteAuthor() {
    if (!this.author || !this.authorId) return;

    const success = this.authorService.removeAuthor(this.authorId);
    
    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Author "${this.author.name}" deleted successfully`
      });
      this.router.navigate(['/authors']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete author'
      });
    }
  }

  onImageUploaded(imageUrl: string) {
    if (this.author && this.author.id) {
      const updatedAuthor = {
        id: this.author.id,
        name: this.author.name,
        biography: this.author.biography,
        photoUrl: imageUrl,
        birthDate: this.author.birthDate,
        deathDate: this.author.deathDate,
        nationality: this.author.nationality,
        website: this.author.website,
        socialLinks: this.author.socialLinks,
        genres: this.author.genres,
        isActive: this.author.isActive,
        notes: this.author.notes
      };
      
      const success = this.authorService.updateAuthor(updatedAuthor);
      
      if (success) {
        this.author.photoUrl = imageUrl;
        this.messageService.add({
          severity: 'success',
          summary: 'Photo Updated',
          detail: 'Author photo has been updated successfully'
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update author photo'
        });
      }
    }
  }

  onImageRemoved() {
    if (this.author && this.author.id) {
      const updatedAuthor = {
        id: this.author.id,
        name: this.author.name,
        biography: this.author.biography,
        photoUrl: undefined,
        birthDate: this.author.birthDate,
        deathDate: this.author.deathDate,
        nationality: this.author.nationality,
        website: this.author.website,
        socialLinks: this.author.socialLinks,
        genres: this.author.genres,
        isActive: this.author.isActive,
        notes: this.author.notes
      };
      
      const success = this.authorService.updateAuthor(updatedAuthor);
      
      if (success) {
        this.author.photoUrl = undefined;
        this.messageService.add({
          severity: 'success',
          summary: 'Photo Removed',
          detail: 'Author photo has been removed successfully'
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to remove author photo'
        });
      }
    }
  }
}
