package com.biblioteca.userlibraryservice.dto.userSeriesBooks;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserSeriesBookDTO {
    private Integer id;

    private Integer userSeriesId;

    private Integer userBookId;

    private Integer catalogBookId;

    private Integer orderInSeries;

    private Boolean isRead;

    private Integer readingPriority;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
