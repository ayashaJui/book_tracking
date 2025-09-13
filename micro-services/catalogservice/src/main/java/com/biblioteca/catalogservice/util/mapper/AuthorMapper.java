package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.author.AuthorCreateDTO;
import com.biblioteca.catalogservice.dto.author.AuthorDTO;
import com.biblioteca.catalogservice.dto.author.AuthorUpdateDTO;
import com.biblioteca.catalogservice.entity.Author;

import java.time.LocalDateTime;
import java.util.List;

public class AuthorMapper {
    public static AuthorDTO toDTO(Author author) {

        return AuthorDTO.builder()
                .id(author.getId())
                .name(author.getName())
                .bio(author.getBio())
                .birthDate(author.getBirthDate())
                .deathDate(author.getDeathDate())
                .nationality(author.getNationality())
                .website(author.getWebsite())
                .imageId(author.getImageId())
                .createdAt(author.getCreatedAt())
                .updatedAt(author.getUpdatedAt())
                .build();
    }

    public static Author fromCreateDTO(AuthorCreateDTO authorCreateDTO) {
        return Author.builder()
                .name(authorCreateDTO.getName())
                .bio(authorCreateDTO.getBio())
                .birthDate(authorCreateDTO.getBirthDate())
                .deathDate(authorCreateDTO.getDeathDate())
                .nationality(authorCreateDTO.getNationality())
                .website(authorCreateDTO.getWebsite())
                .imageId(authorCreateDTO.getImageId())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static Author fromUpdateDTO(AuthorUpdateDTO authorUpdateDTO, Author author) {
        author.setName(authorUpdateDTO.getName());
        author.setBio(authorUpdateDTO.getBio());
        author.setBirthDate(authorUpdateDTO.getBirthDate());
        author.setDeathDate(authorUpdateDTO.getDeathDate());
        author.setNationality(authorUpdateDTO.getNationality());
        author.setWebsite(authorUpdateDTO.getWebsite());
        author.setImageId(authorUpdateDTO.getImageId());
        author.setUpdatedAt(LocalDateTime.now());

        return author;
    }
}
