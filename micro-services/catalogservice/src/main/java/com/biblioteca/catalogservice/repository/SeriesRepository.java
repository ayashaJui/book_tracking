package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.Series;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeriesRepository extends JpaRepository<Series, Integer> {
    Optional<Series> findByName(String name);

    @Query("SELECT s FROM SeriesAuthor sa JOIN sa.series s " +
            "WHERE sa.author.id = :authorId ORDER BY sa.role")
    List<Series> findBySeriesAuthors(@Param("authorId") Integer authorId);

    @Query("SELECT s FROM SeriesGenre sg JOIN sg.series s " +
            "WHERE sg.genre.id = :genreId")
    List<Series> findBySeriesGenres(@Param("genreId") Integer genreId);
}
