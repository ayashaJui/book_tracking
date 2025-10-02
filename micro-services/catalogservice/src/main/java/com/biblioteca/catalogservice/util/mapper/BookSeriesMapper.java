package com.biblioteca.catalogservice.util.mapper;

import com.biblioteca.catalogservice.dto.bookSeries.BookSeriesCreateDTO;
import com.biblioteca.catalogservice.dto.bookSeries.BookSeriesDTO;
import com.biblioteca.catalogservice.dto.bookSeries.BookSeriesUpdateDTO;
import com.biblioteca.catalogservice.entity.BookSeries;

public class BookSeriesMapper {
    public static BookSeriesDTO toDTO(BookSeries bookSeries) {
        return BookSeriesDTO.builder()
                .id(bookSeries.getId())
//                .bookId(bookSeries.getBook().getId())
                .seriesName(bookSeries.getSeries().getName())
                .seriesId(bookSeries.getSeries().getId())
                .position(bookSeries.getPosition())
                .build();
    }

    public static BookSeries fromCreateDTO(BookSeriesCreateDTO bookSeriesCreateDTO) {
        return BookSeries.builder()
                .position(bookSeriesCreateDTO.getPosition())
                .build();
    }

    public  static BookSeries fromUpdateDTO(BookSeriesUpdateDTO bookSeriesUpdateDTO, BookSeries bookSeries) {

        bookSeries.setPosition(bookSeriesUpdateDTO.getPosition() != null ? bookSeriesUpdateDTO.getPosition() : bookSeries.getPosition());

        return bookSeries;

    }
}
