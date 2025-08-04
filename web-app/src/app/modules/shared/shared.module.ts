import { NgModule } from '@angular/core';
import { ToastMsg } from './components/toast-msg/toast-msg';
import { CommonModule } from '@angular/common';
import { NotFound } from './components/not-found/not-found';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [ToastMsg, NotFound],
  imports: [CommonModule, ButtonModule],
  exports: [ButtonModule],
})
export class SharedModule {}
