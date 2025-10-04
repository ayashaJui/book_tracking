package com.biblioteca.userlibraryservice.dto.userBooks;

import com.biblioteca.userlibraryservice.util.enums.BookStatus;
import com.biblioteca.userlibraryservice.util.enums.Format;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UserBookDTO {
    private Integer id;

    private Integer userId;

    private Integer catalogBookId;

    private BookStatus status;

    private Integer rating;

    private BigDecimal progressPercentage;

    private Integer currentPage;

    private LocalDate startDate;

    private LocalDate finishDate;

    private Boolean isFavorite;

    private Format readingFormat;

    private String notes;

    private String privateNotes;

    private LocalDate firstAcquisitionDate;

    private String firstAcquisitionMethod;

    private String sourceType;

    private String originalSearchQuery;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
