package com.biblioteca.catalogservice.dto.book;

import com.biblioteca.catalogservice.dto.bookAuthor.BookAuthorCreateDTO;
import com.biblioteca.catalogservice.dto.bookGenre.BookGenreCreateDTO;
import com.biblioteca.catalogservice.dto.bookSeries.BookSeriesCreateDTO;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BookCreateDTO {
    @NotNull(message = "Title is required" )
    private String title;

    private String subTitle;

    private String description;

    private LocalDate publicationDate;

    private Integer pageCount;

    private String language ;

    private Double averageRating;

    private Integer totalRatings;

    private String goodreadsId;

    private String googleBooksId;

    private Boolean isActive;

    private List<BookAuthorCreateDTO> bookAuthorCreateDTOs;

    private List<BookGenreCreateDTO> bookGenreCreateDTOs;

    private List<BookSeriesCreateDTO> bookSeriesCreateDTOs;
}
