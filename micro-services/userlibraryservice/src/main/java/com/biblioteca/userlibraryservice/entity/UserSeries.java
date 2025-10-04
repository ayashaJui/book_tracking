package com.biblioteca.userlibraryservice.entity;

import com.biblioteca.userlibraryservice.util.enums.SeriesStatus;
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
@Table(name = "user_series")
public class UserSeries {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //    TODO - propagate user data to use foreign key
    @Column(name = "user_id" , nullable = false)
    private Integer userId;

    //    TODO - propagate catalog series data to use foreign key
    @Column(name = "catalog_series_id", nullable = false)
    private Integer catalogSeriesId;

    @Column(name = "books_read")
    private Integer booksRead = 0;

    @Column(name = "books_owned")
    private Integer booksOwned = 0;

    @Column(name = "completion_percentage")
    private BigDecimal completionPercentage = BigDecimal.ZERO;

    @Column(name = "status")
    private String status = SeriesStatus.WANT_TO_READ.name();

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(name = "is_favorite")
    private Boolean isFavorite = false;

    @Column(name = "reading_order_preference")
    private String readingOrderPreference = "publication";

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
