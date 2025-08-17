import { Component, EventEmitter, Input, Output, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GenreService } from '../services/genre.service';
import { MessageService } from 'primeng/api';
import { MultiSelect } from 'primeng/multiselect';

@Component({
  selector: 'app-genre-selector',
  standalone: false,
  template: `
    <div class="space-y-2">
      <!-- Multi Selection Mode (Always) -->
      <p-multiSelect
        #multiSelectRef
        [options]="genreOptions"
        [ngModel]="value"
        [placeholder]="placeholder"
        class="w-full"
        [showHeader]="true"
        (onChange)="onSelectionChange($event)"
      >
        <ng-template pTemplate="header">
          <div class="flex items-center justify-between px-3 py-2 border-b">
            <span class="font-medium">Select Genres</span>
            <button
              type="button"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              (click)="showAddGenreForm()"
              *ngIf="!showAddForm"
            >
              + Add New
            </button>
          </div>
        </ng-template>
      </p-multiSelect>

      <!-- Selected Genres Display -->
      <div *ngIf="value && value.length > 0" class="flex flex-wrap gap-2 mt-2">
        <span
          *ngFor="let genre of value"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
        >
          {{ genre }}
          <button
            type="button"
            class="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
            (click)="removeGenre(genre)"
          >
            ×
          </button>
        </span>
      </div>

      <!-- Add New Genre Form -->
      <div *ngIf="showAddForm" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-200">Add New Genre</h4>
          <div class="flex items-center gap-2">
            <input
              type="text"
              [(ngModel)]="newGenreName"
              [ngModelOptions]="{ standalone: true }"
              placeholder="Enter genre name"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              (keyup.enter)="createNewGenre()"
              maxlength="50"
            />
            <button
              type="button"
              pButton
              class="p-button-success p-button-sm"
              (click)="createNewGenre()"
              [disabled]="!canCreateGenre()"
              label="Add"
            ></button>
            <button
              type="button"
              pButton
              class="p-button-secondary p-button-sm"
              (click)="cancelAddGenre()"
              label="Cancel"
            ></button>
          </div>
          <small class="text-red-500" *ngIf="newGenreName && genreExists(newGenreName)">
            Genre "{{ newGenreName }}" already exists
          </small>
        </div>
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenreSelectorComponent),
      multi: true
    }
  ],
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class GenreSelectorComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Select genre(s)';
  @Output() genreCreated = new EventEmitter<string>();
  @ViewChild('multiSelectRef') multiSelectRef!: MultiSelect;

  value: string[] = [];
  genreOptions: { label: string; value: string }[] = [];
  newGenreName: string = '';
  showAddForm: boolean = false;

  // ControlValueAccessor methods
  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(
    private genreService: GenreService,
    private messageService: MessageService
  ) {
    this.loadGenreOptions();
    
    // Subscribe to genre changes
    this.genreService.genres$.subscribe(() => {
      this.loadGenreOptions();
    });
  }

  loadGenreOptions(): void {
    this.genreOptions = this.genreService.getGenreOptions();
  }

  onSelectionChange(event: any): void {
    this.value = event.value || [];
    this.onChange(this.value);
    this.onTouched();
  }

  showAddGenreForm(): void {
    this.showAddForm = true;
    // Close the dropdown
    if (this.multiSelectRef) {
      this.multiSelectRef.hide();
    }
  }

  removeGenre(genre: string): void {
    this.value = this.value.filter(g => g !== genre);
    this.onChange(this.value);
  }

  canCreateGenre(): boolean {
    return !!(this.newGenreName && 
           this.newGenreName.trim().length > 0 && 
           !this.genreExists(this.newGenreName.trim()));
  }

  genreExists(name: string): boolean {
    return this.genreService.genreExists(name);
  }

  createNewGenre(): void {
    if (!this.canCreateGenre()) {
      return;
    }

    const trimmedName = this.newGenreName.trim();
    
    try {
      const newGenre = this.genreService.addGenre(trimmedName);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Genre "${newGenre.name}" created successfully`,
        life: 3000
      });

      // Add the new genre to selection
      if (!this.value.includes(newGenre.name)) {
        this.value = [...this.value, newGenre.name];
        this.onChange(this.value);
      }

      this.genreCreated.emit(newGenre.name);

      // Reset form
      this.cancelAddGenre();
      
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create genre',
        life: 3000
      });
    }
  }

  cancelAddGenre(): void {
    this.newGenreName = '';
    this.showAddForm = false;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    // Always ensure we have an array
    if (Array.isArray(value)) {
      this.value = value;
    } else if (value && typeof value === 'string') {
      this.value = [value];
    } else {
      this.value = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
}
