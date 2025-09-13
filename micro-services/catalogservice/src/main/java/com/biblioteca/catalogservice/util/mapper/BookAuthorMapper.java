package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.bookAuthor.BookAuthorCreateDTO;
import com.biblioteca.catalogservice.dto.bookAuthor.BookAuthorDTO;
import com.biblioteca.catalogservice.dto.bookAuthor.BookAuthorUpdateDTO;
import com.biblioteca.catalogservice.entity.BookAuthor;
import com.biblioteca.catalogservice.util.enums.AuthorRoleEnums;

public class BookAuthorMapper {
    public static BookAuthorDTO toDTO(BookAuthor bookAuthor) {
        return BookAuthorDTO.builder()
                .bookId(bookAuthor.getBook().getId())
                .authorId(bookAuthor.getAuthor().getId())
                .authorRole(bookAuthor.getId().getRole() != null ? AuthorRoleEnums.valueOf(bookAuthor.getId().getRole()) : null)
                .build();
    }

    public static BookAuthor fromCreateDTO(BookAuthorCreateDTO bookAuthorCreateDTO) {
        return BookAuthor.builder()
                .id(BookAuthor.BookAuthorId.builder()
                        .authorId(bookAuthorCreateDTO.getAuthorId())
                        .bookId(bookAuthorCreateDTO.getBookId())
                        .role(bookAuthorCreateDTO.getAuthorRole().name())
                        .build())
                .build();
    }

    public static  BookAuthor fromUpdateDTO(BookAuthorUpdateDTO bookAuthorUpdateDTO, BookAuthor bookAuthor) {

        bookAuthor.setId(
                BookAuthor.BookAuthorId.builder()
                        .bookId(bookAuthorUpdateDTO.getBookId())
                        .authorId(bookAuthorUpdateDTO.getAuthorId())
                        .role(bookAuthorUpdateDTO.getAuthorRole().name())
                        .build()
        );

        return bookAuthor;
    }
}
