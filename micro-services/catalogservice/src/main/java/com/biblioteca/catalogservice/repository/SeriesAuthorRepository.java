package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.SeriesAuthor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeriesAuthorRepository extends JpaRepository<SeriesAuthor, Integer> {
}
