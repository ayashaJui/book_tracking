package com.biblioteca.catalogservice.dto.book;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
