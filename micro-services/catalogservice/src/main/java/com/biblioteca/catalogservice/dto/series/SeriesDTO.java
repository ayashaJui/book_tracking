package com.biblioteca.catalogservice.dto.series;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SeriesDTO {
    private Integer id;

    private String name;

    private String description;

    private Integer totalBooks;

    private Boolean isCompleted;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
