import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllSeries } from './components/all-series/all-series';
import { AddSeries } from './components/add-series/add-series';
import { EditSeries } from './components/edit-series/edit-series';
import { ViewSeries } from './components/view-series/view-series';

const routes: Routes = [
  {
    path: '',
    component: AllSeries,
  },
  {
    path: 'add-series',
    component: AddSeries,
  },
  {
    path: 'edit/:id',
    component: EditSeries,
  },
  {
    path: 'view/:id',
    component: ViewSeries,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeriesRoutingModule {}
