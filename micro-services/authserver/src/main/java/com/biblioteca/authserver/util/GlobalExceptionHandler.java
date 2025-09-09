package com.biblioteca.authserver.util;

import com.biblioteca.authserver.dto.ExceptionResponse;
import com.biblioteca.authserver.dto.ResponseDTO;
import com.biblioteca.authserver.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
//    @ExceptionHandler({LoginAttemptBlockedException.class})
//    public ResponseEntity<ExceptionResponse> handleLoginAttemptBlockedException(LoginAttemptBlockedException exception) {
//        return new ResponseEntity<>(new ExceptionResponse(exception.getLocalizedMessage(), HttpStatus.OK.value()), HttpStatus.OK);
//    }


    @ExceptionHandler(value = RuntimeException.class)
    public ResponseEntity<ExceptionResponse> handleRuntimeException(RuntimeException exception) {
        return new ResponseEntity<>(new ExceptionResponse(exception.getLocalizedMessage(), HttpStatus.OK.value()), HttpStatus.OK);
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ResponseDTO<String>> handleCustomException(CustomException exception) {
        log.error("Exception: {}", exception.getLocalizedMessage());
        return new ResponseEntity<>(new ResponseDTO<>(HttpStatus.valueOf(exception.getCode()).getReasonPhrase(), exception.getMessage(), exception.getCode()), HttpStatusCode.valueOf(exception.getCode()));
    }
}
