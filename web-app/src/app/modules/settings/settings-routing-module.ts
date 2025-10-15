import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettings } from './components/user-settings/user-settings';
import { GenreManagementComponent } from './components/genre-management/genre-management.component';

const routes: Routes = [
  {
    path: '',
    component: UserSettings,
  },
  {
    path: 'genres',
    component: GenreManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
