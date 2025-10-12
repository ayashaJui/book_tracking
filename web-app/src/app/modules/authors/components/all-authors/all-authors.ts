import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';

import { Author, CatalogAuthorDTO, UserAuthorPreferenceDTO } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
import { UiService } from '../../../shared/services/ui.service.service';
import { CatalogApiService } from '../../../shared/services/catalog.api.service';

@Component({
  selector: 'app-all-authors',
  standalone: false,
  templateUrl: './all-authors.html',
  styleUrl: './all-authors.scss',
  providers: [MessageService, ConfirmationService]
})
export class AllAuthorsComponent implements OnInit {
  authors: UserAuthorPreferenceDTO[] = [];
  filteredAuthors: UserAuthorPreferenceDTO[] = [];
  loading = false;
  // pagedAuthors

  // Search and filtering
  searchTerm = '';
  selectedGenre = '';
  showActiveOnly = false;

  // View options
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: 'name' | 'totalBooks' | 'averageRating' | 'createdAt' = 'name';

  // Pagination
  first = 0;
  size = 10;
  page = 1;
  totalRecords = 0;
  totalBooks = 0;

  // Selected author for actions
  selectedAuthor: Author | null = null;

  // Subscriptions
  // private authorsSubscription: Subscription | null = null;

  // Genre options for filtering
  genreOptions: string[] = [];

  constructor(
    private authorService: AuthorService,
    private router: Router,
    private messageService: MessageService, private catalogApiService: CatalogApiService,
    private confirmationService: ConfirmationService, private uiService: UiService
  ) { }

  ngOnInit() {
    let userId = localStorage.getItem('userId');

    if (userId) {
      this.loadAuthors(parseInt(userId));
    }
    // this.extractGenreOptions();
  }

  // ngOnDestroy() {
  //   if (this.authorsSubscription) {
  //     this.authorsSubscription.unsubscribe();
  //   }
  // }

  loadAuthors(userId: number) {
    this.loading = true;

    this.authorService.getUserAuthorPreferences(userId, 1, 10).subscribe({
      next: (response) => {
        if (response.data) {
          let pagedData = response.data;
          this.authors = pagedData.content;

          let ids = pagedData.content.map(pref => pref.catalogAuthorId).filter(id => id !== undefined) as number[];

          this.catalogApiService.getCatalogAuthorDetails(ids).subscribe({
            next: (catalogResponse) => {
              if (catalogResponse.data) {
                let catalogAuthors: CatalogAuthorDTO[] = catalogResponse.data;

                this.authors.forEach((author) => {
                  author.catalogAuthor = catalogAuthors.find(ca => ca.id === author.catalogAuthorId) || undefined;
                })
              }
            },
            error: (error) => {
              console.error('Error fetching catalog author details:', error);
              this.uiService.setCustomError('Error', error.message || 'Failed to load author preferences');
              this.loading = false;
            }
          })

          // TODO: change for filtering
          this.filteredAuthors = [...this.authors];
          this.applyFilters();
          this.totalRecords = pagedData.totalElements;
          // console.log('User author preferences:', this.authors);
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading user author preferences:', error);
        this.uiService.setCustomError('Error', error.message || 'Failed to load author preferences');
        this.loading = false;
      }
    });
  }

  getTotalBooks(): number {
    return this.authors.reduce((total, author) => total + (author.catalogAuthor?.totalBooks || 0), 0);
  }

  // extractGenreOptions() {
  //   const allGenres = new Set<string>();
  //   this.authors.forEach(author => {
  //     author.genres?.forEach(genre => allGenres.add(genre));
  //   });
  //   this.genreOptions = Array.from(allGenres).sort();
  // }

  applyFilters() {
    let filtered = [...this.authors];

    // Apply search filter
    // if (this.searchTerm.trim()) {
    //   filtered = this.authorService.searchAuthors(this.searchTerm);
    // }

    // Apply genre filter
    // if (this.selectedGenre) {
    //   filtered = filtered.filter(author =>
    //     author.genres?.includes(this.selectedGenre)
    //   );
    // }

    // Apply active filter
    // if (this.showActiveOnly) {
    //   filtered = filtered.filter(author => author.isActive !== false);
    // }

    // Apply sorting
    // this.filteredAuthors = this.sortAuthors(filtered);
    this.totalRecords = this.filteredAuthors.length;

    // Reset pagination
    this.first = 0;
  }

  // sortAuthors(authors: UserAuthorPreferenceDTO[]): UserAuthorPreferenceDTO[] {
  //   return [...authors].sort((a, b) => {
  //     switch (this.sortBy) {
  //       case 'name':
  //         return a.catalogAuthor.name.localeCompare(b.catalogAuthor.name);
  //       case 'totalBooks':
  //         return (b.totalBooks || 0) - (a.totalBooks || 0);
  //       case 'averageRating':
  //         return (b.averageRating || 0) - (a.averageRating || 0);
  //       case 'createdAt':
  //         return b.createdAt.getTime() - a.createdAt.getTime();
  //       default:
  //         return 0;
  //     }
  //   });
  // }

  onSearchChange() {
    this.applyFilters();
  }

  onGenreChange() {
    this.applyFilters();
  }

  onActiveFilterChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedGenre = '';
    this.showActiveOnly = false;
    this.applyFilters();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  // Navigation methods
  navigateToAdd() {
    this.router.navigate(['/authors/add']);
  }

  navigateToDetails(authorId: number) {
    this.router.navigate(['/authors', authorId]);
  }

  navigateToEdit(authorId: number) {
    this.router.navigate(['/authors/edit', authorId]);
  }

  // CRUD operations
  editAuthor(author: Author) {
    this.navigateToEdit(author.id!);
  }

  confirmDeleteAuthor(author: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${author.catalogAuthor.name}"? This action cannot be undone.`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteAuthor(author);
      }
    });
  }

  deleteAuthor(author: Author) {
    const success = this.authorService.removeAuthor(author.id!);

    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Author "${author.name}" deleted successfully`
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete author'
      });
    }
  }

  // Utility methods
  getAuthorAge(author: any): string {
    if (!author.birthDate) return '';

    const birthYear = new Date(author.birthDate).getFullYear();
    const currentYear = author.deathDate ? new Date(author.deathDate).getFullYear() : new Date().getFullYear();

    const age = currentYear - birthYear;
    return author.deathDate ? `(${age} years)` : `(Age ${age})`;
  }

  getAuthorInitials(authorName: string): string {
    return authorName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  // Pagination
  onPageChange(event: any) {
    this.page = event.page + 1;
    this.size = event.rows;
  }

  get paginatedAuthors(): UserAuthorPreferenceDTO[] {
    const start = (this.page - 1) * this.size;
    const end = start + this.size;

    return this.filteredAuthors.slice(start, end);
  }

  get isEmpty(): boolean {
    return this.filteredAuthors.length === 0;
  }

  get hasFilters(): boolean {
    return !!(this.searchTerm || this.selectedGenre || this.showActiveOnly);
  }

  get genreSelectOptions() {
    return this.genreOptions.map(g => ({ label: g, value: g }));
  }

  // getTotalBooks(): number {
  //   return this.authors.reduce((total, author) => total + (author.totalBooks || 0), 0);
  // }
}
