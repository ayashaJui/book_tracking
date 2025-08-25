package com.biblioteca.authserver.exception;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LoginAttemptBlockedException extends Exception {
    public LoginAttemptBlockedException(String message) {
        super(message);
        log.error(getLocalizedMessage());
    }
}
