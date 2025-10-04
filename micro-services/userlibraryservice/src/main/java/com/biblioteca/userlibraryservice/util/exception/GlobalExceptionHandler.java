package com.biblioteca.userlibraryservice.util.exception;

import com.biblioteca.userlibraryservice.dto.response.ResponseDTO;
import jakarta.ws.rs.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDTO<String>> handleException(Exception e) {
        log.error("Exception: {}", e.getLocalizedMessage());
        return new ResponseEntity<>(new ResponseDTO<>("error", "Failed to process your request. Please try again", BAD_REQUEST.value()), BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ResponseDTO<String>> handleRuntimeException(RuntimeException e) {
        log.error("Exception: {}", e.getLocalizedMessage());
        return new ResponseEntity<>(new ResponseDTO<>("error", e.getMessage(), BAD_REQUEST.value()), BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ResponseDTO<String>> handleIllegalArgument(IllegalArgumentException exception) {
        log.error("Exception: {}", exception.getLocalizedMessage());
        return new ResponseEntity<>(new ResponseDTO<>("error", exception.getMessage(), BAD_REQUEST.value()), BAD_REQUEST);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ResponseDTO<String>> handleNotFoundException(NotFoundException exception) {
        log.error("Exception: {}", exception.getLocalizedMessage());
        return new ResponseEntity<>(new ResponseDTO<>("error", exception.getMessage(), BAD_REQUEST.value()), BAD_REQUEST);
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ResponseDTO<String>> handleValidationException(BindException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        List<String> errorMessages = bindingResult.getFieldErrors().stream().map(FieldError::getDefaultMessage).collect(Collectors.toList());
        log.error("Exception: {}", String.join(", ", errorMessages));
        return new ResponseEntity<>(new ResponseDTO<>("error", String.join(", ", errorMessages), BAD_REQUEST.value()), BAD_REQUEST);
    }


    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ResponseDTO<String>> handleCustomException(CustomException exception) {
        log.error("Exception: {}", exception.getLocalizedMessage());

        String data = HttpStatus.valueOf(exception.getCode()).getReasonPhrase();

        ResponseDTO<String> response = new ResponseDTO<>();
        response.setData(data);
        response.setMessage(exception.getMessage());
        response.setCode(exception.getCode());

        return new ResponseEntity<>(response, HttpStatus.valueOf(exception.getCode()));
    }
}
