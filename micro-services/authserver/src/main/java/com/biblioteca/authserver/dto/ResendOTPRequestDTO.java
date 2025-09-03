package com.biblioteca.authserver.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ResendOTPRequestDTO {
    @NotNull(message = "AuthUserId cannot be null")
    private Integer authUserId;
}
