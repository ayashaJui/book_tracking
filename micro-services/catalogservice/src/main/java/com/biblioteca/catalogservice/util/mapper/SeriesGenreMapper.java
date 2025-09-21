package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.seriesGenre.SeriesGenreDTO;
import com.biblioteca.catalogservice.entity.SeriesGenre;

public class SeriesGenreMapper {
    public static SeriesGenreDTO toDTO(SeriesGenre seriesGenre) {
        return SeriesGenreDTO.builder()
                .id(seriesGenre.getId())
//                .seriesId(seriesGenre.getSeries().getId())
                .genreId(seriesGenre.getGenre().getId())
                .genreName(seriesGenre.getGenre().getName())
                .build();
    }
}
