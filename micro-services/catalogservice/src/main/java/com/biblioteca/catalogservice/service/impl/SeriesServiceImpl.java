package com.biblioteca.catalogservice.service.impl;

import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.pagination.PaginationUtil;
import com.biblioteca.catalogservice.dto.series.SeriesCreateDTO;
import com.biblioteca.catalogservice.dto.series.SeriesDTO;
import com.biblioteca.catalogservice.dto.series.SeriesUpdateDTO;
import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorCreateDTO;
import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorDTO;
import com.biblioteca.catalogservice.dto.seriesGenre.SeriesGenreCreateDTO;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@Slf4j
@RequiredArgsConstructor
public class SeriesServiceImpl implements SeriesService {
    private final SeriesRepository seriesRepository;
    private  final SeriesAuthorRepository seriesAuthorRepository;
    private final SeriesGenreRepository seriesGenreRepository;
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

        return null;
    }

    @Override
    public String deleteSeries(Integer id, HttpServletRequest request, Jwt jwt) {
        return "";
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
}
