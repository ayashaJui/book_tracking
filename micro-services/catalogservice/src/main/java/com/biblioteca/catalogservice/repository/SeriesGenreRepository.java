package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.SeriesGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeriesGenreRepository extends JpaRepository<SeriesGenre, Integer> {
    List<SeriesGenre> findBySeriesId(Integer seriesId);
}
