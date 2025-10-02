package com.biblioteca.catalogservice.dto.bookAuthor;

import com.biblioteca.catalogservice.util.enums.AuthorRoleEnums;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BookAuthorUpdateDTO {
//    @NotNull(message = "ID cannot be null")
//    private Integer id;

    @NotNull(message = "Author ID cannot be null")
    private Integer authorId;

//    @NotNull(message = "Book ID cannot be null")
//    private Integer bookId;

    private AuthorRoleEnums authorRole;
}
