package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.Book;
import com.biblioteca.catalogservice.entity.BookEdition;
import com.biblioteca.catalogservice.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookEditionRepository extends JpaRepository<BookEdition, Integer> {
    Optional<BookEdition> findByIsbn(String isbn);

    List<BookEdition> findByBookId(Integer bookId);

    List<BookEdition> findByPublisherId(Integer publisherId);
}
