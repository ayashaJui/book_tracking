import {
    Component,
    EventEmitter,
    Input,
    Output,
    forwardRef,
    ViewChild,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GenreSelectorService } from '../../services/genre.selector.service';
import { MessageService } from 'primeng/api';
import { MultiSelect } from 'primeng/multiselect';
import { Genre, CatalogGenre, UserGenrePreference, CatalogGenreCreateRequestDTO, UserGenrePreferenceCreateRequestDTO } from '../../models/genre.model';
import { CatalogGenreDTO, UserGenrePreferenceDTO } from '../../../settings/models/genre.model';
import { GenreService } from '../../../settings/services/genre.service';
import { UiService } from '../../services/ui.service.service';

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
export class GenreSelectorComponent implements ControlValueAccessor, OnChanges {
    @Input() placeholder: string = 'Select genre(s)';
    @Input() showPreferences: boolean = false; // Whether to show preference options
    @Input() userId: number = 1; // Current user ID (should come from auth service)
    @Input() hierarchical: boolean = false; // Whether to show hierarchical structure
    @Output() genreCreated = new EventEmitter<string>();
    @Output() preferenceUpdated = new EventEmitter<UserGenrePreferenceDTO>();
    @ViewChild('multiSelectRef') multiSelectRef!: MultiSelect;

    value: string[] = [];
    allGenres: CatalogGenreDTO[] = [];
    genreOptions: { label: string; value: string; level?: number }[] = [];
    selectedGenres: { id: string; name: string; genre: any; icon?: string | null }[] = []; // Pre-computed
    newGenreName: string = '';
    newGenreDescription: string = '';
    newGenreParentId: number | null = null;
    isGenreActive: boolean = true;
    showAddForm: boolean = false;
    showPreferenceDialog: boolean = false;
    selectedGenreForPreference: CatalogGenreDTO | null = null;

    preferenceLevelOptions = [
        { label: '💤 Not for Me', value: 1 },
        { label: '⚖️ Neutral', value: 2 },
        { label: '🙂 Interested', value: 3 },
        { label: '❤️ Favorite', value: 4 },
        { label: '💎 Top Favorite', value: 5 }
    ];

    // Preference form data
    preferenceLevel: number = 3;
    isExcluded: boolean = false;
    preferenceNotes: string = '';

    // ControlValueAccessor methods
    onChange = (value: any) => { };
    onTouched = () => { };

    constructor(
        private genreSelectorService: GenreSelectorService,
        private messageService: MessageService,
        private uiService: UiService
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.loadGenreOptions();

    }

    loadGenreOptions(): void {
        this.genreSelectorService.getGenres().subscribe((genres) => {
            this.allGenres = genres;

            if (this.hierarchical) {
                this.genreSelectorService.getHierarchicalGenreOptions().subscribe((options) => {
                    this.genreOptions = options;
                    // Update selected genres after options are loaded
                    this.updateSelectedGenres();
                });
            } else {
                this.genreOptions = genres.map(g => ({
                    label: g.name,
                    value: g.id.toString(),
                    level: 0
                }));
                // Update selected genres after options are loaded
                this.updateSelectedGenres();
            }
        });
    }

    onSelectionChange(event: any): void {
        this.value = event.value || [];
        this.updateSelectedGenres();
        this.onChange(this.value);
        // this.onTouched();
    }

    removeGenre(genre: string): void {
        this.value = this.value.filter((g) => g !== genre);
        this.updateSelectedGenres()
        this.onChange(this.value);
    }

    private updateSelectedGenres(): void {
        this.selectedGenres = this.value.map(genreId => {

            const genreOption = this.genreOptions.find(g => g.value === genreId);
            return {
                id: genreId,
                name: genreOption ? genreOption.label : genreId,
                genre: genreOption,
                icon: null // Will implement icon logic separately if needed
            };
        });

        console.log('Selected genres after update:', this.selectedGenres);
    }

    showAddGenreForm(): void {
        console.log('Showing add genre form');
        this.showAddForm = true;
        // Close the dropdown
        if (this.multiSelectRef) {
            this.multiSelectRef.hide();
        }
    }

    cancelAddGenre(): void {
        this.newGenreName = '';
        this.newGenreDescription = '';
        this.newGenreParentId = null;
        this.isGenreActive = true;
        this.preferenceLevel = 3;
        this.isExcluded = false;
        this.preferenceNotes = '';
        this.showAddForm = false;
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
        return !!this.allGenres.find(g => g.name.toLowerCase() === name.toLowerCase());
    }

