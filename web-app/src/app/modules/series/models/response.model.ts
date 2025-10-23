import { SeriesDTO } from "./series.model";


export interface CatalogSeriesHttpResponse {
    data: any;
    message: string;
    code: number;
}

export interface UserSeriesHttpResponse {
    data: any;
    message: string;
    code: number;
}

export interface UserSeriesHttpPagedResponse {
    data: UserSeriesPagedData;
    message: string;
    code: number;
}

export interface UserSeriesPagedData {
    totalPages: number,
    totalElements: number,
    size: number,
    content: SeriesDTO[];
    number: number,
    sort: Sort;
    first: boolean,
    last: boolean,
    numberOfElements: number,
    pageable: Pageable,
    empty: boolean
}

export interface Pageable {
    offset: number,
    sort: Sort,
    unpaged: boolean,
    paged: boolean,
    pageNumber: number,
    pageSize: number
}

export interface Sort {
    empty: boolean,
    unsorted: boolean,
    sorted: boolean
}