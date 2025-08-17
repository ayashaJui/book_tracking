import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllLogs } from './components/all-logs/all-logs';
import { AddLog } from './components/add-log/add-log';


const routes: Routes = [
  {
    path: '',
    component: AllLogs,
  },
  {
    path: 'add-log',
    component: AddLog
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadingLogsRoutingModule {}
