package com.biblioteca.authserver.providers.custompasswordgrant;

import lombok.Getter;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AuthorizationGrantAuthenticationToken;
import org.springframework.util.StringUtils;

import java.io.Serial;
import java.util.Map;
import java.util.Set;

public class CustomCodeGrantAuthenticationToken extends OAuth2AuthorizationGrantAuthenticationToken {

    @Serial
    private static final long serialVersionUID = 1L;
    @Getter
    private final String username;
    @Getter
    private final String password;
    private final String scope;

    protected CustomCodeGrantAuthenticationToken(
            String granttype,
            Authentication clientPrincipal,
            Map<String, Object> additionalParameters) {
        super(new AuthorizationGrantType(granttype), clientPrincipal, additionalParameters);
        this.username = (String) additionalParameters.get(OAuth2ParameterNames.USERNAME);
        this.password = (String) additionalParameters.get(OAuth2ParameterNames.PASSWORD);
        this.scope = (String) additionalParameters.get(OAuth2ParameterNames.SCOPE);
        if (this.scope == null) {
            throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_SCOPE);
        }
    }

    public Set<String> getScope() {
        return StringUtils.commaDelimitedListToSet(scope.replace(" ", ""));
    }

}
