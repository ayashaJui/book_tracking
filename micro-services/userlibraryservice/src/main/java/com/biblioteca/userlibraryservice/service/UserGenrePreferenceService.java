package com.biblioteca.userlibraryservice.service;

import com.biblioteca.userlibraryservice.dto.pagination.PageRequestDTO;
import com.biblioteca.userlibraryservice.dto.userGenrePreferences.UserGenrePreferenceCreateDTO;
import com.biblioteca.userlibraryservice.dto.userGenrePreferences.UserGenrePreferenceDTO;
import com.biblioteca.userlibraryservice.dto.userGenrePreferences.UserGenrePreferenceUpdateDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public interface UserGenrePreferenceService {
    UserGenrePreferenceDTO createUserGenrePreference(UserGenrePreferenceCreateDTO createDTO, HttpServletRequest request, Jwt jwt);

    Page<UserGenrePreferenceDTO> getUserGenresWithPaginationByUserId(PageRequestDTO pageRequestDTO, Integer userId, HttpServletRequest request, Jwt jwt);

    UserGenrePreferenceDTO getUserGenrePreferenceById(Integer id, HttpServletRequest request, Jwt jwt);

    UserGenrePreferenceDTO updateUserGenre(UserGenrePreferenceUpdateDTO updateDTO, HttpServletRequest request, Jwt jwt);

    String deleteUserGenrePreference(Integer id, HttpServletRequest request, Jwt jwt);

    List<UserGenrePreferenceDTO> getAllUserGenresByUserId(Integer userId, HttpServletRequest request, Jwt jwt);
}
