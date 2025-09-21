package com.biblioteca.catalogservice.dto.series;

import com.biblioteca.catalogservice.dto.seriesAuthor.SeriesAuthorDTO;
import com.biblioteca.catalogservice.dto.seriesGenre.SeriesGenreDTO;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SeriesDTO {
    private Integer id;

    private String name;

    private String description;

    private Integer totalBooks;

    private Boolean isCompleted;

    private List<SeriesAuthorDTO> seriesAuthors;

    private List<SeriesGenreDTO> seriesGenres;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
