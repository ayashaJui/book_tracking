import { Component, OnInit, signal } from '@angular/core';
import { UiService } from './modules/shared/services/ui.service.service';
import { ColorScheme } from './layout/service/layout.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { ProfileService } from './modules/profile/service/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('Biblioteca');
  color!: ColorScheme;
  isAuthenticated!: boolean;
  email!: string;

  constructor(
    private uiService: UiService,
    private oauthService: OAuthService, private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.color = (
      localStorage.getItem('colorScheme')
        ? <string>localStorage.getItem('colorScheme')
        : 'light'
    ) as ColorScheme;
    this.uiService.changeColorScheme(this.color);

    if (this.oauthService.getAccessToken()) {
      this.isAuthenticated = true;
    }

    this.email = localStorage.getItem('email') || '';
    if (this.email) {
      console.log("Loading auth user for email:", this.email);
      this.loadAuthUser(this.email);
    }

  }

  loadAuthUser(email: string) {
    this.profileService.getAuthUserByEmail(email).subscribe((response) => {
      if (response.data) {
        localStorage.setItem('userId', response.data.id.toString());
      }
    });
  }



}
