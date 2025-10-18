import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserGenrePreferenceCreateRequestDTO } from '../../shared/models/genre.model';
import { Observable } from 'rxjs';
import { CatalogGenreHttpResponse, UserGenrePreferenceHttpResponse } from '../models/response.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CatalogGenreCreateRequestDTO, CatalogGenreUpdateRequestDTO, GenreUpdateRequestDTO } from '../models/genre.model';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  genreForm!: FormGroup

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.genreForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      parentGenreId: [null],
      isActive: [true],

      preferenceLevel: [3, [Validators.min(1), Validators.max(5)]],
      isExcluded: [false],
      notes: [""]
    });
  }

  // api integration
  createUserGenrePrefernece(data: UserGenrePreferenceCreateRequestDTO): Observable<UserGenrePreferenceHttpResponse> {
    let url = `${environment.user_library_service_url}/user_genre_preferences`;

    return this.http.post<UserGenrePreferenceHttpResponse>(url, data);
  }

  getUserGenrePreferences(userId: number): Observable<UserGenrePreferenceHttpResponse> {
    let url = `${environment.user_library_service_url}/user_genre_preferences/all/user/${userId}`;

    return this.http.get<UserGenrePreferenceHttpResponse>(url);
  }

  getUserGenrePreferenceById(id: number): Observable<UserGenrePreferenceHttpResponse> {
    let url = `${environment.user_library_service_url}/user_genre_preferences/${id}`;

    return this.http.get<UserGenrePreferenceHttpResponse>(url);
  }

  updateUserGenrePreference(genreData: GenreUpdateRequestDTO): Observable<UserGenrePreferenceHttpResponse> {
    let url = `${environment.user_library_service_url}/user_genre_preferences`;

    return this.http.put<UserGenrePreferenceHttpResponse>(url, genreData);
  }

  deleteUserGenrePreference(id: number): Observable<UserGenrePreferenceHttpResponse> {
    let url = `${environment.user_library_service_url}/user_genre_preferences/${id}`;

    return this.http.delete<UserGenrePreferenceHttpResponse>(url);
  }

  // CRUD for Catalog Genres
  createCatalogGenre(catalogData: CatalogGenreCreateRequestDTO): Observable<CatalogGenreHttpResponse> {
    let url = `${environment.catalog_service_url}/genres`;

    return this.http.post<CatalogGenreHttpResponse>(url, catalogData);
  }

  getCatalogGenreDetails(catalogGenreIds: number[]): Observable<CatalogGenreHttpResponse> {
    let params = catalogGenreIds.map(id => `ids=${id}`).join('&');
    let url = `${environment.catalog_service_url}/genres/genre_ids?${params}`;

    return this.http.get<CatalogGenreHttpResponse>(url);
  }

  getCatalogGenreDetailsById(catalogGenreId: number): Observable<CatalogGenreHttpResponse> {
    let url = `${environment.catalog_service_url}/genres/${catalogGenreId}`;
    return this.http.get<CatalogGenreHttpResponse>(url);
  }

  updateCatalogGenre(catalogGenreData: CatalogGenreUpdateRequestDTO): Observable<CatalogGenreHttpResponse> {
    let url = `${environment.catalog_service_url}/genres`;

    return this.http.put<CatalogGenreHttpResponse>(url, catalogGenreData);
  }

  getAllCatalogGenres(): Observable<CatalogGenreHttpResponse> {
    let url = `${environment.catalog_service_url}/genres`;

    return this.http.get<CatalogGenreHttpResponse>(url);
  }
}
