package com.biblioteca.authserver.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserRegistrationDTO {
    @NotNull(message = "Email address cannot be null")
    private String emailAddress;
    @NotNull(message = "Password cannot be null")
    private String passwordHash;
    @NotBlank(message = "Confirm password cannot be blank")
    private String confirmPassword;
}
