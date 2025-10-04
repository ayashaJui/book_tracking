package com.biblioteca.userlibraryservice.entity;

import com.biblioteca.userlibraryservice.util.enums.BookStatus;
import com.biblioteca.userlibraryservice.util.enums.Format;
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
@Table(name = "user_books")
public class UserBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

//    TODO - propagate user data to use foreign key
    @Column(name = "user_id" , nullable = false)
    private Integer userId;

//    TODO - propagate catalog book data to use foreign key
    @Column(name = "catalog_book_id", nullable = false)
    private Integer catalogBookId;

    @Column(name = "status", nullable = false)
    private String status = BookStatus.WANT_TO_READ.name();

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "progress_percentage")
    private BigDecimal progressPercentage = BigDecimal.ZERO;

    @Column(name = "current_page")
    private Integer currentPage = 0;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "finish_date")
    private LocalDate finishDate;

    @Column(name = "is_favorite")
    private Boolean isFavorite = false;

    @Column(name = "reading_format")
    private String readingFormat = Format.PHYSICAL.name();

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "private_notes", columnDefinition = "TEXT")
    private String privateNotes;

    @Column(name = "first_acquisition_date")
    private LocalDate firstAcquisitionDate;

    @Column(name = "first_acquisition_method")
    private String firstAcquisitionMethod;

    @Column(name = "source_type")
    private String sourceType = "catalog_existing";

    @Column(name = "original_search_query", columnDefinition = "TEXT")
    private String originalSearchQuery;

    @Column(name = "created_at")
    private LocalDateTime  createdAt;

    @Column(name = "updated_at")
    private LocalDateTime  updatedAt;
}
