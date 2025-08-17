import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishlistRoutingModule } from './wishlist-routing-module';
import { AllWishes } from './components/all-wishes/all-wishes';
import { SharedModule } from '../shared/shared.module';
import { AddWishlist } from './components/add-wishlist/add-wishlist';

@NgModule({
  declarations: [AllWishes, AddWishlist],
  imports: [CommonModule, SharedModule, WishlistRoutingModule],
})
export class WishlistModule {}
