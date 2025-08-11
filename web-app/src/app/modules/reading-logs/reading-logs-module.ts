import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadingLogsRoutingModule } from './reading-logs-routing-module';
import { AllLogs } from './all-logs/all-logs';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AllLogs],
  imports: [CommonModule, ReadingLogsRoutingModule, SharedModule],
})
export class ReadingLogsModule {}
