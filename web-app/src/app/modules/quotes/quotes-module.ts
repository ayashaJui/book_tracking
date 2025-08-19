import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotesRoutingModule } from './quotes-routing-module';
import { AllQuotes } from './components/all-quotes/all-quotes';
import { SharedModule } from '../shared/shared.module';
import { AddQuote } from './components/add-quote/add-quote';

@NgModule({
  declarations: [AllQuotes, AddQuote],
  imports: [CommonModule, SharedModule, QuotesRoutingModule],
})
export class QuotesModule {}
