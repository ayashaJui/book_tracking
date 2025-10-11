package com.biblioteca.userservice.controller;

import com.biblioteca.userservice.dto.authUser.AuthUserDTO;
import com.biblioteca.userservice.dto.response.ResponseDTO;
import com.biblioteca.userservice.service.AuthUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/v1/auth_user")
@Tag(name = "2. AuthUser Controller", description = "APIs for Auth User Related Info")
public class AuthUserController {
    private final AuthUserService authUserService;

    @GetMapping("/{emailAddress}")
    @Operation(summary = "API ID: AuthUser001")
    public ResponseEntity<ResponseDTO<AuthUserDTO>> getAuthUserByEmailAddress(@PathVariable String emailAddress, HttpServletRequest request, @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("getAuthUserByEmailAddress method in AuthUserController is called by user: {}", jwt.getSubject());

        AuthUserDTO authUserDTO = authUserService.getUserByEmailAddress(emailAddress, request, jwt);

        return new ResponseEntity<>(new ResponseDTO<>(authUserDTO, "success", HttpStatus.OK.value()), HttpStatus.OK);
    }
}
