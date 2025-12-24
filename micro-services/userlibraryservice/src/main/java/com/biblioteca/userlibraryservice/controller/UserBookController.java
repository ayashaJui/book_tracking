package com.biblioteca.userlibraryservice.controller;

import com.biblioteca.userlibraryservice.dto.response.ResponseDTO;
import com.biblioteca.userlibraryservice.dto.userBooks.UserBookCreateDTO;
import com.biblioteca.userlibraryservice.dto.userBooks.UserBookDTO;
import com.biblioteca.userlibraryservice.service.UserBookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/user_books")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "4. User Books Controller", description = "User Books Related APIs")
public class UserBookController {
    private final UserBookService userBookService;

    @Operation(summary = "API ID: UserBooks001")
    @PostMapping
    public ResponseEntity<ResponseDTO<UserBookDTO>> createUserBook(@RequestBody @Valid UserBookCreateDTO createDTO, HttpServletRequest request,
                                                                   @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt){
        log.info("createUserBook in UserBookController is called by user: {}", jwt.getSubject());
        UserBookDTO dto = userBookService.createUserBook(createDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(dto, "success", HttpStatus.CREATED.value()), HttpStatus.CREATED);
    }
}
