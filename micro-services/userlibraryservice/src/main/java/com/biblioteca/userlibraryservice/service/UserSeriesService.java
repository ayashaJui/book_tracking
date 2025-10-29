package com.biblioteca.userlibraryservice.service;

import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesCreateDTO;
import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesDTO;
import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesUpdateDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public interface UserSeriesService {
    UserSeriesDTO createUserSeries(UserSeriesCreateDTO userSeriesCreateDTO, HttpServletRequest request, Jwt jwt);

    List<UserSeriesDTO> getAllUserSeriesByUserId(Integer userId, HttpServletRequest request, Jwt jwt);

    UserSeriesDTO getUserSeriesById(Integer id, HttpServletRequest request, Jwt jwt);

    UserSeriesDTO updateUserSeries(UserSeriesUpdateDTO userSeriesUpdateDTO, HttpServletRequest request, Jwt jwt);

    String deleteUserSeries(Integer id, HttpServletRequest request, Jwt jwt);
}
