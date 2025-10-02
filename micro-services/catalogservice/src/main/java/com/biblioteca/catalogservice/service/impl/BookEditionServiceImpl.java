package com.biblioteca.catalogservice.service.impl;

import com.biblioteca.catalogservice.dto.bookEdition.BookEditionCreateDTO;
import com.biblioteca.catalogservice.dto.bookEdition.BookEditionDTO;
import com.biblioteca.catalogservice.dto.bookEdition.BookEditionUpdateDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.pagination.PaginationUtil;
import com.biblioteca.catalogservice.entity.Book;
import com.biblioteca.catalogservice.entity.BookEdition;
import com.biblioteca.catalogservice.entity.Publisher;
import com.biblioteca.catalogservice.repository.BookEditionRepository;
import com.biblioteca.catalogservice.repository.BookRepository;
import com.biblioteca.catalogservice.repository.PublisherRepository;
import com.biblioteca.catalogservice.service.BookEditionService;
import com.biblioteca.catalogservice.service.BookService;
import com.biblioteca.catalogservice.util.exception.CustomException;
import com.biblioteca.catalogservice.util.mapper.BookEditionMapper;
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

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookEditionServiceImpl implements BookEditionService {
    private final BookEditionRepository bookEditionRepository;
    private final BookRepository bookRepository;
    private final BookService bookService;
    private final PublisherRepository publisherRepository;

    @Override
    @Transactional
    public BookEditionDTO createBookEdition(BookEditionCreateDTO bookEditionCreateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("createBookEdition in BookEditionServiceImpl is called with data: {}" , bookEditionCreateDTO);

        Optional<BookEdition> exist = bookEditionRepository.findByIsbn(bookEditionCreateDTO.getIsbn());

        if(exist.isPresent()) {
            log.error("Book Edition with isbn: {} already exists in BookEditionServiceImpl", bookEditionCreateDTO.getIsbn());

            throw new CustomException("Book Edition Already Exist", HttpStatus.CONFLICT.value());
        }

        Book book = bookRepository.findById(bookEditionCreateDTO.getBookId()).orElseThrow(() -> {
            log.error("Book with id {} not found in BookEditionServiceImpl", bookEditionCreateDTO.getBookId());
            return new CustomException("Book Not Found", HttpStatus.NOT_FOUND.value());
        });

        Publisher publisher = publisherRepository.findById(bookEditionCreateDTO.getPublisherId()).orElseThrow(() -> {
            log.error("Publisher with id {} not found in BookEditionServiceImpl", bookEditionCreateDTO.getPublisherId());

            return new CustomException("Publisher Not Found", HttpStatus.NOT_FOUND.value());
        });

        BookEdition bookEdition = fromCreateBookEdition(bookEditionCreateDTO);
        bookEdition.setPublisher(publisher);
        bookEdition.setBook(book);

        try {
            bookEditionRepository.save(bookEdition);
            log.info("Book Edition saved in BookEditionServiceImpl");
            return convertToDTO(bookEdition);
        }catch (Exception e) {
            log.error("Book Edition could not be saved in BookEditionServiceImpl");
            throw new CustomException("Book Edition could not be saved", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public Page<BookEditionDTO> getBookEditionsWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt) {
        log.info("getBookEditionsWithPagination in BookEditionServiceImpl is called");

        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PaginationUtil.getPageableSorted(pageRequestDTO.getPage(), pageRequestDTO.getSize(), sort);

        Page<BookEdition> bookEditionPage = bookEditionRepository.findAll(pageable);
        Page<BookEditionDTO> bookEditionDTOPage = bookEditionPage.map(this::convertToDTO);

        return bookEditionDTOPage;
    }

    @Override
    public List<BookEditionDTO> getAllBookEditions(HttpServletRequest request, Jwt jwt) {
        log.info("getAllBookEditions in BookEditionServiceImpl is called");

        List<BookEdition> bookEditions = bookEditionRepository.findAll();
        List<BookEditionDTO> bookEditionDTOS = bookEditions.stream().map(this::convertToDTO).toList();

        return bookEditionDTOS;
    }

    @Override
    public BookEditionDTO getBookEditionById(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("getBookEditionById in BookEditionServiceImpl is called with id: {}" , id);

        BookEdition bookEdition = findById(id);

        return convertToDTO(bookEdition);
    }

    @Override
    @Transactional
    public BookEditionDTO updateBookEdition(BookEditionUpdateDTO bookEditionUpdateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("updateBookEdition in BookEditionServiceImpl is called with data: {}" , bookEditionUpdateDTO);

        BookEdition bookEdition = findById(bookEditionUpdateDTO.getId());

        Optional<BookEdition> existingEdition = bookEditionRepository.findByIsbn(bookEditionUpdateDTO.getIsbn().trim());

        if(existingEdition.isPresent() && !existingEdition.get().getId().equals(bookEditionUpdateDTO.getId())) {
            log.warn("Edition with isbn '{}' already exists. Update aborted.", bookEditionUpdateDTO.getIsbn());
            throw new CustomException("Edition with the same isbn already exists", HttpStatus.CONFLICT.value());
        }

        Book book = bookRepository.findById(bookEditionUpdateDTO.getBookId()).orElseThrow(() -> {
            log.error("Book with id {} not found in BookEditionServiceImpl", bookEditionUpdateDTO.getBookId());
            return new CustomException("Book Not Found", HttpStatus.NOT_FOUND.value());
        });

        Publisher publisher = publisherRepository.findById(bookEditionUpdateDTO.getPublisherId()).orElseThrow(() -> {
            log.error("Publisher with id {} not found in BookEditionServiceImpl", bookEditionUpdateDTO.getPublisherId());

            return new CustomException("Publisher Not Found", HttpStatus.NOT_FOUND.value());
        });

        BookEdition updatedEdition = fromUpdateBookEdition(bookEditionUpdateDTO, bookEdition);
        updatedEdition.setBook(book);
        updatedEdition.setPublisher(publisher);

        try{
            bookEditionRepository.save(updatedEdition);

            log.info("Publisher updated successfully");

            return convertToDTO(updatedEdition);

        }catch (Exception e) {
            log.error("Error occurred while updating bookEdition: {}", e.getMessage());
            throw new CustomException("Failed to update bookEdition", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    @Transactional
    public String deleteBookEditionById(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("deleteBookEditionById in BookEditionServiceImpl is called with id: {}" , id);
        BookEdition bookEdition = findById(id);

        try {
            bookEditionRepository.delete(bookEdition);
            log.info("BookEdition deleted successfully");
            return "BookEdition has been deleted successfully";

        }catch (Exception e) {
            log.error("Error occurred while deleting bookEdition: {}", e.getMessage());
            throw new CustomException("Failed to delete bookEdition", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public List<BookEditionDTO> getByBookId(Integer bookId, HttpServletRequest request, Jwt jwt) {
        log.info("getByBookId in BookEditionServiceImpl is called with bookId: {}" , bookId);

        bookRepository.findById(bookId).orElseThrow(() -> {
            log.error("Book with id {} not found in BookEditionServiceImpl", bookId);
            return new CustomException("Book Not Found", HttpStatus.NOT_FOUND.value());
        });

        List<BookEdition> bookEditionList = bookEditionRepository.findByBookId(bookId);

        List<BookEditionDTO> bookEditionDTOS = bookEditionList.stream().map(this::convertToDTO).toList();

        return bookEditionDTOS;
    }

    @Override
    public List<BookEditionDTO> getByPublisherId(Integer publisherId, HttpServletRequest request, Jwt jwt) {
        log.info("getByPublisherId in BookEditionServiceImpl is called with publisherId: {}" , publisherId);

        publisherRepository.findById(publisherId).orElseThrow(() -> {
            log.error("Publisher with id {} not found in BookEditionServiceImpl", publisherId);
            return new CustomException("Publisher Not Found", HttpStatus.NOT_FOUND.value());
        });

        List<BookEdition> bookEditionList = bookEditionRepository.findByPublisherId(publisherId);

        List<BookEditionDTO> bookEditionDTOS = bookEditionList.stream().map(this::convertToDTO).toList();

        return bookEditionDTOS;
    }

    private BookEdition findById(Integer id){
        return bookEditionRepository.findById(id).orElseThrow(() -> {
            log.error("Book Edition with id {} not found in BookEditionServiceImpl", id);
            return new CustomException("Book Edition Not Found", HttpStatus.NOT_FOUND.value());
        });
    }

    private BookEdition fromCreateBookEdition(BookEditionCreateDTO bookEditionCreateDTO) {
        return BookEditionMapper.fromCreateDTO(bookEditionCreateDTO);
    }

    private BookEdition fromUpdateBookEdition(BookEditionUpdateDTO bookEditionUpdateDTO, BookEdition bookEdition) {
        return BookEditionMapper.fromUpdateDTO(bookEditionUpdateDTO, bookEdition);
    }

    private BookEditionDTO convertToDTO(BookEdition bookEdition) {
        return BookEditionMapper.toDTO(bookEdition);
    }
}
