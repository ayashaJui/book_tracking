package com.biblioteca.catalogservice.dto.bookGenre;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BookGenreUpdateDTO {
    @NotNull(message = "ID cannot be null")
    private Integer id;

    @NotNull(message = "Book ID cannot be null")
    private Integer bookId;

    @NotNull(message = "Genre ID cannot be null")
    private Integer genreId;
}
