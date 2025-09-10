CREATE TABLE oauth2_registered_client (
                                          id VARCHAR(100) PRIMARY KEY,
                                          client_id VARCHAR(100) NOT NULL,
                                          client_id_issued_at TIMESTAMP,
                                          client_secret VARCHAR(200),
                                          client_secret_expires_at TIMESTAMP,
                                          client_name VARCHAR(200) NOT NULL,
                                          client_authentication_methods VARCHAR(1000),
                                          authorization_grant_types VARCHAR(1000),
                                          redirect_uris VARCHAR(1000),
                                          scopes VARCHAR(1000),
                                          client_settings BYTEA,
                                          token_settings BYTEA
);
