import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotesRoutingModule } from './quotes-routing-module';
import { AllQuotes } from './components/all-quotes/all-quotes';
import { SharedModule } from '../shared/shared.module';
import { AddQuote } from './components/add-quote/add-quote';
import { EditQuote } from './components/edit-quote/edit-quote';
import { ViewQuote } from './components/view-quote/view-quote';

@NgModule({
  declarations: [AllQuotes, AddQuote, EditQuote, ViewQuote],
  imports: [CommonModule, SharedModule, QuotesRoutingModule],
})
export class QuotesModule {}
