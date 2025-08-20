import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllWishes } from './components/all-wishes/all-wishes';
import { AddWishlist } from './components/add-wishlist/add-wishlist';

const routes: Routes = [
  {
    path: '',
    component: AllWishes,
  },
  {
    path: 'add-wishlist',
    component: AddWishlist,
  },
  {
    path: 'edit',
    component: AddWishlist,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishlistRoutingModule {}
