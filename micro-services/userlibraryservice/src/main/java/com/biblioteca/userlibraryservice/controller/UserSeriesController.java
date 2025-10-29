package com.biblioteca.userlibraryservice.controller;

import com.biblioteca.userlibraryservice.dto.pagination.PageRequestDTO;
import com.biblioteca.userlibraryservice.dto.response.ResponseDTO;
import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesCreateDTO;
import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesDTO;
import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesUpdateDTO;
import com.biblioteca.userlibraryservice.service.UserSeriesService;
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
@Tag(name = "1. User Series Controller", description = "User Series Related APIs")
@RequestMapping("/v1/user_series")
public class UserSeriesController {
    private final UserSeriesService userSeriesService;

    @Operation(summary = "API ID: UserSeries001")
    @PostMapping
    public ResponseEntity<ResponseDTO<UserSeriesDTO>> createUserSeries(@RequestBody @Valid UserSeriesCreateDTO createDTO,
                                                                       HttpServletRequest request,
                                                                       @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("createUserSeries in UserSeriesController is called by user: {}", jwt.getSubject());

        UserSeriesDTO userSeriesDTO = userSeriesService.createUserSeries(createDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(userSeriesDTO, "success", HttpStatus.CREATED.value()), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "API ID: UserSeries002")
    public ResponseEntity<ResponseDTO<List<UserSeriesDTO>>> getAllUserSeriesByUserId(@PathVariable Integer userId,
                                                                             HttpServletRequest request,
                                                                             @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ){
        log.info("getAllUserSeriesByUserId in UserSeriesController is called by user: {}", jwt.getSubject());

        List<UserSeriesDTO> userSeriesDTO = userSeriesService.getAllUserSeriesByUserId(userId, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(userSeriesDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "API ID: UserSeries003")
    public ResponseEntity<ResponseDTO<UserSeriesDTO>> getUserSeriesById(@PathVariable Integer id, HttpServletRequest request,
                                                                        @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ){
        log.info("getUserSeriesById in UserAuthorPreferenceController is called by user: {}", jwt.getSubject());

        UserSeriesDTO dto = userSeriesService.getUserSeriesById(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(dto, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @PutMapping
    @Operation(summary = "API ID: UserSeries004")
    public ResponseEntity<ResponseDTO<UserSeriesDTO>> updateUserSeries(@RequestBody @Valid UserSeriesUpdateDTO updateDTO,
                                                                                 HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt ){
        log.info("updateUserSeries in UserSeriesController is called by user: {}", jwt.getSubject());

        UserSeriesDTO userSeriesDTO = userSeriesService.updateUserSeries(updateDTO, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(userSeriesDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "API ID: UserSeries005")
    public ResponseEntity<ResponseDTO<String>> deleteUserSeries(@PathVariable Integer id, HttpServletRequest request,
                                                                @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt){
        log.info("deleteUserSeries in UserSeriesController is called by user: {}", jwt.getSubject());

        String message = userSeriesService.deleteUserSeries(id, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(message, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }
}
