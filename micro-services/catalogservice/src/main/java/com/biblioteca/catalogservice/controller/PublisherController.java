package com.biblioteca.catalogservice.controller;

import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.publisher.PublisherCreateDTO;
import com.biblioteca.catalogservice.dto.publisher.PublisherDTO;
import com.biblioteca.catalogservice.dto.publisher.PublisherUpdateDTO;
import com.biblioteca.catalogservice.dto.response.ResponseDTO;
import com.biblioteca.catalogservice.service.PublisherService;
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
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/v1/publishers")
@Tag(name = "3. Publisher Controller", description = "Publisher Related APIs")
public class PublisherController {
    private final PublisherService publisherService;

    @Operation(summary = "API ID: Publisher001")
    @PostMapping
    public ResponseEntity<ResponseDTO<PublisherDTO>> createPublisher(@RequestBody @Valid PublisherCreateDTO publisherCreateDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("createPublisher in PublisherController is called with data: {} by user: {}", publisherCreateDTO, jwt.getSubject());

        PublisherDTO publisherDTO = publisherService.createPublisher(publisherCreateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(publisherDTO, "success", HttpStatus.CREATED.value()), HttpStatus.CREATED);

    }

    @Operation(summary = "API ID: Publisher002")
    @GetMapping
    public ResponseEntity<ResponseDTO<List<PublisherDTO>>> getAllPublisher(HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getAllPublisher in PublisherController is called by user: {}", jwt.getSubject());

        List<PublisherDTO> publishers = publisherService.getAllPublisher(request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(publishers, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Publisher003")
    @GetMapping("/pagination")
    public ResponseEntity<ResponseDTO<Page<PublisherDTO>>> getAllPublisherWithPagination(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            HttpServletRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getAllPublisherWithPagination in PublisherController is called with page: {}, size: {} by user: {}", page, size, jwt.getSubject());

        PageRequestDTO pageRequestDTO = new PageRequestDTO(page, size);

        Page<PublisherDTO> publisherPage = publisherService.getAllPubisherWithPagination(pageRequestDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(publisherPage, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Publisher004")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO<PublisherDTO>> getPublisherById(@PathVariable(value = "id") Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getPublisherById in PublisherController is called with id: {} by user: {}", id, jwt.getSubject());

        PublisherDTO publisherDTO = publisherService.getPublisherById(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(publisherDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Publisher005")
    @PutMapping
    public ResponseEntity<ResponseDTO<PublisherDTO>> updatePublisher(@RequestBody @Valid PublisherUpdateDTO publisherUpdateDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("updatePublisher in PublisherController is called with data: {} by user: {}", publisherUpdateDTO, jwt.getSubject());

        PublisherDTO publisherDTO = publisherService.updatePublisher(publisherUpdateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(publisherDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Operation(summary = "API ID: Publisher006")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<String>> deletePublisher(@PathVariable(value = "id") Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("deletePublisher in PublisherController is called with id: {} by user: {}", id, jwt.getSubject());

        String message = publisherService.deletePublisher(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(message, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }
}
