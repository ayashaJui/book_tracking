package com.biblioteca.catalogservice.dto.publisher;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class PublisherCreateDTO {
    @NotNull(message = "Publisher name cannot be null")
    private String name;

    private String location;

    private String website;

    private String description;
}
