import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';

// Routing
import { AuthorsRoutingModule } from './authors-routing-module';

// Components
import { AllAuthorsComponent } from './components/all-authors/all-authors';
import { AddAuthorComponent } from './components/add-author/add-author';
import { AuthorDetailsComponent } from './components/author-details/author-details';

// Components (will be created)
// import { AllAuthorsComponent } from './components/all-authors/all-authors.component';
// import { AddAuthorComponent } from './components/add-author/add-author.component';
// import { AuthorDetailsComponent } from './components/author-details/author-details.component';

@NgModule({
  declarations: [
    AllAuthorsComponent,
    AddAuthorComponent,
    AuthorDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthorsRoutingModule,
    
    // PrimeNG
    ButtonModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    ToggleButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    TableModule,
    PaginatorModule,
    ToolbarModule,
    AvatarModule,
    ChipModule,
    TagModule,
    MenuModule,
    FileUploadModule,
    TooltipModule,
    BadgeModule,
    DividerModule,
    CheckboxModule,
    SharedModule,
  ],
  providers: [],
})
export class AuthorsModule {}
