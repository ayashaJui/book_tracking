import {
    Component,
    EventEmitter,
    Input,
    Output,
    forwardRef,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GenreService } from '../../services/genre.service';
import { MessageService } from 'primeng/api';
import { MultiSelect } from 'primeng/multiselect';
import { Genre, CatalogGenre, UserGenrePreference } from '../../models/genre.model';

@Component({
    selector: 'app-genre-selector',
    standalone: false,
    templateUrl: './genre-selector.component.html',
    styleUrls: ['./genre-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GenreSelectorComponent),
            multi: true,
        },
    ],
})
export class GenreSelectorComponent implements ControlValueAccessor {
    @Input() placeholder: string = 'Select genre(s)';
    @Input() showPreferences: boolean = false; // Whether to show preference options
    @Input() userId: number = 1; // Current user ID (should come from auth service)
    @Input() hierarchical: boolean = false; // Whether to show hierarchical structure
    @Output() genreCreated = new EventEmitter<string>();
    @Output() preferenceUpdated = new EventEmitter<UserGenrePreference>();
    @ViewChild('multiSelectRef') multiSelectRef!: MultiSelect;

    value: string[] = [];
    genreOptions: { label: string; value: string; level?: number }[] = [];
    newGenreName: string = '';
    newGenreDescription: string = '';
    newGenreParentId: number | null = null;
    isGenreActive: boolean = true;
    showAddForm: boolean = false;
    showPreferenceDialog: boolean = false;
    selectedGenreForPreference: Genre | null = null;

    // Preference form data
    preferenceLevel: number = 3;
    isExcluded: boolean = false;
    preferenceNotes: string = '';

    // ControlValueAccessor methods
    onChange = (value: any) => { };
    onTouched = () => { };

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
        if (this.hierarchical) {
            this.genreOptions = this.genreService.getHierarchicalGenreOptions();
        } else {
            this.genreOptions = this.genreService.getGenreOptions().map(opt => ({
                ...opt,
                level: 0
            }));
        }
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
        this.value = this.value.filter((g) => g !== genre);
        this.onChange(this.value);
    }

    canCreateGenre(): boolean {
        return !!(
            this.newGenreName &&
            this.newGenreName.trim().length > 0 &&
            !this.genreExists(this.newGenreName.trim()) &&
            this.preferenceLevel &&
            this.preferenceLevel >= 1 &&
            this.preferenceLevel <= 5
        );
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
            // Create catalog genre with all database fields
            const newCatalogGenreData: Omit<CatalogGenre, 'id' | 'createdAt' | 'updatedAt'> = {
                name: trimmedName,
                description: this.newGenreDescription.trim() || undefined,
                parentGenreId: this.newGenreParentId || undefined,
                isActive: this.isGenreActive
            };

            const newGenre = this.genreService.addCatalogGenre(newCatalogGenreData);

            // Create user preference with all fields
            const userPreferenceData: Omit<UserGenrePreference, 'id' | 'createdAt' | 'updatedAt'> = {
                userId: this.userId,
                catalogGenreId: newGenre.id,
                preferenceLevel: this.preferenceLevel,
                isExcluded: this.isExcluded,
                notes: this.preferenceNotes.trim() || undefined
            };

            const userPreference = this.genreService.setUserGenrePreference(userPreferenceData);

            this.messageService.add({
                severity: 'success',
                summary: 'Genre Created',
                detail: `"${newGenre.name}" created with preference level ${this.preferenceLevel}/5`,
                life: 3000,
            });

            // Add the new genre to selection
            if (!this.value.includes(newGenre.name)) {
                this.value = [...this.value, newGenre.name];
                this.onChange(this.value);
            }

            this.genreCreated.emit(newGenre.name);

            // Emit preference update
            this.preferenceUpdated.emit(userPreference as UserGenrePreference);

            // Reset form
            this.cancelAddGenre();
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create genre',
                life: 3000,
            });
        }
    }

    cancelAddGenre(): void {
        this.newGenreName = '';
        this.newGenreDescription = '';
        this.newGenreParentId = null;
        this.isGenreActive = true;
        this.preferenceLevel = 3; // Reset to default
        this.isExcluded = false;
        this.preferenceNotes = '';
        this.showAddForm = false;
    }

    // New methods for preference management
    openPreferenceDialog(genreName: string): void {
        const genre = this.genreService.getGenreByName(genreName);
        if (!genre) return;

        this.selectedGenreForPreference = genre;
        this.preferenceLevel = genre.preferenceLevel || 3;
        this.isExcluded = genre.isExcluded || false;
        this.preferenceNotes = genre.notes || '';
        this.showPreferenceDialog = true;
    }

    savePreference(): void {
        if (!this.selectedGenreForPreference) return;

        try {
            const preference = this.genreService.setUserGenrePreference({
                userId: this.userId,
                catalogGenreId: this.selectedGenreForPreference.id,
                preferenceLevel: this.preferenceLevel,
                isExcluded: this.isExcluded,
                notes: this.preferenceNotes.trim() || undefined
            });

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `Preference for "${this.selectedGenreForPreference.name}" saved`,
                life: 3000,
            });

            this.preferenceUpdated.emit(preference);
            this.closePreferenceDialog();
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save preference',
                life: 3000,
            });
        }
    }

    closePreferenceDialog(): void {
        this.showPreferenceDialog = false;
        this.selectedGenreForPreference = null;
        this.preferenceLevel = 3;
        this.isExcluded = false;
        this.preferenceNotes = '';
    }

    getGenreIcon(genre: Genre): string {
        if (genre.isExcluded) return 'pi pi-ban text-red-500';
        if (genre.preferenceLevel === 5) return 'pi pi-heart-fill text-red-500';
        if (genre.preferenceLevel === 4) return 'pi pi-heart text-pink-500';
        if (genre.preferenceLevel === 1) return 'pi pi-thumbs-down text-gray-500';
        return '';
    }

    getParentGenreOptions(): { label: string; value: number }[] {
        const rootGenres = this.genreService.getCatalogGenres().filter(g => !g.parentGenreId && g.isActive);
        return rootGenres.map(genre => ({
            label: genre.name,
            value: genre.id
        }));
    }

    getGenreByName(name: string): Genre | undefined {
        return this.genreService.getGenreByName(name);
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