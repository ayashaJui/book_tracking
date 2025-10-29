package com.biblioteca.userlibraryservice.util.mapper;

import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesCreateDTO;
import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesDTO;
import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesUpdateDTO;
import com.biblioteca.userlibraryservice.entity.UserSeries;
import com.biblioteca.userlibraryservice.util.enums.SeriesStatus;

import java.time.LocalDateTime;

public class UserSeriesMapper {
    public static UserSeriesDTO toDTO(UserSeries userSeries) {
        return UserSeriesDTO.builder()
                .id(userSeries.getId())
                .userId(userSeries.getUserId())
                .catalogSeriesId(userSeries.getCatalogSeriesId())
                .booksRead(userSeries.getBooksRead())
                .booksOwned(userSeries.getBooksOwned())
                .completionPercentage(userSeries.getCompletionPercentage())
                .status(SeriesStatus.valueOf(userSeries.getStatus()))
                .startDate(userSeries.getStartDate())
                .completionDate(userSeries.getCompletionDate())
                .isFavorite(userSeries.getIsFavorite())
                .readingOrderPreference(userSeries.getReadingOrderPreference())
                .notes(userSeries.getNotes())
                .createdAt(userSeries.getCreatedAt())
                .updatedAt(userSeries.getUpdatedAt())
                .build();
    }

    public static UserSeries fromCreateDTO(UserSeriesCreateDTO userSeriesCreateDTO) {
        return UserSeries.builder()
//                .userId(userSeriesCreateDTO.getUserId())
//                .catalogSeriesId(userSeriesCreateDTO.getCatalogSeriesId())
                .booksRead(userSeriesCreateDTO.getBooksRead())
                .booksOwned(userSeriesCreateDTO.getBooksOwned())
//                .completionPercentage(userSeriesCreateDTO.getCompletionPercentage())
                .status(userSeriesCreateDTO.getStatus().name())
                .startDate(userSeriesCreateDTO.getStartDate())
                .completionDate(userSeriesCreateDTO.getCompletionDate())
                .isFavorite(userSeriesCreateDTO.getIsFavorite())
                .readingOrderPreference(userSeriesCreateDTO.getReadingOrderPreference())
                .notes(userSeriesCreateDTO.getNotes())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static UserSeries fromUpdateDTO(UserSeriesUpdateDTO userSeriesUpdateDTO, UserSeries userSeries) {
        userSeries.setBooksRead(userSeriesUpdateDTO.getBooksRead());
        userSeries.setBooksOwned(userSeriesUpdateDTO.getBooksOwned());
//        userSeries.setCompletionPercentage(userSeriesUpdateDTO.getCompletionPercentage());
        userSeries.setStatus(userSeriesUpdateDTO.getStatus().name());
        userSeries.setStartDate(userSeriesUpdateDTO.getStartDate());
        userSeries.setCompletionDate(userSeriesUpdateDTO.getCompletionDate());
        userSeries.setIsFavorite(userSeriesUpdateDTO.getIsFavorite());
        userSeries.setReadingOrderPreference(userSeriesUpdateDTO.getReadingOrderPreference());
        userSeries.setNotes(userSeriesUpdateDTO.getNotes());
        userSeries.setUpdatedAt(LocalDateTime.now());

        return userSeries;
    }
}
