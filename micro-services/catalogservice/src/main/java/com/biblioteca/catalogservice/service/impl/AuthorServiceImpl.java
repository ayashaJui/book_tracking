package com.biblioteca.catalogservice.service.impl;

import com.biblioteca.catalogservice.dto.author.AuthorCreateDTO;
import com.biblioteca.catalogservice.dto.author.AuthorDTO;
import com.biblioteca.catalogservice.dto.author.AuthorUpdateDTO;
import com.biblioteca.catalogservice.dto.book.BookDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.pagination.PaginationUtil;
import com.biblioteca.catalogservice.entity.Author;
import com.biblioteca.catalogservice.entity.Book;
import com.biblioteca.catalogservice.entity.BookAuthor;
import com.biblioteca.catalogservice.repository.AuthorRepository;
import com.biblioteca.catalogservice.service.AuthorService;
import com.biblioteca.catalogservice.service.BookService;
import com.biblioteca.catalogservice.util.exception.CustomException;
import com.biblioteca.catalogservice.util.mapper.AuthorMapper;
import com.biblioteca.catalogservice.util.mapper.BookMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {
    private final AuthorRepository authorRepository;
    private final BookService bookService;

    @Override
    @Transactional
    public AuthorDTO createAuthor(AuthorCreateDTO authorCreateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("createAuthor in AuthorServiceImpl is called with data: {} by user: {}", authorCreateDTO, jwt.getSubject());

        Optional<Author> existingAuthor = authorRepository.findByNameIgnoreCase(authorCreateDTO.getName());
        if (existingAuthor.isPresent()) {
            log.error("Author with name '{}' already exists", authorCreateDTO.getName());
            throw new CustomException("Author with the same name already exists", CONFLICT.value());
        }

        Author author = fromCreateDTO(authorCreateDTO);

        try {
            authorRepository.save(author);

            log.info("Author created successfully ");

            return convertToDTO(author);
        }catch (Exception e) {
            log.error("Error occurred while creating author: {}", e.getMessage());
            throw new CustomException("Failed to create author", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public List<AuthorDTO> getAll(HttpServletRequest request, Jwt jwt) {
        log.info("getAll in AuthorServiceImpl is called with data: {}", jwt.getSubject());

        List<AuthorDTO> authorDTOs = authorRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();

        return authorDTOs;
    }

    @Override
    public AuthorDTO getById(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("getById in AuthorServiceImpl is called with id: {} by user: {}", id, jwt.getSubject());

        Author author = findById(id);

        AuthorDTO authorDTO = convertToDTO(author);

        List<Book> books = author.getBookAuthors()
                .stream()
                .map(BookAuthor::getBook)
                .toList();

        Set<String> genres = books.stream()
                .flatMap(book -> book.getBookGenres().stream())
                .map(bg -> bg.getGenre().getName())
                .collect(Collectors.toSet());

        double avgRating = books.stream()
                .filter(b -> b.getAverageRating() != null)
                .mapToDouble(Book::getAverageRating)
                .average()
                .orElse(0.0);

        authorDTO.setTotalBooks((long) books.size());
        authorDTO.setGenres(genres);
        authorDTO.setAverageRating(avgRating);
        authorDTO.setBooks(books.stream().map(this::convertToBookDTO).toList());

        return authorDTO;
    }

    @Override
    public Page<AuthorDTO> getAllWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt) {
        log.info("getAllWithPagination in AuthorServiceImpl is called by user: {}", jwt.getSubject());

        Sort sort = Sort.by(Sort.Direction.DESC, "id");

        Pageable pageable = PaginationUtil.getPageableSorted(pageRequestDTO.getPage(), pageRequestDTO.getSize(), sort);


        Page<Author> authorPage = authorRepository.findAll(pageable);

        return authorPage.map(this::convertToDTO);
    }

    @Override
    @Transactional
    public AuthorDTO updateAuthor(AuthorUpdateDTO updateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("updateAuthor in AuthorServiceImpl is called with data: {} by user: {}", updateDTO, jwt.getSubject());

        Optional<Author> existingAuthor = authorRepository.findByNameIgnoreCase(updateDTO.getName());

        if(existingAuthor.isPresent() && !existingAuthor.get().getId().equals(updateDTO.getId())) {
            log.error("Author with name '{}' already exists", updateDTO.getName());
            throw new CustomException("Author with the same name already exists", CONFLICT.value());
        }

        Author author = findById(updateDTO.getId());

        author = fromUpdateDTO(updateDTO, author);

        author.setId(updateDTO.getId());

        try{
            authorRepository.save(author);

            log.info("Author updated successfully ");

            return convertToDTO(author);
        }catch (Exception e) {
            log.error("Error occurred while updating author: {}", e.getMessage());
            throw new CustomException("Failed to update author", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public String deleteAuthor(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("deleteAuthor in AuthorServiceImpl is called with id: {} by user: {}", id, jwt.getSubject());

        Author author = findById(id);

        try {
            authorRepository.delete(author);
            log.info("Author deleted successfully ");
            return "Author deleted successfully";
        } catch (Exception e) {
            log.error("Error occurred while deleting author: {}", e.getMessage());
            throw new CustomException("Failed to delete author", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public List<AuthorDTO> searchAuthor(String authorName, HttpServletRequest request, Jwt jwt) {
        log.info("searchAuthor in AuthorServiceImpl is called with data: {} by user: {}", authorName, jwt.getSubject());

        List<Author>  authors = authorRepository.findByNameContaining(authorName);
        List<AuthorDTO> authorDTOS = authors.stream().map(this::convertToDTO).toList();

        return authorDTOS;
    }

    @Override
    public List<AuthorDTO> getAuthorsByIds(List<Integer> ids, HttpServletRequest request, Jwt jwt) {
        log.info("getAuthorsByIds method is called with data: {}", ids);

        if (ids == null || ids.isEmpty()) {
            throw new CustomException("Author ID list cannot be empty", HttpStatus.BAD_REQUEST.value());
        }

        List<Author> authors = authorRepository.findAllById(ids);
        if (authors.isEmpty()) {
            throw new CustomException("No authors found for given IDs", HttpStatus.NOT_FOUND.value());
        }

        List<AuthorDTO> authorDTOS = authors.stream().map((author) -> {
            List<Book> books = author.getBookAuthors().stream().map(BookAuthor::getBook).distinct().toList();

            Set<String> genres = books.stream()
                    .flatMap(book -> book.getBookGenres().stream())
                    .map(bg -> bg.getGenre().getName())
                    .collect(Collectors.toSet());

            double avgRating = books.stream()
                    .filter(book -> book.getAverageRating() != null)
                    .mapToDouble(Book::getAverageRating)
                    .average()
                    .orElse(0.0);

            return AuthorDTO.builder()
                    .id(author.getId())
                    .name(author.getName())
                    .nationality(author.getNationality())
                    .bio(author.getBio())
                    .birthDate(author.getBirthDate())
                    .deathDate(author.getDeathDate())
                    .website(author.getWebsite())
                    .instagramUrl(author.getInstagramUrl())
                    .threadsUrl(author.getThreadsUrl())
                    .goodreadUrl(author.getGoodreadUrl())
                    .totalBooks((long) books.size())
                    .genres(genres)
                    .averageRating(avgRating)
                    .build();
        }).toList();

        return authorDTOS;
    }

    private Author findById(Integer id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Author not found with id: {}", id);
                    return new CustomException("Author not found", NOT_FOUND.value());
                });
    }

    public Author fromCreateDTO(AuthorCreateDTO authorCreateDTO){
        return AuthorMapper.fromCreateDTO(authorCreateDTO);
    }

    public AuthorDTO convertToDTO(Author author){
        return AuthorMapper.toDTO(author);
    }

    public Author fromUpdateDTO(AuthorUpdateDTO authorUpdateDTO, Author author){
        return AuthorMapper.fromUpdateDTO(authorUpdateDTO, author);
    }

    private BookDTO convertToBookDTO(Book book) {
        return BookMapper.toDTO(book);
    }

}
