package com.biblioteca.authserver.config.token;

import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;

public interface OAuth2TokenSettings {
    TokenSettings getTokenSettings();
}
