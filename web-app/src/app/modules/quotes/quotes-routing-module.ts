import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllQuotes } from './components/all-quotes/all-quotes';
import { AddQuote } from './components/add-quote/add-quote';

const routes: Routes = [
  {
    path: '',
    component: AllQuotes,
  },
  {
    path: 'add',
    component: AddQuote,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotesRoutingModule {}
