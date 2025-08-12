import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllSpendings } from './components/all-spendings/all-spendings';

const routes: Routes = [
  {
    path: '', component: AllSpendings
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpendingsRoutingModule { }
