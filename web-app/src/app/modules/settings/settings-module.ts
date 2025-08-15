import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing-module';
import { UserSettings } from './components/user-settings/user-settings';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UserSettings],
  imports: [CommonModule, SettingsRoutingModule, SharedModule],
})
export class SettingsModule {}
