package com.biblioteca.catalogservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title", nullable = false, columnDefinition = "VARCHAR(500)" )
    private String title;

    @Column(name = "subtitle" , columnDefinition = "VARCHAR(500)")
    private String subtitle;

    @Column(name = "description", columnDefinition = "TEXT" )
    private String description;

    @Column(name = "publication_date")
    private LocalDateTime publicationDate;

    @Column(name = "page_count", columnDefinition = "INT")
    private Integer pageCount;

    @Column(name = "language", columnDefinition = "VARCHAR(100)" )
    private String language = "en";

    @Column(name = "average_rating", columnDefinition = "DOUBLE" )
    private Double averageRating = 0.0;

    @Column(name = "total_ratings", columnDefinition = "INT" )
    private Integer totalRatings = 0;

    @Column(name = "goodreads_id", columnDefinition = "VARCHAR(50)" )
    private String goodreadsId;

    @Column(name = "google_books_id", columnDefinition = "VARCHAR(50)" )
    private String googleBooksId;

    @Column(name = "is_active", columnDefinition = "BOOLEAN" )
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
