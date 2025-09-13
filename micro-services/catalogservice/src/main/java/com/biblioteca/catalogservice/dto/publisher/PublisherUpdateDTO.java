package com.biblioteca.catalogservice.dto.publisher;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PublisherUpdateDTO {
    @NotNull(message = "Publisher ID cannot be null")
    private Integer id;

    @NotNull(message = "Publisher name cannot be null")
    private String name;

    private String location;

    private String website;
}
