package com.biblioteca.catalogservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Table(name = "authors")
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, columnDefinition = "VARCHAR(255)")
    private String name;

    @Column(name = "bio", columnDefinition = "TEXT")
    private  String bio;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "death_date")
    private LocalDate deathDate;

    @Column(name = "nationality", columnDefinition = "VARCHAR(100)")
    private String nationality;

    @Column(name = "website", columnDefinition = "VARCHAR(500)")
    private String website;

    @Column(name = "image_id", columnDefinition = "VARCHAR(500)")
    private String imageId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "instagram_url", columnDefinition = "VARCHAR(500)")
    private String instagramUrl;

    @Column(name = "threads_url", columnDefinition = "VARCHAR(500)")
    private String threadsUrl;

    @Column(name = "goodread_url", columnDefinition = "VARCHAR(500)")
    private String goodreadUrl;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SeriesAuthor> seriesAuthors = new ArrayList<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookAuthor> bookAuthors = new ArrayList<>();
}
