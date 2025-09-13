package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.BookSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookSeriesRepository extends JpaRepository<BookSeries, BookSeries.BookSeriesId> {
}
