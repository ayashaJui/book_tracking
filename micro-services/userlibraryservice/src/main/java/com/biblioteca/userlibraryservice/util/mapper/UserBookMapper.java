package com.biblioteca.userlibraryservice.util.mapper;

import com.biblioteca.userlibraryservice.dto.userBooks.UserBookCreateDTO;
import com.biblioteca.userlibraryservice.dto.userBooks.UserBookDTO;
import com.biblioteca.userlibraryservice.dto.userBooks.UserBookUpdateDTO;
import com.biblioteca.userlibraryservice.entity.UserBook;
import com.biblioteca.userlibraryservice.util.enums.BookStatus;
import com.biblioteca.userlibraryservice.util.enums.Format;

import java.time.LocalDateTime;

public class UserBookMapper {
    public static UserBookDTO toDTO(UserBook userBook){
        return UserBookDTO.builder()
                .id(userBook.getId())
                .userId(userBook.getUserId())
                .catalogBookId(userBook.getCatalogBookId())
                .status(BookStatus.valueOf(userBook.getStatus()))
                .rating(userBook.getRating())
                .progressPercentage(userBook.getProgressPercentage())
                .currentPage(userBook.getCurrentPage())
                .startDate(userBook.getStartDate())
                .finishDate(userBook.getFinishDate())
                .isFavorite(userBook.getIsFavorite())
                .readingFormat(Format.valueOf(userBook.getReadingFormat()))
                .notes(userBook.getNotes())
                .privateNotes(userBook.getPrivateNotes())
                .firstAcquisitionDate(userBook.getFirstAcquisitionDate())
                .firstAcquisitionMethod(userBook.getFirstAcquisitionMethod())
                .sourceType(userBook.getSourceType())
                .originalSearchQuery(userBook.getOriginalSearchQuery())
                .createdAt(userBook.getCreatedAt())
                .updatedAt(userBook.getUpdatedAt())
                .build();
    }

    public static UserBook fromCreateDTO(UserBookCreateDTO userBookCreateDTO){
        return UserBook.builder()
//                .userId(userBookCreateDTO.getUserId())
//                .catalogBookId(userBookCreateDTO.getCatalogBookId())
                .status(userBookCreateDTO.getStatus().name())
                .rating(userBookCreateDTO.getRating())
                .progressPercentage(userBookCreateDTO.getProgressPercentage())
                .currentPage(userBookCreateDTO.getCurrentPage())
                .startDate(userBookCreateDTO.getStartDate())
                .finishDate(userBookCreateDTO.getFinishDate())
                .isFavorite(userBookCreateDTO.getIsFavorite())
                .readingFormat(userBookCreateDTO.getReadingFormat().name())
                .notes(userBookCreateDTO.getNotes())
                .privateNotes(userBookCreateDTO.getPrivateNotes())
                .firstAcquisitionDate(userBookCreateDTO.getFirstAcquisitionDate())
                .firstAcquisitionMethod(userBookCreateDTO.getFirstAcquisitionMethod())
                .sourceType(userBookCreateDTO.getSourceType())
                .originalSearchQuery(userBookCreateDTO.getOriginalSearchQuery())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static UserBook fromUpdateDTO(UserBookUpdateDTO userBookUpdateDTO, UserBook userBook){
//        userBook.setUserId(userBookUpdateDTO.getUserId());
//        userBook.setCatalogBookId(userBookUpdateDTO.getCatalogBookId());
        userBook.setStatus(userBookUpdateDTO.getStatus().name());
        userBook.setRating(userBookUpdateDTO.getRating());
        userBook.setProgressPercentage(userBookUpdateDTO.getProgressPercentage());
        userBook.setCurrentPage(userBookUpdateDTO.getCurrentPage());
        userBook.setStartDate(userBookUpdateDTO.getStartDate());
        userBook.setFinishDate(userBookUpdateDTO.getFinishDate());
        userBook.setIsFavorite(userBookUpdateDTO.getIsFavorite());
        userBook.setReadingFormat(userBookUpdateDTO.getReadingFormat().name());
        userBook.setNotes(userBookUpdateDTO.getNotes());
        userBook.setPrivateNotes(userBookUpdateDTO.getPrivateNotes());
        userBook.setFirstAcquisitionDate(userBookUpdateDTO.getFirstAcquisitionDate());
        userBook.setFirstAcquisitionMethod(userBookUpdateDTO.getFirstAcquisitionMethod());
        userBook.setSourceType(userBookUpdateDTO.getSourceType());
        userBook.setOriginalSearchQuery(userBookUpdateDTO.getOriginalSearchQuery());
        userBook.setUpdatedAt(LocalDateTime.now());
        return userBook;
    }
}
