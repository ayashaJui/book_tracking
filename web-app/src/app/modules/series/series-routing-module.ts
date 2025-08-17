import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllSeries } from './components/all-series/all-series';
import { AddSeries } from './components/add-series/add-series';

const routes: Routes = [
  {
    path: '',
    component: AllSeries,
  },
  {
    path: 'add-series',
    component: AddSeries,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeriesRoutingModule {}
