package com.biblioteca.catalogservice.dto.publisher;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class PublisherDTO {
    private Integer id;

    private String name;

    private String location;

    private String website;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
