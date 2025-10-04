package com.biblioteca.userlibraryservice.dto.userGenrePreferences;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserGenrePreferenceDTO {
    private Integer id;

    private Integer userId;

    private Integer catalogGenreId;

    private Integer preferenceLevel;

    private Boolean isExcluded;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
