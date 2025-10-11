import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) { }

  getAuthUserByEmail(email: string): Observable<any> {
    let url = `${environment.user_service_url}/auth_user/${email}`;

    return this.http.get<any>(url);
  }
}
