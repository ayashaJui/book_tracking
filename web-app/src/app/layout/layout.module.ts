import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { StyleClassModule } from 'primeng/styleclass';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';

import { AppLayout } from './component/app.layout';
import { AppTopbar } from './component/app.topbar';
import { AppSidebar } from './component/app.sidebar';
import { AppMenu } from './component/app.menu';
import { AppFooter } from './component/app.footer';
import { AppMenuitem } from './component/app.menuitem';
import { AppConfigurator } from './component/app.configurator';
import { AppFloatingConfigurator } from './component/app.floatingconfigurator';

import { SharedModule } from '../modules/shared/shared.module';

@NgModule({
  declarations: [
    AppLayout,
    AppTopbar,
    AppSidebar,
    AppMenu,
    AppFooter,
    AppMenuitem,
    AppConfigurator,
    AppFloatingConfigurator
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    StyleClassModule,
    RippleModule,
    SelectButtonModule,
    SharedModule
  ],
  exports: [
    AppLayout,
    AppTopbar,
    AppSidebar,
    AppMenu,
    AppFooter,
    AppMenuitem,
    AppConfigurator,
    AppFloatingConfigurator
  ]
})
export class LayoutModule { }