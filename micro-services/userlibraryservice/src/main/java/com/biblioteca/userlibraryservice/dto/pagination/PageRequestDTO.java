package com.biblioteca.userlibraryservice.dto.pagination;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PageRequestDTO {
    private int page;
    private int size;
}
