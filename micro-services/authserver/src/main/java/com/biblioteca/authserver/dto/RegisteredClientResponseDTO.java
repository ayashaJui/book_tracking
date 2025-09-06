package com.biblioteca.authserver.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RegisteredClientResponseDTO {
    private String id;
    private String clientId;
    private String clientSecret;
    private String clientName;
}
