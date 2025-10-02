package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.bookAuthor.BookAuthorCreateDTO;
import com.biblioteca.catalogservice.dto.bookAuthor.BookAuthorDTO;
import com.biblioteca.catalogservice.dto.bookAuthor.BookAuthorUpdateDTO;
import com.biblioteca.catalogservice.entity.BookAuthor;
import com.biblioteca.catalogservice.util.enums.AuthorRoleEnums;

public class BookAuthorMapper {
    public static BookAuthorDTO toDTO(BookAuthor bookAuthor) {
        return BookAuthorDTO.builder()
                .id(bookAuthor.getId())
//                .bookId(bookAuthor.getBook().getId())
                .authorName(bookAuthor.getAuthor().getName())
                .authorId(bookAuthor.getAuthor().getId())
                .authorRole(bookAuthor.getRole() != null ? AuthorRoleEnums.valueOf(bookAuthor.getRole()) : null)
                .build();
    }

    public static BookAuthor fromCreateDTO(BookAuthorCreateDTO bookAuthorCreateDTO) {
        return BookAuthor.builder()
                .role(bookAuthorCreateDTO.getAuthorRole().name())
                .build();
    }

    public static  BookAuthor fromUpdateDTO(BookAuthorUpdateDTO bookAuthorUpdateDTO, BookAuthor bookAuthor) {

        bookAuthor.setRole(bookAuthorUpdateDTO.getAuthorRole().name());

        return bookAuthor;
    }
}
