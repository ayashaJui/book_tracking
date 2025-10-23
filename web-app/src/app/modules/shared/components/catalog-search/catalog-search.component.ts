import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { CatalogService } from '../../services/catalog.service';
import { CatalogSearchResult, CatalogSearchQuery, CatalogAuthor, CatalogBook, CatalogSeries, CatalogPublisher, CatalogGenre } from '../../models/catalog.model';
import { CatalogApiService } from '../../services/catalog.api.service';

@Component({
    selector: 'app-catalog-search',
    templateUrl: './catalog-search.component.html',
    styleUrls: ['./catalog-search.component.scss'],
    standalone: false
})
export class CatalogSearchComponent implements OnInit, OnDestroy {
    @Input() searchType: 'book' | 'author' | 'publisher' | 'series' | 'genre' | 'edition' | 'all' = 'all';
    @Input() placeholder: string = 'Search catalog...';
    @Input() showCreateNew: boolean = true;
    @Input() minCharacters: number = 2;

    @Output() itemSelected = new EventEmitter<CatalogSearchResult>();
    @Output() createNewClicked = new EventEmitter<string>();
    @Output() searchPerformed = new EventEmitter<string>();

    searchQuery: string = '';
    searchResults: CatalogSearchResult[] = [];
    isSearching: boolean = false;
    showResults: boolean = false;
    hasSearched: boolean = false;

    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    constructor(private catalogService: CatalogService, private catalogApiService: CatalogApiService) { }

    ngOnInit(): void {
        this.setupSearch();

        if (this.placeholder === 'Search catalog...') {
            this.placeholder = this.getDefaultPlaceholder();
        }
    }

    private getDefaultPlaceholder(): string {
        switch (this.searchType) {
            case 'book': return 'Search for books...';
            case 'author': return 'Search for authors...';
            case 'publisher': return 'Search for publishers...';
            case 'series': return 'Search for book series...';
            case 'genre': return 'Search for genres...';
            case 'edition': return 'Search for editions...';
            case 'all':
            default: return 'Search catalog...';
        }
    }

    private setupSearch(): void {
        this.searchSubject
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntil(this.destroy$),
                switchMap(query => {
                    if (!query || query.length < this.minCharacters) {
                        this.searchResults = [];
                        this.showResults = false;
                        this.hasSearched = false;
                        return [];
                    }

                    this.isSearching = true;
                    this.searchPerformed.emit(query);

                    // const searchQuery: CatalogSearchQuery = {
                    //     query,
                    //     type: this.searchType,
                    //     limit: 10
                    // };

                    // route to correct search call based on type
                    switch (this.searchType) {
                        case 'author':
                            return this.catalogApiService.searchAuthors(query);

                        case 'genre':
                            return this.catalogApiService.searchGenres(query);

                        case 'publisher':
                            return this.catalogApiService.searchPublishers(query);

                        case 'book':
                            return this.catalogService.searchBooks(query);

                        case 'series':
                            return this.catalogApiService.searchSeries(query);

                        

                        default:

                            return this.catalogService.search({ query, type: 'all', limit: 10 });
                    }
                })
            )
            .subscribe({
                next: (results: any) => {
                    const rawResults = results.data || [];
                    
                    this.searchResults = rawResults.map((item: any) => {
                        
                        if (!item.type && this.searchType !== 'all') {
                            item.type = this.searchType;
                        }
                        return item as CatalogSearchResult;
                    });

                    this.isSearching = false;
                    this.showResults = true;
                    this.hasSearched = true;
                },
                error: (error) => {
                    console.error('Search error:', error);
                    this.searchResults = [];
                    this.isSearching = false;
                    this.showResults = false;
                    this.hasSearched = true;
                }
            });
    }

    onSearchInput(event: any): void {
        this.searchQuery = event.target.value;
        this.searchSubject.next(this.searchQuery);
    }

    onItemClick(item: CatalogSearchResult): void {
        this.itemSelected.emit(item);
        this.hideResults();
    }

    onCreateNewClick(): void {
        this.createNewClicked.emit(this.searchQuery);
        this.hideResults();
    }

    hideResults(): void {
        this.showResults = false;
    }

    showResultsPanel(): void {
        if (this.hasSearched) {
            this.showResults = true;
        }
    }

    getTypeIcon(type: string): string {
        switch (type) {
            case 'book': return 'pi pi-book';
            case 'author': return 'pi pi-user';
            case 'publisher': return 'pi pi-building';
            case 'series': return 'pi pi-list';
            case 'genre': return 'pi pi-tag';
            case 'edition': return 'pi pi-clone';
            default: return 'pi pi-search';
        }
    }

    getTypeLabel(type: string): string {
        switch (type) {
            case 'book': return 'Book';
            case 'author': return 'Author';
            case 'publisher': return 'Publisher';
            case 'series': return 'Series';
            case 'genre': return 'Genre';
            case 'edition': return 'Edition';
            default: return 'Item';
        }
    }

    clearSearch(): void {
        this.searchQuery = '';
        this.searchResults = [];
        this.showResults = false;
        this.hasSearched = false;
    }

    get hasResults(): boolean {
        return this.searchResults && this.searchResults.length > 0;
    }

    get showNoResults(): boolean {
        return this.hasSearched && !this.isSearching && !this.hasResults;
    }

    get canCreateNew(): boolean {
        return this.showCreateNew &&
            this.searchQuery.length >= this.minCharacters &&
            this.showNoResults;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}