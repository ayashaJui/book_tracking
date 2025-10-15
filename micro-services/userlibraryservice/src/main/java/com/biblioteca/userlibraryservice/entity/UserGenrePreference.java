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
@Table(name = "user_genre_preferences")
public class UserGenrePreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //    TODO - propagate user data to use foreign key
    @Column(name = "user_id" , nullable = false)
    private Integer userId;

    //    TODO - propagate catalog genre data to use foreign key
    @Column(name = "catalog_genre_id", nullable = false)
    private Integer catalogGenreId;

    @Column(name = "preference_level")
    private Integer preferenceLevel = 3;

    @Column(name = "is_excluded")
    private Boolean isExcluded = Boolean.FALSE;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
