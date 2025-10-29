import { Component, OnInit } from '@angular/core';
import { Genre, CatalogGenre, UserGenrePreferenceCreateRequestDTO, UserGenrePreferenceUpdateRequestDTO } from '../../../shared/models/genre.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CatalogGenreCreateRequestDTO, CatalogGenreDTO, CatalogGenreUpdateRequestDTO, UserGenrePreferenceDTO } from '../../models/genre.model';
import { GenreService } from '../../services/genre.service';
import { UiService } from '../../../shared/services/ui.service.service';

@Component({
    selector: 'app-genre-management',
    standalone: false,
    templateUrl: './genre-management.component.html',
    styleUrls: ['./genre-management.component.scss']
})
export class GenreManagementComponent implements OnInit {
    genres: UserGenrePreferenceDTO[] = [];
    filteredGenres: UserGenrePreferenceDTO[] = [];
    viewMode: 'cards' | 'table' = 'cards';
    showAddForm: boolean = true;
    showGenreForm: boolean = false;
    loading: boolean = false;
    userId: number = 0;
    preferenceLevelOptions = [
        { label: '💤 Not for Me', value: 1 },
        { label: '⚖️ Neutral', value: 2 },
        { label: '🙂 Interested', value: 3 },
        { label: '❤️ Favorite', value: 4 },
        { label: '💎 Top Favorite', value: 5 }
    ];

    searchTerm: string = '';

    // Dialog states
    showEditDialog: boolean = false;
    editingGenre: UserGenrePreferenceDTO | null = null;

    // Catalog search states
    catalogSearchPerformed: boolean = false;
    selectedCatalogGenre: any | null = null;
    isFromCatalog: boolean = false;

    parentGenreOptions: { id: number; name: string }[] = [];

    constructor(
        public genreService: GenreService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private uiService: UiService
    ) {

    }

    ngOnInit() {
        this.updateParentGenreOptions();

        this.userId = parseInt(localStorage.getItem('userId') || '0');

        if (this.userId) {
            this.loadGenres(this.userId);
        }
    }

    loadGenres(userId: number) {
        this.loading = true;

        this.genreService.getUserGenrePreferences(userId).subscribe({
            next: (response) => {
                if (response.data) {
                    this.genres = response.data;

                    const ids = this.genres.map(pref => pref.catalogGenreId).filter(id => id !== undefined) as number[];

                    if (ids.length > 0) {
                        this.genreService.getCatalogGenreDetails(ids).subscribe({
                            next: (catalogResponse) => {
                                if (catalogResponse.data) {
                                    let catalogGenres: CatalogGenreDTO[] = catalogResponse.data;

                                    this.genres.forEach((genre) => {
                                        genre.catalogGenre = catalogGenres.find(cg => cg.id === genre.catalogGenreId);
                                    });

                                    this.filterGenres()
                                }
                            },
                            error: (error) => {
                                console.error('Error fetching catalog author details:', error);
                                this.uiService.setCustomError('Error', error.message || 'Failed to load author preferences');
                                this.loading = false;
                            }
                        });
                    }
                }

            }, error: (error) => {
                console.error('Error fetching catalog author details:', error);
                this.uiService.setCustomError('Error', error.message || 'Failed to load author preferences');
                this.loading = false;
            }
        });
    }

    updateParentGenreOptions() {
        this.genreService.getAllCatalogGenres().subscribe((response) => {
            if (response.data) {
                this.parentGenreOptions = response.data;
            }
        });
    }

    filterGenres() {
        if (!this.searchTerm.trim()) {
            this.filteredGenres = [...this.genres];
            // } else {
            //     const searchLower = this.searchTerm.toLowerCase();
            //     this.filteredGenres = this.genres.filter((genre) =>
            //         genre.name.toLowerCase().includes(searchLower) ||
            //         genre.description?.toLowerCase().includes(searchLower)
            //     );
        }
    }

    toggleView() {
        this.viewMode = this.viewMode === 'cards' ? 'table' : 'cards';
    }

    addGenre() {
        if (!this.genreService.genreForm.valid) return;

        const formData = this.genreService.genreForm.value;

        if (this.isFromCatalog) {
            this.saveUserGenrePreference(formData);
        } else {
            this.createNewGenre(formData);
        }
    }

