package com.biblioteca.userservice.dto.authentication;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class VerifyOTPDTO {
    @NotNull(message = "Invalid UserId")
    private Integer authUserId;

    @NotBlank(message = "Otp cannot be null")
    private String otp;
}
