package com.biblioteca.catalogservice.dto.author;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AuthorCreateDTO {
    @NotNull(message = "Author name cannot be null")
    private String name;

    private String bio;

    private LocalDate birthDate;

    private LocalDate deathDate;

    private String nationality;

    private String website;

    private String imageId;

}
