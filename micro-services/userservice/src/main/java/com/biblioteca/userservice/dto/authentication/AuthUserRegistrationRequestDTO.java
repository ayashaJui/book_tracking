package com.biblioteca.userservice.dto.authentication;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AuthUserRegistrationRequestDTO {
    @NotBlank(message = "email can not be null")
    @Email(message = "Invalid email format")
    private String emailAddress;

    @NotBlank(message = "password can not be null")
    @Size(min = 6, message = "Minimum password length is 6")
    private String passwordHash;

    @NotBlank(message = "confirm password can not be null")
    @Size(min = 6, message = "Minimum password length is 6")
    private String confirmPassword;
}
