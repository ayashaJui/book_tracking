package com.biblioteca.authserver.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ResponseDTO<T> {
    private T data;
    private String message;
    private int code;
}
