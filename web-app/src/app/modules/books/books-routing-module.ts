import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllBook } from './components/all-book/all-book';
import { AddBook } from './components/add-book/add-book';

const routes: Routes = [
  {
    path: '',
    component: AllBook,
  },
  {
    path: 'add',
    component: AddBook,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BooksRoutingModule {}
