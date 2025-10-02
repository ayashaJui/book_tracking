# Catalog System Integration Guide

## Overview

This guide shows how to integrate the generic catalog search and duplicate detection components into any entity module (Authors, Publishers, Series, Genres, Editions). The catalog system provides a "catalog-first" workflow where users can search external catalogs before manually creating new entities.

## Generic Components Available

### 1. CatalogSearchComponent

- **Selector**: `<app-catalog-search>`
- **Purpose**: Search external catalogs for entities
- **Supports**: book, author, publisher, series, genre, edition

### 2. DuplicateDetectionDialogComponent

- **Selector**: `<app-duplicate-detection-dialog>`
- **Purpose**: Handle potential duplicates with user confirmation
- **Features**: Confidence scoring, exact/similar match display

## Integration Pattern

Follow this pattern to add catalog functionality to any entity module:

### Step 1: Import Shared Module

Ensure your module imports the SharedModule:

```typescript
// your-module.module.ts
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule, // This provides catalog components
    // ... other imports
  ],
  // ...
})
export class YourModule {}
```

### Step 2: Component Integration

#### Template Updates

Add catalog search section to your add-entity template:

```html
<!-- Catalog Search Section -->
<div class="space-y-6">
  <div class="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
    <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
      <i class="pi pi-search text-blue-600 dark:text-blue-400"></i>
    </div>
    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Search Catalog First</h2>
  </div>

  <app-catalog-search searchType="entityType" (entitySelected)="onCatalogEntitySelected($event)" (createNewRequested)="onCreateNewFromCatalog()"> </app-catalog-search>
</div>

<!-- Existing Form Section -->
<div class="space-y-6" [class.opacity-50]="showCatalogSearch">
  <!-- Your existing form fields -->
</div>

<!-- Duplicate Detection Dialog -->
<app-duplicate-detection-dialog [visible]="showDuplicateDialog" [potentialDuplicates]="potentialDuplicates" [selectedEntity]="selectedCatalogEntity" [entityType]="'entityType'" (action)="onDuplicateAction($event)" (visibilityChange)="showDuplicateDialog = $event"> </app-duplicate-detection-dialog>
```

#### Component Class Updates

```typescript
import { Component, OnInit } from "@angular/core";
import { CatalogService } from "../../../shared/services/catalog.service";
import { CatalogSearchResult } from "../../../shared/models/catalog.models";
import { DuplicateDialogAction } from "../../../shared/components/duplicate-detection-dialog/duplicate-detection-dialog";

@Component({
  selector: "app-add-entity",
  standalone: false,
  templateUrl: "./add-entity.html",
})
export class AddEntityComponent implements OnInit {
  // Existing properties...

  // Catalog-related properties
  showCatalogSearch: boolean = true;
  showDuplicateDialog: boolean = false;
  selectedCatalogEntity: CatalogSearchResult | null = null;
  potentialDuplicates: any[] = [];

  constructor(
    // Existing dependencies...
    private catalogService: CatalogService
  ) {}

  // Catalog event handlers
  onCatalogEntitySelected(result: CatalogSearchResult): void {
    this.selectedCatalogEntity = result;

    // Search for potential duplicates
    this.catalogService.search("entityType", result.title || result.name).subscribe({
      next: (searchResults) => {
        if (searchResults.length > 0) {
          this.potentialDuplicates = searchResults;
          this.showDuplicateDialog = true;
        } else {
          this.prefillFormFromCatalog(result);
        }
      },
      error: (error) => {
        console.error("Error checking for duplicates:", error);
        this.prefillFormFromCatalog(result);
      },
    });
  }

  onCreateNewFromCatalog(): void {
    this.showCatalogSearch = false;
    // Focus on manual form entry
  }

  onDuplicateAction(action: DuplicateDialogAction): void {
    this.showDuplicateDialog = false;

    switch (action.action) {
      case "use-existing":
        // Navigate to existing entity or show details
        this.router.navigate(["/entities", action.entityId]);
        break;
      case "create-anyway":
        if (this.selectedCatalogEntity) {
          this.prefillFormFromCatalog(this.selectedCatalogEntity);
        }
        break;
      case "manual-entry":
        this.showCatalogSearch = false;
        break;
    }
  }

  private prefillFormFromCatalog(result: CatalogSearchResult): void {
    this.showCatalogSearch = false;

    // Map catalog result to your form structure
    this.entityForm.patchValue({
      name: result.title || result.name,
      description: result.description,
      // Map other relevant fields based on your entity type
    });
  }
}
```

