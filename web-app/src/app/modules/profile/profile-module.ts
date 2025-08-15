import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Import PrimeNG modules */
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { ProfileRoutingModule } from './profile-routing-module';
import { UserProfile } from './components/user-profile/user-profile';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UserProfile],
  imports: [CommonModule, ProfileRoutingModule, SharedModule],
})
export class ProfileModule {}
