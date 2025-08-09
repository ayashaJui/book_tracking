import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllBook } from './components/all-book/all-book';

const routes: Routes = [
  {
    path: '',
    component: AllBook,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BooksRoutingModule {}
