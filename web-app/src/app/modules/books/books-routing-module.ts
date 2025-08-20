import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllBook } from './components/all-book/all-book';
import { AddBook } from './components/add-book/add-book';
import { BookDetails } from './components/book-details/book-details';

const routes: Routes = [
  {
    path: '',
    component: AllBook,
  },
  {
    path: 'add-book',
    component: AddBook,
  },
  {
    path: ':id',
    component: BookDetails,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BooksRoutingModule {}
