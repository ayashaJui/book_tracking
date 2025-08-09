import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BooksRoutingModule } from './books-routing-module';
import { AllBook } from './components/all-book/all-book';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AllBook],
  imports: [CommonModule, SharedModule, BooksRoutingModule],
})
export class BooksModule {}
