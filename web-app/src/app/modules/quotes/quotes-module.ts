import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotesRoutingModule } from './quotes-routing-module';
import { AllQuotes } from './components/all-quotes/all-quotes';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AllQuotes],
  imports: [CommonModule, SharedModule, QuotesRoutingModule],
})
export class QuotesModule {}
