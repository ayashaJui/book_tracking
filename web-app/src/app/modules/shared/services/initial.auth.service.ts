import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  authorities: string[];
}

@Injectable({
  providedIn: 'root',
})
export class InitialAuthService {
  constructor(
    private oauthService: OAuthService,
    private authConfig: AuthConfig,
    private router: Router
  ) {}

  async initAuth(): Promise<any> {
    return new Promise<void>((resolveFn, rejectFn) => {
      // setup oauthservice
      this.oauthService.configure(this.authConfig);

      // continue initializing app (provoking a token_received event) or redirect to login-page
      this.oauthService
        .loadDiscoveryDocumentAndLogin().then((isLoggedIn) => {
        if (isLoggedIn) {
          const userInfo = this.oauthService.getIdentityClaims();
          const decodeToken: CustomJwtPayload = jwtDecode(
            this.oauthService.getAccessToken()
          );

          let authorities = decodeToken.authorities;
          if (userInfo && authorities) {
            localStorage.setItem('email', userInfo['sub']);
            localStorage.setItem('role', authorities[0]);
          }

          resolveFn();
        } else {
          this.oauthService.initLoginFlow();
          rejectFn();
        }
      });
    });
  }
}
