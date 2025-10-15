import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SettingsRoutingModule } from './settings-routing-module';
import { UserSettings } from './components/user-settings/user-settings';
import { GenreManagementComponent } from './components/genre-management/genre-management.component';
import { SharedModule } from '../shared/shared.module';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [UserSettings, GenreManagementComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SettingsRoutingModule,
    SharedModule,
    // PrimeNG
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    RatingModule,
    DialogModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [DatePipe],
})
export class SettingsModule { }
