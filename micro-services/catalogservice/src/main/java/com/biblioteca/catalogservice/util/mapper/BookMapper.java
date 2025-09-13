package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.book.BookCreateDTO;
import com.biblioteca.catalogservice.dto.book.BookDTO;
import com.biblioteca.catalogservice.dto.book.BookUpdateDTO;
import com.biblioteca.catalogservice.entity.Book;

import java.time.LocalDateTime;

public class BookMapper {
    public static BookDTO toDTO(Book book){
        return BookDTO.builder()
                .id(book.getId())
                .title(book.getTitle())
                .subTitle(book.getSubtitle())
                .description(book.getDescription())
                .publicationDate(book.getPublicationDate())
                .pageCount(book.getPageCount())
                .language(book.getLanguage()  )
                .averageRating(book.getAverageRating() )
                .totalRatings(book.getTotalRatings() )
                .goodreadsId(book.getGoodreadsId())
                .googleBooksId(book.getGoogleBooksId())
                .isActive(book.getIsActive() )
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }

    public static Book fromCreateDTO(BookCreateDTO bookCreateDTO){
        return Book.builder()
                .title(bookCreateDTO.getTitle())
                .subtitle(bookCreateDTO.getSubTitle())
                .description(bookCreateDTO.getDescription())
                .publicationDate(bookCreateDTO.getPublicationDate())
                .pageCount(bookCreateDTO.getPageCount())
                .language(bookCreateDTO.getLanguage() != null ? bookCreateDTO.getLanguage() : "en")
                .averageRating(bookCreateDTO.getAverageRating()!= null ? bookCreateDTO.getAverageRating() : 0.0)
                .totalRatings(bookCreateDTO.getTotalRatings() != null ? bookCreateDTO.getTotalRatings() : 0)
                .goodreadsId(bookCreateDTO.getGoodreadsId())
                .googleBooksId(bookCreateDTO.getGoogleBooksId())
                .isActive(bookCreateDTO.getIsActive() != null ? bookCreateDTO.getIsActive() : true)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static Book fromUpdateDTO(BookUpdateDTO bookUpdateDTO, Book book){
        book.setTitle(bookUpdateDTO.getTitle());
        book.setSubtitle(bookUpdateDTO.getSubTitle());
        book.setDescription(bookUpdateDTO.getDescription());
        book.setPublicationDate(bookUpdateDTO.getPublicationDate());
        book.setPageCount(bookUpdateDTO.getPageCount());
        book.setLanguage(bookUpdateDTO.getLanguage() != null ? bookUpdateDTO.getLanguage() : book.getLanguage());
        book.setAverageRating(bookUpdateDTO.getAverageRating() != null ? bookUpdateDTO.getAverageRating() : book.getAverageRating());
        book.setTotalRatings(bookUpdateDTO.getTotalRatings() != null ? bookUpdateDTO.getTotalRatings() : book.getTotalRatings());
        book.setGoodreadsId(bookUpdateDTO.getGoodreadsId());
        book.setGoogleBooksId(bookUpdateDTO.getGoogleBooksId());
        book.setIsActive(bookUpdateDTO.getIsActive() != null ? bookUpdateDTO.getIsActive() : book.getIsActive());
        book.setUpdatedAt(LocalDateTime.now());

        return book;
    }
}
