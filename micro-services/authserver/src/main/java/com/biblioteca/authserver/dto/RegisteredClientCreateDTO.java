package com.biblioteca.authserver.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Set;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RegisteredClientCreateDTO {
    @NotNull
    private String clientId;
    @NotNull
    private String clientSecret;

    private String clientName;

    private Set<String> redirectUris;

    private Set<String> postLogoutRedirectUris;

    private Set<String> scopes;

    private String customGrantType;

    @NotNull
    private boolean publicClient;
}
