package com.biblioteca.userlibraryservice.dto.userPublisherPreferences;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserPublisherPreferenceUpdateDTO {
    @NotNull(message = "id can not be null")
    private Integer id;

    @NotNull(message = "userId can not be null")
    private Integer userId;

    @NotNull(message = "catalogAuthorId can not be null")
    private Integer catalogAuthorId;

    @Min(value = 1, message = "preferenceLevel can not be less than 1")
    @Max(value = 5, message = "preferenceLevel can not be greater than 5")
    private Integer preferenceLevel;

    private Boolean isFavorite;

    private String personalNotes;
}
