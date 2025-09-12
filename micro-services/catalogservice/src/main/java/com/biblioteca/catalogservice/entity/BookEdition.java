package com.biblioteca.catalogservice.entity;

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
@Table(name = "book_editions", uniqueConstraints = {
        @UniqueConstraint(
                name = "uq_book_editions_isbn",
                columnNames = {"isbn"} // DB enforces the partial uniqueness
        )
})
public class BookEdition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "formate", columnDefinition = "VARCHAR(50)")
    private String formate;

    @Column(name = "isbn", columnDefinition = "VARCHAR(50)")
    private String isbn;

    @Column(name = "publication_date")
    private LocalDate publicationDate;

    @Column(name = "page_count", columnDefinition = "INT")
    private Integer pageCount;

    @Column(name = "price", columnDefinition = "DECIMAL(10,2)")
    private BigDecimal price;

    @Column(name = "currency", columnDefinition = "VARCHAR(10)")
    private String currency = "BDT";

    @Column(name = "cover_image_id")
    private Integer coverImageId;

    @Column(name = "availability_status", columnDefinition = "VARCHAR(50)")
    private String availabilityStatus = "AVAILABLE";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JoinColumn(name = "book_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Book book;

    @JoinColumn(name = "publisher_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Publisher publisher;

}
