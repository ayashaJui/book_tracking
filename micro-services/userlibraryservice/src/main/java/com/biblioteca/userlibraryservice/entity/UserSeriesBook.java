package com.biblioteca.userlibraryservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "user_series_books")
public class UserSeriesBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_series_id" , nullable = false)
    private UserSeries userSeries;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_book_id" , nullable = false)
    private UserBook userBook;

    //    TODO - propagate catalog book data to use foreign key
    @Column(name = "catalog_book_id", nullable = false)
    private Integer catalogBookId;

    @Column(name = "order_in_series")
    private Integer orderInSeries;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "reading_priority")
    private Integer readingPriority = 0;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
