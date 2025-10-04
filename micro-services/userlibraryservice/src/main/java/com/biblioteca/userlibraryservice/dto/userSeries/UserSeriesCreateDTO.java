package com.biblioteca.userlibraryservice.dto.userSeries;

import com.biblioteca.userlibraryservice.util.enums.SeriesStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserSeriesCreateDTO {
    @NotNull(message = "userId can not be null")
    private Integer userId;

    @NotNull(message = "catalogSeriesId can not be null")
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
}
