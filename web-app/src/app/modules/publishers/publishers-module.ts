import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';

import { AllPublishersComponent } from './components/all-publishers/all-publishers';
import { AddPublisherComponent } from './components/add-publisher/add-publisher';
import { EditPublisherComponent } from './components/edit-publisher/edit-publisher';
import { PublisherDetailsComponent } from './components/publisher-details/publisher-details';
import { PublishersRoutingModule } from './publishers-routing-module';

@NgModule({
  declarations: [
    AllPublishersComponent,
    AddPublisherComponent,
    EditPublisherComponent,
    PublisherDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PublishersRoutingModule,
    SharedModule,
    
    // PrimeNG modules
    ButtonModule,
    InputTextModule,
    TextareaModule,
    TableModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    ToolbarModule,
    FileUploadModule,
    BadgeModule,
    TagModule,
    SelectModule
  ]
})
export class PublishersModule { }

