package com.biblioteca.catalogservice.controller;

import com.biblioteca.catalogservice.dto.author.AuthorCreateDTO;
import com.biblioteca.catalogservice.dto.author.AuthorDTO;
import com.biblioteca.catalogservice.dto.author.AuthorUpdateDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.response.ResponseDTO;
import com.biblioteca.catalogservice.service.AuthorService;
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
@RequiredArgsConstructor
@RequestMapping("/v1/authors")
@Tag(name = "1. Author Controller", description = "Author Related APIs")
@Slf4j
public class AuthorController {
    private final AuthorService authorService;

    @Operation(summary = "APT ID: Author001")
    @PostMapping
    public ResponseEntity<ResponseDTO<AuthorDTO>> createAuthor(@RequestBody @Valid AuthorCreateDTO authorCreateDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ) {
        log.info("createAuthor in AuthorController is called with data: {} by user: {}", authorCreateDTO, jwt.getSubject());

        AuthorDTO authorDTO = authorService.createAuthor(authorCreateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(authorDTO, "success", HttpStatus.CREATED.value()), HttpStatus.CREATED);
    }

    @Operation(summary = "APT ID: Author002")
    @GetMapping
    public ResponseEntity<ResponseDTO<List<AuthorDTO>>> getAllAuthor( HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ) {
        log.info("getAllAuthor in AuthorController is called  by user: {}", jwt.getSubject());

        List<AuthorDTO> authorDTOs = authorService.getAll( request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(authorDTOs, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "APT ID: Author003")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO<AuthorDTO>> getById(@PathVariable(value = "id") Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ) {
        log.info("getById in AuthorController is called  by user: {}", jwt.getSubject());

        AuthorDTO authorDTO = authorService.getById(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(authorDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "APT ID: Author004")
    @PutMapping
    public ResponseEntity<ResponseDTO<AuthorDTO>> updateAuthor(@RequestBody @Valid AuthorUpdateDTO updateDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ) {
        log.info("updateAuthor in AuthorController is called with data: {} by user: {}", updateDTO, jwt.getSubject());

        AuthorDTO authorDTO = authorService.updateAuthor(updateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(authorDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "APT ID: Author005")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<String>> deleteAuthor(@PathVariable(value = "id") Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ) {
        log.info("deleteAuthor in AuthorController is called  by user: {}", jwt.getSubject());

        String message = authorService.deleteAuthor(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(message, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "APT ID: Author006")
    @GetMapping("/pagination")
    public ResponseEntity<ResponseDTO<Page<AuthorDTO>>> getAllAuthorWithPagination(@RequestParam(value = "page", required = false, defaultValue = "1") int page, @RequestParam(value = "size", required = false, defaultValue = "10") int size, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ) {
        log.info("getAllAuthorWithPagination in AuthorController is called  by user: {}", jwt.getSubject());

        PageRequestDTO pageRequestDTO = new PageRequestDTO(page, size);

        Page<AuthorDTO> authorDTOs = authorService.getAllWithPagination(pageRequestDTO,  request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(authorDTOs, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }
}
