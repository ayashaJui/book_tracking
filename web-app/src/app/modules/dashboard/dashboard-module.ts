import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { Dashboard } from './components/dashboard';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [Dashboard],
  imports: [CommonModule, SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
