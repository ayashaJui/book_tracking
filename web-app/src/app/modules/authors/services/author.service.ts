import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Author, AuthorStats, AuthorCreateRequestDTO, AuthorCreateRequest, AuthorUpdateRequest, CatalogAuthorCreateRequestDTO } from '../models/author.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogAuthorHttpResponse, UserAuthorPreferenceHttpPagedResponse, UserAuthorPreferenceHttpResponse } from '../models/response.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  authorForm!: FormGroup

  private authorsSubject = new BehaviorSubject<Author[]>([
    // Some default authors
    {
      id: 1,
      name: 'J.K. Rowling',
      biography: 'British author best known for the Harry Potter fantasy series.',
      photoUrl: '',
      birthDate: new Date('1965-07-31'),
      nationality: 'British',
      website: 'https://www.jkrowling.com',
      threadsUrl: '@jk_rowling',
      goodreadUrl: 'https://www.goodreads.com/author/show/1077326.J_K_Rowling',
      // genres: ['Fantasy', 'Young Adult', 'Children'],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      name: 'Patrick Rothfuss',
      biography: 'American fantasy author known for The Kingkiller Chronicle series.',
      photoUrl: '',
      birthDate: new Date('1973-06-06'),
      nationality: 'American',
      website: 'https://www.patrickrothfuss.com',
      threadsUrl: '@PatrickRothfuss',
      goodreadUrl: 'https://www.goodreads.com/author/show/108424.Patrick_Rothfuss',
      // genres: ['Fantasy', 'Epic Fantasy'],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 3,
      name: 'Frank Herbert',
      biography: 'American science fiction author, best known for the novel Dune and its sequels.',
      photoUrl: '',
      birthDate: new Date('1920-10-08'),
      deathDate: new Date('1986-02-11'),
      nationality: 'American',
      // genres: ['Science Fiction', 'Space Opera'],
      isActive: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 4,
      name: 'James Clear',
      biography: 'American author and speaker focused on habits, decision making, and continuous improvement.',
      photoUrl: '',
      birthDate: new Date('1986-01-01'),
      nationality: 'American',
      website: 'https://jamesclear.com',
      // socialLinks: {
      //   twitter: '@JamesClear',
      //   goodreads: 'https://www.goodreads.com/author/show/7327369.James_Clear'
      // },
      // genres: ['Self-help', 'Non-Fiction', 'Psychology'],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ]);


  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.authorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      bio: [''],
      birthDate: [null],
      deathDate: [null],
      nationality: [''],
      website: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      instagramUrl: ['', [Validators.pattern(/^@?[\w.]+$/)]],
      goodreadUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      threadsUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],

      preferenceLevel: [3, [Validators.min(1), Validators.max(5)]],
      isFavorite: [false],
      isExcluded: [false],
      personalNotes: ['']
    });
  }

  // Observable for components to subscribe to
  get authors$(): Observable<Author[]> {
    return this.authorsSubject.asObservable();
  }

  // Get current authors value
  getAuthors(): Author[] {
    return this.authorsSubject.value;
  }

  // Get author options for dropdowns
  getAuthorOptions(): { label: string; value: number }[] {
    return this.authorsSubject.value.map((author) => ({
      label: author.name,
      value: author.id!,
    }));
  }

  // Get author by ID
  getAuthorById(id: number): Author | undefined {
    return this.authorsSubject.value.find((author) => author.id === id);
  }

  // Get author by name
  getAuthorByName(name: string): Author | undefined {
    return this.authorsSubject.value.find(
      (author) => author.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Search authors
  searchAuthors(query: string): Author[] {
    const searchTerm = query.toLowerCase();
    return this.authorsSubject.value.filter(
      (author) =>
        author.name.toLowerCase().includes(searchTerm) ||
        author.biography?.toLowerCase().includes(searchTerm) ||
        author.nationality?.toLowerCase().includes(searchTerm)
      // author.genres?.some(genre => genre.toLowerCase().includes(searchTerm))
    );
  }

  // Add new author
  addAuthor(authorData: AuthorCreateRequest): Author {
    const existingAuthor = this.getAuthorByName(authorData.name);
    if (existingAuthor) {
      throw new Error(`Author "${authorData.name}" already exists`);
    }

    const currentAuthors = this.authorsSubject.value;
    const newId = Math.max(...currentAuthors.map((a) => a.id || 0), 0) + 1;

    const newAuthor: Author = {
      id: newId,
      ...authorData,
      name: authorData.name.trim(),
      totalBooks: 0,
      averageRating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedAuthors = [...currentAuthors, newAuthor];
    this.authorsSubject.next(updatedAuthors);


    return newAuthor;
  }

  // Update author
  updateAuthor(authorData: AuthorUpdateRequest): boolean {
    const currentAuthors = this.authorsSubject.value;
    const authorIndex = currentAuthors.findIndex((author) => author.id === authorData.id);

    if (authorIndex === -1) {
      return false;
    }

    // Check if new name already exists (excluding current author)
    const existingAuthor = currentAuthors.find(
      (author) =>
        author.id !== authorData.id &&
        author.name.toLowerCase() === authorData.name.toLowerCase()
    );

    if (existingAuthor) {
      throw new Error(`Author "${authorData.name}" already exists`);
    }

    const updatedAuthors = [...currentAuthors];
    updatedAuthors[authorIndex] = {
      ...updatedAuthors[authorIndex],
      ...authorData,
      name: authorData.name.trim(),
      updatedAt: new Date(),
    };

    this.authorsSubject.next(updatedAuthors);

    return true;
  }

  // Remove author
  removeAuthor(id: number): boolean {
    const currentAuthors = this.authorsSubject.value;
    const updatedAuthors = currentAuthors.filter((author) => author.id !== id);

    if (updatedAuthors.length !== currentAuthors.length) {
      this.authorsSubject.next(updatedAuthors);

      return true;
    }

    return false;
  }

  // Check if author exists
  authorExists(name: string, excludeId?: number): boolean {
    return this.authorsSubject.value.some(
      (author) =>
        author.name.toLowerCase() === name.toLowerCase() &&
        (!excludeId || author.id !== excludeId)
    );
  }

  // Get authors by genre
  // getAuthorsByGenre(genre: string): Author[] {
  //   return this.authorsSubject.value.filter(
  //     (author) => author.genres?.includes(genre)
  //   );
  // }

  // Get active/inactive authors
  getActiveAuthors(): Author[] {
    return this.authorsSubject.value.filter((author) => author.isActive !== false);
  }

  getInactiveAuthors(): Author[] {
    return this.authorsSubject.value.filter((author) => author.isActive === false);
  }

  // Calculate author statistics (would integrate with book service in real implementation)
  calculateAuthorStats(authorId: number): AuthorStats {
    // This would typically query the book service to get actual stats
    // For now, returning mock data
    return {
      totalBooks: 0,
      readBooks: 0,
      unreadBooks: 0,
      averageRating: 0,
      totalPages: 0,
      favoriteGenres: [],
      readingProgress: {
        completed: 0,
        reading: 0,
        wantToRead: 0,
        onHold: 0,
      },
    };
  }

  // Update author book statistics (to be called when books are added/updated)
  updateAuthorStats(authorId: number, stats: Partial<AuthorStats>): void {
    const currentAuthors = this.authorsSubject.value;
    const authorIndex = currentAuthors.findIndex((author) => author.id === authorId);

    if (authorIndex !== -1) {
      const updatedAuthors = [...currentAuthors];
      updatedAuthors[authorIndex] = {
        ...updatedAuthors[authorIndex],
        totalBooks: stats.totalBooks || updatedAuthors[authorIndex].totalBooks || 0,
        averageRating: stats.averageRating || updatedAuthors[authorIndex].averageRating || 0,
        updatedAt: new Date(),
      };

      this.authorsSubject.next(updatedAuthors);

    }
  }

  // Get authors sorted by various criteria
  getAuthorsSorted(sortBy: 'name' | 'totalBooks' | 'averageRating' | 'createdAt' = 'name'): Author[] {
    const authors = [...this.authorsSubject.value];

    return authors.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'totalBooks':
          return (b.totalBooks || 0) - (a.totalBooks || 0);
        case 'averageRating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'createdAt':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });
  }


  // api integration methods
  createUserAuthorPreference(authorData: AuthorCreateRequestDTO): Observable<UserAuthorPreferenceHttpResponse> {
    let url = `${environment.user_library_service_url}/user_author_preferences`;

    return this.http.post<UserAuthorPreferenceHttpResponse>(url, authorData);
  }

  getUserAuthorPreferences(userId: number, page: number = 1, size: number = 10): Observable<UserAuthorPreferenceHttpPagedResponse> {
    let url = `${environment.user_library_service_url}/user_author_preferences/user/${userId}?page=${page}&size=${size}`;

    return this.http.get<UserAuthorPreferenceHttpPagedResponse>(url);
  }
}
