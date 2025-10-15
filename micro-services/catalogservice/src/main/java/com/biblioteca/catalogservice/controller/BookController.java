package com.biblioteca.catalogservice.controller;

import com.biblioteca.catalogservice.dto.author.AuthorDTO;
import com.biblioteca.catalogservice.dto.book.BookCreateDTO;
import com.biblioteca.catalogservice.dto.book.BookDTO;
import com.biblioteca.catalogservice.dto.book.BookUpdateDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.response.ResponseDTO;
import com.biblioteca.catalogservice.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/books")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "5. Book Controller", description = "Book Related APIs")
public class BookController {
    private final BookService bookService;

    @Operation(summary = "API ID: Book001")
    @PostMapping
    public ResponseEntity<ResponseDTO<BookDTO>> createBook(@RequestBody @Valid BookCreateDTO bookCreateDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("createBook in BookController is called with data: {} by user: {}", bookCreateDTO, jwt.getSubject());

        BookDTO bookDTO = bookService.createBook(bookCreateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookDTO, "success", HttpStatus.CREATED.value()), HttpStatus.CREATED);
    }

    @Operation(summary = "API ID: Book002")
    @GetMapping
    public ResponseEntity<ResponseDTO<List<BookDTO>>> getAllBooks(HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getAllBooks in BookController is called with data: {}", jwt.getSubject());

        List<BookDTO> bookDTOList = bookService.getAllBooks(request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookDTOList, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Book003")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO<BookDTO>> getBookById(@PathVariable(value = "id") Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getBookById in BookController is called with id: {}", id);

        BookDTO bookDTO = bookService.getBookById(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Book004")
    @GetMapping("/paginated")
    public ResponseEntity<ResponseDTO<Page<BookDTO>>> getAllBooksWithPagination(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getAllBooksWithPagination in BookController is called by user: {}",  jwt.getSubject());

        PageRequestDTO pageRequestDTO = new PageRequestDTO(page, size);

        Page<BookDTO> bookDTOPage = bookService.getAllBooksWithPagination(pageRequestDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookDTOPage, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Book005")
    @PutMapping
    public ResponseEntity<ResponseDTO<BookDTO>> updateBook(@RequestBody @Valid BookUpdateDTO bookUpdateDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("updateBook in BookController is called with data: {} by user: {}", bookUpdateDTO, jwt.getSubject());

        BookDTO updatedBookDTO = bookService.updateBook(bookUpdateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(updatedBookDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Book006")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<String>> deleteBook(@PathVariable(value = "id") Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("deleteBook in BookController is called with id: {} by user: {}", id, jwt.getSubject());

        String responseMessage = bookService.deleteBook(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(responseMessage, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Book007")
    @GetMapping("/series/{seriesId}")
    public ResponseEntity<ResponseDTO<List<BookDTO>>> getBookBySeriesId(@PathVariable(value = "seriesId") Integer seriesId, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getBookBySeriesId in BookController is called with id: {}", seriesId);

        List<BookDTO> bookDTO = bookService.getBookBySeriesId(seriesId, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Book008")
    @GetMapping("/authors/{authorId}")
    public ResponseEntity<ResponseDTO<List<BookDTO>>> getBookByAuthorId(@PathVariable(value = "authorId") Integer authorId, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getBookByAuthorId in BookController is called with id: {}", authorId);

        List<BookDTO> bookDTO = bookService.getBookByAuthorId(authorId, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Book007")
    @GetMapping("/genres/{genreId}")
    public ResponseEntity<ResponseDTO<List<BookDTO>>> getBookByGenreId(@PathVariable(value = "genreId") Integer genreId, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getBookByGenreId in BookController is called with id: {}", genreId);

        List<BookDTO> bookDTO = bookService.getBookByGenreId(genreId, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "APT ID: Book008")
    @GetMapping("/search")
    public ResponseEntity<ResponseDTO<List<BookDTO>>> searchAuthor(@RequestParam(value = "title", required = false) String title,
                                                                     HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ) {
        log.info("searchAuthor in AuthorController is called  by user: {}", jwt.getSubject());

        List<BookDTO> authorDTOs = bookService.searchBook(title,  request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(authorDTOs, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }
}
