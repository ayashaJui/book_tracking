package com.biblioteca.catalogservice.controller;

import com.biblioteca.catalogservice.dto.author.AuthorDTO;
import com.biblioteca.catalogservice.dto.book.BookDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.response.ResponseDTO;
import com.biblioteca.catalogservice.dto.series.SeriesCreateDTO;
import com.biblioteca.catalogservice.dto.series.SeriesDTO;
import com.biblioteca.catalogservice.dto.series.SeriesUpdateDTO;
import com.biblioteca.catalogservice.service.SeriesService;
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

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/series")
@Tag(name = "4. Series Controller", description = "Series Related APIs")
public class SeriesController {
    private final SeriesService seriesService;

    @Operation(summary = "API ID: Series001")
    @PostMapping
    public ResponseEntity<ResponseDTO<SeriesDTO>> createSeries(@RequestBody @Valid SeriesCreateDTO seriesCreateDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("createSeries in SeriesController is called with data: {} by user: {}", seriesCreateDTO, jwt.getSubject());

        SeriesDTO seriesDTO = seriesService.createSeries(seriesCreateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(seriesDTO, "success", HttpStatus.CREATED.value()), HttpStatus.CREATED);
    }

    @Operation(summary = "API ID: Series002")
    @GetMapping
    public ResponseEntity<ResponseDTO<List<SeriesDTO>>> getAllSeries(HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getAllSeries in SeriesController is called by user: {}", jwt.getSubject());

        List<SeriesDTO> series = seriesService.getAll(request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(series, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Series003")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO<SeriesDTO>> getSeriesById(@PathVariable(value = "id") Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getSeriesById in SeriesController is called with id: {} by user: {}", id, jwt.getSubject());

        SeriesDTO seriesDTO = seriesService.getById(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(seriesDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Series004")
    @GetMapping("/pagination")
    public ResponseEntity<ResponseDTO<Page<SeriesDTO>>> getAllSeriesWithPagination(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            HttpServletRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getAllSeriesWithPagination in SeriesController is called with page: {}, size: {} by user: {}", page, size, jwt.getSubject());

        PageRequestDTO pageRequestDTO = new PageRequestDTO(page, size);

        Page<SeriesDTO> seriesPage = seriesService.getAllWithPagination(pageRequestDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(seriesPage, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Series005")
    @PutMapping
    public ResponseEntity<ResponseDTO<SeriesDTO>> updateSeries(@RequestBody @Valid SeriesUpdateDTO seriesUpdateDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("updateSeries in SeriesController is called with data: {} by user: {}", seriesUpdateDTO, jwt.getSubject());

        SeriesDTO seriesDTO = seriesService.updateSeries(seriesUpdateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(seriesDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Series006")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<String>> deleteSeries(@PathVariable(value = "id") Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("deleteSeries in SeriesController is called with id: {} by user: {}", id, jwt.getSubject());

        String message = seriesService.deleteSeries(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(message, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Series007")
    @GetMapping("/authors/{authorId}")
    public ResponseEntity<ResponseDTO<List<SeriesDTO>>> getSeriesByAuthorId(@PathVariable(value = "authorId") Integer authorId, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getSeriesByAuthorId in SeriesController is called with id: {}", authorId);

        List<SeriesDTO> seriesDTO = seriesService.getSeriesByAuthorId(authorId, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(seriesDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Series008")
    @GetMapping("/genres/{genreId}")
    public ResponseEntity<ResponseDTO<List<SeriesDTO>>> getSeriesByGenreId(@PathVariable(value = "genreId") Integer genreId, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getSeriesByGenreId in SeriesController is called with id: {}", genreId);

        List<SeriesDTO> seriesDTOS = seriesService.getSeriesByGenreId(genreId, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(seriesDTOS, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "APT ID: Series009")
    @GetMapping("/search")
    public ResponseEntity<ResponseDTO<List<SeriesDTO>>> searchSeries(@RequestParam(value = "seriesName", required = false) String seriesName,
                                                                     HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ) {
        log.info("searchSeries in SeriesController is called  by user: {}", jwt.getSubject());

        List<SeriesDTO> seriesDTOs = seriesService.searchSeries(seriesName,  request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(seriesDTOs, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Series010")
    @GetMapping("/series_ids")
    public ResponseEntity<ResponseDTO<List<SeriesDTO>>> getSeriesByIds(@RequestParam("ids") List<Integer> ids,
                                                                        HttpServletRequest request,
                                                                        @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ){
        log.info("getSeriesByIds in SeriesController is called  by user: {}", jwt.getSubject());

        List<SeriesDTO> dtos = seriesService.getSeriesByIds(ids, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(dtos, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }
}
