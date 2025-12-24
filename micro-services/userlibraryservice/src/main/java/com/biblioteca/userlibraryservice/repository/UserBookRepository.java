package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.UserBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserBookRepository extends JpaRepository<UserBook, Integer> {
    Optional<UserBook> findByUserIdAndCatalogBookId(Integer userId, Integer catalogBookId);
}
