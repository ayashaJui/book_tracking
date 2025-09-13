package com.biblioteca.catalogservice.dto.bookEdition;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BookEditionUpdateDTO {
    @NotNull(message = "id cannot be null")
    private Integer id;

    @NotNull(message = "bookId cannot be null")
    private Integer bookId;

    @NotNull(message = "format cannot be null")
    private String format;

    private String isbn;

    @NotNull(message = "publisher Id cannot be null")
    private Integer publisherId;

    private LocalDate publishedDate;

    private Integer pageCount;

    private BigDecimal price;

    private String currency;

    private Integer coverImage;

    private String availabilityStatus;
}
