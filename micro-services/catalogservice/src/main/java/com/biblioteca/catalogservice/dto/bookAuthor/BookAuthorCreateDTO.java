package com.biblioteca.catalogservice.dto.bookAuthor;

import com.biblioteca.catalogservice.util.enums.AuthorRoleEnums;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class BookAuthorCreateDTO {
    @NotNull(message = "Author ID cannot be null")
    private Integer authorId;

//    @NotNull(message = "Book ID cannot be null")
//    private Integer bookId;

    private AuthorRoleEnums authorRole;
}
