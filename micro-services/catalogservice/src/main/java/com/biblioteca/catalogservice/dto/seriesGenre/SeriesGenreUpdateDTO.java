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
    // No ID field - we use natural key (seriesId + genreId) to identify relationships
    
    @NotNull(message = "Genre ID cannot be null")
    private Integer genreId;
}
