package com.biblioteca.catalogservice.service.impl;

import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.pagination.PaginationUtil;
import com.biblioteca.catalogservice.dto.series.SeriesCreateDTO;
import com.biblioteca.catalogservice.dto.series.SeriesDTO;
import com.biblioteca.catalogservice.dto.series.SeriesUpdateDTO;
import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorCreateDTO;
import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorUpdateDTO;
import com.biblioteca.catalogservice.dto.seriesGenre.SeriesGenreCreateDTO;
import com.biblioteca.catalogservice.dto.seriesGenre.SeriesGenreUpdateDTO;
import com.biblioteca.catalogservice.entity.*;
import com.biblioteca.catalogservice.repository.*;
import com.biblioteca.catalogservice.service.SeriesService;
import com.biblioteca.catalogservice.util.exception.CustomException;
import com.biblioteca.catalogservice.util.mapper.SeriesAuthorMapper;
import com.biblioteca.catalogservice.util.mapper.SeriesMapper;
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
@Slf4j
@RequiredArgsConstructor
public class SeriesServiceImpl implements SeriesService {
    private final SeriesRepository seriesRepository;
    private final AuthorRepository authorRepository;
    private final GenreRepository genreRepository;

    @Override
    @Transactional
    public SeriesDTO createSeries(SeriesCreateDTO seriesCreateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("createSeries in SeriesServiceImpl is called with data: {} by user: {}", seriesCreateDTO, jwt.getSubject());

        Optional<Series> existingSeries = seriesRepository.findByName(seriesCreateDTO.getName());
        if (existingSeries.isPresent()) {
            log.error("Series with name '{}' already exists", seriesCreateDTO.getName());
            throw new CustomException("Series with the same name already exists", HttpStatus.CONFLICT.value());
        }

        Series series = fromCreateDTO(seriesCreateDTO);

        if(seriesCreateDTO.getSeriesAuthorCreateDTOS() != null && !seriesCreateDTO.getSeriesAuthorCreateDTOS().isEmpty()){
            List<Integer> seriesAuthorIds = seriesCreateDTO.getSeriesAuthorCreateDTOS().stream().map(SeriesAuthorCreateDTO::getAuthorId).toList();

            List<Author> authors = authorRepository.findAllById(seriesAuthorIds);

            for(SeriesAuthorCreateDTO seriesAuthorCreateDTO : seriesCreateDTO.getSeriesAuthorCreateDTOS()){
                Author author = authors.stream()
                        .filter(a -> a.getId().equals(seriesAuthorCreateDTO.getAuthorId()))
                        .findFirst()
                        .orElseThrow(() -> new CustomException("Author with id " + seriesAuthorCreateDTO.getAuthorId() + " not found", HttpStatus.NOT_FOUND.value()));

                SeriesAuthor seriesAuthor = fromSeriesAuthorCreateDTO(seriesAuthorCreateDTO);
                seriesAuthor.setAuthor(author);
                seriesAuthor.setSeries(series);

                series.getSeriesAuthors().add(seriesAuthor);
            }

        }

        if(seriesCreateDTO.getSeriesGenreCreateDTOS() != null && !seriesCreateDTO.getSeriesGenreCreateDTOS().isEmpty()){
            List<Integer> genreIds = seriesCreateDTO.getSeriesGenreCreateDTOS().stream().map(SeriesGenreCreateDTO::getGenreId).toList();
            List<Genre> genres = genreRepository.findAllById(genreIds);

            for(SeriesGenreCreateDTO seriesGenreCreateDTO : seriesCreateDTO.getSeriesGenreCreateDTOS()){
                Genre genre = genres.stream()
                        .filter(g -> g.getId().equals(seriesGenreCreateDTO.getGenreId()))
                        .findFirst()
                        .orElseThrow(() -> new CustomException("Genre with id " + seriesGenreCreateDTO.getGenreId() + " not found", HttpStatus.NOT_FOUND.value()));

                SeriesGenre seriesGenre = new SeriesGenre();
                seriesGenre.setGenre(genre);
                seriesGenre.setSeries(series);

                series.getSeriesGenres().add(seriesGenre);
            }
        }

        try{
            seriesRepository.save(series);

            log.info("Series created successfully ");

            return convertToDTO(series);
        }catch (Exception e){
            log.error("Error occurred while creating series: {}", e.getMessage());
            throw new CustomException("Failed to create series", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public List<SeriesDTO> getAll(HttpServletRequest request, Jwt jwt) {
        log.info("getAll in SeriesController is called by user: {}", jwt.getSubject());

        List<Series> seriesList = seriesRepository.findAll();

        List<SeriesDTO> seriesDTOList = seriesList.stream().map(this::convertToDTO).toList();

        return seriesDTOList;
    }

    @Override
    public SeriesDTO getById(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("getById in SeriesController is called with id:{} by user: {}", id, jwt.getSubject());

        Series series = findById(id);

        return convertToDTO(series);
    }

    @Override
    public Page<SeriesDTO> getAllWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt) {
        log.info("getAllWithPagination in SeriesController is called by user: {}", jwt.getSubject());

        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PaginationUtil.getPageableSorted(pageRequestDTO.getPage(), pageRequestDTO.getSize(), sort);

        Page<Series> seriesPage = seriesRepository.findAll(pageable);
        Page<SeriesDTO> seriesDTOPage = seriesPage.map(this::convertToDTO);

        return seriesDTOPage;
    }

    @Override
    @Transactional
    public SeriesDTO updateSeries(SeriesUpdateDTO seriesUpdateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("updateSeries in SeriesController is called with data: {} by user: {}", seriesUpdateDTO, jwt.getSubject());

        Series series = findById(seriesUpdateDTO.getId());

        Optional<Series> seriesWithSameName = seriesRepository.findByName(seriesUpdateDTO.getName());
        if(seriesWithSameName.isPresent() && !seriesWithSameName.get().getId().equals(seriesUpdateDTO.getId())){
            log.error("Series with name '{}' already exists", seriesUpdateDTO.getName());
            throw new CustomException("Series with the same name already exists", HttpStatus.CONFLICT.value());
        }

        Series updatedSeries = fromUpdateDTO(seriesUpdateDTO, series);

        // Handle Series Authors Update - Complete Replacement Strategy
        updateSeriesAuthors(series, seriesUpdateDTO.getSeriesAuthorsUpdateDTOS());
        
        // Handle Series Genres Update - Complete Replacement Strategy  
        updateSeriesGenres(series, seriesUpdateDTO.getSeriesGenresUpdateDTOS());

        try {
            seriesRepository.save(updatedSeries);
            log.info("Series updated successfully with id: {}", updatedSeries.getId());
            return convertToDTO(updatedSeries);
        } catch (Exception e) {
            log.error("Error occurred while updating series: {}", e.getMessage());
            throw new CustomException("Failed to update series", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    @Transactional
    public String deleteSeries(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("deleteSeries in SeriesController is called with id: {} by user: {}", id, jwt.getSubject());

        Series series = findById(id);

        int authorCount = series.getSeriesAuthors().size();
        int genreCount = series.getSeriesGenres().size();

        try {
            seriesRepository.delete(series);
            
            log.info("Successfully deleted series with id: {} and its {} SeriesAuthor and {} SeriesGenre relationships", id, authorCount, genreCount);
            
            return "Series with id " + id + " has been successfully deleted along with its relationships";
            
        } catch (Exception e) {
            log.error("Error occurred while deleting series with id: {}: {}", id, e.getMessage());
            throw new CustomException("Failed to delete series: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    private Series findById(Integer id) {
        return seriesRepository.findById(id)
                .orElseThrow(() -> new CustomException("Series with id " + id + " not found", HttpStatus.NOT_FOUND.value()));
    }

    private Series fromCreateDTO(SeriesCreateDTO seriesCreateDTO) {
        return SeriesMapper.fromCreateDTO(seriesCreateDTO);
    }

    private SeriesDTO convertToDTO(Series series) {
        return SeriesMapper.toDTO(series);
    }

    private Series fromUpdateDTO(SeriesUpdateDTO seriesUpdateDTO,  Series series) {
        return SeriesMapper.fromUpdateDTO(seriesUpdateDTO, series);
    }

    private SeriesAuthor fromSeriesAuthorCreateDTO(SeriesAuthorCreateDTO seriesAuthorCreateDTO) {
        return SeriesAuthorMapper.fromCreateDTO(seriesAuthorCreateDTO);
    }

    /**
     * Updates series authors using Natural Key strategy to preserve existing IDs
     * Uses composite key (series_id + author_id) to identify existing relationships
     * This prevents unnecessary ID increments while handling all scenarios:
     * 1. Existing relationship (same author): Update role only
     * 2. New relationship: Create new SeriesAuthor  
     * 3. Missing relationship: Remove existing SeriesAuthor
     */
    private void updateSeriesAuthors(Series series, List<SeriesAuthorUpdateDTO> authorsUpdateDTOS) {
        log.info("Updating series authors for series id: {} using natural key strategy", series.getId());
        
        if (authorsUpdateDTOS == null || authorsUpdateDTOS.isEmpty()) {
            // Remove all existing authors
            series.getSeriesAuthors().clear();
            log.info("No authors provided, all existing authors removed from series");
            return;
        }
        
        // Validate all author IDs exist before proceeding
        List<Integer> incomingAuthorIds = authorsUpdateDTOS.stream()
                .map(SeriesAuthorUpdateDTO::getAuthorId)
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
        
        // Get current SeriesAuthor entities
        List<SeriesAuthor> currentAuthors = series.getSeriesAuthors();
        
        // Create maps for efficient lookup
        Map<Integer, SeriesAuthor> currentAuthorMap = currentAuthors.stream()
                .collect(Collectors.toMap(sa -> sa.getAuthor().getId(), sa -> sa));
        
        Map<Integer, Author> authorMap = existingAuthors.stream()
                .collect(Collectors.toMap(Author::getId, author -> author));
        
        // Track which authors should remain
        Set<Integer> authorsToKeep = new HashSet<>(incomingAuthorIds);
        
        // Remove SeriesAuthors for authors not in the incoming list
        currentAuthors.removeIf(sa -> !authorsToKeep.contains(sa.getAuthor().getId()));
        
        // Process incoming authors
        for (SeriesAuthorUpdateDTO authorDTO : authorsUpdateDTOS) {
            Integer authorId = authorDTO.getAuthorId();
            
            if (currentAuthorMap.containsKey(authorId)) {
                // Update existing relationship - only role can change, preserves ID
                SeriesAuthor existing = currentAuthorMap.get(authorId);
                existing.setRole(authorDTO.getAuthorRole() != null ? 
                        authorDTO.getAuthorRole().name() : null);
                log.debug("Updated role for existing SeriesAuthor ID: {}, Author ID: {}", 
                        existing.getId(), authorId);
            } else {
                // Create new relationship
                Author author = authorMap.get(authorId);
                SeriesAuthor newSeriesAuthor = SeriesAuthor.builder()
                        .series(series)
                        .author(author)
                        .role(authorDTO.getAuthorRole() != null ? 
                                authorDTO.getAuthorRole().name() : null)
                        .build();
                        
                currentAuthors.add(newSeriesAuthor);
                log.debug("Created new SeriesAuthor for Author ID: {}", authorId);
            }
        }
        
        log.info("Successfully updated series authors, final count: {}", currentAuthors.size());
    }

    /**
     * Updates series genres using Natural Key strategy to preserve existing IDs
     * Uses composite key (series_id + genre_id) to identify existing relationships
     * This prevents unnecessary ID increments while handling all scenarios:
     * 1. Existing relationship (same genre): Keep existing SeriesGenre
     * 2. New relationship: Create new SeriesGenre
     * 3. Missing relationship: Remove existing SeriesGenre  
     */
    private void updateSeriesGenres(Series series, List<SeriesGenreUpdateDTO> genresUpdateDTOS) {
        log.info("Updating series genres for series id: {} using natural key strategy", series.getId());
        
        if (genresUpdateDTOS == null || genresUpdateDTOS.isEmpty()) {
            // Remove all existing genres
            series.getSeriesGenres().clear();
            log.info("No genres provided, all existing genres removed from series");
            return;
        }
        
        // Validate all genre IDs exist before proceeding
        List<Integer> incomingGenreIds = genresUpdateDTOS.stream()
                .map(SeriesGenreUpdateDTO::getGenreId)
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
        
        // Get current SeriesGenre entities
        List<SeriesGenre> currentGenres = series.getSeriesGenres();
        
        // Create maps for efficient lookup
        Map<Integer, SeriesGenre> currentGenreMap = currentGenres.stream()
                .collect(Collectors.toMap(sg -> sg.getGenre().getId(), sg -> sg));
        
        Map<Integer, Genre> genreMap = existingGenres.stream()
                .collect(Collectors.toMap(Genre::getId, genre -> genre));
        
        // Track which genres should remain
        Set<Integer> genresToKeep = new HashSet<>(incomingGenreIds);
        
        // Remove SeriesGenres for genres not in the incoming list
        currentGenres.removeIf(sg -> !genresToKeep.contains(sg.getGenre().getId()));
        
        // Process incoming genres
        for (SeriesGenreUpdateDTO genreDTO : genresUpdateDTOS) {
            Integer genreId = genreDTO.getGenreId();
            
            if (currentGenreMap.containsKey(genreId)) {
                // Relationship already exists - keep existing SeriesGenre (preserves ID)
                log.debug("Keeping existing SeriesGenre ID: {}, Genre ID: {}", 
                        currentGenreMap.get(genreId).getId(), genreId);
            } else {
                // Create new relationship
                Genre genre = genreMap.get(genreId);
                SeriesGenre newSeriesGenre = SeriesGenre.builder()
                        .series(series)
                        .genre(genre)
                        .build();
                        
                currentGenres.add(newSeriesGenre);
                log.debug("Created new SeriesGenre for Genre ID: {}", genreId);
            }
        }
        
        log.info("Successfully updated series genres, final count: {}", currentGenres.size());
    }
}
