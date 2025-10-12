import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CatalogAuthorCreateRequestDTO } from '../../authors/models/author.model';
import { Observable } from 'rxjs';
import { CatalogAuthorHttpResponse } from '../../authors/models/response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogApiService {
  constructor(private http: HttpClient) { }

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
}
