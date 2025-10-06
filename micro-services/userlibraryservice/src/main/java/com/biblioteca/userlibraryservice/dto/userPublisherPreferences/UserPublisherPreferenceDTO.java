package com.biblioteca.userlibraryservice.dto.userPublisherPreferences;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserPublisherPreferenceDTO {
    private Integer id;

    private Integer userId;

    private Integer catalogAuthorId;

    private Integer preferenceLevel;

    private Boolean isFavorite;

    private String personalNotes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