    private saveUserGenrePreference(formData: any) {
        const userPreferenceData: UserGenrePreferenceCreateRequestDTO = {
            userId: parseInt(localStorage.getItem('userId') || '0'),
            catalogGenreId: this.selectedCatalogGenre.id,
            preferenceLevel: formData.preferenceLevel,
            isExcluded: formData.isExcluded || false,
            notes: formData.notes?.trim() || undefined
        };

        this.genreService.createUserGenrePrefernece(userPreferenceData).subscribe({
            next: (response) => {
                if (response.data) {
                    this.uiService.setCustomSuccess('Success', `Preferences saved"`);
                    this.loadGenres(this.userId);
                    this.selectedCatalogGenre = null;
                    this.isFromCatalog = false;
                    this.updateFieldsEnabledState();
                }
            }, error: (error) => {
                console.error('Error saving user genre preference:', error);
                this.uiService.setCustomError('Error', error.message || 'Failed to save genre preference');
                this.loading = false;
            }
        });

        this.resetForm();
    }

    private createNewGenre(formData: any) {
        const newCatalogGenreData: CatalogGenreCreateRequestDTO = {
            name: formData.name.trim(),
            description: formData.description?.trim(),
            parentGenreId: formData.parentGenreId,
            isActive: formData.isActive ?? true
        };

        this.genreService.createCatalogGenre(newCatalogGenreData).subscribe({
            next: (response) => {
                if (response.data) {
                    this.uiService.setCustomSuccess('Success', `Genre "${newCatalogGenreData.name}" created`);

                    const userPreferenceData: UserGenrePreferenceCreateRequestDTO = {
                        userId: localStorage.getItem('userId') ? +localStorage.getItem('userId')! : 0,
                        catalogGenreId: response.data.id,
                        preferenceLevel: formData.preferenceLevel,
                        isExcluded: formData.isExcluded || false,
                        notes: formData.notes?.trim() || undefined
                    };

                    this.updateParentGenreOptions();

                    this.genreService.createUserGenrePrefernece(userPreferenceData).subscribe({
                        next: (userGenreResponse) => {
                            if (userGenreResponse.data) {
                                this.uiService.setCustomSuccess('Success', `Preferences saved"`);
                                this.loadGenres(this.userId);
                                this.selectedCatalogGenre = null;
                                this.isFromCatalog = false;
                                this.updateFieldsEnabledState();
                            }
                        }, error: (error) => {
                            console.error('Error saving user genre preference:', error);
                            this.uiService.setCustomError('Error', error.message || 'Failed to save genre preference');
                            this.loading = false;
                        }
                    });


                }
            }, error: (error) => {
                console.error('Error creating catalog genre:', error);
                this.uiService.setCustomError('Error', error.message || 'Failed to create genre');
                this.loading = false;
            }
        });

        this.resetForm();
    }

    cancelAdd() {
        this.resetForm();
    }

    private resetForm() {
        this.genreService.genreForm.reset({
            isActive: true,
            preferenceLevel: 3,
            isExcluded: false
        });
        this.selectedCatalogGenre = null;
        this.isFromCatalog = false;
        this.showGenreForm = false;
        this.updateFieldsEnabledState();
    }

    getParentGenreName(parentId?: number): string {
        if (!parentId) return '';
        const parent = this.parentGenreOptions.find(g => g.id == parentId);
        return parent?.name || '';
    }

    editGenre(genre: UserGenrePreferenceDTO) {
        this.editingGenre = genre;

        this.genreService.genreForm.patchValue({
            name: genre.catalogGenre?.name || '',
            description: genre.catalogGenre?.description || '',
            parentGenreId: genre.catalogGenre?.parentGenreId || null,
            isActive: genre.catalogGenre?.isActive ?? true,

            preferenceLevel: genre.preferenceLevel || 3,
            isExcluded: genre.isExcluded || false,
            notes: genre.notes || ''
        });

        this.showEditDialog = true;
    }

