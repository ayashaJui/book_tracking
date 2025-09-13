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
    private Integer authorId;

    private Integer bookId;

    private AuthorRoleEnums authorRole;
}
