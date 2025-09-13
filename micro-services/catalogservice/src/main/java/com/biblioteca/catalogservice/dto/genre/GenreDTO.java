package com.biblioteca.catalogservice.dto.genre;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class GenreDTO {
    private Integer id;

    private String name;

    private String description;

    private Integer parentGenreId;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
