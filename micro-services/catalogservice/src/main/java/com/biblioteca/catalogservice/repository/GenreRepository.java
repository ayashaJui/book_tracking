package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.Author;
import com.biblioteca.catalogservice.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Integer> {
    Optional<Genre> findByName(String name);

    List<Genre> findByNameContaining(String name);
}
