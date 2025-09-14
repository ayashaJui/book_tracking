package com.biblioteca.catalogservice.dto.bookSeries;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BookSeriesDTO {
    private Integer id;

    private Integer bookId;

    private Integer seriesId;

    private Integer position;
}
