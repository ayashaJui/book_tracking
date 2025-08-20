import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllQuotes } from './components/all-quotes/all-quotes';
import { AddQuote } from './components/add-quote/add-quote';
import { EditQuote } from './components/edit-quote/edit-quote';
import { ViewQuote } from './components/view-quote/view-quote';

const routes: Routes = [
  {
    path: '',
    component: AllQuotes,
  },
  {
    path: 'add',
    component: AddQuote,
  },
  {
    path: 'view/:id',
    component: ViewQuote,
  },
  {
    path: 'edit/:id',
    component: EditQuote,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotesRoutingModule {}
