package com.biblioteca.userlibraryservice.dto.userBookEditions;

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
public class UserBookEditionUpdateDTO {
    @NotNull(message = "id can not be null")
    private Integer id;

    @NotNull(message = "UserBookId can not be null")
    private Integer userBookId;

    @NotNull(message = "catalogEditionId can not be null")
    private int catalogEditionId;

    private Boolean isPrimaryEdition;

    private String condition;

    private String storageLocation;

    private LocalDate acquisitionDate;

    private String acquisitionMethod;

    private BigDecimal purchasePrice;

    private String purchaseCurrency;

    private String purchaseLocation;

    private String notes;
}
