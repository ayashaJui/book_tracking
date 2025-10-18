
import { CatalogPublisherDTO } from "./publisher.model";

export interface CatalogPublisherHttpResponse {
    data: any;
    message: string;
    code: number;
}

export interface UserPublisherPreferenceHttpResponse {
    data: any;
    message: string;
    code: number;
}

export interface UserPublisherPreferenceHttpPagedResponse {
    data: UserPublisherPreferencePagedData;
    message: string;
    code: number;
}

export interface UserPublisherPreferencePagedData {
    totalPages: number,
    totalElements: number,
    size: number,
    content: CatalogPublisherDTO[];
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