package com.biblioteca.catalogservice.repository;

import com.biblioteca.catalogservice.entity.Author;
import com.biblioteca.catalogservice.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    Optional<Book> findByTitle(String title);

    @Query("SELECT b FROM BookSeries bs JOIN bs.book b " +
            "WHERE bs.series.id = :seriesId ORDER BY bs.position")
    List<Book> findByBookSeries(@Param("seriesId") Integer seriesId);

    @Query("SELECT b FROM BookAuthor ba JOIN ba.book b " +
            "WHERE ba.author.id = :authorId ORDER BY ba.role")
    List<Book> findByBookAuthors(@Param("authorId") Integer authorId);

    @Query("SELECT b FROM BookGenre bg JOIN bg.book b " +
            "WHERE bg.genre.id = :genreId")
    List<Book> findByBookGenres(@Param("genreId") Integer genreId);

    List<Book> findByTitleContaining(String title);
}
