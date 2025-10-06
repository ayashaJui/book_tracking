import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';

// Routing
import { CollectionsRoutingModule } from './collections-routing-module';

// Components
import { AllCollections } from './components/all-collections/all-collections';
import { CollectionDetails } from './components/collection-details/collection-details';

// Services
import { CollectionService } from './services/collection.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
    declarations: [
        AllCollections,
        CollectionDetails
    ],
    imports: [
        CommonModule,
        FormsModule,
        CollectionsRoutingModule,

        // PrimeNG
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        CheckboxModule,
        ToastModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        BadgeModule,
        TagModule,
        RatingModule,
        DividerModule,
        MenuModule
    ],
    providers: [
        CollectionService,
        ConfirmationService,
        MessageService
    ]
})
export class CollectionsModule { }