package com.biblioteca.catalogservice.dto.seriesGenre;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SeriesGenreCreateDTO {

    @NotNull(message = "Genre ID cannot be null")
    private Integer genreId;
}
