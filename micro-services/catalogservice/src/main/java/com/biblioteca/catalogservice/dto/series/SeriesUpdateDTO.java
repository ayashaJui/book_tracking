package com.biblioteca.catalogservice.dto.series;

import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorUpdateDTO;
import com.biblioteca.catalogservice.dto.seriesGenre.SeriesGenreUpdateDTO;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SeriesUpdateDTO {
    @NotNull(message = "Series ID cannot be null")
    private Integer id;

    @NotNull(message = "Series name cannot be null")
    private String name;

    private String description;

    private Integer totalBooks;

    private Boolean isCompleted;

    List<SeriesAuthorUpdateDTO> seriesAuthorsUpdateDTOS;

    List<SeriesGenreUpdateDTO> seriesGenresUpdateDTOS;
}
