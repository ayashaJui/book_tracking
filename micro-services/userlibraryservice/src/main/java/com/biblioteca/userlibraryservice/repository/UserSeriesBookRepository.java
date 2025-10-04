package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.UserSeriesBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSeriesBookRepository extends JpaRepository<UserSeriesBook, Integer> {
}
