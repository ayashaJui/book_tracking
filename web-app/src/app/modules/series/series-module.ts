import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesRoutingModule } from './series-routing-module';
import { AllSeries } from './components/all-series/all-series';
import { SharedModule } from '../shared/shared.module';
import { AddSeries } from './components/add-series/add-series';
import { EditSeries } from './components/edit-series/edit-series';
import { ViewSeries } from './components/view-series/view-series';

@NgModule({
  declarations: [AllSeries, AddSeries, EditSeries, ViewSeries],
  imports: [CommonModule, SeriesRoutingModule, SharedModule],
})
export class SeriesModule {}
