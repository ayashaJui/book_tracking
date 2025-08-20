import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllLogs } from './components/all-logs/all-logs';
import { AddLog } from './components/add-log/add-log';
import { ViewLog } from './components/view-log/view-log';
import { EditLog } from './components/edit-log/edit-log';


const routes: Routes = [
  {
    path: '',
    component: AllLogs,
  },
  {
    path: 'add-log',
    component: AddLog
  },
  {
    path: 'view-log/:id',
    component: ViewLog
  },
  {
    path: 'edit-log/:id',
    component: EditLog
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadingLogsRoutingModule {}
