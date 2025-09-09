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



INSERT INTO oauth2_registered_client (id, client_id, client_secret, client_name, client_authentication_methods, 
    authorization_grant_types, redirect_uris, scopes, client_settings, token_settings) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440000', -- UUID for the client
    'biblioteca-web', -- client_id
    '{bcrypt}$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', -- encoded 'secret'
    'Bibliotheca Web Application',
    'none', -- client authentication methods
    'authorization_code,refresh_token', -- authorization grant types
    'http://localhost:4200', -- redirect URIs
    'openid,profile,email', -- scopes
    '{"@class":"java.util.Collections$UnmodifiableMap","settings.client.require-proof-key":true,"settings.client.require-authorization-consent":true}', -- client settings
    '{"@class":"java.util.Collections$UnmodifiableMap","settings.token.access-token-time-to-live":["java.time.Duration",1800.000000000],"settings.token.refresh-token-time-to-live":["java.time.Duration",86400.000000000]}' -- token settings
);
