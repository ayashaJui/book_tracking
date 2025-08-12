import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllReviews } from './components/all-reviews/all-reviews';

const routes: Routes = [
  {
    path: '',
    component: AllReviews,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewsRoutingModule {}
