package com.biblioteca.catalogservice.service;

import com.biblioteca.catalogservice.dto.author.AuthorDTO;
import com.biblioteca.catalogservice.dto.book.BookCreateDTO;
import com.biblioteca.catalogservice.dto.book.BookDTO;
import com.biblioteca.catalogservice.dto.book.BookUpdateDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public interface BookService {
    BookDTO createBook(BookCreateDTO bookCreateDTO, HttpServletRequest request, Jwt jwt);

    List<BookDTO> getAllBooks(HttpServletRequest request, Jwt jwt);

    Page<BookDTO> getAllBooksWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt);

    BookDTO getBookById(Integer id, HttpServletRequest request, Jwt jwt);

    BookDTO updateBook(BookUpdateDTO bookUpdateDTO, HttpServletRequest request, Jwt jwt);

    String deleteBook(Integer id, HttpServletRequest request, Jwt jwt);

    List<BookDTO> getBookBySeriesId(Integer seriesId, HttpServletRequest request, Jwt jwt);

    List<BookDTO> getBookByAuthorId(Integer authorId, HttpServletRequest request, Jwt jwt);

    List<BookDTO> getBookByGenreId(Integer genreId, HttpServletRequest request, Jwt jwt);

    List<BookDTO> searchBook(String title, HttpServletRequest request, Jwt jwt);
}