    createNewGenre(): void {
        if (!this.canCreateGenre()) {
            return;
        }

        const trimmedName = this.newGenreName.trim();

        const catalogGenreData: CatalogGenreCreateRequestDTO = {
            name: trimmedName,
            description: this.newGenreDescription.trim() || '',
            parentGenreId: this.newGenreParentId || undefined,
            isActive: this.isGenreActive
        }

        const userPreferenceData: UserGenrePreferenceCreateRequestDTO = {
            userId: this.userId,
            preferenceLevel: this.preferenceLevel,
            isExcluded: this.isExcluded,
            notes: this.preferenceNotes.trim() || '',
            catalogGenreId: 0
        }

        this.genreSelectorService.createCatalogGenreSelector(catalogGenreData).subscribe((response) => {
            if (response.data) {
                const newGenre = response.data;
                userPreferenceData.catalogGenreId = newGenre.id;

                this.genreSelectorService.createUserGenreSelectorPrefernece(userPreferenceData).subscribe((prefResponse) => {
                    if (prefResponse.data) {
                        this.uiService.setCustomSuccess("Success", "Genre Preference Created");

                    }
                });
                this.uiService.setCustomSuccess("Success", `Genre Created`);

                // Refresh the genre options list
                this.loadGenreOptions();

                this.genreCreated.emit(newGenre.name);

                // Emit preference update
                this.preferenceUpdated.emit(userPreferenceData as UserGenrePreferenceDTO);

                // Reset form
                this.cancelAddGenre();
            }
        })
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
        this.updateSelectedGenres(); // Update pre-computed data
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // TrackBy function for better performance
    trackByGenreName(index: number, item: { id: string; name: string; genre: any; icon?: string | null }): string {
        return item.id;
    }

    // openPreferenceDialog(genreId: string): void {
    //     console.log('Opening preference dialog for genre:', genreId);
    //     const genre = this.allGenres.find(g => g.id === +genreId);
    //     console.log('Found genre option:', genre);
    //     if (!genre) return;

    //     this.selectedGenreForPreference = genre;
    //     this.preferenceLevel = 3; // Default to neutral
    //     this.isExcluded = false;
    //     this.preferenceNotes = '';

    //     this.showPreferenceDialog = true;
    //     console.log('Dialog should be visible now, selectedGenreForPreference:', this.selectedGenreForPreference);
    // }

    // savePreference(): void {
    //     if (!this.selectedGenreForPreference) return;

    //     try {
    //         const preference = this.genreSelectorService.setUserGenrePreference({
    //             userId: this.userId,
    //             catalogGenreId: this.selectedGenreForPreference.id,
    //             preferenceLevel: this.preferenceLevel,
    //             isExcluded: this.isExcluded,
    //             notes: this.preferenceNotes.trim() || undefined
    //         });

    //         this.messageService.add({
    //             severity: 'success',
    //             summary: 'Success',
    //             detail: `Preference for "${this.selectedGenreForPreference.name}" saved`,
    //             life: 3000,
    //         });

    //         // this.preferenceUpdated.emit(preference);
    //         this.closePreferenceDialog();
    //     } catch (error) {
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Failed to save preference',
    //             life: 3000,
    //         });
    //     }
    // }

    // closePreferenceDialog(): void {
    //     this.showPreferenceDialog = false;
    //     this.selectedGenreForPreference = null;
    //     this.preferenceLevel = 3;
    //     this.isExcluded = false;
    //     this.preferenceNotes = '';
    // }


    // getGenreIcon(genre: Genre): string {
    //     if (genre.isExcluded) return 'pi pi-ban text-red-500';
    //     if (genre.preferenceLevel === 5) return 'pi pi-heart-fill text-red-500';
    //     if (genre.preferenceLevel === 4) return 'pi pi-heart text-pink-500';
    //     if (genre.preferenceLevel === 1) return 'pi pi-thumbs-down text-gray-500';
    //     return '';
    // }

    // getParentGenreOptions(): { label: string; value: number }[] {
    //     const rootGenres = this.genreSelectorService.getCatalogGenres().filter(g => !g.parentGenreId && g.isActive);
    //     return rootGenres.map(genre => ({
    //         label: genre.name,
    //         value: genre.id
    //     }));
    // }

}