package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.series.SeriesCreateDTO;
import com.biblioteca.catalogservice.dto.series.SeriesDTO;
import com.biblioteca.catalogservice.dto.series.SeriesUpdateDTO;
import com.biblioteca.catalogservice.entity.Series;

import java.time.LocalDateTime;
import java.util.ArrayList;

public class SeriesMapper {
    public static SeriesDTO toDTO(Series series) {
        return SeriesDTO.builder()
                .id(series.getId())
                .name(series.getName())
                .description(series.getDescription())
                .totalBooks(series.getTotalBooks())
                .isCompleted(series.getIsCompleted())
                .seriesAuthors(series.getSeriesAuthors() != null ? series.getSeriesAuthors().stream().map(SeriesAuthorMapper::toDTO).toList() : new ArrayList<>())
                .seriesGenres(series.getSeriesGenres() != null ? series.getSeriesGenres().stream().map(SeriesGenreMapper::toDTO).toList() : new ArrayList<>())
                .createdAt(series.getCreatedAt())
                .updatedAt(series.getUpdatedAt())
                .build();
    }

    public static Series fromCreateDTO(SeriesCreateDTO seriesCreateDTO) {
        return Series.builder()
                .name(seriesCreateDTO.getName())
                .description(seriesCreateDTO.getDescription())
                .totalBooks(seriesCreateDTO.getTotalBooks())
                .isCompleted(seriesCreateDTO.getIsCompleted() != null ? seriesCreateDTO.getIsCompleted() : false)
                .seriesAuthors(new ArrayList<>())
                .seriesGenres(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static Series fromUpdateDTO(SeriesUpdateDTO seriesUpdateDTO, Series series) {
        series.setName(seriesUpdateDTO.getName());
        series.setDescription(seriesUpdateDTO.getDescription());
        series.setTotalBooks(seriesUpdateDTO.getTotalBooks());
        series.setIsCompleted(seriesUpdateDTO.getIsCompleted() != null ? seriesUpdateDTO.getIsCompleted() : series.getIsCompleted());
        series.setUpdatedAt(LocalDateTime.now());
        return series;
    }
}
