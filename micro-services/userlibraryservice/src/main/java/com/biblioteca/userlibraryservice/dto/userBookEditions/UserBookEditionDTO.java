package com.biblioteca.userlibraryservice.dto.userBookEditions;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserBookEditionDTO {
    private Integer id;

    private Integer userBookId;

    private Integer catalogEditionId;

    private Boolean isPrimaryEdition;

    private String condition;

    private String storageLocation;

    private LocalDate acquisitionDate;

    private String acquisitionMethod;

    private BigDecimal purchasePrice;

    private String purchaseCurrency;

    private String purchaseLocation;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
