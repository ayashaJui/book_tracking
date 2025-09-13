package com.biblioteca.catalogservice.dto.genre;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class GenreCreateDTO {
    @NotNull(message = "Genre Name cannot be null")
    private String name;

    private String description;

    private Integer parentGenreId;

    private Boolean isActive;
}
