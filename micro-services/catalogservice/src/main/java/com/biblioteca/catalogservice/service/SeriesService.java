package com.biblioteca.catalogservice.service;

import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.series.SeriesCreateDTO;
import com.biblioteca.catalogservice.dto.series.SeriesDTO;
import com.biblioteca.catalogservice.dto.series.SeriesUpdateDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public interface SeriesService {
    SeriesDTO createSeries(SeriesCreateDTO seriesCreateDTO, HttpServletRequest request, Jwt jwt);

    List<SeriesDTO> getAll(HttpServletRequest request, Jwt jwt);

    SeriesDTO getById(Integer id, HttpServletRequest request, Jwt jwt);

    Page<SeriesDTO> getAllWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt);

    SeriesDTO updateSeries(SeriesUpdateDTO seriesUpdateDTO, HttpServletRequest request, Jwt jwt);

    String deleteSeries(Integer id, HttpServletRequest request, Jwt jwt);
}
