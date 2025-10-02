package com.biblioteca.catalogservice.service;

import com.biblioteca.catalogservice.dto.bookEdition.BookEditionCreateDTO;
import com.biblioteca.catalogservice.dto.bookEdition.BookEditionDTO;
import com.biblioteca.catalogservice.dto.bookEdition.BookEditionUpdateDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public interface BookEditionService {
    BookEditionDTO createBookEdition(BookEditionCreateDTO bookEditionCreateDTO, HttpServletRequest request, Jwt jwt);

    Page<BookEditionDTO> getBookEditionsWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt);

    List<BookEditionDTO> getAllBookEditions(HttpServletRequest request, Jwt jwt);

    BookEditionDTO getBookEditionById(Integer id, HttpServletRequest request, Jwt jwt);

    BookEditionDTO updateBookEdition(BookEditionUpdateDTO bookEditionUpdateDTO, HttpServletRequest request, Jwt jwt);

    String deleteBookEditionById(Integer id, HttpServletRequest request, Jwt jwt);

    List<BookEditionDTO> getByBookId(Integer bookId, HttpServletRequest request, Jwt jwt);

    List<BookEditionDTO> getByPublisherId(Integer publisherId, HttpServletRequest request, Jwt jwt);
}
