package com.biblioteca.authserver.service;

import com.biblioteca.authserver.config.token.OAuth2TokenSettings;
import com.biblioteca.authserver.dto.RegisteredClientCreateDTO;
import com.biblioteca.authserver.dto.RegisteredClientResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
public class RegisteredClientService {
    private final RegisteredClientRepository registeredClientRepository;
    private final OAuth2TokenSettings oAuth2TokenSettings;
    private final PasswordEncoder passwordEncoder;

    public RegisteredClientResponseDTO registerClient(RegisteredClientCreateDTO clientCreateDTO) {
        RegisteredClient registeredClient = fromCreateDTO(clientCreateDTO);
        try{
            registeredClientRepository.save(registeredClient);
            return convertToResponse(registeredClient);
        }catch (Exception e){
            throw new RuntimeException("Can't save data");
        }
    }

    private RegisteredClientResponseDTO convertToResponse(RegisteredClient registeredClient) {
        return RegisteredClientResponseDTO.builder()
                .id(registeredClient.getId())
                .clientId(registeredClient.getClientId())
                .clientName(registeredClient.getClientName())
                .clientSecret(registeredClient.getClientSecret())
                .build();
    }

    private RegisteredClient fromCreateDTO(RegisteredClientCreateDTO clientCreateDTO){
        return RegisteredClient.withId(UUID.randomUUID().toString())
                .clientId(clientCreateDTO.getClientId())
                .clientSecret(passwordEncoder.encode(clientCreateDTO.getClientSecret()))//db
                .clientName(clientCreateDTO.getClientName())
                .clientAuthenticationMethod(clientCreateDTO.isPublicClient() ? ClientAuthenticationMethod.NONE : ClientAuthenticationMethod.CLIENT_SECRET_POST)
                .authorizationGrantTypes(authorizationGrantTypesConsumer(clientCreateDTO))
                .redirectUris(redirectURIConsumer(clientCreateDTO))
                .postLogoutRedirectUris(postLogoutRedirectURIConsumer(clientCreateDTO))
                .scopes(scopeConsumer(clientCreateDTO))
                .clientSettings(getClientSettings(clientCreateDTO))
                .tokenSettings(oAuth2TokenSettings.getTokenSettings())
                .build();
    }

    private Consumer<Set<AuthorizationGrantType>> authorizationGrantTypesConsumer(RegisteredClientCreateDTO createDTO) {
        return authorizationGrantTypes -> {
            authorizationGrantTypes.clear();

            if (createDTO.isPublicClient()) {
                authorizationGrantTypes.add(AuthorizationGrantType.AUTHORIZATION_CODE);
                authorizationGrantTypes.add(AuthorizationGrantType.REFRESH_TOKEN);
            } else {
                authorizationGrantTypes.add(AuthorizationGrantType.CLIENT_CREDENTIALS);
                authorizationGrantTypes.add(new AuthorizationGrantType(createDTO.getCustomGrantType()));
            }
        };
    }

    private Consumer<Set<String>> redirectURIConsumer(RegisteredClientCreateDTO createDTO) {
        return redirectUris -> {
            redirectUris.clear();
            redirectUris.addAll(createDTO.getRedirectUris());
        };
    }

    private Consumer<Set<String>> postLogoutRedirectURIConsumer(RegisteredClientCreateDTO createDTO) {
        return redirectUris -> {
            redirectUris.clear();
            redirectUris.addAll(createDTO.getRedirectUris());
        };
    }

    private Consumer<Set<String>> scopeConsumer(RegisteredClientCreateDTO createDTO) {
        return scopes -> {
            scopes.clear();
            if (createDTO.getScopes() == null) {
                scopes.add(OidcScopes.OPENID);
                scopes.add(OidcScopes.PROFILE);
                scopes.add(OidcScopes.EMAIL);
            } else scopes.addAll(createDTO.getScopes());
        };
    }

    private ClientSettings getClientSettings(RegisteredClientCreateDTO createDTO) {
        return ClientSettings.builder()
                .requireProofKey(createDTO.isPublicClient())
                .build();
    }
}
