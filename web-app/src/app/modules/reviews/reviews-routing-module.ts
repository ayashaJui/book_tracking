import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllReviews } from './components/all-reviews/all-reviews';
import { AddReview } from './components/add-review/add-review';
import { EditReview } from './components/edit-review/edit-review';
import { ViewReview } from './components/view-review/view-review';

const routes: Routes = [
  {
    path: '',
    component: AllReviews,
  },
  {
    path: 'add-review',
    component: AddReview,
  },
  {
    path: 'edit/:id',
    component: EditReview,
  },
  {
    path: 'view/:id',
    component: ViewReview,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewsRoutingModule {}
