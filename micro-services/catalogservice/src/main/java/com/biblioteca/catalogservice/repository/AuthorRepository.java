package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Integer> {
    Optional<Author> findByNameIgnoreCase(String name);

    List<Author> findByNameContainingIgnoreCase(String name);
}
