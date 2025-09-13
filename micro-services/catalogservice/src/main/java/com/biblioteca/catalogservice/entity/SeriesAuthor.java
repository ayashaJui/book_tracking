package com.biblioteca.catalogservice.entity;

import com.biblioteca.catalogservice.util.enums.AuthorRoleEnums;
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
@Table(name = "series_authors")
public class SeriesAuthor {
    @EmbeddedId
    private SeriesAuthorId id;

//    @Column(name = "role", columnDefinition = "VARCHAR(50)")
//    private String role = AuthorRoleEnums.AUTHOR.name();

    // Many-to-one relationship to Series
    @MapsId("seriesId") // Maps seriesId from embedded key
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;

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
    public static class SeriesAuthorId implements Serializable {
        @Column(name = "series_id")
        private Integer seriesId;

        @Column(name = "author_id")
        private Integer authorId;

        @Column(name = "role", length = 50)
        private String role;
    }
}
