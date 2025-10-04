package com.biblioteca.userlibraryservice.util.mapper;

import com.biblioteca.userlibraryservice.dto.userSeriesBooks.UserSeriesBookCreateDTO;
import com.biblioteca.userlibraryservice.dto.userSeriesBooks.UserSeriesBookDTO;
import com.biblioteca.userlibraryservice.dto.userSeriesBooks.UserSeriesBookUpdateDTO;
import com.biblioteca.userlibraryservice.entity.UserSeriesBook;

import java.time.LocalDateTime;

public class UserSeriesBookMapper {
    public static UserSeriesBookDTO toDTO(UserSeriesBook userSeriesBook) {
        return UserSeriesBookDTO.builder()
                .id(userSeriesBook.getId())
                .userSeriesId(userSeriesBook.getUserSeries().getId())
                .catalogBookId(userSeriesBook.getCatalogBookId())
                .userBookId(userSeriesBook.getUserBook().getId())
                .orderInSeries(userSeriesBook.getOrderInSeries())
                .isRead(userSeriesBook.getIsRead())
                .readingPriority(userSeriesBook.getReadingPriority())
                .notes(userSeriesBook.getNotes())
                .createdAt(userSeriesBook.getCreatedAt())
                .updatedAt(userSeriesBook.getUpdatedAt())
                .build();
    }

    public static UserSeriesBook fromCreateDTO(UserSeriesBookCreateDTO userSeriesBookCreateDTO) {
        return UserSeriesBook.builder()
                .orderInSeries(userSeriesBookCreateDTO.getOrderInSeries())
                .isRead(userSeriesBookCreateDTO.getIsRead())
                .readingPriority(userSeriesBookCreateDTO.getReadingPriority())
                .notes(userSeriesBookCreateDTO.getNotes())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static UserSeriesBook fromUpdateDTO(UserSeriesBookUpdateDTO userSeriesBookUpdateDTO, UserSeriesBook userSeriesBook) {
        userSeriesBook.setOrderInSeries(userSeriesBookUpdateDTO.getOrderInSeries());
        userSeriesBook.setIsRead(userSeriesBookUpdateDTO.getIsRead());
        userSeriesBook.setReadingPriority(userSeriesBookUpdateDTO.getReadingPriority());
        userSeriesBook.setNotes(userSeriesBookUpdateDTO.getNotes());
        userSeriesBook.setUpdatedAt(LocalDateTime.now());

        return userSeriesBook;
    }
}
