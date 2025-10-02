package com.biblioteca.catalogservice.dto.bookAuthor;

import com.biblioteca.catalogservice.util.enums.AuthorRoleEnums;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BookAuthorDTO {
    private Integer id;

    private Integer authorId;

    private String authorName;

    private AuthorRoleEnums authorRole;
}
