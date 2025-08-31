package com.biblioteca.authserver.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UserRegistrationResponseDTO {
    private Object data;
    private String message;
    private int code;
}
