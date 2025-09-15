import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Author } from '../../../authors/models/author.model';
import { AuthorService } from '../../../authors/services/author.service';

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
export class AuthorSelectorComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() placeholder: string = 'Select author...';
  @Input() multiple: boolean = false;
  @Input() showAddButton: boolean = true;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() showClear: boolean = true;
  @Input() filter: boolean = true;
  @Input() maxSelectedLabels: number = 3;
  
  @Output() authorSelected = new EventEmitter<Author | Author[]>();
  @Output() addNewAuthor = new EventEmitter<void>();
  @Output() viewAuthor = new EventEmitter<Author>();

  authors: Author[] = [];
  filteredAuthors: Author[] = [];
  selectedAuthors: Author | Author[] | null = null;
  searchTerm: string = '';
  loading: boolean = false;
  showDropdown: boolean = false;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // ControlValueAccessor properties
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private authorService: AuthorService) {
    // Setup search debouncing
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.filterAuthors(searchTerm);
      });
  }

  ngOnInit(): void {
    this.loadAuthors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.selectedAuthors = value;
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

  private loadAuthors(): void {
    this.loading = true;
    this.authorService.authors$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (authors: Author[]) => {
          this.authors = authors;
          this.filteredAuthors = [...authors];
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading authors:', error);
          this.loading = false;
        }
      });
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value;
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  private filterAuthors(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredAuthors = [...this.authors];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredAuthors = this.authors.filter(author =>
      author.name.toLowerCase().includes(term) ||
      (author.biography && author.biography.toLowerCase().includes(term)) ||
      (author.nationality && author.nationality.toLowerCase().includes(term)) ||
      (author.genres && author.genres.some(genre => genre.toLowerCase().includes(term)))
    );
  }

  onAuthorSelect(author: Author): void {
    if (this.multiple) {
      const currentSelection = Array.isArray(this.selectedAuthors) ? this.selectedAuthors : [];
      const isSelected = currentSelection.some(a => a.id === author.id);
      
      if (!isSelected) {
        this.selectedAuthors = [...currentSelection, author];
      }
    } else {
      this.selectedAuthors = author;
      this.showDropdown = false;
    }

    this.onChange(this.selectedAuthors);
    this.onTouched();
    this.authorSelected.emit(this.selectedAuthors || undefined);
  }

  onAuthorRemove(author: Author): void {
    if (this.multiple && Array.isArray(this.selectedAuthors)) {
      this.selectedAuthors = this.selectedAuthors.filter(a => a.id !== author.id);
      this.onChange(this.selectedAuthors);
      this.authorSelected.emit(this.selectedAuthors || undefined);
    }
  }

  onClear(): void {
    this.selectedAuthors = this.multiple ? [] : null;
    this.onChange(this.selectedAuthors);
    this.authorSelected.emit(this.selectedAuthors || undefined);
  }

  onAddNewAuthor(): void {
    this.addNewAuthor.emit();
  }

  onViewAuthor(author: Author, event: Event): void {
    event.stopPropagation();
    this.viewAuthor.emit(author);
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.showDropdown = !this.showDropdown;
      if (this.showDropdown) {
        this.onTouched();
      }
    }
  }

  getDisplayValue(): string {
    if (!this.selectedAuthors) return '';

    if (this.multiple && Array.isArray(this.selectedAuthors)) {
      if (this.selectedAuthors.length === 0) return '';
      if (this.selectedAuthors.length <= this.maxSelectedLabels) {
        return this.selectedAuthors.map(a => a.name).join(', ');
      }
      return `${this.selectedAuthors.length} authors selected`;
    }

    if (!this.multiple && this.selectedAuthors && !Array.isArray(this.selectedAuthors)) {
      return this.selectedAuthors.name;
    }

    return '';
  }

  getSelectedAuthorsArray(): Author[] {
    if (this.multiple && Array.isArray(this.selectedAuthors)) {
      return this.selectedAuthors;
    }
    return [];
  }

  isAuthorSelected(author: Author): boolean {
    if (this.multiple && Array.isArray(this.selectedAuthors)) {
      return this.selectedAuthors.some(a => a.id === author.id);
    }
    if (!this.multiple && this.selectedAuthors && !Array.isArray(this.selectedAuthors)) {
      return this.selectedAuthors.id === author.id;
    }
    return false;
  }

  trackByAuthorId(index: number, author: Author): number {
    return author.id || index;
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getSingleAuthor(): Author | null {
    if (!this.multiple && this.selectedAuthors && !Array.isArray(this.selectedAuthors)) {
      return this.selectedAuthors;
    }
    return null;
  }
}
