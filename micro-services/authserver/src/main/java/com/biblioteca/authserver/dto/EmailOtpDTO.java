package com.biblioteca.authserver.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class EmailOtpDTO {
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
