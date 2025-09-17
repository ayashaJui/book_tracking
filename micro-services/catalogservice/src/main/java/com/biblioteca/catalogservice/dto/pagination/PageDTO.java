package com.biblioteca.catalogservice.dto.pagination;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PageDTO<T> {
    private T data;

    private int totalPage;

    private int currentPage;

    private int pageSize;

}
