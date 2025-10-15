package com.biblioteca.catalogservice.service;

import com.biblioteca.catalogservice.dto.author.AuthorDTO;
import com.biblioteca.catalogservice.dto.genre.GenreCreateDTO;
import com.biblioteca.catalogservice.dto.genre.GenreDTO;
import com.biblioteca.catalogservice.dto.genre.GenreUpdateDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public interface GenreService {
    GenreDTO createGenre(GenreCreateDTO genreCreateDTO, HttpServletRequest request, Jwt jwt);

    List<GenreDTO> getAllGenres(HttpServletRequest request, Jwt jwt);

    GenreDTO getGenreById(Integer id, HttpServletRequest request, Jwt jwt);

    GenreDTO updateGenre(GenreUpdateDTO genreUpdateDTO, HttpServletRequest request, Jwt jwt);

    String deleteGenre(Integer id, HttpServletRequest request, Jwt jwt);

    Page<GenreDTO> getAllGenresWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt);

    List<GenreDTO> searchGenre(String genreName, HttpServletRequest request, Jwt jwt);

    List<GenreDTO> getGenresByIds(List<Integer> ids, HttpServletRequest request, Jwt jwt);
}
