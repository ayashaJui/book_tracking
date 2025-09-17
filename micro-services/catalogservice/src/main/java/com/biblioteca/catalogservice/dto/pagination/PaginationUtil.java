package com.biblioteca.catalogservice.dto.pagination;

import org.springframework.data.domain.*;

import java.util.List;

public class PaginationUtil {
    public static Pageable getPageable(Integer page, Integer size) {
        if (page > 0) page = page - 1;
        return PageRequest.of(page, size);
    }

    public static Pageable getPageableSorted(Integer page, Integer size, Sort sort) {
        if (page > 0) page = page - 1;
        return PageRequest.of(page, size, sort);
    }

    public static <T> Page<T> getPage(List<T> content, Pageable pageable, long total) {
        return new PageImpl<>(content, pageable, total);
    }

}
