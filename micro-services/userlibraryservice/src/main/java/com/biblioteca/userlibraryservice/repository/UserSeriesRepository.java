package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.UserSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSeriesRepository extends JpaRepository<UserSeries, Integer> {
}
