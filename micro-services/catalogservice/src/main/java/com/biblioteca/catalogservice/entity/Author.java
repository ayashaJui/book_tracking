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
    private LocalDateTime birthDate;

    @Column(name = "death_date")
    private LocalDateTime deathDate;

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
}
