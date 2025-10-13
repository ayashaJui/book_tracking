package com.biblioteca.userlibraryservice.service;

import com.biblioteca.userlibraryservice.dto.pagination.PageRequestDTO;
import com.biblioteca.userlibraryservice.dto.userAuthorPreferences.UserAuthorPreferenceCreateDTO;
import com.biblioteca.userlibraryservice.dto.userAuthorPreferences.UserAuthorPreferenceDTO;
import com.biblioteca.userlibraryservice.dto.userAuthorPreferences.UserAuthorPreferenceUpdateDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.jwt.Jwt;

public interface UserAuthorPreferenceService {
    UserAuthorPreferenceDTO createUserAuthorPreference(UserAuthorPreferenceCreateDTO createDTO, HttpServletRequest request, Jwt jwt);

    Page<UserAuthorPreferenceDTO> getUserAuthorsWithPagination(PageRequestDTO pageRequestDTO, Integer userId, HttpServletRequest request, Jwt jwt);

    UserAuthorPreferenceDTO getUserAuthorPreferenceById(Integer id, HttpServletRequest request, Jwt jwt);

    UserAuthorPreferenceDTO updateUserAuthor(UserAuthorPreferenceUpdateDTO updateDTO, HttpServletRequest request, Jwt jwt);

    String deleteUserAuthorPreference(Integer id, HttpServletRequest request, Jwt jwt);
}
