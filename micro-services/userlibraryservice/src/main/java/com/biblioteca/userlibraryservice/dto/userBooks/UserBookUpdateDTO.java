package com.biblioteca.userlibraryservice.dto.userBooks;

import com.biblioteca.userlibraryservice.util.enums.BookStatus;
import com.biblioteca.userlibraryservice.util.enums.Format;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UserBookUpdateDTO {
    @NotNull(message = "id can not be null")
    private Integer id;

    @NotNull(message = "userId can not be null")
    private Integer userId;

    @NotNull(message = "catalogBookId can not be null")
    private Integer catalogBookId;

    @NotNull(message = "status can not be null")
    private BookStatus status;

    @Min(value = 1, message = "Rating can not be less than 1")
    @Max(value = 5, message = "Rating can not be greater than 5")
    private Integer rating;

    private BigDecimal progressPercentage;

    private int currentPage;

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
}
