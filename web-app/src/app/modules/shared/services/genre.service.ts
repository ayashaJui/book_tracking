import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Genre {
  id: number;
  name: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private genresSubject = new BehaviorSubject<Genre[]>([
    { id: 1, name: 'Fantasy', createdAt: new Date('2024-01-01') },
    { id: 2, name: 'Science Fiction', createdAt: new Date('2024-01-01') },
    { id: 3, name: 'Mystery', createdAt: new Date('2024-01-01') },
    { id: 4, name: 'Romance', createdAt: new Date('2024-01-01') },
    { id: 5, name: 'Thriller', createdAt: new Date('2024-01-01') },
    { id: 6, name: 'Horror', createdAt: new Date('2024-01-01') },
    { id: 7, name: 'Self-help', createdAt: new Date('2024-01-01') },
    { id: 8, name: 'History', createdAt: new Date('2024-01-01') },
    { id: 9, name: 'Non-Fiction', createdAt: new Date('2024-01-01') },
    { id: 10, name: 'Biography', createdAt: new Date('2024-01-01') },
    { id: 11, name: 'Science', createdAt: new Date('2024-01-01') },
    { id: 12, name: 'Philosophy', createdAt: new Date('2024-01-01') },
    { id: 13, name: 'Poetry', createdAt: new Date('2024-01-01') },
    { id: 14, name: 'Drama', createdAt: new Date('2024-01-01') },
    { id: 15, name: 'Young Adult', createdAt: new Date('2024-01-01') },
    { id: 16, name: 'Children', createdAt: new Date('2024-01-01') },
    { id: 17, name: 'Historical Fiction', createdAt: new Date('2024-01-01') },
    { id: 18, name: 'Adventure', createdAt: new Date('2024-01-01') },
    { id: 19, name: 'Crime', createdAt: new Date('2024-01-01') },
  ]);

  private storageKey = 'bookTracking_genres';

  constructor() {
    this.loadFromStorage();
  }

  // Observable for components to subscribe to
  get genres$(): Observable<Genre[]> {
    return this.genresSubject.asObservable();
  }

  // Get current genres value
  getGenres(): Genre[] {
    return this.genresSubject.value;
  }

  // Get genre options for dropdowns
  getGenreOptions(): { label: string; value: string }[] {
    return this.genresSubject.value.map((genre) => ({
      label: genre.name,
      value: genre.name,
    }));
  }

  // Get genre by name
  getGenreByName(name: string): Genre | undefined {
    return this.genresSubject.value.find(
      (genre) => genre.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Add new genre
  addGenre(name: string): Genre {
    const existingGenre = this.getGenreByName(name);
    if (existingGenre) {
      return existingGenre;
    }

    const currentGenres = this.genresSubject.value;
    const newId = Math.max(...currentGenres.map((g) => g.id), 0) + 1;

    const newGenre: Genre = {
      id: newId,
      name: name.trim(),
      createdAt: new Date(),
    };

    const updatedGenres = [...currentGenres, newGenre];
    this.genresSubject.next(updatedGenres);
    this.saveToStorage();

    return newGenre;
  }

  // Remove genre
  removeGenre(id: number): boolean {
    const currentGenres = this.genresSubject.value;
    const updatedGenres = currentGenres.filter((genre) => genre.id !== id);

    if (updatedGenres.length !== currentGenres.length) {
      this.genresSubject.next(updatedGenres);
      this.saveToStorage();
      return true;
    }

    return false;
  }

  // Update genre
  updateGenre(id: number, name: string): boolean {
    const currentGenres = this.genresSubject.value;
    const genreIndex = currentGenres.findIndex((genre) => genre.id === id);

    if (genreIndex === -1) {
      return false;
    }

    // Check if new name already exists (excluding current genre)
    const existingGenre = currentGenres.find(
      (genre) =>
        genre.id !== id && genre.name.toLowerCase() === name.toLowerCase()
    );

    if (existingGenre) {
      return false;
    }

    const updatedGenres = [...currentGenres];
    updatedGenres[genreIndex] = {
      ...updatedGenres[genreIndex],
      name: name.trim(),
    };

    this.genresSubject.next(updatedGenres);
    this.saveToStorage();
    return true;
  }

  // Check if genre exists
  genreExists(name: string): boolean {
    return this.getGenreByName(name) !== undefined;
  }

  // Private methods for persistence
  private saveToStorage(): void {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.genresSubject.value)
      );
    } catch (error) {
      console.error('Failed to save genres to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsedGenres = JSON.parse(stored);
        // Ensure dates are properly parsed
        const genresWithDates = parsedGenres.map((genre: any) => ({
          ...genre,
          createdAt: new Date(genre.createdAt),
        }));
        this.genresSubject.next(genresWithDates);
      }
    } catch (error) {
      console.error('Failed to load genres from localStorage:', error);
      // Keep default genres if loading fails
    }
  }
}
