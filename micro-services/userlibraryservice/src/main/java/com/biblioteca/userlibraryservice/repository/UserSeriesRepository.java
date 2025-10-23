package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.UserSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSeriesRepository extends JpaRepository<UserSeries, Integer> {
    Optional<UserSeries> findByUserIdAndCatalogSeriesId(Integer userId, Integer catalogSeriesId);
}
