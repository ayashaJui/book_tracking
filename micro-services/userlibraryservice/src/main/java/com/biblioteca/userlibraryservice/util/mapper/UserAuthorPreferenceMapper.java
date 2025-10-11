package com.biblioteca.userlibraryservice.util.mapper;

import com.biblioteca.userlibraryservice.dto.userAuthorPreferences.UserAuthorPreferenceCreateDTO;
import com.biblioteca.userlibraryservice.dto.userAuthorPreferences.UserAuthorPreferenceDTO;
import com.biblioteca.userlibraryservice.dto.userAuthorPreferences.UserAuthorPreferenceUpdateDTO;
import com.biblioteca.userlibraryservice.entity.UserAuthorPreference;

import java.time.LocalDateTime;

public class UserAuthorPreferenceMapper {
    public static UserAuthorPreferenceDTO toDTO(UserAuthorPreference userAuthorPreference) {
        return UserAuthorPreferenceDTO.builder()
                .id(userAuthorPreference.getId())
                .userId(userAuthorPreference.getUserId())
                .catalogAuthorId(userAuthorPreference.getCatalogAuthorId())
                .preferenceLevel(userAuthorPreference.getPreferenceLevel())
                .isFavorite(userAuthorPreference.getIsFavorite())
                .isExcluded(userAuthorPreference.getIsExcluded())
                .personalNotes(userAuthorPreference.getPersonalNotes())
                .createdAt(userAuthorPreference.getCreatedAt())
                .updatedAt(userAuthorPreference.getUpdatedAt())
                .build();
    }

//    TODO: change to User & CatalogAuthor after propagation
    public static UserAuthorPreference fromCreateDTO(UserAuthorPreferenceCreateDTO  userAuthorPreferenceCreateDTO, Integer userId, Integer catalogAuthorId) {
        return UserAuthorPreference.builder()
                .userId(userId)
                .catalogAuthorId(catalogAuthorId)
                .preferenceLevel(userAuthorPreferenceCreateDTO.getPreferenceLevel())
                .isFavorite(userAuthorPreferenceCreateDTO.getIsFavorite())
                .isExcluded(userAuthorPreferenceCreateDTO.getIsExcluded())
                .personalNotes(userAuthorPreferenceCreateDTO.getPersonalNotes())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static UserAuthorPreference fromUpdateDTO(UserAuthorPreferenceUpdateDTO userAuthorPreferenceUpdateDTO, UserAuthorPreference userAuthorPreference) {
        userAuthorPreference.setPreferenceLevel(userAuthorPreferenceUpdateDTO.getPreferenceLevel());
        userAuthorPreference.setIsFavorite(userAuthorPreferenceUpdateDTO.getIsFavorite());
        userAuthorPreference.setIsExcluded(userAuthorPreferenceUpdateDTO.getIsExcluded());
        userAuthorPreference.setPersonalNotes(userAuthorPreferenceUpdateDTO.getPersonalNotes());
        userAuthorPreference.setUpdatedAt(LocalDateTime.now());

        return userAuthorPreference;
    }
}
