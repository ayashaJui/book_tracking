import { NgModule } from '@angular/core';
import { NavBar } from './components/nav-bar/nav-bar';
import { ToastMsg } from './components/toast-msg/toast-msg';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NavBar, ToastMsg],
  imports: [CommonModule],
  exports: [NavBar],
})
export class SharedModule {}
