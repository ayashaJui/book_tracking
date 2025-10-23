import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  Genre,
  CatalogGenre,
  UserGenrePreference,
  GenreCreateRequest,
  CatalogGenreCreateRequestDTO,
  UserGenrePreferenceCreateRequestDTO,
  UserGenrePreferenceUpdateRequestDTO,
  GenreHierarchy,
  GenreFilterOptions,
  GenreStats
} from '../models/genre.model';
import { environment } from '../../../../environments/environment';
import { CatalogAuthorHttpResponse } from '../../authors/models/response.model';
import { CatalogGenreHttpResponse } from '../../settings/models/response.model';
import { CatalogGenreDTO } from '../../settings/models/genre.model';

// Export interfaces for backward compatibility
export type { Genre, CatalogGenre, UserGenrePreference };

@Injectable({
  providedIn: 'root',
})
export class GenreSelectorService {
  genreForm!: FormGroup;

  // Catalog genres (from catalog database)
  private catalogGenresSubject = new BehaviorSubject<CatalogGenre[]>([
    { id: 1, name: 'Fantasy', description: 'Fantasy literature with magical elements', isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 2, name: 'Epic Fantasy', description: 'Large-scale fantasy adventures', parentGenreId: 1, isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 3, name: 'Urban Fantasy', description: 'Fantasy set in modern urban environments', parentGenreId: 1, isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 4, name: 'Science Fiction', description: 'Speculative fiction with scientific themes', isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 5, name: 'Space Opera', description: 'Science fiction adventures in space', parentGenreId: 4, isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 6, name: 'Cyberpunk', description: 'Futuristic fiction with cyber themes', parentGenreId: 4, isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 7, name: 'Mystery', description: 'Fiction involving puzzles and investigations', isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 8, name: 'Romance', description: 'Stories focused on romantic relationships', isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 9, name: 'Thriller', description: 'Suspenseful and exciting stories', isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 10, name: 'Horror', description: 'Fiction intended to frighten or create suspense', isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 11, name: 'Self-help', description: 'Books for personal improvement', isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 12, name: 'History', description: 'Non-fiction about historical events', isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 13, name: 'Biography', description: 'Life stories of real people', isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 14, name: 'Young Adult', description: 'Fiction targeted at teenage readers', isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  ]);

  // User preferences for genres
  private userGenrePreferencesSubject = new BehaviorSubject<UserGenrePreference[]>([
    // Sample user preferences
    { id: 1, userId: 1, catalogGenreId: 1, preferenceLevel: 5, isExcluded: false, notes: 'Love fantasy novels!', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 2, userId: 1, catalogGenreId: 10, preferenceLevel: 1, isExcluded: true, notes: 'Too scary for me', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  ]);

  // Combined genres for display (catalog + user preferences)
  private genresSubject = new BehaviorSubject<Genre[]>([]);

  private catalogGenresStorageKey = 'bookTracking_catalogGenres';
  private userPreferencesStorageKey = 'bookTracking_userGenrePreferences';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.genreForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: [''],
      parentGenreId: [null],
      isActive: [true],

      // User preference fields
      preferenceLevel: [3, [Validators.min(1), Validators.max(5)]],
      isExcluded: [false],
      notes: ['']
    });

    this.loadFromStorage();
    this.combineGenresWithPreferences();

