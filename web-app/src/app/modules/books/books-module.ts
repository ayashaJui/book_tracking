import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BooksRoutingModule } from './books-routing-module';
import { AllBook } from './components/all-book/all-book';
import { SharedModule } from '../shared/shared.module';
import { AddBook } from './components/add-book/add-book';
import { BookDetails } from './components/book-details/book-details';
import { BookEditionsComponent } from './components/book-editions/book-editions';
import { EditBook } from './components/edit-book/edit-book';

@NgModule({
  declarations: [AllBook, AddBook, BookDetails, BookEditionsComponent, EditBook],
  imports: [CommonModule, SharedModule, BooksRoutingModule],
})
export class BooksModule { }
