import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettings } from './components/user-settings/user-settings';

const routes: Routes = [
  {
    path: '',
    component: UserSettings,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
