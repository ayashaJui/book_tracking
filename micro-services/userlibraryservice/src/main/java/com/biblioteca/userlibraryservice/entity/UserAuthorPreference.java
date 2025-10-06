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
@Table(name = "user_author_preferences")
public class UserAuthorPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //    TODO - propagate user data to use foreign key
    @Column(name = "user_id" , nullable = false)
    private Integer userId;

    //    TODO - propagate catalog author data to use foreign key
    @Column(name = "catalog_author_id", nullable = false)
    private Integer catalogAuthorId;

    @Column(name = "preference_level")
    private Integer preferenceLevel = 3;

    @Column(name = "is_favorite")
    private Boolean isFavorite = false;

    @Column(name = "is_excluded")
    private Boolean isExcluded = Boolean.FALSE;

    @Column(name = "personal_notes")
    private String personalNotes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
