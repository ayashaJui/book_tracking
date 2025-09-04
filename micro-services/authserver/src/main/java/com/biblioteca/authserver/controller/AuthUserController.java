package com.biblioteca.authserver.controller;

import com.biblioteca.authserver.repository.AuthUserRepository;
import com.biblioteca.authserver.service.AuthUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthUserController {
    private final AuthUserRepository authUserRepository;

}
