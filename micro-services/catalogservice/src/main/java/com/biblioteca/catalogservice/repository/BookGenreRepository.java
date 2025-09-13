package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.BookGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookGenreRepository extends JpaRepository<BookGenre, BookGenre.BookGenreId> {
}
