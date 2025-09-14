package com.biblioteca.catalogservice.dto.bookEdition;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class BookEditionDTO {
    private Integer id;

    private Integer bookId;

    private String format;

    private String isbn;

    private Integer publisherId;

    private LocalDate publicationDate;

    private Integer pageCount;

    private BigDecimal price;

    private String currency;

    private Integer coverImageId;

    private String availabilityStatus;

    private LocalDateTime createdAt;

    private  LocalDateTime updatedAt;
}
