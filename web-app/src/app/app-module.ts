import {
  APP_INITIALIZER,
  NgModule,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { SharedModule } from './modules/shared/shared.module';
import { AppLayout } from './layout/component/app.layout';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  AuthConfig,
  OAuthModule,
  OAuthService,
  OAuthStorage,
} from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './configurations/oauth2';
import { InitialAuthService } from './modules/shared/services/initial.auth.service';
import { httpInterceptorProviders } from './configurations';

@NgModule({
  declarations: [App],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    AppLayout,
    OAuthModule.forRoot(),
    // StoreModule.forRoot(),
  ],
  providers: [
    OAuthService,
    { provide: OAuthStorage, useValue: localStorage },
    { provide: AuthConfig, useValue: authCodeFlowConfig },
    {
      provide: APP_INITIALIZER,
      useFactory: (initialAuthService: InitialAuthService) => {
        initialAuthService.initAuth();
      },
      deps: [OAuthService],
      multi: true,
    },
    httpInterceptorProviders,
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.app-dark' },
      },
    }),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [App],
})
export class AppModule {}
