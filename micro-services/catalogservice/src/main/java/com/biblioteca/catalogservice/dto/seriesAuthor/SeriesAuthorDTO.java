package com.biblioteca.catalogservice.dto.seriesAuthor;

import com.biblioteca.catalogservice.util.enums.AuthorRoleEnums;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SeriesAuthorDTO {
    private Integer id;

    private Integer authorId;

    private String authorName;

    private AuthorRoleEnums authorRole;
}
