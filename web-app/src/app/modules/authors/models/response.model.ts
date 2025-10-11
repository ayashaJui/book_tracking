import { UserAuthorPreferenceDTO } from "./author.model";

export interface CatalogAuthorHttpResponse {
    data: any;
    message: string;
    code: number;
}

export interface UserAuthorPreferenceHttpResponse {
    data: any;
    message: string;
    code: number;
}

export interface UserAuthorPreferenceHttpPagedResponse {
    data: UserAuthorPreferencePagedData;
    message: string;
    code: number;
}

export interface UserAuthorPreferencePagedData {
    totalPages: number,
    totalElements: number,
    size: number,
    content: UserAuthorPreferenceDTO[];
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