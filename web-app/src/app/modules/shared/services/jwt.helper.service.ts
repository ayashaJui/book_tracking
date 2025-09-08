import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtHelperService {
  decodeToken(token: string) {
    return jwtDecode(token);
  }
}
