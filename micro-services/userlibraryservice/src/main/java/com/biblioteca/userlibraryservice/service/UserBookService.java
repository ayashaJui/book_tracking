package com.biblioteca.userlibraryservice.service;

import com.biblioteca.userlibraryservice.dto.userBooks.UserBookCreateDTO;
import com.biblioteca.userlibraryservice.dto.userBooks.UserBookDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.jwt.Jwt;

public interface UserBookService {
    UserBookDTO createUserBook(UserBookCreateDTO createDTO, HttpServletRequest request, Jwt jwt);
}
