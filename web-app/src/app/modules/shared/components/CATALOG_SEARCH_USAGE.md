# Generic Catalog Search Component Usage Examples

The `CatalogSearchComponent` (`<app-catalog-search>`) is now a fully generic, reusable component that can be used to search for any type of catalog entity.

## Basic Usage

```html
<!-- General catalog search (all types) -->
<app-catalog-search searchType="all" placeholder="Search anything in catalog..." (itemSelected)="onItemSelected($event)" (createNewClicked)="onCreateNew($event)"> </app-catalog-search>
```

## Entity-Specific Usage

### Books

```html
<app-catalog-search searchType="book" placeholder="Search for books..." (itemSelected)="onBookSelected($event)" (createNewClicked)="onCreateNewBook($event)"> </app-catalog-search>
```

### Authors

```html
<app-catalog-search searchType="author" placeholder="Search for authors..." (itemSelected)="onAuthorSelected($event)" (createNewClicked)="onCreateNewAuthor($event)"> </app-catalog-search>
```

### Publishers

```html
<app-catalog-search searchType="publisher" placeholder="Search for publishers..." (itemSelected)="onPublisherSelected($event)" (createNewClicked)="onCreateNewPublisher($event)"> </app-catalog-search>
```

### Series

```html
<app-catalog-search searchType="series" placeholder="Search for book series..." (itemSelected)="onSeriesSelected($event)" (createNewClicked)="onCreateNewSeries($event)"> </app-catalog-search>
```

### Genres

```html
<app-catalog-search searchType="genre" placeholder="Search for genres..." (itemSelected)="onGenreSelected($event)" (createNewClicked)="onCreateNewGenre($event)"> </app-catalog-search>
```

### Editions

```html
<app-catalog-search searchType="edition" placeholder="Search for editions..." (itemSelected)="onEditionSelected($event)" (createNewClicked)="onCreateNewEdition($event)"> </app-catalog-search>
```

## Component Properties

| Property        | Type                                                                             | Default                            | Description                                               |
| --------------- | -------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------- |
| `searchType`    | `'book' \| 'author' \| 'publisher' \| 'series' \| 'genre' \| 'edition' \| 'all'` | `'all'`                            | Type of entity to search for                              |
| `placeholder`   | `string`                                                                         | Auto-generated based on searchType | Placeholder text for search input                         |
| `showCreateNew` | `boolean`                                                                        | `true`                             | Whether to show "Create New" option when no results found |
| `minCharacters` | `number`                                                                         | `2`                                | Minimum characters required before searching              |

## Events

| Event              | Type                  | Description                                            |
| ------------------ | --------------------- | ------------------------------------------------------ |
| `itemSelected`     | `CatalogSearchResult` | Emitted when user selects an existing item             |
| `createNewClicked` | `string`              | Emitted when user clicks "Create New" with search term |
| `searchPerformed`  | `string`              | Emitted when a search is performed                     |

## Auto-generated Placeholders

When no custom placeholder is provided, the component automatically generates appropriate placeholders:

- `book` → "Search for books..."
- `author` → "Search for authors..."
- `publisher` → "Search for publishers..."
- `series` → "Search for book series..."
- `genre` → "Search for genres..."
- `edition` → "Search for editions..."
- `all` → "Search catalog..."

## Icons and Labels

Each entity type has its own icon and label:

| Type      | Icon             | Label     |
| --------- | ---------------- | --------- |
| book      | `pi pi-book`     | Book      |
| author    | `pi pi-user`     | Author    |
| publisher | `pi pi-building` | Publisher |
| series    | `pi pi-list`     | Series    |
| genre     | `pi pi-tag`      | Genre     |
| edition   | `pi pi-clone`    | Edition   |

## Duplicate Detection Dialog

The companion `DuplicateDetectionDialogComponent` (`<app-duplicate-detection-dialog>`) is also generic and works with any entity type:

```html
<app-duplicate-detection-dialog [visible]="showDuplicateDialog" [duplicateResult]="duplicateResult" [searchTerm]="searchTerm" [entityType]="currentEntityType" (actionSelected)="onDuplicateAction($event)" (dialogClosed)="showDuplicateDialog = false"> </app-duplicate-detection-dialog>
```

## Integration Example

```typescript
export class MyComponent {
  onBookSelected(item: CatalogSearchResult) {
    if (item.type === "book") {
      // Handle book selection
      console.log("Selected book:", item);
    }
  }

  onAuthorSelected(item: CatalogSearchResult) {
    if (item.type === "author") {
      // Handle author selection
      console.log("Selected author:", item);
    }
  }

  onCreateNewBook(searchTerm: string) {
    // Handle creating new book with the search term
    console.log("Create new book:", searchTerm);
  }

  onCreateNewAuthor(searchTerm: string) {
    // Handle creating new author with the search term
    console.log("Create new author:", searchTerm);
  }
}
```

This generic approach allows the same component to be reused across all catalog entity management features while maintaining type safety and appropriate UX for each context.
