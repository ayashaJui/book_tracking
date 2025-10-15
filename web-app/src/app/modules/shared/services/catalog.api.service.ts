import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CatalogAuthorCreateRequestDTO, CatalogAuthorUpdateRequestDTO } from '../../authors/models/author.model';
import { Observable } from 'rxjs';
import { CatalogAuthorHttpResponse } from '../../authors/models/response.model';
import { environment } from '../../../../environments/environment';
import { CatalogAuthor, CatalogGenre } from '../models/catalog.model';
import { CatalogGenreCreateRequestDTO, CatalogGenreUpdateRequestDTO } from '../../settings/models/genre.model';
import { CatalogGenreHttpResponse } from '../../settings/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogApiService {
  constructor(private http: HttpClient) { }

  // Search for authors
  searchAuthors(name: string): Observable<CatalogAuthor[]> {
    const params = new HttpParams().set('authorName', name);

    let url = `${environment.catalog_service_url}/authors/search`;

    return this.http.get(url, { params }) as Observable<CatalogAuthor[]>
  }

  // Search for genres
  searchGenres(name: string): Observable<CatalogGenre[]> {
    const params = new HttpParams().set('genreName', name);

    let url = `${environment.catalog_service_url}/genres/search`;

    return this.http.get(url, { params }) as Observable<CatalogGenre[]>
  }

  // CRUD for Catalog Authors
  createCatalogAuthor(catalogData: CatalogAuthorCreateRequestDTO): Observable<CatalogAuthorHttpResponse> {
    let url = `${environment.catalog_service_url}/authors`;

    return this.http.post<CatalogAuthorHttpResponse>(url, catalogData);
  }

  getCatalogAuthorDetails(catalogAuthorIds: number[]): Observable<CatalogAuthorHttpResponse> {
    let params = catalogAuthorIds.map(id => `ids=${id}`).join('&');
    let url = `${environment.catalog_service_url}/authors/author_ids?${params}`;

    return this.http.get<CatalogAuthorHttpResponse>(url);
  }

  getCatalogAuthorDetailsById(catalogAuthorId: number): Observable<CatalogAuthorHttpResponse> {
    let url = `${environment.catalog_service_url}/authors/${catalogAuthorId}`;
    return this.http.get<CatalogAuthorHttpResponse>(url);
  }

  updateCatalogAuthor(catalogAuthorData: CatalogAuthorUpdateRequestDTO): Observable<CatalogAuthorHttpResponse> {
    let url = `${environment.catalog_service_url}/authors`;

    return this.http.put<CatalogAuthorHttpResponse>(url, catalogAuthorData);
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
