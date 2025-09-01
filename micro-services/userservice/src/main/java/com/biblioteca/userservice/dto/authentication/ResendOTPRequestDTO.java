package com.biblioteca.userservice.dto.authentication;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ResendOTPRequestDTO {
    @NotNull(message = "UserId cannot be null")
    private Integer authUserId;
}
