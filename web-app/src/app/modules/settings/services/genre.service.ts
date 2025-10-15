import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserGenrePreferenceCreateRequestDTO } from '../../shared/models/genre.model';
import { Observable } from 'rxjs';
import { UserGenrePreferenceHttpResponse } from '../models/response.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenreUpdateRequestDTO } from '../models/genre.model';

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
}
