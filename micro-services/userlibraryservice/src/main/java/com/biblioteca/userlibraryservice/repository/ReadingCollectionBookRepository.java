package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.ReadingCollectionBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadingCollectionBookRepository extends JpaRepository<ReadingCollectionBook, Integer> {
}
