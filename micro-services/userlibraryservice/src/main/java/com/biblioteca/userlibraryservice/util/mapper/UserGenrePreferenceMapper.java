package com.biblioteca.userlibraryservice.util.mapper;


import com.biblioteca.userlibraryservice.dto.userGenrePreferences.UserGenrePreferenceCreateDTO;
import com.biblioteca.userlibraryservice.dto.userGenrePreferences.UserGenrePreferenceDTO;
import com.biblioteca.userlibraryservice.dto.userGenrePreferences.UserGenrePreferenceUpdateDTO;
import com.biblioteca.userlibraryservice.entity.UserGenrePreference;

import java.time.LocalDateTime;

public class UserGenrePreferenceMapper {
    public static UserGenrePreferenceDTO toDTO(UserGenrePreference userGenrePreference) {
        return UserGenrePreferenceDTO.builder()
                .id(userGenrePreference.getId())
                .userId(userGenrePreference.getUserId())
                .catalogGenreId(userGenrePreference.getCatalogGenreId())
                .preferenceLevel(userGenrePreference.getPreferenceLevel())
                .isExcluded(userGenrePreference.getIsExcluded())
                .notes(userGenrePreference.getNotes())
                .createdAt(userGenrePreference.getCreatedAt())
                .updatedAt(userGenrePreference.getUpdatedAt())
                .build();
    }

    public static UserGenrePreference fromCreateDTO(UserGenrePreferenceCreateDTO  userGenrePreferenceCreateDTO, Integer userId, Integer catalogGenreId) {
        return UserGenrePreference.builder()
                .userId(userId)
                .catalogGenreId(catalogGenreId)
                .preferenceLevel(userGenrePreferenceCreateDTO.getPreferenceLevel())
                .isExcluded(userGenrePreferenceCreateDTO.getIsExcluded())
                .notes(userGenrePreferenceCreateDTO.getNotes())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static UserGenrePreference fromUpdateDTO(UserGenrePreferenceUpdateDTO userGenrePreferenceUpdateDTO, UserGenrePreference userGenrePreference) {
        userGenrePreference.setPreferenceLevel(userGenrePreferenceUpdateDTO.getPreferenceLevel());
        userGenrePreference.setIsExcluded(userGenrePreferenceUpdateDTO.getIsExcluded());
        userGenrePreference.setNotes(userGenrePreferenceUpdateDTO.getNotes());
        userGenrePreference.setUpdatedAt(LocalDateTime.now());

        return userGenrePreference;
    }
}
