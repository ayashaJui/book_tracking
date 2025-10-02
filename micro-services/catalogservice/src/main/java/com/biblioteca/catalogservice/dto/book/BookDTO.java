package com.biblioteca.catalogservice.dto.book;

import com.biblioteca.catalogservice.dto.bookAuthor.BookAuthorDTO;
import com.biblioteca.catalogservice.dto.bookGenre.BookGenreDTO;
import com.biblioteca.catalogservice.dto.bookSeries.BookSeriesDTO;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class BookDTO {
    private Integer id;

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

    private List<BookAuthorDTO> bookAuthors;

    private List<BookGenreDTO> bookGenres;

    private List<BookSeriesDTO> bookSeries;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
