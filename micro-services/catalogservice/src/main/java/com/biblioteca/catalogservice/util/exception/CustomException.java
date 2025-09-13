package com.biblioteca.catalogservice.util.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomException extends RuntimeException {
    int code;

    public CustomException(String message, int code) {
        super(message);
        this.code = code;
    }
}
