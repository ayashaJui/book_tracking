package com.biblioteca.catalogservice.dto.search;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class SearchDTO {
    private Integer id;
    private String name;
    private String title;
    private String description;
}
