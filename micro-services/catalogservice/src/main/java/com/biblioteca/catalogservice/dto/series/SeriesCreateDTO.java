package com.biblioteca.catalogservice.dto.series;

import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorCreateDTO;
import com.biblioteca.catalogservice.dto.seriesGenre.SeriesGenreCreateDTO;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SeriesCreateDTO {
    @NotNull(message = "Series name cannot be null")
    private String name;

    private String description;

    private Integer totalBooks;

    private Boolean isCompleted;

    List<SeriesGenreCreateDTO> seriesGenreCreateDTOS;

    List<SeriesAuthorCreateDTO> seriesAuthorCreateDTOS;
}
