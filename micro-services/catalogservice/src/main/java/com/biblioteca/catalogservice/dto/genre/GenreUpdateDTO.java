package com.biblioteca.catalogservice.dto.genre;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class GenreUpdateDTO {
    @NotNull(message = "Genre ID cannot be null")
    private Integer id;

    @NotNull(message = "Genre Name cannot be null")
    private String name;

    private String description;

    private Integer parentGenreId;

    private Boolean isActive;
}
