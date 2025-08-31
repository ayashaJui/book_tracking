package com.biblioteca.userservice.controller;

import com.biblioteca.userservice.dto.authUser.AuthUserDTO;
import com.biblioteca.userservice.dto.authentication.AuthUserRegistrationRequestDTO;
import com.biblioteca.userservice.dto.response.ResponseDTO;
import com.biblioteca.userservice.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "1. Authentication Controller", description = "APIs for New User Registration and OTP Related")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    @Operation(summary = "API ID: Authentication001")
    private ResponseEntity<ResponseDTO<AuthUserDTO>> registerUser(@RequestBody @Valid AuthUserRegistrationRequestDTO registrationRequestDTO){
        log.info(("AuthenticationController registerUser is called with emailId: {}"), registrationRequestDTO.getEmailAddress());
        AuthUserDTO authUserDTO = authenticationService.registerUser(registrationRequestDTO);

        return new ResponseEntity<>(new ResponseDTO<>(authUserDTO, "success", HttpStatus.CREATED.value()),HttpStatus.CREATED);
    }

    @GetMapping("/get_registered_user_info/{authUserId}")
    @Operation(summary = "API ID: Authentication002")
    private ResponseEntity<ResponseDTO<AuthUserDTO>> getRegisteredUserInfo(@PathVariable int authUserId){
        log.info(("AuthenticationController getRegisteredUserInfo is called with authUserId: {}"), authUserId);
        AuthUserDTO authUserDTO = authenticationService.getRegisteredUserInfo(authUserId);

        return new ResponseEntity<>(new ResponseDTO<>(authUserDTO, "success", HttpStatus.OK.value()),HttpStatus.OK);
    }
}
