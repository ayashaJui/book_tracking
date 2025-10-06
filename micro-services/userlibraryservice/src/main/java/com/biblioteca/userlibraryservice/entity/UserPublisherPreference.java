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
@Table(name = "user_publisher_preferences")
public class UserPublisherPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //    TODO - propagate user data to use foreign key
    @Column(name = "user_id" , nullable = false)
    private Integer userId;

    //    TODO - propagate catalog publisher data to use foreign key
    @Column(name = "catalog_publisher_id", nullable = false)
    private Integer catalogPublisherId;

    @Column(name = "preference_level")
    private Integer preferenceLevel = 3;

    @Column(name = "is_favorite")
    private Boolean isFavorite = false;

    @Column(name = "personal_notes")
    private String personalNotes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
