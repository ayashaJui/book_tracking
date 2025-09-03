package com.biblioteca.authserver.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class OTPVerifyRequestDTO {
    @NotNull
    private Integer authUserId;

    @NotNull
    private String otp;
}
