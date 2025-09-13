package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.bookGenre.BookGenreCreateDTO;
import com.biblioteca.catalogservice.dto.bookGenre.BookGenreDTO;
import com.biblioteca.catalogservice.entity.BookGenre;

public class BookGenreMapper {
    public static BookGenreDTO toDTO(BookGenre bookGenre) {
        return BookGenreDTO.builder()
                .bookId(bookGenre.getBook().getId())
                .genreId(bookGenre.getGenre().getId())
                .build();
    }

    public static BookGenre fromCreateDTO(BookGenreCreateDTO bookGenreCreateDTO){
        return BookGenre.builder()
                .id(BookGenre.BookGenreId.builder()
                        .bookId(bookGenreCreateDTO.getBookId())
                        .genreId(bookGenreCreateDTO.getGenreId())
                        .build())
                .build();
    }

    public static  BookGenre fromUpdateDTO(BookGenre bookGenreUpdateDTO , BookGenre bookGenre) {

        bookGenre.setId(
                BookGenre.BookGenreId.builder()
                        .bookId(bookGenreUpdateDTO.getBook().getId())
                        .genreId(bookGenreUpdateDTO.getGenre().getId())
                        .build()
        );

        return bookGenre;

    }
}
