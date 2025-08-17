import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadingLogsRoutingModule } from './reading-logs-routing-module';
import { SharedModule } from '../shared/shared.module';
import { AllLogs } from './components/all-logs/all-logs';
import { AddLog } from './components/add-log/add-log';

@NgModule({
  declarations: [AllLogs, AddLog],
  imports: [CommonModule, ReadingLogsRoutingModule, SharedModule],
})
export class ReadingLogsModule {}
