import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpendingsRoutingModule } from './spendings-routing-module';
import { AllSpendings } from './components/all-spendings/all-spendings';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AllSpendings],
  imports: [CommonModule, SharedModule, SpendingsRoutingModule],
})
export class SpendingsModule {}
