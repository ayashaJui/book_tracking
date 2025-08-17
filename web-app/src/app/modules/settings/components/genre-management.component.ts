import { Component, OnInit } from '@angular/core';
import { GenreService, Genre } from '../../shared/services/genre.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-genre-management',
  standalone: false,
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div class="max-w-4xl mx-auto px-4">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center gap-4 mb-4">
            <div
              class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <i class="pi pi-tags text-white text-xl"></i>
            </div>
            <div>
              <h1
                class="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white tracking-tight"
              >
                Genre Management
              </h1>
              <p
                class="text-gray-600 dark:text-gray-300 text-sm lg:text-base mt-1"
              >
                Manage your book genres and categories
              </p>
            </div>
          </div>
        </div>

        <!-- Add New Genre Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            <i class="pi pi-plus-circle text-green-600 mr-2"></i>
            Add New Genre
          </h2>

          <div class="flex items-center gap-4">
            <div class="flex-1">
              <input
                type="text"
                [(ngModel)]="newGenreName"
                placeholder="Enter genre name"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                (keyup.enter)="addGenre()"
                maxlength="50"
              />
            </div>
            <button
              pButton
              type="button"
              icon="pi pi-plus"
              label="Add Genre"
              class="p-button-success"
              (click)="addGenre()"
              [disabled]="!canAddGenre()"
            ></button>
          </div>

          <small
            class="text-red-500 mt-2 block"
            *ngIf="newGenreName && genreExists(newGenreName)"
          >
            Genre "{{ newGenreName }}" already exists
          </small>
        </div>

        <!-- Genres List -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
              <i class="pi pi-list text-blue-600 mr-2"></i>
              All Genres ({{ genres.length }})
            </h2>

            <!-- Search -->
            <div class="flex items-center gap-4">
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="searchTerm"
                  placeholder="Search genres..."
                  class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <i
                  class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                ></i>
              </div>
            </div>
          </div>

          <!-- Genres Grid -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            *ngIf="filteredGenres.length > 0"
          >
            <div
              *ngFor="let genre of filteredGenres"
              class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 group"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-800 dark:text-white">
                  {{ genre.name }}
                </span>
                <div
                  class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    pButton
                    type="button"
                    icon="pi pi-pencil"
                    class="p-button-text p-button-sm p-button-rounded"
                    (click)="editGenre(genre)"
                    pTooltip="Edit genre"
                  ></button>
                  <button
                    pButton
                    type="button"
                    icon="pi pi-trash"
                    class="p-button-text p-button-sm p-button-rounded p-button-danger"
                    (click)="confirmDeleteGenre(genre)"
                    pTooltip="Delete genre"
                  ></button>
                </div>
              </div>

              <div class="text-xs text-gray-500 dark:text-gray-400">
                Created: {{ genre.createdAt | date : 'short' }}
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="filteredGenres.length === 0" class="text-center py-12">
            <div
              class="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <i class="pi pi-search text-white text-3xl"></i>
            </div>
            <h3
              class="text-xl font-semibold text-gray-800 dark:text-white mb-2"
            >
              {{
                searchTerm ? 'No matching genres found' : 'No genres available'
              }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              {{
                searchTerm
                  ? 'Try adjusting your search terms.'
                  : 'Start by adding your first genre above!'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Genre Dialog -->
    <p-dialog
      header="Edit Genre"
      [(visible)]="showEditDialog"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '400px' }"
      styleClass="rounded-xl overflow-hidden"
    >
      <div class="space-y-4" *ngIf="editingGenre">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Genre Name
          </label>
          <input
            type="text"
            [(ngModel)]="editGenreName"
            placeholder="Enter genre name"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxlength="50"
          />
          <small
            class="text-red-500 mt-1 block"
            *ngIf="
              editGenreName &&
              editGenreName !== editingGenre.name &&
              genreExists(editGenreName)
            "
          >
            Genre "{{ editGenreName }}" already exists
          </small>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <button
            pButton
            type="button"
            label="Cancel"
            class="p-button-text"
            (click)="cancelEdit()"
          ></button>
          <button
            pButton
            type="button"
            label="Save"
            class="p-button-success"
            (click)="saveEdit()"
            [disabled]="!canSaveEdit()"
          ></button>
        </div>
      </ng-template>
    </p-dialog>

    <!-- Confirmation Dialog -->
    <p-confirmDialog></p-confirmDialog>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class GenreManagementComponent implements OnInit {
  genres: Genre[] = [];
  filteredGenres: Genre[] = [];
  newGenreName: string = '';
  searchTerm: string = '';

  showEditDialog: boolean = false;
  editingGenre: Genre | null = null;
  editGenreName: string = '';

  constructor(
    private genreService: GenreService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadGenres();

    // Subscribe to genre changes
    this.genreService.genres$.subscribe((genres) => {
      this.genres = genres;
      this.filterGenres();
    });
  }

  loadGenres() {
    this.genres = this.genreService.getGenres();
    this.filterGenres();
  }

  filterGenres() {
    if (!this.searchTerm.trim()) {
      this.filteredGenres = [...this.genres];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredGenres = this.genres.filter((genre) =>
        genre.name.toLowerCase().includes(searchLower)
      );
    }
  }

  canAddGenre(): boolean {
    return !!(
      this.newGenreName &&
      this.newGenreName.trim().length > 0 &&
      !this.genreExists(this.newGenreName.trim())
    );
  }

  genreExists(name: string): boolean {
    return this.genreService.genreExists(name);
  }

  addGenre() {
    if (!this.canAddGenre()) {
      return;
    }

    const trimmedName = this.newGenreName.trim();

    try {
      this.genreService.addGenre(trimmedName);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Genre "${trimmedName}" added successfully`,
        life: 3000,
      });

      this.newGenreName = '';
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add genre',
        life: 3000,
      });
    }
  }

  editGenre(genre: Genre) {
    this.editingGenre = genre;
    this.editGenreName = genre.name;
    this.showEditDialog = true;
  }

  canSaveEdit(): boolean {
    return !!(
      this.editGenreName &&
      this.editGenreName.trim().length > 0 &&
      this.editGenreName.trim() !== this.editingGenre?.name &&
      !this.genreExists(this.editGenreName.trim())
    );
  }

  saveEdit() {
    if (!this.editingGenre || !this.canSaveEdit()) {
      return;
    }

    const trimmedName = this.editGenreName.trim();

    const success = this.genreService.updateGenre(
      this.editingGenre.id,
      trimmedName
    );

    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Genre updated to "${trimmedName}"`,
        life: 3000,
      });

      this.cancelEdit();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update genre',
        life: 3000,
      });
    }
  }

  cancelEdit() {
    this.showEditDialog = false;
    this.editingGenre = null;
    this.editGenreName = '';
  }

  confirmDeleteGenre(genre: Genre) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the genre "${genre.name}"? This action cannot be undone.`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteGenre(genre);
      },
    });
  }

  deleteGenre(genre: Genre) {
    const success = this.genreService.removeGenre(genre.id);

    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Genre "${genre.name}" deleted successfully`,
        life: 3000,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete genre',
        life: 3000,
      });
    }
  }

  // Watch for search term changes
  ngDoCheck() {
    // Simple change detection for search
    this.filterGenres();
  }
}
