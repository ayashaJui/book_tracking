package com.biblioteca.catalogservice.service.impl;

import com.biblioteca.catalogservice.dto.book.BookCreateDTO;
import com.biblioteca.catalogservice.dto.book.BookDTO;
import com.biblioteca.catalogservice.dto.book.BookUpdateDTO;
import com.biblioteca.catalogservice.dto.bookAuthor.BookAuthorCreateDTO;
import com.biblioteca.catalogservice.dto.bookAuthor.BookAuthorUpdateDTO;
import com.biblioteca.catalogservice.dto.bookGenre.BookGenreCreateDTO;
import com.biblioteca.catalogservice.dto.bookGenre.BookGenreUpdateDTO;
import com.biblioteca.catalogservice.dto.bookSeries.BookSeriesCreateDTO;
import com.biblioteca.catalogservice.dto.bookSeries.BookSeriesUpdateDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.pagination.PaginationUtil;
import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorCreateDTO;
import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorUpdateDTO;
import com.biblioteca.catalogservice.dto.seriesGenre.SeriesGenreUpdateDTO;
import com.biblioteca.catalogservice.entity.*;
import com.biblioteca.catalogservice.repository.AuthorRepository;
import com.biblioteca.catalogservice.repository.BookRepository;
import com.biblioteca.catalogservice.repository.GenreRepository;
import com.biblioteca.catalogservice.repository.SeriesRepository;
import com.biblioteca.catalogservice.service.BookService;
import com.biblioteca.catalogservice.util.exception.CustomException;
import com.biblioteca.catalogservice.util.mapper.BookAuthorMapper;
import com.biblioteca.catalogservice.util.mapper.BookMapper;
import com.biblioteca.catalogservice.util.mapper.BookSeriesMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final GenreRepository genreRepository;
    private final SeriesRepository seriesRepository;

    @Override
    @Transactional
    public BookDTO createBook(BookCreateDTO bookCreateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("createBook in BookServiceImpl is called with data: {} by user: {}", bookCreateDTO.toString(), jwt.getSubject());

        Optional<Book> existingBook = bookRepository.findByTitle(bookCreateDTO.getTitle());

        if (existingBook.isPresent()) {
            log.error("Book with title '{}' already exists", bookCreateDTO.getTitle());
            throw new CustomException("Book with the same title already exists", HttpStatus.CONFLICT.value());
        }

        Book book = fromCreateDTO(bookCreateDTO);

        if(bookCreateDTO.getBookAuthorCreateDTOs() != null && !bookCreateDTO.getBookAuthorCreateDTOs().isEmpty()){
            List<Integer> bookAuthorIds = bookCreateDTO.getBookAuthorCreateDTOs().stream().map(BookAuthorCreateDTO::getAuthorId).toList();

            List<Author> authors = authorRepository.findAllById(bookAuthorIds);

            for(BookAuthorCreateDTO bookAuthorCreateDTO : bookCreateDTO.getBookAuthorCreateDTOs()){
                Author author = authors.stream()
                        .filter(a -> a.getId().equals(bookAuthorCreateDTO.getAuthorId())).findFirst()
                        .orElseThrow(() -> new CustomException("Author with id " + bookAuthorCreateDTO.getAuthorId() + " not found", HttpStatus.NOT_FOUND.value()));

                BookAuthor bookAuthor = fromBookAuthorCreateDTO(bookAuthorCreateDTO);
                bookAuthor.setAuthor(author);
                bookAuthor.setBook(book);

                book.getBookAuthors().add(bookAuthor);
            }
        }

        if(bookCreateDTO.getBookGenreCreateDTOs() != null && !bookCreateDTO.getBookGenreCreateDTOs().isEmpty()){
            List<Integer> bookGenreIds = bookCreateDTO.getBookGenreCreateDTOs().stream().map(BookGenreCreateDTO::getGenreId).toList();

            List<Genre> genres = genreRepository.findAllById(bookGenreIds);

            for(BookGenreCreateDTO bookGenreCreateDTO : bookCreateDTO.getBookGenreCreateDTOs()){
                Genre genre = genres.stream()
                        .filter(a -> a.getId().equals(bookGenreCreateDTO.getGenreId())).findFirst()
                        .orElseThrow(() -> new CustomException("Genre with id " + bookGenreCreateDTO.getGenreId() + " not found", HttpStatus.NOT_FOUND.value()));

                BookGenre bookGenre = new BookGenre();
                bookGenre.setGenre(genre);
                bookGenre.setBook(book);

                book.getBookGenres().add(bookGenre);
            }
        }

        if(bookCreateDTO.getBookSeriesCreateDTOs() != null && !bookCreateDTO.getBookSeriesCreateDTOs().isEmpty()){
            List<Integer> bookSeriesIds = bookCreateDTO.getBookSeriesCreateDTOs().stream().map(BookSeriesCreateDTO::getSeriesId).toList();

            List<Series> series = seriesRepository.findAllById(bookSeriesIds);

            for(BookSeriesCreateDTO bookSeriesCreateDTO : bookCreateDTO.getBookSeriesCreateDTOs()){
                Series s = series.stream()
                        .filter(a -> a.getId().equals(bookSeriesCreateDTO.getSeriesId())).findFirst()
                        .orElseThrow(() -> new CustomException("Series with id " + bookSeriesCreateDTO.getSeriesId() + " not found", HttpStatus.NOT_FOUND.value()));

                BookSeries bookSeries = fromBookSeriesCreateDTO(bookSeriesCreateDTO);
                bookSeries.setSeries(s);
                bookSeries.setBook(book);

                book.getBookSeries().add(bookSeries);
            }
        }

        try{
            bookRepository.save(book);

            log.info("Book has been created");

            return convertToDTO(book);

        }catch (Exception e){
            log.error("Error occurred while creating Book: {}", e.getMessage());
            throw new CustomException("Failed to create Book", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public List<BookDTO> getAllBooks(HttpServletRequest request, Jwt jwt) {
        log.info("getAllBooks in BookServiceImpl");

        List<Book> books = bookRepository.findAll();

        List<BookDTO> bookDTOS = books.stream().map(this::convertToDTO).toList();

        return bookDTOS;
    }

    @Override
    public Page<BookDTO> getAllBooksWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt) {
        log.info("getAllBooksWithPagination in BookServiceImpl");

        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PaginationUtil.getPageableSorted(pageRequestDTO.getPage(),  pageRequestDTO.getSize(), sort);

        Page<Book> books = bookRepository.findAll(pageable);
        Page<BookDTO> bookDTOPage = books.map(this::convertToDTO);

        return bookDTOPage;
    }

    @Override
    public BookDTO getBookById(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("getBookById in BookServiceImpl with id: {}", id);

        Book book = findById(id);

        return convertToDTO(book);
    }

    @Override
    @Transactional
    public BookDTO updateBook(BookUpdateDTO bookUpdateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("updateBook in BookServiceImpl with data: {}", bookUpdateDTO);

        Book  book = findById(bookUpdateDTO.getId());
        Optional<Book> bookWithSameTitle = bookRepository.findByTitle(bookUpdateDTO.getTitle());

        if(bookWithSameTitle.isPresent() && !bookWithSameTitle.get().getId().equals(bookUpdateDTO.getId())){
            log.error("Book with title '{}' already exists", bookUpdateDTO.getTitle());
            throw new CustomException("Book with the same title already exists", HttpStatus.CONFLICT.value());
        }

        Book updatedBook = fromUpdateDTO(bookUpdateDTO, book);

        // Handle Book Authors Update - Complete Replacement Strategy
        updateBookAuthors(book, bookUpdateDTO.getBookAuthorUpdateDTOs());

        // Handle Book Genres Update - Complete Replacement Strategy
        updateBookGenres(book, bookUpdateDTO.getBookGenreUpdateDTOS());

        // Handle Book series Update - Complete Replacement Strategy
        updateBookSeries(book, bookUpdateDTO.getBookSeriesUpdateDTOS());

        try{
            bookRepository.save(updatedBook);
            log.info("Book has been updated");
            return convertToDTO(updatedBook);

        }catch (Exception e){
            log.error("Error occurred while updating Book: {}", e.getMessage());
            throw new CustomException("Failed to update Book", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public String deleteBook(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("deleteBook in BookController is called with id: {} by user: {}", id, jwt.getSubject());

        Book book = findById(id);

        int authorCount = book.getBookAuthors().size();
        int genreCount = book.getBookGenres().size();
        int seriesCount = book.getBookSeries().size();

        try {
            bookRepository.delete(book);

            log.info("Successfully deleted book with id: {} and its {} BookAuthor, {} BookSeries and {} BookGenre relationships", id, authorCount, seriesCount, genreCount);

            return "Book with id " + id + " has been successfully deleted along with its relationships";

        } catch (Exception e) {
            log.error("Error occurred while deleting series with id: {}: {}", id, e.getMessage());
            throw new CustomException("Failed to delete series: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public List<BookDTO> getBookBySeriesId(Integer seriesId, HttpServletRequest request, Jwt jwt) {
        log.info("getBookBySeriesId in BookServiceImpl is called with seriesId: {} by user: {}", seriesId, jwt.getSubject());

        seriesRepository.findById(seriesId).orElseThrow(() -> {
            log.error("Series with id {} not found", seriesId);
            return new CustomException("Series with id " + seriesId + " not found", HttpStatus.NOT_FOUND.value());
        });

        List<Book> books = bookRepository.findByBookSeries(seriesId);
        List<BookDTO> bookDTOList = books.stream().map(this::convertToDTO).toList();

        return bookDTOList;
    }

    @Override
    public List<BookDTO> getBookByAuthorId(Integer authorId, HttpServletRequest request, Jwt jwt) {
        log.info("getBookByAuthorId in BookServiceImpl is called with authorId: {} by user: {}", authorId, jwt.getSubject());

        authorRepository.findById(authorId).orElseThrow(() -> {
            log.error("Author with id {} not found", authorId);
            return new CustomException("Author with id " + authorId + " not found", HttpStatus.NOT_FOUND.value());
        });

        List<Book> books = bookRepository.findByBookAuthors(authorId);
        List<BookDTO> bookDTOList = books.stream().map(this::convertToDTO).toList();

        return bookDTOList;
    }

    @Override
    public List<BookDTO> getBookByGenreId(Integer genreId, HttpServletRequest request, Jwt jwt) {
        log.info("getBookByGenreId in BookServiceImpl is called with genreId: {} by user: {}", genreId, jwt.getSubject());

        genreRepository.findById(genreId).orElseThrow(() -> {
            log.error("Genre with id {} not found", genreId);
            return new CustomException("Genre with id " + genreId + " not found", HttpStatus.NOT_FOUND.value());
        });

        List<Book> books = bookRepository.findByBookGenres(genreId);
        List<BookDTO> bookDTOList = books.stream().map(this::convertToDTO).toList();

        return bookDTOList;
    }

    private Book findById(Integer id){
        return bookRepository.findById(id).orElseThrow(() -> {
            log.error("Book with id {} not found", id);
            return new CustomException("Book with id " + id + " not found", HttpStatus.NOT_FOUND.value());
        });
    }

    private void updateBookAuthors(Book book, List<BookAuthorUpdateDTO> authorsUpdateDTOS) {
        log.info("Updating book authors for book id: {} ", book.getId());

        if (authorsUpdateDTOS == null || authorsUpdateDTOS.isEmpty()) {
            // Remove all existing authors
            book.getBookAuthors().clear();
            log.info("No authors provided, all existing authors removed from series");
            return;
        }

        // Validate all author IDs exist before proceeding
        List<Integer> incomingAuthorIds = authorsUpdateDTOS.stream()
                .map(BookAuthorUpdateDTO::getAuthorId)
                .distinct()
                .toList();

        List<Author> existingAuthors = authorRepository.findAllById(incomingAuthorIds);

        if (existingAuthors.size() != incomingAuthorIds.size()) {
            List<Integer> foundIds = existingAuthors.stream().map(Author::getId).toList();
            List<Integer> missingIds = incomingAuthorIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new CustomException("Authors not found with IDs: " + missingIds,
                    HttpStatus.NOT_FOUND.value());
        }

        // Get current Book Author entities
        List<BookAuthor> currentAuthors = book.getBookAuthors();

        // Create maps for efficient lookup
        Map<Integer, BookAuthor> currentAuthorMap = currentAuthors.stream()
                .collect(Collectors.toMap(sa -> sa.getAuthor().getId(), sa -> sa));

        Map<Integer, Author> authorMap = existingAuthors.stream()
                .collect(Collectors.toMap(Author::getId, author -> author));

        // Track which authors should remain
        Set<Integer> authorsToKeep = new HashSet<>(incomingAuthorIds);

        // Remove BookAuthors for authors not in the incoming list
        currentAuthors.removeIf(sa -> !authorsToKeep.contains(sa.getAuthor().getId()));

        // Process incoming authors
        for (BookAuthorUpdateDTO authorUpdateDTO : authorsUpdateDTOS) {
            Integer authorId = authorUpdateDTO.getAuthorId();

            if (currentAuthorMap.containsKey(authorId)) {
                // Update existing relationship - only role can change, preserves ID
                BookAuthor existing = currentAuthorMap.get(authorId);
                existing.setRole(authorUpdateDTO.getAuthorRole() != null ?
                        authorUpdateDTO.getAuthorRole().name() : null);
                log.debug("Updated role for existing BookAuthor ID: {}, Author ID: {}",
                        existing.getId(), authorId);
            } else {
                // Create new relationship
                Author author = authorMap.get(authorId);
                BookAuthor newBookAuthor = BookAuthor.builder()
                        .book(book)
                        .author(author)
                        .role(authorUpdateDTO.getAuthorRole() != null ?
                                authorUpdateDTO.getAuthorRole().name() : null)
                        .build();

                currentAuthors.add(newBookAuthor);
                log.debug("Created new BookAuthor for Author ID: {}", authorId);
            }
        }

        log.info("Successfully updated book authors, final count: {}", currentAuthors.size());
    }

    private void updateBookGenres(Book book, List<BookGenreUpdateDTO> genresUpdateDTOS) {
        log.info("Updating book genres for book id: {}", book.getId());

        if (genresUpdateDTOS == null || genresUpdateDTOS.isEmpty()) {
            // Remove all existing genres
            book.getBookGenres().clear();
            log.info("No genres provided, all existing genres removed from book");
            return;
        }

        // Validate all genre IDs exist before proceeding
        List<Integer> incomingGenreIds = genresUpdateDTOS.stream()
                .map(BookGenreUpdateDTO::getGenreId)
                .distinct()
                .toList();

        List<Genre> existingGenres = genreRepository.findAllById(incomingGenreIds);

        if (existingGenres.size() != incomingGenreIds.size()) {
            List<Integer> foundIds = existingGenres.stream().map(Genre::getId).toList();
            List<Integer> missingIds = incomingGenreIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new CustomException("Genres not found with IDs: " + missingIds,
                    HttpStatus.NOT_FOUND.value());
        }

        // Get current BookGenre entities
        List<BookGenre> currentGenres = book.getBookGenres();

        // Create maps for efficient lookup
        Map<Integer, BookGenre> currentGenreMap = currentGenres.stream()
                .collect(Collectors.toMap(sg -> sg.getGenre().getId(), sg -> sg));

        Map<Integer, Genre> genreMap = existingGenres.stream()
                .collect(Collectors.toMap(Genre::getId, genre -> genre));

        // Track which genres should remain
        Set<Integer> genresToKeep = new HashSet<>(incomingGenreIds);

        // Remove BookGenres for genres not in the incoming list
        currentGenres.removeIf(sg -> !genresToKeep.contains(sg.getGenre().getId()));

        // Process incoming genres
        for (BookGenreUpdateDTO genreDTO : genresUpdateDTOS) {
            Integer genreId = genreDTO.getGenreId();

            if (currentGenreMap.containsKey(genreId)) {
                // Relationship already exists - keep existing BookGenre (preserves ID)
                log.debug("Keeping existing BookGenre ID: {}, Genre ID: {}",
                        currentGenreMap.get(genreId).getId(), genreId);
            } else {
                // Create new relationship
                Genre genre = genreMap.get(genreId);
                BookGenre newBookGenre = BookGenre.builder()
                        .book(book)
                        .genre(genre)
                        .build();

                currentGenres.add(newBookGenre);
                log.debug("Created new BookGenre for Genre ID: {}", genreId);
            }
        }

        log.info("Successfully updated book genres, final count: {}", currentGenres.size());
    }

    private void updateBookSeries(Book book, List<BookSeriesUpdateDTO> seriesUpdateDTOS) {
        log.info("Updating book series for book id: {} ", book.getId());

        if (seriesUpdateDTOS == null || seriesUpdateDTOS.isEmpty()) {
            // Remove all existing authors
            book.getBookSeries().clear();
            log.info("No series provided, all existing series removed from book");
            return;
        }

        // Validate all series IDs exist before proceeding
        List<Integer> incomingSeriesIds = seriesUpdateDTOS.stream()
                .map(BookSeriesUpdateDTO::getSeriesId)
                .distinct()
                .toList();

        List<Series> existingSeries = seriesRepository.findAllById(incomingSeriesIds);

        if (existingSeries.size() != incomingSeriesIds.size()) {
            List<Integer> foundIds = existingSeries.stream().map(Series::getId).toList();
            List<Integer> missingIds = incomingSeriesIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new CustomException("Series not found with IDs: " + missingIds,
                    HttpStatus.NOT_FOUND.value());
        }

        // Get current Book Series entities
        List<BookSeries> currentSeries = book.getBookSeries();

        // Create maps for efficient lookup
        Map<Integer, BookSeries> currentSeriesMap = currentSeries.stream()
                .collect(Collectors.toMap(sa -> sa.getSeries().getId(), sa -> sa));

        Map<Integer, Series> seriesMap = existingSeries.stream()
                .collect(Collectors.toMap(Series::getId, s -> s));

        // Track which series should remain
        Set<Integer> seriesToKeep = new HashSet<>(incomingSeriesIds);

        // Remove BookSeries for series not in the incoming list
        currentSeries.removeIf(sa -> !seriesToKeep.contains(sa.getSeries().getId()));

        // Process incoming series
        for (BookSeriesUpdateDTO seriesUpdateDTO : seriesUpdateDTOS) {
            Integer seriesId = seriesUpdateDTO.getSeriesId();

            if (currentSeriesMap.containsKey(seriesId)) {
                // Update existing relationship - only position can change, preserves ID
                BookSeries existing = currentSeriesMap.get(seriesId);
                existing.setPosition(seriesUpdateDTO.getPosition() != null ?
                        seriesUpdateDTO.getPosition() : null);
                log.debug("Updated position for existing BookSeries ID: {}, Author ID: {}",
                        existing.getId(), seriesId);
            } else {
                // Create new relationship
                Series series = seriesMap.get(seriesId);
                BookSeries newBookSeries = BookSeries.builder()
                        .book(book)
                        .series(series)
                        .position(seriesUpdateDTO.getPosition() != null ?
                                seriesUpdateDTO.getPosition() : null)
                        .build();

                currentSeries.add(newBookSeries);
                log.debug("Created new BookSeries for Series ID: {}", seriesId);
            }
        }

        log.info("Successfully updated book series, final count: {}", currentSeries.size());
    }

    private Book fromCreateDTO(BookCreateDTO bookCreateDTO) {
        return BookMapper.fromCreateDTO(bookCreateDTO);
    }

    private BookDTO convertToDTO(Book book) {
        return BookMapper.toDTO(book);
    }

    private Book fromUpdateDTO(BookUpdateDTO bookUpdateDTO, Book book) {
        return BookMapper.fromUpdateDTO(bookUpdateDTO, book);
    }

    private BookAuthor fromBookAuthorCreateDTO(BookAuthorCreateDTO bookAuthorCreateDTO) {
        return BookAuthorMapper.fromCreateDTO(bookAuthorCreateDTO);
    }

    private BookSeries fromBookSeriesCreateDTO(BookSeriesCreateDTO bookSeriesCreateDTO) {
        return BookSeriesMapper.fromCreateDTO(bookSeriesCreateDTO);
    }
}
