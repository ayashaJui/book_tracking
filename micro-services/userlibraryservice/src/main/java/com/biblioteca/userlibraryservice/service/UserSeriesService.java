package com.biblioteca.userlibraryservice.service;

import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesCreateDTO;
import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.jwt.Jwt;

public interface UserSeriesService {
    UserSeriesDTO createUserSeries(UserSeriesCreateDTO userSeriesCreateDTO, HttpServletRequest httpServletRequest, Jwt jwt);
}
