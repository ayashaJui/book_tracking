package com.biblioteca.userlibraryservice.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ResponseDTO<T> {
    private T data;
    private String message;
    private int code;
}