## Entity-Specific Examples

### Authors Module Integration

**Search Type**: `"author"`
**Key Fields**: name, biography, birth_date, nationality

```typescript
private prefillFormFromCatalog(result: CatalogSearchResult): void {
  this.authorForm.patchValue({
    name: result.name,
    biography: result.description,
    nationality: result.metadata?.nationality,
    birth_date: result.metadata?.birth_date
  });
}
```

### Publishers Module Integration

**Search Type**: `"publisher"`
**Key Fields**: name, location, website, description

```typescript
private prefillFormFromCatalog(result: CatalogSearchResult): void {
  this.publisherForm.patchValue({
    name: result.name,
    location: result.metadata?.location,
    website: result.metadata?.website,
    description: result.description
  });
}
```

### Series Module Integration

**Search Type**: `"series"`
**Key Fields**: title, description, total_books, status

```typescript
private prefillFormFromCatalog(result: CatalogSearchResult): void {
  this.seriesForm.patchValue({
    title: result.title,
    description: result.description,
    total_books: result.metadata?.total_books,
    status: result.metadata?.status || 'ongoing'
  });
}
```

### Genres Module Integration

**Search Type**: `"genre"`
**Key Fields**: name, description, parent_genre

```typescript
private prefillFormFromCatalog(result: CatalogSearchResult): void {
  this.genreForm.patchValue({
    name: result.name,
    description: result.description,
    parent_genre: result.metadata?.parent_genre
  });
}
```

### Editions Module Integration

**Search Type**: `"edition"`
**Key Fields**: isbn, format, publication_date, page_count

```typescript
private prefillFormFromCatalog(result: CatalogSearchResult): void {
  this.editionForm.patchValue({
    isbn: result.metadata?.isbn,
    format: result.metadata?.format,
    publication_date: result.metadata?.publication_date,
    page_count: result.metadata?.page_count,
    title: result.title
  });
}
```

## Styling Guidelines

### Use Tailwind Only

- No custom CSS/SCSS files
- Use Tailwind utility classes for all styling
- Follow consistent color scheme: blue for catalog, green for success, red for errors

### Common Classes

```html
<!-- Section Headers -->
<div class="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
  <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
    <i class="pi pi-search text-blue-600 dark:text-blue-400"></i>
  </div>
  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Section Title</h2>
</div>

<!-- Form Sections -->
<div class="space-y-6" [class.opacity-50]="showCatalogSearch">
  <!-- Cards -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"></div>
</div>
```

## Best Practices

### 1. User Experience

- Always show catalog search first
- Provide clear visual feedback when switching between catalog and manual entry
- Use opacity to de-emphasize manual form when catalog is active

### 2. Error Handling

- Handle catalog service errors gracefully
- Provide fallback to manual entry if catalog search fails
- Show appropriate loading states

### 3. Data Validation

- Validate catalog data before prefilling forms
- Allow users to modify prefilled data
- Maintain form validation rules

### 4. Performance

- Implement debouncing for search inputs
- Cache frequently searched results
- Use lazy loading for heavy catalog operations

## Testing Checklist

When implementing catalog integration, verify:

- [ ] Catalog search works for your entity type
- [ ] Form prefilling maps correctly from catalog results
- [ ] Duplicate detection shows relevant matches
- [ ] All user actions in duplicate dialog work
- [ ] Manual entry fallback functions
- [ ] Loading states display correctly
- [ ] Error handling works for network failures
- [ ] Form validation works with prefilled data
- [ ] Styling is consistent with Tailwind guidelines
- [ ] Dark mode styling works correctly

## Migration from Custom Components

If you have existing custom catalog components:

1. **Remove custom CSS**: Delete `.scss` files, replace with Tailwind classes
2. **Update selectors**: Change from `<app-book-catalog-search>` to `<app-catalog-search searchType="book">`
3. **Update imports**: Import from SharedModule instead of individual component imports
4. **Standardize events**: Use `entitySelected` and `createNewRequested` events
5. **Update styling**: Replace custom classes with Tailwind utilities

## Support

For questions or issues with catalog integration:

1. Check the console for any TypeScript errors
2. Verify SharedModule is properly imported
3. Ensure CatalogService is available in your component
4. Review the Authors module implementation as a working example
