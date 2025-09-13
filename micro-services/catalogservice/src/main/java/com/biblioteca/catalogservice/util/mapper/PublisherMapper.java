package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.publisher.PublisherCreateDTO;
import com.biblioteca.catalogservice.dto.publisher.PublisherDTO;
import com.biblioteca.catalogservice.dto.publisher.PublisherUpdateDTO;
import com.biblioteca.catalogservice.entity.Publisher;

import java.time.LocalDateTime;

public class PublisherMapper {
    public static PublisherDTO toDTO(Publisher publisher) {
        return PublisherDTO.builder()
                .id(publisher.getId())
                .name(publisher.getName())
                .location(publisher.getLocation())
                .website(publisher.getWebsite())
                .createdAt(publisher.getCreatedAt())
                .updatedAt(publisher.getUpdatedAt())
                .build();
    }

    public static Publisher fromCreateDTO(PublisherCreateDTO publisherCreateDTO) {
        return Publisher.builder()
                .name(publisherCreateDTO.getName())
                .location(publisherCreateDTO.getLocation())
                .website(publisherCreateDTO.getWebsite())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public  static Publisher fromUpdateDTO(PublisherUpdateDTO publisherUpdateDTO, Publisher publisher) {
        publisher.setName(publisherUpdateDTO.getName());
        publisher.setLocation(publisherUpdateDTO.getLocation());
        publisher.setWebsite(publisherUpdateDTO.getWebsite());
        publisher.setUpdatedAt(LocalDateTime.now());

        return publisher;
    }
}
