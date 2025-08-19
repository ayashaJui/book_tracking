import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllReviews } from './components/all-reviews/all-reviews';
import { AddReview } from './components/add-review/add-review';

const routes: Routes = [
  {
    path: '',
    component: AllReviews,
  },
  {
    path: 'add-review', component: AddReview
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewsRoutingModule {}
