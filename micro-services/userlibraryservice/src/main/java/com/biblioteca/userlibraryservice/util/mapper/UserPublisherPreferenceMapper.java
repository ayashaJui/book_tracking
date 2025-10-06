package com.biblioteca.userlibraryservice.util.mapper;

import com.biblioteca.userlibraryservice.dto.userPublisherPreferences.UserPublisherPreferenceCreateDTO;
import com.biblioteca.userlibraryservice.dto.userPublisherPreferences.UserPublisherPreferenceDTO;
import com.biblioteca.userlibraryservice.dto.userPublisherPreferences.UserPublisherPreferenceUpdateDTO;
import com.biblioteca.userlibraryservice.entity.UserPublisherPreference;

import java.time.LocalDateTime;

public class UserPublisherPreferenceMapper {
    public static UserPublisherPreferenceDTO toDTO(UserPublisherPreference userPublisherPreference) {
        return UserPublisherPreferenceDTO.builder()
                .id(userPublisherPreference.getId())
                .userId(userPublisherPreference.getUserId())
                .catalogAuthorId(userPublisherPreference.getCatalogPublisherId())
                .preferenceLevel(userPublisherPreference.getPreferenceLevel())
                .isFavorite(userPublisherPreference.getIsFavorite())
                .personalNotes(userPublisherPreference.getPersonalNotes())
                .createdAt(userPublisherPreference.getCreatedAt())
                .updatedAt(userPublisherPreference.getUpdatedAt())
                .build();
    }

    public static UserPublisherPreference fromCreateDTO(UserPublisherPreferenceCreateDTO userPublisherPreferenceCreateDTO) {
        return UserPublisherPreference.builder()
                .preferenceLevel(userPublisherPreferenceCreateDTO.getPreferenceLevel())
                .isFavorite(userPublisherPreferenceCreateDTO.getIsFavorite())
                .personalNotes(userPublisherPreferenceCreateDTO.getPersonalNotes())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static UserPublisherPreference fromUpdateDTO(UserPublisherPreferenceUpdateDTO userPublisherPreferenceUpdateDTO, UserPublisherPreference userPublisherPreference) {
        userPublisherPreference.setPreferenceLevel(userPublisherPreferenceUpdateDTO.getPreferenceLevel());
        userPublisherPreference.setIsFavorite(userPublisherPreferenceUpdateDTO.getIsFavorite());
        userPublisherPreference.setPersonalNotes(userPublisherPreferenceUpdateDTO.getPersonalNotes());
        userPublisherPreference.setUpdatedAt(LocalDateTime.now());

        return userPublisherPreference;
    }
}
