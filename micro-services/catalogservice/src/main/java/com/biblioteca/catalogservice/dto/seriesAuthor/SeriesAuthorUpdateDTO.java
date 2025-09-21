package com.biblioteca.catalogservice.dto.seriesAuthor;

import com.biblioteca.catalogservice.util.enums.AuthorRoleEnums;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SeriesAuthorUpdateDTO {
    // No ID field - we use natural key (seriesId + authorId) to identify relationships
    
    @NotNull(message = "Author ID cannot be null")
    private Integer authorId;

    private AuthorRoleEnums authorRole;
}
