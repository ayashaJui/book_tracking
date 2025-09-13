package com.biblioteca.catalogservice.dto.bookGenre;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BookGenreCreateDTO {
    @NotNull(message = "Book ID cannot be null")
    private Integer bookId;

    @NotNull(message = "Genre ID cannot be null")
    private Integer genreId;
}
