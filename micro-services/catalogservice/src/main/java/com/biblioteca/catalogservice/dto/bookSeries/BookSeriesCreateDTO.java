package com.biblioteca.catalogservice.dto.bookSeries;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NotNull
@AllArgsConstructor
@Builder
@ToString
public class BookSeriesCreateDTO {
    @NotNull(message = "Book ID cannot be null" )
    private Integer bookId;

    @NotNull(message = "Series ID cannot be null" )
    private Integer seriesId;

    @NotNull(message = "Position cannot be null" )
    private Integer position;
}
