package com.biblioteca.catalogservice.service.impl;

import com.biblioteca.catalogservice.dto.genre.GenreCreateDTO;
import com.biblioteca.catalogservice.dto.genre.GenreDTO;
import com.biblioteca.catalogservice.dto.genre.GenreUpdateDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.pagination.PaginationUtil;
import com.biblioteca.catalogservice.entity.Author;
import com.biblioteca.catalogservice.entity.Genre;
import com.biblioteca.catalogservice.repository.GenreRepository;
import com.biblioteca.catalogservice.service.GenreService;
import com.biblioteca.catalogservice.util.exception.CustomException;
import com.biblioteca.catalogservice.util.mapper.GenreMapper;
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

import static org.springframework.http.HttpStatus.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {
    private final GenreRepository genreRepository;

    @Override
    @Transactional
    public GenreDTO createGenre(GenreCreateDTO genreCreateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("createGenre in GenreServiceImpl is called with data: {} by user: {}", genreCreateDTO, jwt.getSubject());

        Optional<Genre> existingGenre = genreRepository.findByName(genreCreateDTO.getName());

        if (existingGenre.isPresent()) {
            log.warn("Genre with name '{}' already exists. Creation aborted.", genreCreateDTO.getName());
            throw new CustomException("Genre with the same name already exists", CONFLICT.value());
        }

        Genre parentGenre = null;
        if(genreCreateDTO.getParentGenreId() != null){
            parentGenre = genreRepository.findById(genreCreateDTO.getParentGenreId())
                    .orElseThrow(() -> new CustomException(
                            "Parent genre with id " + genreCreateDTO.getParentGenreId() + " not found",
                            NOT_FOUND.value()
                    ));
        }

        Genre genre = fromCreateDTO(genreCreateDTO);
        genre.setParentGenreId(parentGenre);

        try {
            genreRepository.save(genre);
            log.info("Genre created successfully");
            return convertToDTO(genre);
        } catch (Exception e) {
            log.error("Error occurred while creating genre: {}", e.getMessage());
            throw new CustomException("Failed to create genre", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public List<GenreDTO> getAllGenres(HttpServletRequest request, Jwt jwt) {
        log.info("getAllGenres in GenreServiceImpl is called by user: {}", jwt.getSubject());

        List<GenreDTO> genreDTOList = genreRepository.findAll().stream().map(this::convertToDTO).toList();

        return genreDTOList;
    }

    @Override
    public GenreDTO getGenreById(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("getGenreById in GenreServiceImpl is called with id: {} by user: {}", id, jwt.getSubject());

        Genre genre = findById(id);


        return convertToDTO(genre);
    }

    @Override
    @Transactional
    public GenreDTO updateGenre(GenreUpdateDTO genreUpdateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("updateGenre in GenreServiceImpl is called with data: {} by user: {}", genreUpdateDTO, jwt.getSubject());

        Optional<Genre> existingGenre = genreRepository.findByName(genreUpdateDTO.getName());

        if (existingGenre.isPresent() && !existingGenre.get().getId().equals(genreUpdateDTO.getId())) {
            log.warn("Genre with name '{}' already exists. Update aborted.", genreUpdateDTO.getName());
            throw new CustomException("Genre with the same name already exists", CONFLICT.value());

        }

        Genre parentGenre = null;
        if(genreUpdateDTO.getParentGenreId() != null){
            parentGenre = genreRepository.findById(genreUpdateDTO.getParentGenreId())
                    .orElseThrow(() -> new CustomException(
                            "Parent genre with id " + genreUpdateDTO.getParentGenreId() + " not found",
                            NOT_FOUND.value()
                    ));
        }

        if(genreUpdateDTO.getParentGenreId() != null && genreUpdateDTO.getParentGenreId().equals(genreUpdateDTO.getId())) {
            log.warn("A genre cannot be its own parent. Update aborted.");
            throw new CustomException("A genre cannot be its own parent", BAD_REQUEST.value());
        }

        Genre genre = findById(genreUpdateDTO.getId());

        Genre updatedGenre = fromUpdateDTO(genreUpdateDTO, genre);
        updatedGenre.setId(genreUpdateDTO.getId());
        updatedGenre.setParentGenreId(parentGenre);

        try {
            genreRepository.save(updatedGenre);
            log.info("Genre updated successfully");
            return convertToDTO(updatedGenre);
        } catch (Exception e) {
            log.error("Error occurred while updating genre: {}", e.getMessage());
            throw new CustomException("Failed to update genre", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public String deleteGenre(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("deleteGenre in GenreServiceImpl is called with id: {} by user: {}", id, jwt.getSubject());

        Genre genre = findById(id);

        if (!genre.getSubGenres().isEmpty()) {
            throw new CustomException("Cannot delete genre with sub-genres. Remove or reassign them first.", BAD_REQUEST.value());
        }

        try {
            genreRepository.delete(genre);
            log.info("Genre deleted successfully");
            return "Genre deleted successfully";
        } catch (Exception e) {
            log.error("Error occurred while deleting genre: {}", e.getMessage());
            throw new CustomException("Failed to delete genre", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public Page<GenreDTO> getAllGenresWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt) {
        log.info("getAllGenresWithPagination in GenreServiceImpl is called by user: {}", jwt.getSubject());

        Sort sort = Sort.by(Sort.Direction.DESC, "id");

        Pageable pageable = PaginationUtil.getPageableSorted(pageRequestDTO.getPage(),  pageRequestDTO.getSize(), sort);

        Page<Genre> genrePage = genreRepository.findAll(pageable);

        return genrePage.map(this::convertToDTO);
    }

    @Override
    public List<GenreDTO> searchGenre(String genreName, HttpServletRequest request, Jwt jwt) {
        log.info("searchGenre in GenreServiceImpl is called with name: {}", genreName);

        List<Genre> genres = genreRepository.findByNameContaining(genreName);

        List<GenreDTO> dtos = genres.stream().map(this::convertToDTO).toList();

        return dtos;
    }

    @Override
    public List<GenreDTO> getGenresByIds(List<Integer> ids, HttpServletRequest request, Jwt jwt) {
        log.info("getGenresByIds in GenreServiceImpl is called with ids: {}", ids);

        if (ids == null || ids.isEmpty()) {
            throw new CustomException("Genre ID list cannot be empty", HttpStatus.BAD_REQUEST.value());
        }

        List<Genre> genres = genreRepository.findAllById(ids);
        if (genres.isEmpty()) {
            throw new CustomException("No genres found for given IDs", HttpStatus.NOT_FOUND.value());
        }

        List<GenreDTO> dtos = genres.stream().map(this::convertToDTO).toList();

        return dtos;
    }

    private Genre findById(Integer id) {
        return genreRepository.findById(id).orElseThrow(() -> {
            log.warn("Genre with id '{}' not found.", id);
            return new CustomException("Genre not found", NOT_FOUND.value());
        });
    }

    private Genre fromCreateDTO(GenreCreateDTO genreCreateDTO) {
        return GenreMapper.fromCreateDTO(genreCreateDTO);
    }

    private Genre fromUpdateDTO(GenreUpdateDTO genreUpdateDTO, Genre genre) {
        return GenreMapper.fromUpdateDTO(genreUpdateDTO, genre);
    }

    private GenreDTO convertToDTO(Genre genre) {
        return GenreMapper.toDTO(genre);
    }
}
