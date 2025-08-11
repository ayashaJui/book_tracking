import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadingLogsRoutingModule } from './reading-logs-routing-module';
import { SharedModule } from '../shared/shared.module';
import { AllLogs } from './components/all-logs/all-logs';

@NgModule({
  declarations: [AllLogs],
  imports: [CommonModule, ReadingLogsRoutingModule, SharedModule],
})
export class ReadingLogsModule {}
