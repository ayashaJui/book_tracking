package com.biblioteca.catalogservice.dto.bookSeries;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BookSeriesUpdateDTO {
    @NotNull(message = "ID cannot be null" )
    private Integer id;

    @NotNull(message = "Book ID cannot be null" )
    private Integer bookId;

    @NotNull(message = "Series ID cannot be null" )
    private Integer seriesId;

    @NotNull(message = "Position cannot be null" )
    private Integer position;
}
