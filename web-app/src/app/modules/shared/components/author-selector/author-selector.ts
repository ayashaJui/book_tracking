import { Component, Input, Output, EventEmitter, OnInit, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Author, AuthorCreateRequestDTO, CatalogAuthorCreateRequestDTO, CatalogAuthorDTO } from '../../../authors/models/author.model';
import { AuthorService } from '../../../authors/services/author.service';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { UiService } from '../../services/ui.service.service';

@Component({
  selector: 'app-author-selector',
  standalone: false,
  templateUrl: './author-selector.html',
  styleUrls: ['./author-selector.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AuthorSelectorComponent),
      multi: true
    }
  ]
})
export class AuthorSelectorComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = 'Select author...';
  @Input() multiple: boolean = false;
  @Input() showAddButton: boolean = true;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() showClear: boolean = true;
  @Input() filter: boolean = true;
  @Input() maxSelectedLabels: number = 3;

  @Output() authorSelected = new EventEmitter<CatalogAuthorDTO | CatalogAuthorDTO[]>();
  @Output() addNewAuthor = new EventEmitter<void>();
  @Output() viewAuthor = new EventEmitter<CatalogAuthorDTO>();

  @ViewChild('multiSelectRef') multiSelectRef!: MultiSelect;
  @ViewChild('dropdownRef') dropdownRef!: Select;

  authors: CatalogAuthorDTO[] = [];
  authorOptions: { label: string; value: number }[] = [];
  selectedAuthorIds: number | number[] | null = null;
  loading: boolean = false;

  // Author dialog properties
  showAddAuthorDialog: boolean = false;

  // Preference level options for the dialog
  preferenceLevelOptions = [
    { label: '💤 Not for Me', value: 1 },
    { label: '⚖️ Neutral', value: 2 },
    { label: '🙂 Interested', value: 3 },
    { label: '❤️ Favorite', value: 4 },
    { label: '💎 Top Favorite', value: 5 }
  ];

  // ControlValueAccessor properties
  private onChange = (value: any) => { };
  private onTouched = () => { };

  constructor(public authorService: AuthorService, private uiService: UiService) { }

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(callback?: () => void): void {
    this.loading = true;

    this.authorService.getAllCatalogAuthors().subscribe((response) => {
      if (response.data) {
        this.authors = response.data;
        this.authorOptions = this.authors.map(author => ({
          label: author.name,
          value: author.id!
        }));
        this.loading = false;

        // Execute callback if provided
        if (callback) {
          callback();
        }
      }
    })
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    // Convert author objects to IDs
    if (value) {
      if (this.multiple && Array.isArray(value)) {
        this.selectedAuthorIds = value.map(author =>
          typeof author === 'number' ? author : author.id
        );
      } else if (!this.multiple) {
        this.selectedAuthorIds = typeof value === 'number' ? value : value?.id;
      }
    } else {
      this.selectedAuthorIds = this.multiple ? [] : null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectionChange(event: any): void {
    this.selectedAuthorIds = event.value;

    // Convert IDs back to author objects for the output event
    let selectedAuthors: CatalogAuthorDTO | CatalogAuthorDTO[] | null;

    if (this.multiple && Array.isArray(this.selectedAuthorIds)) {
      selectedAuthors = this.selectedAuthorIds
        .map(id => this.authors.find(a => a.id === id))
        .filter(a => a !== undefined) as CatalogAuthorDTO[];
    } else if (!this.multiple && this.selectedAuthorIds !== null) {
      selectedAuthors = this.authors.find(a => a.id === this.selectedAuthorIds) || null;
    } else {
      selectedAuthors = this.multiple ? [] : null;
    }

    this.onChange(selectedAuthors);
    this.authorSelected.emit(selectedAuthors || undefined);
  }

  onAddNewAuthor(): void {
    this.showAddAuthorDialog = true;

    if (this.multiple && this.multiSelectRef) {
      this.multiSelectRef.hide();
    } else if (!this.multiple && this.dropdownRef) {
      this.dropdownRef.hide();
    }
  }

  onAddAuthorDialogSave(): void {
    if (!this.authorService.authorForm.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.authorService.authorForm.controls).forEach(key => {
        this.authorService.authorForm.get(key)?.markAsTouched();
      });
      this.uiService.setCustomError("Validation Error", "Please fill out all required fields.");
      return;
    }

    const formValue = this.authorService.authorForm.value;

    const newCatalogAuthor: CatalogAuthorCreateRequestDTO = {
      name: formValue.name.trim(),
      bio: formValue.bio || undefined,
      birthDate: formValue.birthDate || undefined,
      deathDate: formValue.deathDate || undefined,
      nationality: formValue.nationality || undefined,
      website: formValue.website || undefined,
      instagramUrl: formValue.instagramUrl || undefined,
      goodreadUrl: formValue.goodreadUrl || undefined,
      threadsUrl: formValue.threadsUrl || undefined,
    }

    const newAuthorPref: AuthorCreateRequestDTO = {
      userId: localStorage.getItem('userId') ? +localStorage.getItem('userId')! : 0,
      catalogAuthorId: 0, // Will be set server-side  
      preferenceLevel: formValue.preferenceLevel || 3,
      isFavorite: formValue.isFavorite || false,
      isExcluded: formValue.isExcluded || false,
      personalNotes: formValue.personalNotes || undefined,
    }
    console.log('New Catalog Author:', newCatalogAuthor);
    console.log('New Author Preference:', newAuthorPref);

    this.authorService.createCatalogAuthor(newCatalogAuthor).subscribe((response) => {
      if (response.data) {
        const newAuthor = response.data;

        newAuthorPref.catalogAuthorId = newAuthor.id!;
        this.authorService.createUserAuthorPreference(newAuthorPref).subscribe((res) => {
          if (res.data) {
            this.uiService.setCustomSuccess("Success", "Author created successfully.");

            // Close dialog and reset form
            this.showAddAuthorDialog = false;
            this.resetNewAuthorData();

            // Reload authors and auto-select the newly created one
            this.loadAuthors(() => {
              if (newAuthor.id) {
                if (this.multiple) {
                  const currentSelection = Array.isArray(this.selectedAuthorIds) ? this.selectedAuthorIds : [];
                  this.selectedAuthorIds = [...currentSelection, newAuthor.id];
                } else {
                  this.selectedAuthorIds = newAuthor.id;
                }

                // Convert IDs back to author objects for the output event
                let selectedAuthors: CatalogAuthorDTO | CatalogAuthorDTO[] | null;
                if (this.multiple && Array.isArray(this.selectedAuthorIds)) {
                  selectedAuthors = this.selectedAuthorIds
                    .map(id => this.authors.find(a => a.id === id))
                    .filter(a => a !== undefined) as CatalogAuthorDTO[];
                } else if (!this.multiple && this.selectedAuthorIds !== null) {
                  selectedAuthors = this.authors.find(a => a.id === this.selectedAuthorIds) || null;
                } else {
                  selectedAuthors = this.multiple ? [] : null;
                }

                // Notify the form control and trigger validation
                this.onChange(selectedAuthors);
                this.onTouched();
                this.authorSelected.emit(selectedAuthors || undefined);
                this.addNewAuthor.emit();
              }
            });
          }
        });
      }
    });
  }

  onAddAuthorDialogCancel(): void {
    this.showAddAuthorDialog = false;
    this.resetNewAuthorData();
  }

  private resetNewAuthorData(): void {
    this.authorService.authorForm.reset()
  }

  trackByAuthorId(index: number, option: { label: string; value: number }): number {
    return option.value;
  }
}
