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
@Table(name = "book_authors")
public class BookAuthor {
    @EmbeddedId
    private BookAuthorId id;

    // Many-to-one relationship to Book
    @MapsId("bookId") // Maps bookId from embedded key
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    // Many-to-one relationship to Author
    @MapsId("authorId") // Maps authorId from embedded key
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private Author author;

    // ===== Composite Key Class =====
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookAuthorId implements Serializable {
        @Column(name = "book_id")
        private Integer bookId;

        @Column(name = "author_id")
        private Integer authorId;

        @Column(name = "role", length = 50)
        private String role;
    }
}
