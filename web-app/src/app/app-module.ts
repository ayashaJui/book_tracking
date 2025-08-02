import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { NavBar } from './modules/shared/components/nav-bar/nav-bar';
import { SharedModule } from './modules/shared/shared.module';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, AppRoutingModule, SharedModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.app-dark' },
      },
    }),
  ],
  bootstrap: [App],
})
export class AppModule {}
