import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllLogs } from './all-logs/all-logs';

const routes: Routes = [
  {
    path: '',
    component: AllLogs,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadingLogsRoutingModule {}
