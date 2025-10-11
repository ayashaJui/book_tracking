package com.biblioteca.userservice.service;

import com.biblioteca.userservice.dto.authUser.AuthUserDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.jwt.Jwt;

public interface AuthUserService {
    AuthUserDTO getUserByEmailAddress(String emailAddress, HttpServletRequest httpServletRequest, Jwt jwt);
}
