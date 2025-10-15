import { UserGenrePreferenceDTO } from "./genre.model";

export interface CatalogGenreHttpResponse {
    data: any;
    message: string;
    code: number;
}

export interface UserGenrePreferenceHttpResponse {
    data: any;
    message: string;
    code: number;
}

export interface UserGenrePreferenceHttpPagedResponse {
    data: UserGenrePreferencePagedData;
    message: string;
    code: number;
}

export interface UserGenrePreferencePagedData {
    totalPages: number,
    totalElements: number,
    size: number,
    content: UserGenrePreferenceDTO[];
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