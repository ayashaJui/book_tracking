package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.BookAuthor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookAuthorRepository extends JpaRepository<BookAuthor, BookAuthor.BookAuthorId> {
}
