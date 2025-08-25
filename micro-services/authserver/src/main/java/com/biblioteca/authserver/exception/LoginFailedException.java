package com.biblioteca.authserver.exception;

public class LoginFailedException extends Exception {
    public LoginFailedException(String message) {
        super(message);
    }
}
