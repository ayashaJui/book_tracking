package com.biblioteca.userservice.util.exception;

public class TooManyRequestException extends RuntimeException {
    int code;
    long retryAfter;

    public TooManyRequestException(String message, int code, long retryAfter) {
        super(message);
        this.code = code;
        this.retryAfter = retryAfter;
    }
}
