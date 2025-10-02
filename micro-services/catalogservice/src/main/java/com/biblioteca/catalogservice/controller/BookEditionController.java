package com.biblioteca.catalogservice.controller;

import com.biblioteca.catalogservice.dto.bookEdition.BookEditionCreateDTO;
import com.biblioteca.catalogservice.dto.bookEdition.BookEditionDTO;
import com.biblioteca.catalogservice.dto.bookEdition.BookEditionUpdateDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.response.ResponseDTO;
import com.biblioteca.catalogservice.service.BookEditionService;
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
@RequestMapping("/v1/book_editions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "6. Book Edition Controller", description = "Book Edition Related APIs")
public class BookEditionController {
    private final BookEditionService bookEditionService;

    @Operation(summary = "API ID: BookEdition001")
    @PostMapping
    public ResponseEntity<ResponseDTO<BookEditionDTO>> createBookEdition(@RequestBody @Valid BookEditionCreateDTO bookEditionCreateDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt){
        log.info("createBookEdition in BookEditionController is called");

        BookEditionDTO bookEditionDTO = bookEditionService.createBookEdition(bookEditionCreateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookEditionDTO, "success", HttpStatus.CREATED.value()), HttpStatus.CREATED);
    }

    @Operation(summary = "API ID: BookEdition002")
    @GetMapping("/paginated")
    public ResponseEntity<ResponseDTO<Page<BookEditionDTO>>> getAllWithPagination(@RequestParam(defaultValue = "1") int page,
                                                                                  @RequestParam(defaultValue = "10") int size,
                                                                                  HttpServletRequest request,
                                                                                  @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt){
        log.info("getAllWithPagination in BookEditionController is called");

        PageRequestDTO pageRequestDTO = new PageRequestDTO(page, size);

        Page<BookEditionDTO> bookEditionDTOPage = bookEditionService.getBookEditionsWithPagination(pageRequestDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookEditionDTOPage, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: BookEdition003")
    @GetMapping
    public ResponseEntity<ResponseDTO<List<BookEditionDTO>>> getAll(HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt){
        log.info("getAll in BookEditionController is called");

        List<BookEditionDTO>  bookEditionDTOList = bookEditionService.getAllBookEditions(request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookEditionDTOList, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: BookEdition004")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO<BookEditionDTO>> getById(@PathVariable(value = "id") Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt){
        log.info("getById in BookEditionController is called");

        BookEditionDTO bookEditionDTO = bookEditionService.getBookEditionById(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookEditionDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: BookEdition005")
    @PutMapping
    public ResponseEntity<ResponseDTO<BookEditionDTO>> updateBookEdition(@RequestBody @Valid BookEditionUpdateDTO bookEditionUpdateDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt){
        log.info("updateBookEdition in BookEditionController is called");

        BookEditionDTO bookEditionDTO = bookEditionService.updateBookEdition(bookEditionUpdateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookEditionDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: BookEdition006")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<String>> deleteBookEdition(@PathVariable(value = "id") Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt){
        log.info("deleteBookEdition in BookEditionController is called");

        String message = bookEditionService.deleteBookEditionById(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(message, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: BookEdition007")
    @GetMapping("/book/{bookId}")
    public ResponseEntity<ResponseDTO<List<BookEditionDTO>>> getBookEditionByBookId(@PathVariable(value = "bookId") Integer bookId, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt){
        log.info("getBookEditionByBookId in BookEditionController is called with book id: {} ", bookId);

        List<BookEditionDTO> bookEditionDTOList = bookEditionService.getByBookId(bookId, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookEditionDTOList, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: BookEdition008")
    @GetMapping("/publisher/{publisherId}")
    public ResponseEntity<ResponseDTO<List<BookEditionDTO>>> getBookEditionByPublisherId(@PathVariable(value = "publisherId") Integer publisherId, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt){
        log.info("getBookEditionByPublisherId in BookEditionController is called with publisher id: {} ", publisherId);

        List<BookEditionDTO> bookEditionDTOList = bookEditionService.getByPublisherId(publisherId, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(bookEditionDTOList, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }
}
