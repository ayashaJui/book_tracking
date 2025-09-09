import { Component, OnInit, signal } from '@angular/core';
import { UiService } from './modules/shared/services/ui.service.service';
import { ColorScheme } from './layout/service/layout.service';
import { OAuthService } from 'angular-oauth2-oidc';

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

  constructor(
    private uiService: UiService,
    private oauthService: OAuthService
  ) {}

  ngOnInit() {
    this.color = (
      localStorage.getItem('colorScheme')
        ? <string>localStorage.getItem('colorScheme')
        : 'light'
    ) as ColorScheme;
    this.uiService.changeColorScheme(this.color);

    if (this.oauthService.getAccessToken()) {
      console.log('Access Token: ', this.oauthService.getAccessToken());
      this.isAuthenticated = true;
    }
  }
}
