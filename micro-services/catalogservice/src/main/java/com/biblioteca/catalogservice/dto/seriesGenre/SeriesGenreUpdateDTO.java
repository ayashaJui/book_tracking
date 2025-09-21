package com.biblioteca.catalogservice.dto.seriesGenre;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SeriesGenreUpdateDTO {
    @NotNull(message = "ID cannot be null")
    private Integer id;

//    @NotNull(message = "Series ID cannot be null")
//    private Integer seriesId;

    @NotNull(message = "Genre ID cannot be null")
    private Integer genreId;
}
