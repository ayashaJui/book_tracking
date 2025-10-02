package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.bookGenre.BookGenreCreateDTO;
import com.biblioteca.catalogservice.dto.bookGenre.BookGenreDTO;
import com.biblioteca.catalogservice.entity.BookGenre;

public class BookGenreMapper {
    public static BookGenreDTO toDTO(BookGenre bookGenre) {
        return BookGenreDTO.builder()
                .id(bookGenre.getId())
//                .bookId(bookGenre.getBook().getId())
                .genreName(bookGenre.getGenre().getName())
                .genreId(bookGenre.getGenre().getId())
                .build();
    }

//    public static BookGenre fromCreateDTO(BookGenreCreateDTO bookGenreCreateDTO){
//        return BookGenre.builder()
//
//                .build();
//    }
//
//    public static  BookGenre fromUpdateDTO(BookGenre bookGenreUpdateDTO , BookGenre bookGenre) {
//
//
//
//        return bookGenre;
//
//    }
}
