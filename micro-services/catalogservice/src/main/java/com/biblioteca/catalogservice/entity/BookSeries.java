package com.biblioteca.catalogservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "book_series")
public class BookSeries {
    @EmbeddedId
    private BookSeriesId id;

    @Column(name = "position")
    private Integer position;

    // Many-to-one relationship to Book
    @MapsId("bookId") // Maps bookId from embedded key
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    // Many-to-one relationship to Series
    @MapsId("seriesId") // Maps seriesId from embedded key
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;

    // ===== Composite Key Class =====
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookSeriesId implements Serializable {
        @Column(name = "book_id")
        private Integer bookId;

        @Column(name = "series_id")
        private Integer seriesId;
    }
}
