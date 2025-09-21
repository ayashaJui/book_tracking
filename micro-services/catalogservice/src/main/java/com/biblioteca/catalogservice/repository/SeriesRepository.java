package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.Series;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeriesRepository extends JpaRepository<Series, Integer> {
    Optional<Series> findByName(String name);
}
