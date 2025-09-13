package com.biblioteca.catalogservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Table(name = "book_genres")
public class BookGenre {
    @EmbeddedId
    private BookGenreId id;

    // Many-to-one relationship to Book
    @MapsId("bookId") // Maps bookId from embedded key
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    // Many-to-one relationship to Genre
    @MapsId("genreId") // Maps genreId from embedded key
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id")
    private Genre genre;


    // ===== Composite Key Class =====
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookGenreId implements Serializable {
        @Column(name = "book_id")
        private Integer bookId;

        @Column(name = "genre_id")
        private Integer genreId;
    }
}
