package com.biblioteca.userservice.util.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DataAlreadyExistsException extends RuntimeException {
    private int code;

    public DataAlreadyExistsException(String message, int code) {
        super(message);
        this.code = code;
    }
}
