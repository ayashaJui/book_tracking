package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.genre.GenreCreateDTO;
import com.biblioteca.catalogservice.dto.genre.GenreDTO;
import com.biblioteca.catalogservice.dto.genre.GenreUpdateDTO;
import com.biblioteca.catalogservice.entity.Genre;

import java.time.LocalDateTime;

public class GenreMapper {
    public static GenreDTO toDTO(Genre genre) {
        return GenreDTO.builder()
                .id(genre.getId())
                .name(genre.getName())
                .description(genre.getDescription())
                .parentGenreId(genre.getParentGenreId() != null ? genre.getParentGenreId().getId() : null)
                .isActive(genre.getIsActive())
                .createdAt(genre.getCreatedAt())
                .updatedAt(genre.getUpdatedAt())
                .build();
    }

    public static Genre fromCreateDTO(GenreCreateDTO genreCreateDTO) {
        return Genre.builder()
                .name(genreCreateDTO.getName())
                .description(genreCreateDTO.getDescription())
                .isActive(genreCreateDTO.getIsActive() != null ? genreCreateDTO.getIsActive() : true)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public  static Genre fromUpdateDTO(GenreUpdateDTO genreUpdateDTO, Genre genre) {

        genre.setName(genreUpdateDTO.getName());
        genre.setDescription(genreUpdateDTO.getDescription());
        genre.setIsActive(genreUpdateDTO.getIsActive() != null ? genreUpdateDTO.getIsActive() : genre.getIsActive());
        genre.setUpdatedAt(LocalDateTime.now());

        return genre;
    }
}
