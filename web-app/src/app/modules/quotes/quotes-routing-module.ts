import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllQuotes } from './components/all-quotes/all-quotes';

const routes: Routes = [
  {
    path: '',
    component: AllQuotes,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotesRoutingModule {}
