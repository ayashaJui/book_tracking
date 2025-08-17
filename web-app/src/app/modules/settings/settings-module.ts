import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing-module';
import { UserSettings } from './components/user-settings/user-settings';
import { GenreManagementComponent } from './components/genre-management.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UserSettings, GenreManagementComponent],
  imports: [CommonModule, SettingsRoutingModule, SharedModule],
})
export class SettingsModule {}
