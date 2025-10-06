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
@Table(name = "reading_collection_books")
public class ReadingCollectionBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_id", nullable = false)
    private ReadingCollection collection;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_book_id" , nullable = false)
    private UserBook userBook;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
