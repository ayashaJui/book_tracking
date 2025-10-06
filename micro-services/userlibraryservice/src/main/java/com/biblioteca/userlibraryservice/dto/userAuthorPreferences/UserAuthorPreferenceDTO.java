package com.biblioteca.userlibraryservice.dto.userAuthorPreferences;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserAuthorPreferenceDTO {
    private Integer id;

    private Integer userId;

    private Integer catalogAuthorId;

    private Integer preferenceLevel;

    private Boolean isFavorite;

    private Boolean isExcluded;

    private String personalNotes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
