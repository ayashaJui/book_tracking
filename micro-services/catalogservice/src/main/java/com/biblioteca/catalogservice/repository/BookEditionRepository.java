package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.BookEdition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookEditionRepository extends JpaRepository<BookEdition, Integer> {
}
