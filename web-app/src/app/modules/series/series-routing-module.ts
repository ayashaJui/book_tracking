import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllSeries } from './components/all-series/all-series';

const routes: Routes = [
  {
    path: '',
    component: AllSeries,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeriesRoutingModule {}
