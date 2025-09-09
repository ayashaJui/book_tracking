import { Injectable, OnDestroy } from '@angular/core';
import { JwtHelperService } from './jwt.helper.service';
import { Subscription } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnDestroy {
  private jwtHelperService: JwtHelperService = new JwtHelperService();
  subscriptions: Subscription[] = [];

  constructor(private oauthService: OAuthService, private router: Router) {}

  isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  logout() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.oauthService.logOut();
    localStorage.clear();
  }

  isAuthorizedClient(): boolean {
    if (!this.isLoggedIn()) {
      this.router.navigate(['access-denied']);
      return false;
    }

    let isAuthorized: boolean = false;
    if (localStorage.getItem('role') == 'CLIENT') {
      isAuthorized = true;
    } else {
      isAuthorized = false;
    }

    return isAuthorized;
  }

  loadUserProfile() {
    let _decodedAccessToken = this.jwtHelperService.decodeToken(
      this.oauthService.getAccessToken()
    );
    this.oauthService.loadUserProfile().then((resp: any) => {
      console.log('User Profile: ', resp);
    });
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions or resources
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
