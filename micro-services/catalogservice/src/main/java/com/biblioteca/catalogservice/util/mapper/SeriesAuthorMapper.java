package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorCreateDTO;
import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorDTO;
import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorUpdateDTO;
import com.biblioteca.catalogservice.entity.SeriesAuthor;
import com.biblioteca.catalogservice.util.enums.AuthorRoleEnums;

public class SeriesAuthorMapper {
    public static SeriesAuthorDTO toDTO(SeriesAuthor seriesAuthor) {
        return SeriesAuthorDTO.builder()
                .id(seriesAuthor.getId())
                .seriesId(seriesAuthor.getSeries().getId())
                .authorId(seriesAuthor.getAuthor().getId())
                .authorRole(seriesAuthor.getRole() != null ? AuthorRoleEnums.valueOf(seriesAuthor.getRole()) : null)
                .build();
    }

    public static SeriesAuthor fromCreateDTO(SeriesAuthorCreateDTO seriesAuthorCreateDTO) {
        return SeriesAuthor.builder()
                .role(seriesAuthorCreateDTO.getAuthorRole().name())
                .build();
    }

    public static SeriesAuthor fromUpdateDTO(SeriesAuthorUpdateDTO seriesAuthorUpdateDTO, SeriesAuthor seriesAuthor) {

        seriesAuthor.setRole(seriesAuthorUpdateDTO.getAuthorRole() != null ? seriesAuthorUpdateDTO.getAuthorRole().name() : seriesAuthor.getRole());

        return seriesAuthor;
    }
}
