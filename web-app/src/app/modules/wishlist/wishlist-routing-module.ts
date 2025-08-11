import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllWishes } from './components/all-wishes/all-wishes';

const routes: Routes = [
  {
    path: '',
    component: AllWishes,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishlistRoutingModule {}
