import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { ColorScheme, LayoutService } from '../service/layout.service';
import { UiService } from '../../modules/shared/services/ui.service.service';
import { AuthenticationService } from '../../modules/shared/services/authentication.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule],
  templateUrl: `./app.topbar.html`,
})
export class AppTopbar {
  items!: MenuItem[];

  constructor(
    public layoutService: LayoutService, private authenticationService: AuthenticationService,
    private uiService: UiService
  ) {}

  toggleDarkMode() {
    // this.layoutService.layoutConfig.update((state) => ({
    //   ...state,
    //   darkTheme: !state.darkTheme,
    // }));
    this.layoutService.layoutConfig.update((state) => {
      const newDarkTheme = !state.darkTheme;
      this.uiService.setColorScheme(
        (newDarkTheme ? 'dark' : 'light') as ColorScheme
      );
      return {
        ...state,
        darkTheme: newDarkTheme,
      };
    });
  }

  logout(){
    this.authenticationService.logout()
  }
}
