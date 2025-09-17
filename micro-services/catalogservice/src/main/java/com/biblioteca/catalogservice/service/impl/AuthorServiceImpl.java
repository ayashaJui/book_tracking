package com.biblioteca.catalogservice.service.impl;

import com.biblioteca.catalogservice.dto.author.AuthorCreateDTO;
import com.biblioteca.catalogservice.dto.author.AuthorDTO;
import com.biblioteca.catalogservice.dto.author.AuthorUpdateDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.pagination.PaginationUtil;
import com.biblioteca.catalogservice.entity.Author;
import com.biblioteca.catalogservice.repository.AuthorRepository;
import com.biblioteca.catalogservice.service.AuthorService;
import com.biblioteca.catalogservice.util.exception.CustomException;
import com.biblioteca.catalogservice.util.mapper.AuthorMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {
    private final AuthorRepository authorRepository;

    @Override
    @Transactional
    public AuthorDTO createAuthor(AuthorCreateDTO authorCreateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("createAuthor in AuthorServiceImpl is called with data: {} by user: {}", authorCreateDTO, jwt.getSubject());

        Optional<Author> existingAuthor = authorRepository.findByName(authorCreateDTO.getName());
        if (existingAuthor.isPresent()) {
            log.error("Author with name '{}' already exists", authorCreateDTO.getName());
            throw new CustomException("Author with the same name already exists", CONFLICT.value());
        }

        Author author = fromCreateDTO(authorCreateDTO);

        try {
            authorRepository.save(author);

            log.info("Author created successfully ");

            return convertToDTO(author);
        }catch (Exception e) {
            log.error("Error occurred while creating author: {}", e.getMessage());
            throw new CustomException("Failed to create author", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public List<AuthorDTO> getAll(HttpServletRequest request, Jwt jwt) {
        log.info("getAll in AuthorServiceImpl is called with data: {}", jwt.getSubject());

        List<AuthorDTO> authorDTOs = authorRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();

        return authorDTOs;
    }

    @Override
    public AuthorDTO getById(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("getById in AuthorServiceImpl is called with id: {} by user: {}", id, jwt.getSubject());

        Author author = findById(id);

        return convertToDTO(author);
    }

    @Override
    public Page<AuthorDTO> getAllWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt) {
        log.info("getAllWithPagination in AuthorServiceImpl is called by user: {}", jwt.getSubject());

        Sort sort = Sort.by(Sort.Direction.DESC, "id");

        Pageable pageable = PaginationUtil.getPageableSorted(pageRequestDTO.getPage(), pageRequestDTO.getSize(), sort);


        Page<Author> authorPage = authorRepository.findAll(pageable);

        return authorPage.map(this::convertToDTO);
    }

    @Override
    @Transactional
    public AuthorDTO updateAuthor(AuthorUpdateDTO updateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("updateAuthor in AuthorServiceImpl is called with data: {} by user: {}", updateDTO, jwt.getSubject());

        Optional<Author> existingAuthor = authorRepository.findByName(updateDTO.getName());

        if(existingAuthor.isPresent() && !existingAuthor.get().getId().equals(updateDTO.getId())) {
            log.error("Author with name '{}' already exists", updateDTO.getName());
            throw new CustomException("Author with the same name already exists", CONFLICT.value());
        }

        Author author = findById(updateDTO.getId());

        author = fromUpdateDTO(updateDTO, author);

        author.setId(updateDTO.getId());

        try{
            authorRepository.save(author);

            log.info("Author updated successfully ");

            return convertToDTO(author);
        }catch (Exception e) {
            log.error("Error occurred while updating author: {}", e.getMessage());
            throw new CustomException("Failed to update author", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public String deleteAuthor(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("deleteAuthor in AuthorServiceImpl is called with id: {} by user: {}", id, jwt.getSubject());

        Author author = findById(id);

        try {
            authorRepository.delete(author);
            log.info("Author deleted successfully ");
            return "Author deleted successfully";
        } catch (Exception e) {
            log.error("Error occurred while deleting author: {}", e.getMessage());
            throw new CustomException("Failed to delete author", INTERNAL_SERVER_ERROR.value());
        }
    }

    private Author findById(Integer id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Author not found with id: {}", id);
                    return new CustomException("Author not found", NOT_FOUND.value());
                });
    }

    public Author fromCreateDTO(AuthorCreateDTO authorCreateDTO){
        return AuthorMapper.fromCreateDTO(authorCreateDTO);
    }

    public AuthorDTO convertToDTO(Author author){
        return AuthorMapper.toDTO(author);
    }

    public Author fromUpdateDTO(AuthorUpdateDTO authorUpdateDTO, Author author){
        return AuthorMapper.fromUpdateDTO(authorUpdateDTO, author);
    }
}
