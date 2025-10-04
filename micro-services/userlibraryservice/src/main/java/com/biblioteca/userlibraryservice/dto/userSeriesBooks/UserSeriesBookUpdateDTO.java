package com.biblioteca.userlibraryservice.dto.userSeriesBooks;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserSeriesBookUpdateDTO {
    @NotNull(message = "id can not be null")
    private Integer id;

    @NotNull(message = "userSeriesId can not be null")
    private Integer userSeriesId;

    @NotNull(message = "userBookId can not be null")
    private Integer userBookId;

    @NotNull(message = "catalogBookId can not be null")
    private Integer catalogBookId;

    private Integer orderInSeries;

    private Boolean isRead;

    private Integer readingPriority;

    private String notes;
}
