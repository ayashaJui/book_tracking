package com.biblioteca.userlibraryservice.controller;

import com.biblioteca.userlibraryservice.dto.pagination.PageRequestDTO;
import com.biblioteca.userlibraryservice.dto.response.ResponseDTO;
import com.biblioteca.userlibraryservice.dto.userGenrePreferences.UserGenrePreferenceCreateDTO;
import com.biblioteca.userlibraryservice.dto.userGenrePreferences.UserGenrePreferenceDTO;
import com.biblioteca.userlibraryservice.dto.userGenrePreferences.UserGenrePreferenceUpdateDTO;
import com.biblioteca.userlibraryservice.service.UserGenrePreferenceService;
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
@Slf4j
@RequestMapping("/v1/user_genre_preferences")
@Tag(name = "2. User Genre Preferences Controller", description = "User Genre Preferences Related APIs")
public class UserGenrePreferenceController {
    private final UserGenrePreferenceService userGenrePreferenceService;

    @Operation(summary = "API ID: UserGenrePreferences001")
    @PostMapping
    public ResponseEntity<ResponseDTO<UserGenrePreferenceDTO>> createUserGenrePreference(@RequestBody @Valid UserGenrePreferenceCreateDTO createDTO, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("createUserGenrePreference in UserGenrePreferenceController is called by user: {}", jwt.getSubject());

        UserGenrePreferenceDTO dto = userGenrePreferenceService.createUserGenrePreference(createDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(dto, "success", HttpStatus.CREATED.value()), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "API ID: UserGenrePreferences002")
    public ResponseEntity<ResponseDTO<Page<UserGenrePreferenceDTO>>> getUserGenresWithPagination(@PathVariable Integer userId,
                                                                                                   @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                                                                                   @RequestParam(value = "size", required = false, defaultValue = "10") int size,
                                                                                                   HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ){
        log.info("getUserGenresWithPagination in UserGenrePreferenceController is called by user: {}", jwt.getSubject());

        PageRequestDTO pageRequestDTO = new PageRequestDTO(page, size);

        Page<UserGenrePreferenceDTO> dtos = userGenrePreferenceService.getUserGenresWithPaginationByUserId(pageRequestDTO, userId, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(dtos, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "API ID: UserGenrePreferences003")
    public ResponseEntity<ResponseDTO<UserGenrePreferenceDTO>> getGenreById(@PathVariable Integer id, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ){
        log.info("getGenreById in UserGenrePreferenceController is called by user: {}", jwt.getSubject());

        UserGenrePreferenceDTO dto = userGenrePreferenceService.getUserGenrePreferenceById(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(dto, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @PutMapping
    @Operation(summary = "API ID: UserGenrePreferences004")
    public ResponseEntity<ResponseDTO<UserGenrePreferenceDTO>> updateUserGenre(@RequestBody @Valid UserGenrePreferenceUpdateDTO updateDTO,
                                                                                 HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ){
        log.info("updateUserGenre in UserGenrePreferenceController is called by user: {}", jwt.getSubject());

        UserGenrePreferenceDTO dto = userGenrePreferenceService.updateUserGenre(updateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(dto, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "API ID: UserGenrePreferences005")
    public ResponseEntity<ResponseDTO<String>> deleteUserGenre(@PathVariable Integer id, HttpServletRequest request,
                                                                @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt){
        log.info("deleteUserGenre in UserGenrePreferenceController is called by user: {}", jwt.getSubject());

        String message = userGenrePreferenceService.deleteUserGenrePreference(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(message, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @GetMapping("/all/user/{userId}")
    @Operation(summary = "API ID: UserGenrePreferences006")
    public ResponseEntity<ResponseDTO<List<UserGenrePreferenceDTO>>> getAlUserGenres(@PathVariable Integer userId, HttpServletRequest request,
                                                                                      @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ){
        log.info("getAllUserGenres in UserGenrePreferenceController is called by user: {}", jwt.getSubject());

        List<UserGenrePreferenceDTO> dtos = userGenrePreferenceService.getAllUserGenresByUserId(userId, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(dtos, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }
}
