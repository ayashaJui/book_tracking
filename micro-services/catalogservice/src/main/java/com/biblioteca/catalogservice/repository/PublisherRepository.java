package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.Author;
import com.biblioteca.catalogservice.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Integer> {
    Optional<Publisher> findByNameIgnoreCase(String name);

    List<Publisher> findByNameContaining(String name);
}
