package com.biblioteca.catalogservice.service.impl;

import com.biblioteca.catalogservice.dto.pagination.PageRequestDTO;
import com.biblioteca.catalogservice.dto.pagination.PaginationUtil;
import com.biblioteca.catalogservice.dto.publisher.PublisherCreateDTO;
import com.biblioteca.catalogservice.dto.publisher.PublisherDTO;
import com.biblioteca.catalogservice.dto.publisher.PublisherUpdateDTO;
import com.biblioteca.catalogservice.entity.Publisher;
import com.biblioteca.catalogservice.repository.PublisherRepository;
import com.biblioteca.catalogservice.service.PublisherService;
import com.biblioteca.catalogservice.util.exception.CustomException;
import com.biblioteca.catalogservice.util.mapper.PublisherMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class PublisherServiceImpl implements PublisherService {
    private final PublisherRepository publisherRepository;

    @Override
    @Transactional
    public PublisherDTO createPublisher(PublisherCreateDTO publisherCreateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("createPublisher in PublisherServiceImpl is called with data: {} by user: {}", publisherCreateDTO, jwt.getSubject());

        Optional<Publisher> existingPublisher = publisherRepository.findByName(publisherCreateDTO.getName());
        if(existingPublisher.isPresent()) {
            log.warn("publisher with name {} already exists", publisherCreateDTO.getName());
            throw new CustomException("Publisher with the same name already exists", HttpStatus.CONFLICT.value());
        }

        Publisher publisher = fromCreateDTO(publisherCreateDTO);

        try {
            publisherRepository.save(publisher);
            log.info("Publisher created successfully");
            return convertToDTO(publisher);
        } catch (Exception e) {
            log.error("Error occurred while creating publisher: {}", e.getMessage());
            throw new CustomException("Failed to create publisher", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public List<PublisherDTO> getAllPublisher(HttpServletRequest request, Jwt jwt) {
        log.info("getAllPublisher in PublisherServiceImpl is called by user: {}", jwt.getSubject());

        List<Publisher> publishers = publisherRepository.findAll();

        List<PublisherDTO> publisherDTOS = publishers.stream().map(this::convertToDTO).toList();

        return publisherDTOS;
    }

    @Override
    public Page<PublisherDTO> getAllPubisherWithPagination(PageRequestDTO pageRequestDTO, HttpServletRequest request, Jwt jwt) {
        log.info("getAllPublisherWithPagination in PublisherServiceImpl is called by user: {}", jwt.getSubject());

        Sort sort = Sort.by(Sort.Direction.DESC, "id");

        Pageable pageable = PaginationUtil.getPageableSorted(pageRequestDTO.getPage(), pageRequestDTO.getSize(), sort);

        Page<Publisher> publishers = publisherRepository.findAll(pageable);

        Page<PublisherDTO> publisherDTOS = publishers.map(this::convertToDTO);

        return publisherDTOS;
    }

    @Override
    public PublisherDTO getPublisherById(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("getPublisherById in PublisherServiceImpl is called with id: {} by user: {}",id, jwt.getSubject());

        Publisher publisher = findById(id);

        return convertToDTO(publisher);
    }

    @Override
    @Transactional
    public PublisherDTO updatePublisher(PublisherUpdateDTO publisherUpdateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("updatePublisher in PublisherServiceImpl is called with data: {} by user: {}",publisherUpdateDTO, jwt.getSubject());

        Optional<Publisher> existingPublisher = publisherRepository.findByName(publisherUpdateDTO.getName());
        if(existingPublisher.isPresent() && !existingPublisher.get().getId().equals(publisherUpdateDTO.getId())) {
            log.warn("Publisher with name '{}' already exists. Update aborted.", publisherUpdateDTO.getName());
            throw new CustomException("Publisher with the same name already exists", HttpStatus.CONFLICT.value());
        }

        Publisher publisher = findById(publisherUpdateDTO.getId());

        Publisher updatedPublisher = fromUpdateDTO(publisherUpdateDTO, publisher);
        updatedPublisher.setId(publisherUpdateDTO.getId());
        try {
            publisherRepository.save(updatedPublisher);
            log.info("Publisher updated successfully");
            return convertToDTO(updatedPublisher);
        } catch (Exception e) {
            log.error("Error occurred while updating publisher: {}", e.getMessage());
            throw new CustomException("Failed to update publisher", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public String deletePublisher(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("deletePublisher in PublisherServiceImpl is called with id: {} by user: {}", id, jwt.getSubject());

        Publisher publisher = findById(id);

        try {
            publisherRepository.delete(publisher);
            log.info("Publisher deleted successfully");
            return "Publisher deleted successfully";
        } catch (Exception e) {
            log.error("Error occurred while deleting publisher: {}", e.getMessage());
            throw new CustomException("Failed to delete publisher", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    private Publisher findById(Integer id) {
        return publisherRepository.findById(id).orElseThrow(() -> {
            log.error("Publisher with id '{}' not found", id);
            return new RuntimeException("Publisher not found");
        });
    }

    private Publisher fromCreateDTO(PublisherCreateDTO publisherCreateDTO) {
        return PublisherMapper.fromCreateDTO(publisherCreateDTO);
    }

    private PublisherDTO convertToDTO(Publisher publisher) {
        return PublisherMapper.toDTO(publisher);
    }

    private Publisher fromUpdateDTO(PublisherUpdateDTO publisherUpdateDTO, Publisher publisher) {
        return PublisherMapper.fromUpdateDTO(publisherUpdateDTO, publisher);
    }
}
