package com.biblioteca.catalogservice.dto.bookGenre;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BookGenreDTO {
    private Integer id;

    private String genreName;

    private Integer genreId;
}
