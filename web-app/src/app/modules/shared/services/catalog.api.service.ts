import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CatalogAuthorCreateRequestDTO, CatalogAuthorUpdateRequestDTO } from '../../authors/models/author.model';
import { Observable } from 'rxjs';
import { CatalogAuthorHttpResponse } from '../../authors/models/response.model';
import { environment } from '../../../../environments/environment';
import { CatalogAuthor, CatalogGenre, CatalogPublisher, CatalogSeries } from '../models/catalog.model';
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

  // Search for publishers
  searchPublishers(name: string): Observable<CatalogPublisher[]> {
    const params = new HttpParams().set('publisherName', name);

    let url = `${environment.catalog_service_url}/publishers/search`;

    return this.http.get(url, { params }) as Observable<CatalogPublisher[]>
  }

  // Search for series
  searchSeries(name: string): Observable<CatalogSeries[]> {
    const params = new HttpParams().set('seriesName', name);

    let url = `${environment.catalog_service_url}/series/search`;

    return this.http.get(url, { params }) as Observable<CatalogSeries[]>
  }


}
