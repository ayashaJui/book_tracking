package com.biblioteca.catalogservice.service;

import com.biblioteca.catalogservice.dto.author.AuthorDTO;
import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.publisher.PublisherCreateDTO;
import com.biblioteca.catalogservice.dto.publisher.PublisherDTO;
import com.biblioteca.catalogservice.dto.publisher.PublisherUpdateDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public interface PublisherService {
    PublisherDTO createPublisher(PublisherCreateDTO publisherCreateDTO, HttpServletRequest request, Jwt jwt);

    List<PublisherDTO> getAllPublisher(HttpServletRequest request, Jwt jwt);

    Page<PublisherDTO> getAllPubisherWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt);

    PublisherDTO getPublisherById(Integer id, HttpServletRequest request, Jwt jwt);

    PublisherDTO updatePublisher(PublisherUpdateDTO publisherUpdateDTO, HttpServletRequest request, Jwt jwt);

    String deletePublisher(Integer id, HttpServletRequest request, Jwt jwt);

    List<PublisherDTO> searchPublisher(String publisherName, HttpServletRequest request, Jwt jwt);

}
