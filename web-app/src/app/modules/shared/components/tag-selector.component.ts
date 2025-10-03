import {
    Component,
    EventEmitter,
    Input,
    Output,
    forwardRef,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MultiSelect } from 'primeng/multiselect';

@Component({
    selector: 'app-tag-selector',
    standalone: false,
    template: `
    <div class="space-y-2">
      <!-- Multi Selection Mode -->
      <p-multiSelect
        #multiSelectRef
        [options]="tagOptions"
        [ngModel]="value"
        [placeholder]="placeholder"
        class="w-full"
        [showHeader]="true"
        (onChange)="onSelectionChange($event)"
        [filter]="true"
        filterPlaceHolder="Search tags..."
      >
        <ng-template pTemplate="header">
          <div class="flex items-center justify-between px-3 py-2 border-b">
            <span class="font-medium">Select Personal Tags</span>
            <button
              type="button"
              class="text-purple-600 hover:text-purple-800 text-sm font-medium"
              (click)="showAddTagForm()"
              *ngIf="!showAddForm"
            >
              + Add Custom Tag
            </button>
          </div>
        </ng-template>
      </p-multiSelect>

      <!-- Selected Tags Display -->
      <div *ngIf="value && value.length > 0" class="flex flex-wrap gap-2 mt-2">
        <span
          *ngFor="let tag of value"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700"
        >
          <i class="pi pi-tag text-xs mr-1"></i>
          {{ tag }}
          <button
            type="button"
            class="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100"
            (click)="removeTag(tag)"
          >
            ×
          </button>
        </span>
      </div>

      <!-- Add New Tag Form -->
      <div
        *ngIf="showAddForm"
        class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700"
      >
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <i class="pi pi-tag text-purple-500"></i>
            Add Personal Tag
          </h4>
          <div class="flex items-center gap-2">
            <input
              type="text"
              [(ngModel)]="newTagName"
              [ngModelOptions]="{ standalone: true }"
              placeholder="e.g., comfort-read, vacation-book"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              (keyup.enter)="createNewTag()"
              maxlength="30"
            />
            <button
              type="button"
              pButton
              class="p-button-success p-button-sm"
              (click)="createNewTag()"
              [disabled]="!canCreateTag()"
              label="Add"
            ></button>
            <button
              type="button"
              pButton
              class="p-button-secondary p-button-sm"
              (click)="cancelAddTag()"
              label="Cancel"
            ></button>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            <i class="pi pi-info-circle mr-1"></i>
            Create personal tags like "comfort-read", "vacation-book", "reread-worthy"
          </div>
          <small
            class="text-red-500"
            *ngIf="newTagName && tagExists(newTagName)"
          >
            Tag "{{ newTagName }}" already exists
          </small>
        </div>
      </div>

      <!-- Popular Tags Suggestions -->
      <div *ngIf="popularTags.length > 0 && !showAddForm" class="mt-3">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
          <i class="pi pi-star mr-1"></i>
          Popular tags:
        </div>
        <div class="flex flex-wrap gap-1">
          <button
            *ngFor="let tag of popularTags"
            type="button"
            class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
            (click)="addPopularTag(tag)"
            [disabled]="value.includes(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TagSelectorComponent),
            multi: true,
        },
    ],
    styles: [
        `
      :host {
        display: block;
      }
    `,
    ],
})
export class TagSelectorComponent implements ControlValueAccessor {
    @Input() placeholder: string = 'Select personal tags';
    @Input() entityType: string = 'book'; // book, series, quote, review
    @Output() tagCreated = new EventEmitter<string>();
    @ViewChild('multiSelectRef') multiSelectRef!: MultiSelect;

    value: string[] = [];
    tagOptions: { label: string; value: string }[] = [];
    newTagName: string = '';
    showAddForm: boolean = false;

    // Popular tag suggestions based on entity type
    popularTags: string[] = [
        'comfort-read',
        'vacation-book',
        'reread-worthy',
        'emotional',
        'quick-read',
        'deep-thinking',
        'light-hearted',
        'page-turner',
        'thought-provoking',
        'escapist',
        'educational',
        'inspiring'
    ];

    // ControlValueAccessor methods
    onChange = (value: any) => { };
    onTouched = () => { };

    constructor(private messageService: MessageService) {
        this.loadTagOptions();
    }

    loadTagOptions(): void {
        // In a real app, this would load from the tagging service
        // For now, we'll use a combination of popular tags and any custom tags
        const allTags = [...this.popularTags];

        this.tagOptions = allTags.map(tag => ({
            label: tag,
            value: tag
        }));
    }

    onSelectionChange(event: any): void {
        this.value = event.value || [];
        this.onChange(this.value);
        this.onTouched();
    }

    showAddTagForm(): void {
        this.showAddForm = true;
        // Close the dropdown
        if (this.multiSelectRef) {
            this.multiSelectRef.hide();
        }
    }

    removeTag(tag: string): void {
        this.value = this.value.filter((t) => t !== tag);
        this.onChange(this.value);
    }

    addPopularTag(tag: string): void {
        if (!this.value.includes(tag)) {
            this.value = [...this.value, tag];
            this.onChange(this.value);
        }
    }

    canCreateTag(): boolean {
        const trimmed = this.newTagName?.trim().toLowerCase();
        return !!(
            trimmed &&
            trimmed.length > 0 &&
            trimmed.length <= 30 &&
            !this.tagExists(trimmed) &&
            /^[a-z0-9-]+$/.test(trimmed) // Only lowercase, numbers, and hyphens
        );
    }

    tagExists(name: string): boolean {
        const trimmed = name.trim().toLowerCase();
        return this.tagOptions.some(option =>
            option.value.toLowerCase() === trimmed
        ) || this.value.some(tag =>
            tag.toLowerCase() === trimmed
        );
    }

    createNewTag(): void {
        if (!this.canCreateTag()) {
            return;
        }

        const trimmedName = this.newTagName.trim().toLowerCase();

        // Add to options
        this.tagOptions.push({
            label: trimmedName,
            value: trimmedName
        });

        // Add to selection
        if (!this.value.includes(trimmedName)) {
            this.value = [...this.value, trimmedName];
            this.onChange(this.value);
        }

        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Custom tag "${trimmedName}" created successfully`,
            life: 3000,
        });

        this.tagCreated.emit(trimmedName);
        this.cancelAddTag();
    }

    cancelAddTag(): void {
        this.newTagName = '';
        this.showAddForm = false;
    }

    // ControlValueAccessor implementation
    writeValue(value: any): void {
        this.value = value || [];
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