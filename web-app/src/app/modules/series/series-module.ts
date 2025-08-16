import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesRoutingModule } from './series-routing-module';
import { AllSeries } from './components/all-series/all-series';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AllSeries],
  imports: [CommonModule, SeriesRoutingModule, SharedModule],
})
export class SeriesModule {}
