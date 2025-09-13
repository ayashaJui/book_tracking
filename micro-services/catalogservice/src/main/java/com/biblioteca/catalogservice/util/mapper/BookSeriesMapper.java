package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.bookSeries.BookSeriesCreateDTO;
import com.biblioteca.catalogservice.dto.bookSeries.BookSeriesDTO;
import com.biblioteca.catalogservice.dto.bookSeries.BookSeriesUpdateDTO;
import com.biblioteca.catalogservice.entity.BookSeries;

public class BookSeriesMapper {
    public static BookSeriesDTO toDTO(BookSeries bookSeries) {
        return BookSeriesDTO.builder()
                .bookId(bookSeries.getBook().getId())
                .seriesId(bookSeries.getSeries().getId())
                .position(bookSeries.getPosition())
                .build();
    }

    public static BookSeries fromCreateDTO(BookSeriesCreateDTO bookSeriesCreateDTO) {
        return BookSeries.builder()
                .id(BookSeries.BookSeriesId.builder()
                        .bookId(bookSeriesCreateDTO.getBookId())
                        .seriesId(bookSeriesCreateDTO.getSeriesId())
                        .build())
                .position(bookSeriesCreateDTO.getPosition())
                .build();
    }

    public  static BookSeries fromUpdateDTO(BookSeriesUpdateDTO bookSeriesUpdateDTO, BookSeries bookSeries) {

        bookSeries.setId(BookSeries.BookSeriesId.builder()
                        .bookId(bookSeriesUpdateDTO.getBookId())
                        .seriesId(bookSeriesUpdateDTO.getSeriesId())
                .build());
        bookSeries.setPosition(bookSeriesUpdateDTO.getPosition() != null ? bookSeriesUpdateDTO.getPosition() : bookSeries.getPosition());

        return bookSeries;

    }
}
