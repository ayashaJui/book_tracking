package com.biblioteca.authserver.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class VerifyEmailOTPDTO {
    @NotNull
    private int authUserId;

    @NotNull
    private String emailAddress;

    @NotNull
    private String otp;

    @NotNull
    private String resendOtpRemainingTime;

    @NotNull
    private int otpRetryCount;
}
