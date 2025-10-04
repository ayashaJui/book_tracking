package com.biblioteca.userlibraryservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "user_book_editions")
public class UserBookEdition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_book_id", nullable = false)
    private UserBook userBook;

    //    TODO - propagate catalog book edition data to use foreign key
    @Column(name = "catalog_edition_id", nullable = false)
    private Integer catalogEditionId;

    @Column(name = "is_primary_edition")
    private Boolean isPrimaryEdition = true;

    @Column(name = "condition")
    private String condition;

    @Column(name = "storage_location")
    private String storageLocation;

    @Column(name = "acquisition_date")
    private LocalDate acquisitionDate;

    @Column(name = "acquisition_method")
    private String acquisitionMethod;

    @Column(name = "purchase_price")
    private BigDecimal purchasePrice;

    @Column(name = "purchase_currency")
    private String purchaseCurrency = "BDT";

    @Column(name = "purchase_location")
    private String purchaseLocation;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
