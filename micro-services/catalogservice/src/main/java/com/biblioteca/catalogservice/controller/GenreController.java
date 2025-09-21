package com.biblioteca.catalogservice.controller;

import com.biblioteca.catalogservice.dto.genre.GenreCreateDTO;
import com.biblioteca.catalogservice.dto.genre.GenreDTO;
import com.biblioteca.catalogservice.dto.genre.GenreUpdateDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.response.ResponseDTO;
import com.biblioteca.catalogservice.service.GenreService;
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
@RequestMapping("/v1/genres")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "2. Genre Controller", description = "Genre Related APIs")
public class GenreController {
    private final GenreService genreService;

    @PostMapping
    @Operation(summary = "API ID: Genre001")
    public ResponseEntity<ResponseDTO<GenreDTO>> createGenre(@RequestBody @Valid GenreCreateDTO genreCreateDTO,  HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("createGenre in GenreController is called with data: {} by user: {}", genreCreateDTO, jwt.getSubject());

        GenreDTO genreDTO = genreService.createGenre(genreCreateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(genreDTO, "success", HttpStatus.CREATED.value()), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "API ID: Genre002")
    public ResponseEntity<ResponseDTO<List<GenreDTO>>> getAllGenres(HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getAllGenres in GenreController is called by user: {}", jwt.getSubject());

        List<GenreDTO> genreDTOList = genreService.getAllGenres(request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(genreDTOList, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "API ID: Genre003")
    public ResponseEntity<ResponseDTO<GenreDTO>> getGenreById(@PathVariable Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getGenreById in GenreController is called with id: {} by user: {}", id, jwt.getSubject());

        GenreDTO genreDTO = genreService.getGenreById(id, request, jwt);

        return  new ResponseEntity<>(new ResponseDTO<>(genreDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @PutMapping
    @Operation(summary = "API ID: Genre004")
    public ResponseEntity<ResponseDTO<GenreDTO>> updateGenre(@RequestBody @Valid GenreUpdateDTO genreUpdateDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("updateGenre in GenreController is called with data: {} by user: {}", genreUpdateDTO, jwt.getSubject());

        GenreDTO genreDTO = genreService.updateGenre(genreUpdateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(genreDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "API ID: Genre005")
    public ResponseEntity<ResponseDTO<String>> deleteGenre(@PathVariable Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("deleteGenre in GenreController is called with id: {} by user: {}", id, jwt.getSubject());

        String message = genreService.deleteGenre(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(message, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @GetMapping("/pagination")
    @Operation(summary = "API ID: Genre006")
    public ResponseEntity<ResponseDTO<Page<GenreDTO>>> getAllGenresWithPagination(@RequestParam(value = "page", required = false, defaultValue = "1") int page, @RequestParam(value = "size", required = false, defaultValue = "10") int size,  HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getAllGenresWithPagination in GenreController is called by user: {}", jwt.getSubject());

        PageRequestDTO pageRequestDTO = new PageRequestDTO(page, size);

        Page<GenreDTO> genreDTOPage = genreService.getAllGenresWithPagination(pageRequestDTO, request, jwt);

        return new ResponseEntity<>(new  ResponseDTO<>(genreDTOPage, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }
}
