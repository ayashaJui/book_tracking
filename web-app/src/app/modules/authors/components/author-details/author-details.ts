import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';

import { Author, AuthorStats, UserAuthorPreferenceDTO } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
import { ImageService } from '../../../shared/services/image.service';
import { UiService } from '../../../shared/services/ui.service.service';

@Component({
  selector: 'app-author-details',
  standalone: false,
  templateUrl: './author-details.html',
  styleUrl: './author-details.scss',
  providers: [MessageService, ConfirmationService]
})
export class AuthorDetailsComponent implements OnInit {
  author: UserAuthorPreferenceDTO | null = null;
  loading = false;
  authorId: number | null = null;

  authorBooks: any[] = [];


  constructor(
    private authorService: AuthorService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private imageService: ImageService,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.authorId = +params['id'];
        this.loadAuthor(this.authorId);
      }
    });
  }



  loadAuthor(authorId: number) {
    if (!authorId) return;

    this.loading = true;

    this.authorService.getUserAuhtorPreferenceById(authorId).subscribe({
      next: (response) => {
        if (response.data) {
          this.author = response.data;
          let catalogAuthorId = this.author?.catalogAuthorId;

          if (catalogAuthorId) {
            this.authorService.getCatalogAuthorDetailsById(catalogAuthorId).subscribe({
              next: (catalogResponse) => {
                if (catalogResponse.data) {
                  this.author!.catalogAuthor = catalogResponse.data;
                  this.authorBooks = this.author?.catalogAuthor?.books || [];

                  const bookIds = this.authorBooks.map(book => book.id);

                  console.log('Book IDs:', bookIds);
                }
              },
              error: (error) => {
                console.error('Error fetching catalog author details:', error);
                this.uiService.setCustomError('Error', error.message || 'Failed to load author details');
              }
            });
          }

          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching catalog author details:', error);
        this.uiService.setCustomError('Error', error.message || 'Failed to load author preferences');
        this.loading = false;
      }
    })
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



  // Utility methods
  getAuthorAge(): string {
    if (!this.author?.catalogAuthor?.birthDate) return '';

    const birthYear = new Date(this.author.catalogAuthor.birthDate).getFullYear();
    const currentYear = this.author.catalogAuthor.deathDate ? new Date(this.author.catalogAuthor.deathDate).getFullYear() : new Date().getFullYear();

    const age = currentYear - birthYear;
    return this.author.catalogAuthor.deathDate ? `(${age} years)` : `(Age ${age})`;
  }

  getAuthorInitials(): string {
    if (!this.author?.catalogAuthor) return '';

    return this.getInitials(this.author?.catalogAuthor?.name);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // formatDate(date: Date): string {
  //   return new Intl.DateTimeFormat('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   }).format(date);
  // }

  // formatShortDate(date: Date): string {
  //   return new Intl.DateTimeFormat('en-US', {
  //     year: 'numeric',
  //     month: 'short'
  //   }).format(date);
  // }

  openLink(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
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
    this.router.navigate(['/books/edit-book', bookId]);
  }

  navigateToAddBook() {
    this.router.navigate(['/books/add-book']);
  }

  confirmDeleteAuthor() {
    if (!this.author?.catalogAuthor) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${this.author.catalogAuthor.name}"? This action cannot be undone.`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteAuthor();
      }
    });
  }

  deleteAuthor() {
    if (!this.author?.catalogAuthor || !this.authorId) return;

    console.log(this.author, this.authorId);

    this.authorService.deleteUserAuthorPreference(this.authorId).subscribe({
      next: (response) => {
        if (response.data) {
          this.uiService.setCustomSuccess('Success', `Author "${this.author?.catalogAuthor?.name}" deleted successfully`);
          this.router.navigate(['/authors']);
        }
      },
      error: (error) => {
        console.error('Error deleting author:', error);
        this.uiService.setCustomError('Error', error.message || 'Failed to delete author');
      }
    });
  }

  // @TODO: Re-enable image upload when backend supports it
  // onImageUploaded(imageUrl: string) {
  //   if (this.author && this.author.id) {
  //     const updatedAuthor = {
  //       id: this.author.id,
  //       name: this.author.name,
  //       biography: this.author.biography,
  //       photoUrl: imageUrl,
  //       birthDate: this.author.birthDate,
  //       deathDate: this.author.deathDate,
  //       nationality: this.author.nationality,
  //       website: this.author.website,
  //       threadsUrl: this.author.threadsUrl,
  //       instagramUrl: this.author.instagramUrl,
  //       goodreadUrl: this.author.goodreadUrl,
  //       genres: this.author.genres,
  //       isActive: this.author.isActive,
  //       notes: this.author.notes
  //     };

  //     const success = this.authorService.updateAuthor(updatedAuthor);

  //     if (success) {
  //       this.author.photoUrl = imageUrl;
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Photo Updated',
  //         detail: 'Author photo has been updated successfully'
  //       });
  //     } else {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Failed to update author photo'
  //       });
  //     }
  //   }
  // }

  // @TODO: Re-enable image upload when backend supports it
  // onImageRemoved() {
  //   if (this.author && this.author.id) {
  //     const updatedAuthor = {
  //       id: this.author.id,
  //       name: this.author.name,
  //       biography: this.author.biography,
  //       photoUrl: undefined,
  //       birthDate: this.author.birthDate,
  //       deathDate: this.author.deathDate,
  //       nationality: this.author.nationality,
  //       website: this.author.website,
  //       threadsUrl: this.author.threadsUrl,
  //       instagramUrl: this.author.instagramUrl,
  //       goodreadUrl: this.author.goodreadUrl,
  //       genres: this.author.genres,
  //       isActive: this.author.isActive,
  //       notes: this.author.notes
  //     };

  //     const success = this.authorService.updateAuthor(updatedAuthor);

  //     if (success) {
  //       this.author.photoUrl = undefined;
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Photo Removed',
  //         detail: 'Author photo has been removed successfully'
  //       });
  //     } else {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Failed to remove author photo'
  //       });
  //     }
  //   }
  // }

  getPreferenceLevelClass(level: number): string {
    switch (level) {
      case 1: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
      case 2: return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 3: return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 4: return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 5: return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  }

  getPreferenceLevelLabel(level: number): string {
    switch (level) {
      case 1: return '💤 Not for Me';
      case 2: return '⚖️ Neutral';
      case 3: return '🙂 Interested';
      case 4: return '❤️ Favorite';
      case 5: return '💎 Top Favorite';
      default: return '💀 Unknown';
    }
  }
}
