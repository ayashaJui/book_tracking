import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfile } from './components/user-profile/user-profile';

const routes: Routes = [
  {
    path: '',
    component: UserProfile,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
