package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorCreateDTO;
import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorDTO;
import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorUpdateDTO;
import com.biblioteca.catalogservice.entity.SeriesAuthor;
import com.biblioteca.catalogservice.util.enums.AuthorRoleEnums;

public class SeriesAuthorMapper {
    public static SeriesAuthorDTO toDTO(SeriesAuthor seriesAuthor) {
        return SeriesAuthorDTO.builder()
                .seriesId(seriesAuthor.getSeries().getId())
                .authorId(seriesAuthor.getAuthor().getId())
                .authorRole(seriesAuthor.getId().getRole() != null ? AuthorRoleEnums.valueOf(seriesAuthor.getId().getRole()) : null)
                .build();
    }

    public static SeriesAuthor fromCreateDTO(SeriesAuthorCreateDTO seriesAuthorCreateDTO) {
        return SeriesAuthor.builder()
                .id(SeriesAuthor.SeriesAuthorId.builder()
                        .seriesId(seriesAuthorCreateDTO.getSeriesId())
                        .authorId(seriesAuthorCreateDTO.getAuthorId())
                        .role(seriesAuthorCreateDTO.getAuthorRole().name())
                        .build())
                .build();
    }

    public static SeriesAuthor fromUpdateDTO(SeriesAuthorUpdateDTO seriesAuthorUpdateDTO, SeriesAuthor seriesAuthor) {

        seriesAuthor.setId(
                SeriesAuthor.SeriesAuthorId.builder()
                        .seriesId(seriesAuthorUpdateDTO.getSeriesId())
                        .authorId(seriesAuthorUpdateDTO.getAuthorId())
                        .role(seriesAuthorUpdateDTO.getAuthorRole().name())
                        .build()
        );

        return seriesAuthor;
    }
}
