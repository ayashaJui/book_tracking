package com.biblioteca.catalogservice.dto.bookGenre;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BookGenreDTO {
    private Integer bookId;

    private Integer genreId;
}
