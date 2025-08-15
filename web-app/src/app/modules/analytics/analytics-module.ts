import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing-module';
import { AllAnalytics } from './components/all-analytics/all-analytics';
import { SharedModule } from '../shared/shared.module';
import { ReadingStreak } from './components/reading-streak/reading-streak';


@NgModule({
  declarations: [
    AllAnalytics,
    ReadingStreak
  ],
  imports: [
    CommonModule, SharedModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule { }
