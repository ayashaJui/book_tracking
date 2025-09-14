package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.bookEdition.BookEditionCreateDTO;
import com.biblioteca.catalogservice.dto.bookEdition.BookEditionDTO;
import com.biblioteca.catalogservice.dto.bookEdition.BookEditionUpdateDTO;
import com.biblioteca.catalogservice.entity.BookEdition;

import java.time.LocalDateTime;

public class BookEditionMapper {
    public static BookEditionDTO toDTO(BookEdition bookEdition) {
        return BookEditionDTO.builder()
                .id(bookEdition.getId())
                .format(bookEdition.getFormat())
                .isbn(bookEdition.getIsbn())
                .publicationDate(bookEdition.getPublicationDate())
                .pageCount(bookEdition.getPageCount())
                .price(bookEdition.getPrice())
                .currency(bookEdition.getCurrency())
                .coverImageId(bookEdition.getCoverImageId())
                .availabilityStatus(bookEdition.getAvailabilityStatus())
                .createdAt(bookEdition.getCreatedAt())
                .updatedAt(bookEdition.getUpdatedAt())
                .build();
    }

    public static BookEdition fromCreateDTO(BookEditionCreateDTO bookEditionCreateDTO) {
        return BookEdition.builder()
                .format(bookEditionCreateDTO.getFormat())
                .isbn(bookEditionCreateDTO.getIsbn())
                .publicationDate(bookEditionCreateDTO.getPublishedDate())
                .pageCount(bookEditionCreateDTO.getPageCount())
                .price(bookEditionCreateDTO.getPrice())
                .currency(bookEditionCreateDTO.getCurrency())
                .coverImageId(bookEditionCreateDTO.getCoverImage())
                .availabilityStatus(bookEditionCreateDTO.getAvailabilityStatus())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public  static BookEdition fromUpdateDTO(BookEditionUpdateDTO bookEditionUpdateDTO, BookEdition bookEdition) {
        bookEdition.setFormat(bookEditionUpdateDTO.getFormat());
        bookEdition.setIsbn(bookEditionUpdateDTO.getIsbn());
        bookEdition.setPublicationDate(bookEditionUpdateDTO.getPublishedDate());
        bookEdition.setPageCount(bookEditionUpdateDTO.getPageCount());
        bookEdition.setPrice(bookEditionUpdateDTO.getPrice());
        bookEdition.setCurrency(bookEditionUpdateDTO.getCurrency());
        bookEdition.setCoverImageId(bookEditionUpdateDTO.getCoverImage());
        bookEdition.setAvailabilityStatus(bookEditionUpdateDTO.getAvailabilityStatus());
        bookEdition.setUpdatedAt(LocalDateTime.now());

        return bookEdition;
    }
}
