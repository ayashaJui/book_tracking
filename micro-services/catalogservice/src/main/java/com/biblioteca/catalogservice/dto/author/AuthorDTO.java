package com.biblioteca.catalogservice.dto.author;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AuthorDTO {
    private Integer id;

    private String name;

    private String bio;

    private LocalDate birthDate;

    private LocalDate deathDate;

    private String nationality;

    private String website;

    private String imageId;

    private String instagramUrl;

    private String threadsUrl;

    private String goodreadUrl;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
