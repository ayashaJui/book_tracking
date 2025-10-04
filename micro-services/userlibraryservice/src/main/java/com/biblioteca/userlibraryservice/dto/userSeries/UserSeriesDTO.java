package com.biblioteca.userlibraryservice.dto.userSeries;

import com.biblioteca.userlibraryservice.util.enums.SeriesStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserSeriesDTO {
    private Integer id;

    private Integer userId;

    private Integer catalogSeriesId;

    private Integer booksRead;

    private Integer booksOwned;

    private BigDecimal completionPercentage;

    private SeriesStatus status;

    private LocalDate startDate;

    private LocalDate completionDate;

    private Boolean isFavorite;

    private String readingOrderPreference;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
