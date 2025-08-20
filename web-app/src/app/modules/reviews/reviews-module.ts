import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewsRoutingModule } from './reviews-routing-module';
import { AllReviews } from './components/all-reviews/all-reviews';
import { SharedModule } from '../shared/shared.module';
import { AddReview } from './components/add-review/add-review';
import { EditReview } from './components/edit-review/edit-review';
import { ViewReview } from './components/view-review/view-review';

@NgModule({
  declarations: [AllReviews, AddReview, EditReview, ViewReview],
  imports: [CommonModule, SharedModule, ReviewsRoutingModule],
})
export class ReviewsModule {}
