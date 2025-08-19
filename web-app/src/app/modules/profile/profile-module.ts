import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing-module';
import { UserProfile } from './components/user-profile/user-profile';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UserProfile],
  imports: [CommonModule, ProfileRoutingModule, SharedModule],
})
export class ProfileModule {}
