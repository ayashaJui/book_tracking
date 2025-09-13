package com.biblioteca.catalogservice.dto.book;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class BookUpdateDTO {
    @NotNull(message = "Book ID is required")
    private Integer id;

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
}
