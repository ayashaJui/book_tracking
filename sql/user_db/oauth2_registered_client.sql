CREATE TABLE oauth2_registered_client (
    id varchar(100) NOT NULL,
    client_id varchar(100) NOT NULL,
    client_id_issued_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    client_secret varchar(200) DEFAULT NULL,
    client_secret_expires_at timestamp DEFAULT NULL,
    client_name varchar(200) NOT NULL,
    client_authentication_methods varchar(1000) NOT NULL,
    authorization_grant_types varchar(1000) NOT NULL,
    redirect_uris varchar(1000) DEFAULT NULL,
    post_logout_redirect_uris varchar(1000) DEFAULT NULL,
    scopes varchar(1000) NOT NULL,
    client_settings varchar(2000) NOT NULL,
    token_settings varchar(2000) NOT NULL,
    PRIMARY KEY (id)
);



INSERT INTO oauth2_registered_client (
    id, client_id, client_id_issued_at, client_secret, client_secret_expires_at,
    client_name, client_authentication_methods, authorization_grant_types,
    redirect_uris, post_logout_redirect_uris, scopes, client_settings, token_settings
) VALUES (
    'client-postman-001',
    'postman-client',
    CURRENT_TIMESTAMP,
    '{bcrypt}$2a$10$Dow1DpI4Hq0A1dZ2t9kFhOiF7jGmBQmM8gQWgQWrXmKzvDk4j9B8W', -- secret: "secret123"
    NULL,
    'Postman Client',
    'client_secret_basic',
    'authorization_code,refresh_token,client_credentials',
    'https://oauth.pstmn.io/v1/callback',
    NULL,
    'openid,profile,read,write',
    '{"requireProofKey":false,"requireAuthorizationConsent":true}',
    '{"accessTokenTimeToLive":"PT1H","refreshTokenTimeToLive":"P30D","reuseRefreshTokens":true}'
);
