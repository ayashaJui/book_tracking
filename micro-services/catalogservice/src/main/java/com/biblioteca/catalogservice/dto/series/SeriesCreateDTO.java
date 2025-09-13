package com.biblioteca.catalogservice.dto.series;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SeriesCreateDTO {
    @NotNull(message = "Series name cannot be null")
    private String name;

    private String description;

    private Integer totalBooks;

    private Boolean isCompleted;
}
