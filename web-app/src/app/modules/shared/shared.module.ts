import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ToastMsg } from './components/toast-msg/toast-msg';
import { NotFoundComponent } from './components/not-found/not-found';
import { GenreSelectorComponent } from './components/genre-selector.component';
import { TagSelectorComponent } from './components/tag-selector.component';
import { AuthorSelectorComponent } from './components/author-selector/author-selector';
import { ImageUploadComponent } from './components/image-upload/image-upload';
import { CatalogSearchComponent } from './components/catalog-search/catalog-search.component';
import { DuplicateDetectionDialogComponent } from './components/duplicate-dialog/duplicate-dialog.component';

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
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { Avatar } from 'primeng/avatar';
import { Chip } from 'primeng/chip';
import { Knob } from 'primeng/knob';
import { FileUploadModule } from 'primeng/fileupload';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Select } from 'primeng/select';
// import { Textarea } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';

import { NgApexchartsModule } from 'ng-apexcharts';
import { MessageService, ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [ToastMsg, NotFoundComponent, GenreSelectorComponent, TagSelectorComponent, AuthorSelectorComponent, ImageUploadComponent, CatalogSearchComponent, DuplicateDetectionDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    InputNumberModule,
    TooltipModule,
    Avatar,
    Chip,
    Knob,
    FileUploadModule,
    ToastModule,
    DatePickerModule,
    ConfirmDialogModule,
    PaginatorModule,
    MenuModule,
    BreadcrumbModule,
    FloatLabelModule,
    ToggleButtonModule,
    SelectButtonModule,
    ToolbarModule,
    DividerModule,
    ProgressSpinnerModule,
    Select,
    // Textarea,
    CheckboxModule,
    ToggleSwitchModule,
    TextareaModule
  ],
  providers: [MessageService, ConfirmationService],
  exports: [
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
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
    InputNumberModule,
    TooltipModule,
    Avatar,
    Chip,
    Knob,
    FileUploadModule,
    ToastModule,
    DatePickerModule,
    ConfirmDialogModule,
    PaginatorModule,
    MenuModule,
    BreadcrumbModule,
    FloatLabelModule,
    ToggleButtonModule,
    SelectButtonModule,
    ToolbarModule,
    DividerModule,
    ToastMsg,
    GenreSelectorComponent,
    TagSelectorComponent,
    AuthorSelectorComponent,
    ImageUploadComponent,
    CatalogSearchComponent,
    DuplicateDetectionDialogComponent,
    ProgressSpinnerModule,
    Select,
    // Textarea,
    CheckboxModule,
    ToggleSwitchModule,
    TextareaModule
  ],
})
export class SharedModule { }
