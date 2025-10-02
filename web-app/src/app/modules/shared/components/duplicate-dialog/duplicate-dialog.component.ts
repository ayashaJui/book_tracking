import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DuplicateDetectionResult, CatalogSearchResult } from '../../models/catalog.model';

export interface DuplicateDialogAction {
    action: 'use_existing' | 'create_new' | 'cancel';
    selectedItem?: CatalogSearchResult;
}

@Component({
    selector: 'app-duplicate-detection-dialog',
    templateUrl: './duplicate-dialog.component.html',
    styleUrls: ['./duplicate-dialog.component.scss'],
    standalone: false
})
export class DuplicateDetectionDialogComponent {
    @Input() visible: boolean = false;
    @Input() duplicateResult!: DuplicateDetectionResult;
    @Input() searchTerm: string = '';
    @Input() entityType: string = 'book';

    @Output() actionSelected = new EventEmitter<DuplicateDialogAction>();
    @Output() dialogClosed = new EventEmitter<void>();

    selectedExistingItem: CatalogSearchResult | null = null;

    get hasExactMatches(): boolean {
        return this.duplicateResult?.exactMatches?.length > 0;
    }

    get hasSimilarMatches(): boolean {
        return this.duplicateResult?.similarMatches?.length > 0;
    }

    get hasAnyMatches(): boolean {
        return this.hasExactMatches || this.hasSimilarMatches;
    }

    get dialogTitle(): string {
        if (this.hasExactMatches) {
            return `Exact ${this.entityType} matches found`;
        }
        if (this.hasSimilarMatches) {
            return `Similar ${this.entityType}s found`;
        }
        return `Check for duplicates`;
    }

    get dialogMessage(): string {
        if (this.hasExactMatches) {
            return `We found exact matches for "${this.searchTerm}" in the catalog. Would you like to use one of these existing entries?`;
        }
        if (this.hasSimilarMatches) {
            return `We found similar ${this.entityType}s for "${this.searchTerm}". Please check if any of these match what you're looking for.`;
        }
        return '';
    }

    onExistingItemSelect(item: CatalogSearchResult): void {
        this.selectedExistingItem = item;
    }

    onUseExisting(): void {
        if (this.selectedExistingItem) {
            this.actionSelected.emit({
                action: 'use_existing',
                selectedItem: this.selectedExistingItem
            });
        }
    }

    onCreateNew(): void {
        this.actionSelected.emit({
            action: 'create_new'
        });
    }

    onCancel(): void {
        this.actionSelected.emit({
            action: 'cancel'
        });
    }

    onDialogHide(): void {
        this.selectedExistingItem = null;
        this.dialogClosed.emit();
    }

    getItemDisplayName(item: CatalogSearchResult): string {
        return item.name || item.title || 'Unknown';
    }

    getItemTypeIcon(type: string): string {
        switch (type) {
            case 'book': return 'pi pi-book';
            case 'author': return 'pi pi-user';
            case 'publisher': return 'pi pi-building';
            case 'series': return 'pi pi-list';
            default: return 'pi pi-search';
        }
    }

    getItemTypeLabel(type: string): string {
        switch (type) {
            case 'book': return 'Book';
            case 'author': return 'Author';
            case 'publisher': return 'Publisher';
            case 'series': return 'Series';
            default: return 'Item';
        }
    }

    getConfidenceClass(confidence: number): string {
        if (confidence >= 0.9) return 'text-red-600 font-semibold';
        if (confidence >= 0.7) return 'text-orange-600 font-medium';
        if (confidence >= 0.5) return 'text-yellow-600';
        return 'text-gray-600';
    }

    getConfidenceLabel(confidence: number): string {
        if (confidence >= 0.9) return 'Very High';
        if (confidence >= 0.7) return 'High';
        if (confidence >= 0.5) return 'Medium';
        return 'Low';
    }

    formatConfidence(confidence: number): string {
        return `${Math.round(confidence * 100)}%`;
    }

    canUseExisting(): boolean {
        return this.selectedExistingItem !== null;
    }
}