package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.UserBookEdition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBookEditionRepository extends JpaRepository<UserBookEdition, Integer> {
}
