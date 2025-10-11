package com.biblioteca.catalogservice.service;

import com.biblioteca.catalogservice.dto.author.AuthorCreateDTO;
import com.biblioteca.catalogservice.dto.author.AuthorDTO;
import com.biblioteca.catalogservice.dto.author.AuthorUpdateDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public interface AuthorService {
    AuthorDTO createAuthor(AuthorCreateDTO authorCreateDTO, HttpServletRequest request, Jwt jwt);

    List<AuthorDTO> getAll(HttpServletRequest request, Jwt jwt);

    AuthorDTO getById(Integer id, HttpServletRequest request, Jwt jwt);

    Page<AuthorDTO> getAllWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt);

    AuthorDTO updateAuthor(AuthorUpdateDTO updateDTO, HttpServletRequest request, Jwt jwt);

    String deleteAuthor(Integer id, HttpServletRequest request, Jwt jwt);

    List<AuthorDTO> searchAuthor(String authorName, HttpServletRequest request, Jwt jwt);

    List<AuthorDTO> getAuthorsByIds(List<Integer> ids, HttpServletRequest request, Jwt jwt);
}
