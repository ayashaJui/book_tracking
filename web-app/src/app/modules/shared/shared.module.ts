import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ToastMsg } from './components/toast-msg/toast-msg';
import { NotFoundComponent } from './components/not-found/not-found';

import { ButtonModule } from 'primeng/button';
import { Rating } from 'primeng/rating';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChartModule } from 'primeng/chart';
import { TimelineModule } from 'primeng/timeline';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { DataViewModule } from 'primeng/dataview';

import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [ToastMsg, NotFoundComponent],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    Rating,
    ProgressBarModule,
    ChartModule,
    NgApexchartsModule,
    TimelineModule,
    TableModule,
    CardModule,
    SelectModule,
    MultiSelectModule,
    InputTextModule,
    TagModule,
    ButtonGroupModule,
    BadgeModule,
    DialogModule,
    AccordionModule,
    DataViewModule,
  ],
  exports: [
    ButtonModule,
    FormsModule,
    Rating,
    ProgressBarModule,
    ChartModule,
    NgApexchartsModule,
    TimelineModule,
    TableModule,
    CardModule,
    SelectModule,
    MultiSelectModule,
    InputTextModule,
    TagModule,
    ButtonGroupModule,
    BadgeModule,
    DialogModule,
    AccordionModule,
    DataViewModule,
  ],
})
export class SharedModule {}
