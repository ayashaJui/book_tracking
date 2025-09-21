package com.biblioteca.catalogservice.dto.seriesGenre;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SeriesGenreDTO {
    private Integer id;
//    private Integer seriesId;
    private Integer genreId;

    private String genreName;
}
