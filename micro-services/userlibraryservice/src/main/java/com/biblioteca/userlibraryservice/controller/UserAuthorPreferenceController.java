package com.biblioteca.userlibraryservice.controller;

import com.biblioteca.userlibraryservice.dto.pagination.PageRequestDTO;
import com.biblioteca.userlibraryservice.dto.response.ResponseDTO;
import com.biblioteca.userlibraryservice.dto.userAuthorPreferences.UserAuthorPreferenceCreateDTO;
import com.biblioteca.userlibraryservice.dto.userAuthorPreferences.UserAuthorPreferenceDTO;
import com.biblioteca.userlibraryservice.service.UserAuthorPreferenceService;
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

@RestController
@Slf4j
@RequiredArgsConstructor
@Tag(name = "1. User Author Preferences Controller", description = "User Author Preferences Related APIs")
@RequestMapping("/v1/user_author_preferences")
public class UserAuthorPreferenceController {
    private final UserAuthorPreferenceService userAuthorPreferenceService;

    @Operation(summary = "API ID: UserAuthorPreferences001")
    @PostMapping
    public ResponseEntity<ResponseDTO<UserAuthorPreferenceDTO>> createUserAuthorPreference(@RequestBody @Valid UserAuthorPreferenceCreateDTO userAuthorPreferenceCreateDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("createUserAuthorPreference in UserAuthorPreferenceController is called by user: {}", jwt.getSubject());

        UserAuthorPreferenceDTO dto = userAuthorPreferenceService.createUserAuthorPreference(userAuthorPreferenceCreateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(dto, "success", HttpStatus.CREATED.value()), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "API ID: UserAuthorPreferences002")
    public ResponseEntity<ResponseDTO<Page<UserAuthorPreferenceDTO>>> getUserAuthorsWithPagination(@PathVariable Integer userId,
                                                                                           @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                                                                           @RequestParam(value = "size", required = false, defaultValue = "10") int size,
                                                                                           HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ){
        log.info("getUserAuthorsWithPagination in UserAuthorPreferenceController is called by user: {}", jwt.getSubject());

        PageRequestDTO pageRequestDTO = new PageRequestDTO(page, size);

        Page<UserAuthorPreferenceDTO> dtos = userAuthorPreferenceService.getUserAuthorsWithPagination(pageRequestDTO, userId, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(dtos, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }
}
