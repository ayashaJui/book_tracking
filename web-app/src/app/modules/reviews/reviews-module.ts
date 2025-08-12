import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewsRoutingModule } from './reviews-routing-module';
import { AllReviews } from './components/all-reviews/all-reviews';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AllReviews],
  imports: [CommonModule, SharedModule, ReviewsRoutingModule],
})
export class ReviewsModule {}