    // Subscribe to changes and recombine
    this.catalogGenresSubject.subscribe(() => this.combineGenresWithPreferences());
    this.userGenrePreferencesSubject.subscribe(() => this.combineGenresWithPreferences());
  }

  // Private method to combine catalog genres with user preferences
  private combineGenresWithPreferences(): void {
    const catalogGenres = this.catalogGenresSubject.value;
    const userPreferences = this.userGenrePreferencesSubject.value;

    const combinedGenres: Genre[] = catalogGenres.map(catalogGenre => {
      const userPref = userPreferences.find(pref => pref.catalogGenreId === catalogGenre.id);

      return {
        id: catalogGenre.id,
        name: catalogGenre.name,
        description: catalogGenre.description,
        parentGenreId: catalogGenre.parentGenreId,
        isActive: catalogGenre.isActive,
        createdAt: catalogGenre.createdAt,
        updatedAt: catalogGenre.updatedAt,

        // User preference fields
        preferenceLevel: userPref?.preferenceLevel,
        isExcluded: userPref?.isExcluded || false,
        notes: userPref?.notes,
        hasPreference: !!userPref,
        isFromCatalog: true
      };
    });

    this.genresSubject.next(this.buildGenreHierarchy(combinedGenres));
  }

  // Build hierarchical structure
  private buildGenreHierarchy(genres: Genre[]): Genre[] {
    const genreMap = new Map<number, Genre>();
    const rootGenres: Genre[] = [];

    // First pass: create map and identify root genres
    genres.forEach(genre => {
      genreMap.set(genre.id, { ...genre, subGenres: [] });
      if (!genre.parentGenreId) {
        rootGenres.push(genreMap.get(genre.id)!);
      }
    });

    // Second pass: build parent-child relationships
    genres.forEach(genre => {
      if (genre.parentGenreId) {
        const parent = genreMap.get(genre.parentGenreId);
        const child = genreMap.get(genre.id);
        if (parent && child) {
          parent.subGenres = parent.subGenres || [];
          parent.subGenres.push(child);
          child.parentGenre = parent;
        }
      }
    });

    return Array.from(genreMap.values());
  }

  // Observable for components to subscribe to
  get genres$(): Observable<Genre[]> {
    return this.genresSubject.asObservable();
  }

  get catalogGenres$(): Observable<CatalogGenre[]> {
    return this.catalogGenresSubject.asObservable();
  }

  get userGenrePreferences$(): Observable<UserGenrePreference[]> {
    return this.userGenrePreferencesSubject.asObservable();
  }

  // Get current genres value

  getCatalogGenres(): CatalogGenre[] {
    return this.catalogGenresSubject.value;
  }

  getUserGenrePreferences(): UserGenrePreference[] {
    return this.userGenrePreferencesSubject.value;
  }

  getGenres(isActive: boolean = false): Observable<CatalogGenreDTO[]> {
    const url = `${environment.catalog_service_url}/genres`;
    return this.http.get<CatalogGenreHttpResponse>(url).pipe(
      map(response =>
        response.data.filter((genre: any) => isActive || genre.isActive)
      )
    );
  }

  // Get genre options for dropdowns --> api
  getGenreOptions(isActive: boolean = false): Observable<{ label: string; value: string }[]> {
    return this.getGenres(isActive).pipe(
      map(genres =>
        genres.map(g => ({
          label: g.name,
          value: g.id.toString()
        }))
      )
    );
  }


  // Get hierarchical genre options --> api
  getHierarchicalGenreOptions(isActive: boolean = false): Observable<{ label: string; value: string; level: number }[]> {
    return this.getGenres(isActive).pipe(
      map((genres) => {
        const options: { label: string; value: string; level: number }[] = [];

        const addGenreOptions = (parentId: number | null, level: number = 0) => {
          genres
            .filter(g => g.parentGenreId === parentId)
            .forEach(g => {
              const prefix = '  '.repeat(level);
              options.push({
                label: `${prefix}${g.name}`,
                value: g.id.toString(),
                level
              });
              addGenreOptions(g.id, level + 1);
            });
        };

        addGenreOptions(null);
        return options;
      })
    );
  }

  // Get genre by name
  getGenreByName(name: string): Genre | undefined {
    return this.genresSubject.value.find(
      (genre) => genre.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Get catalog genre by ID
  getCatalogGenreById(id: number): CatalogGenre | undefined {
    return this.catalogGenresSubject.value.find(genre => genre.id === id);
  }

  // Add new catalog genre
  addCatalogGenre(genreData: Omit<CatalogGenre, 'id' | 'createdAt' | 'updatedAt'>): CatalogGenre {
    const existingGenre = this.getCatalogGenreByName(genreData.name);
    if (existingGenre) {
      return existingGenre;
    }

    const currentGenres = this.catalogGenresSubject.value;
    const newId = Math.max(...currentGenres.map((g) => g.id), 0) + 1;

    const newGenre: CatalogGenre = {
      id: newId,
      ...genreData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedGenres = [...currentGenres, newGenre];
    this.catalogGenresSubject.next(updatedGenres);
    this.saveCatalogGenresToStorage();

    return newGenre;
  }

  // Legacy method for backward compatibility
  addGenre(name: string): Genre {
    const catalogGenre = this.addCatalogGenre({
      name: name.trim(),
      isActive: true
    });

    // Return the combined genre
    return this.getGenreByName(catalogGenre.name)!;
  }

  // Get catalog genre by name
  getCatalogGenreByName(name: string): CatalogGenre | undefined {
    return this.catalogGenresSubject.value.find(
      (genre) => genre.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Add or update user genre preference
  setUserGenrePreference(preference: Omit<UserGenrePreference, 'id' | 'createdAt' | 'updatedAt'>): UserGenrePreference {
    const currentPreferences = this.userGenrePreferencesSubject.value;
    const existingIndex = currentPreferences.findIndex(
      p => p.userId === preference.userId && p.catalogGenreId === preference.catalogGenreId
    );

    if (existingIndex >= 0) {
      // Update existing preference
      const updatedPreferences = [...currentPreferences];
      updatedPreferences[existingIndex] = {
        ...updatedPreferences[existingIndex],
        ...preference,
        updatedAt: new Date()
      };
      this.userGenrePreferencesSubject.next(updatedPreferences);
      this.saveUserPreferencesToStorage();
      return updatedPreferences[existingIndex];
    } else {
      // Create new preference
      const newId = Math.max(...currentPreferences.map((p) => p.id || 0), 0) + 1;
      const newPreference: UserGenrePreference = {
        id: newId,
        ...preference,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedPreferences = [...currentPreferences, newPreference];
      this.userGenrePreferencesSubject.next(updatedPreferences);
      this.saveUserPreferencesToStorage();
      return newPreference;
    }
  }

  // Remove user genre preference
  removeUserGenrePreference(userId: number, catalogGenreId: number): boolean {
    const currentPreferences = this.userGenrePreferencesSubject.value;
    const updatedPreferences = currentPreferences.filter(
      p => !(p.userId === userId && p.catalogGenreId === catalogGenreId)
    );

    if (updatedPreferences.length !== currentPreferences.length) {
      this.userGenrePreferencesSubject.next(updatedPreferences);
      this.saveUserPreferencesToStorage();
      return true;
    }

    return false;
  }

  // Check if genre exists
  genreExists(name: string): boolean {
    return this.getGenreByName(name) !== undefined;
  }

  catalogGenreExists(name: string): boolean {
    return this.getCatalogGenreByName(name) !== undefined;
  }

  // Remove catalog genre (admin function)
  removeCatalogGenre(id: number): boolean {
    const currentGenres = this.catalogGenresSubject.value;
    const updatedGenres = currentGenres.filter((genre) => genre.id !== id);

    if (updatedGenres.length !== currentGenres.length) {
      this.catalogGenresSubject.next(updatedGenres);
      this.saveCatalogGenresToStorage();
      return true;
    }

    return false;
  }

  // Update catalog genre
  updateCatalogGenre(id: number, updates: Partial<Omit<CatalogGenre, 'id' | 'createdAt' | 'updatedAt'>>): boolean {
    const currentGenres = this.catalogGenresSubject.value;
    const genreIndex = currentGenres.findIndex((genre) => genre.id === id);

    if (genreIndex === -1) {
      return false;
    }

    // Check if new name already exists (excluding current genre)
    if (updates.name) {
      const existingGenre = currentGenres.find(
        (genre) =>
          genre.id !== id && genre.name.toLowerCase() === updates.name!.toLowerCase()
      );

      if (existingGenre) {
        return false;
      }
    }

    const updatedGenres = [...currentGenres];
    updatedGenres[genreIndex] = {
      ...updatedGenres[genreIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.catalogGenresSubject.next(updatedGenres);
    this.saveCatalogGenresToStorage();
    return true;
  }

  // Legacy method for backward compatibility - updates combined genre
  updateGenre(id: number, name: string): boolean {
    return this.updateCatalogGenre(id, { name: name.trim() });
  }

  // Legacy method for backward compatibility - removes catalog genre
  removeGenre(id: number): boolean {
    return this.removeCatalogGenre(id);
  }

  // Get filtered genres
  getFilteredGenres(options: GenreFilterOptions = {}): Genre[] {
    let genres = this.genresSubject.value;

    if (!options.includeInactive) {
      genres = genres.filter(g => g.isActive);
    }

    if (options.parentGenreId !== undefined) {
      genres = genres.filter(g => g.parentGenreId === options.parentGenreId);
    }

    if (options.level !== undefined) {
      // Filter by hierarchy level
      genres = genres.filter(g => this.getGenreLevel(g) === options.level);
    }

    if (options.hasUserPreferences !== undefined) {
      genres = genres.filter(g => g.hasPreference === options.hasUserPreferences);
    }

    if (options.excludedGenres !== undefined) {
      genres = genres.filter(g => g.isExcluded === options.excludedGenres);
    }

    if (options.preferenceLevel) {
      genres = genres.filter(g => {
        if (!g.preferenceLevel) return false;
        const min = options.preferenceLevel!.min || 1;
        const max = options.preferenceLevel!.max || 5;
        return g.preferenceLevel >= min && g.preferenceLevel <= max;
      });
    }

    return genres;
  }

  // Get genre hierarchy level
  private getGenreLevel(genre: Genre): number {
    let level = 0;
    let current = genre;

    while (current.parentGenre) {
      level++;
      current = current.parentGenre;
    }

    return level;
  }

  // Private methods for persistence
  private saveCatalogGenresToStorage(): void {
    try {
      localStorage.setItem(
        this.catalogGenresStorageKey,
        JSON.stringify(this.catalogGenresSubject.value)
      );
    } catch (error) {
      console.error('Failed to save catalog genres to localStorage:', error);
    }
  }

  private saveUserPreferencesToStorage(): void {
    try {
      localStorage.setItem(
        this.userPreferencesStorageKey,
        JSON.stringify(this.userGenrePreferencesSubject.value)
      );
    } catch (error) {
      console.error('Failed to save user preferences to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      // Load catalog genres
      const storedCatalogGenres = localStorage.getItem(this.catalogGenresStorageKey);
      if (storedCatalogGenres) {
        const parsedGenres = JSON.parse(storedCatalogGenres);
        const genresWithDates = parsedGenres.map((genre: any) => ({
          ...genre,
          createdAt: new Date(genre.createdAt),
          updatedAt: new Date(genre.updatedAt),
        }));
        this.catalogGenresSubject.next(genresWithDates);
      }

      // Load user preferences
      const storedPreferences = localStorage.getItem(this.userPreferencesStorageKey);
      if (storedPreferences) {
        const parsedPreferences = JSON.parse(storedPreferences);
        const preferencesWithDates = parsedPreferences.map((pref: any) => ({
          ...pref,
          createdAt: new Date(pref.createdAt),
          updatedAt: new Date(pref.updatedAt),
        }));
        this.userGenrePreferencesSubject.next(preferencesWithDates);
      }
    } catch (error) {
      console.error('Failed to load genres from localStorage:', error);
      // Keep default data if loading fails
    }
  }
}
