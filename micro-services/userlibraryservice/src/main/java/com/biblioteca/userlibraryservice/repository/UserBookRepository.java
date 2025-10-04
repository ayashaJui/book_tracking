package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.UserBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBookRepository extends JpaRepository<UserBook, Integer> {
}