    saveEdit() {
        if (!this.editingGenre || !this.genreService.genreForm.valid) return;

        const formData = this.genreService.genreForm.value;

        let catalogUpdateData: CatalogGenreUpdateRequestDTO = {
            id: this.editingGenre.catalogGenre?.id || 0,
            name: formData.name.trim(),
            description: formData.description?.trim(),
            parentGenreId: formData.parentGenreId,
            isActive: formData.isActive ?? true
        }

        let userGenrePrefUpdateData: UserGenrePreferenceUpdateRequestDTO = {
            id: this.editingGenre.id,
            userId: this.editingGenre.userId,
            catalogGenreId: this.editingGenre.catalogGenreId,
            preferenceLevel: formData.preferenceLevel,
            isExcluded: formData.isExcluded || false,
            notes: formData.notes?.trim() || undefined
        }

        this.genreService.updateCatalogGenre(catalogUpdateData).subscribe({
            next: (response) => {
                if (response.data) {
                    this.uiService.setCustomSuccess('Success', `Genre "${catalogUpdateData.name}" updated`);

                    this.genreService.updateUserGenrePreference(userGenrePrefUpdateData).subscribe({
                        next: (userResponse) => {
                            if (userResponse.data) {
                                this.uiService.setCustomSuccess('Success', `Genre Preferences updated`);
                                this.loadGenres(this.userId);
                            }
                        }
                    });

                    this.updateParentGenreOptions();

                    this.cancelEdit();
                }
            }, error: (error) => {
                console.error('Error updating catalog genre:', error);
                this.uiService.setCustomError('Error', error.message || 'Failed to update genre');
                this.loading = false;
            }
        });
    }

    cancelEdit() {
        this.showEditDialog = false;
        this.editingGenre = null;
        this.genreService.genreForm.reset({
            isActive: true,
            preferenceLevel: 3,
            isExcluded: false
        });
    }

    confirmDeleteGenre(genre: UserGenrePreferenceDTO) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete the genre "${genre.catalogGenre?.name}"? This action cannot be undone.`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.deleteGenre(genre);
            },
        });
    }

    deleteGenre(genre: UserGenrePreferenceDTO) {
        console.log(genre)

        this.genreService.deleteUserGenrePreference(genre.id).subscribe({
            next: (response) => {
                if (response.data) {
                    this.uiService.setCustomSuccess('Success', `Genre "${genre.catalogGenre?.name}" deleted successfully`);
                    this.loadGenres(this.userId);
                }
            }
        });
    }

    onCatalogGenreSelected(genre: any) {
        console.log('Catalog Genre Selected:', genre);
        if (genre.type === 'genre') {
            this.selectedCatalogGenre = genre;
            this.isFromCatalog = true;
            this.showGenreForm = true; 

            this.genreService.genreForm.patchValue({
                name: genre.name,
                description: genre.description || '',
                parentGenreId: genre.parentGenreId || null,
                isActive: genre.isActive ?? true
            });

            this.updateFieldsEnabledState();

            this.messageService.add({
                severity: 'success',
                summary: 'Genre Selected',
                detail: `Selected "${genre.name}" from catalog`,
                life: 3000,
            });
        }
    }

    onCreateNewFromCatalog(searchTerm: string) {
        this.isFromCatalog = false;
        this.showGenreForm = true; 
        this.updateFieldsEnabledState();
        this.proceedWithNewGenre(searchTerm);
    }

    private proceedWithNewGenre(searchTerm: string) {
        this.genreService.genreForm.patchValue({
            name: searchTerm
        });

        this.messageService.add({
            severity: 'info',
            summary: 'Create New Genre',
            detail: `Creating new genre: "${searchTerm}"`,
            life: 3000,
        });
    }

    private updateFieldsEnabledState(): void {
        const catalogFields = ['name', 'description', 'parentGenreId', 'isActive'];

        if (this.isFromCatalog) {
            catalogFields.forEach(field => {
                const control = this.genreService.genreForm.get(field);
                if (control) {
                    control.disable();
                }
            });
        } else {
            catalogFields.forEach(field => {
                const control = this.genreService.genreForm.get(field);
                if (control) {
                    control.enable();
                }
            });
        }
    }
}