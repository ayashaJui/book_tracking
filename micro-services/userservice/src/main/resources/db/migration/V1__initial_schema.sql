CREATE TABLE IF NOT EXISTS auth_users (
    id SERIAL PRIMARY KEY,
    email_address VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    account_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
    credentials_non_expired BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    blocked_at TIMESTAMP WITHOUT TIME ZONE,
    blocked_to TIMESTAMP WITHOUT TIME ZONE,
    login_attempt INTEGER NOT NULL DEFAULT 0,
    otp_retry_count INTEGER DEFAULT 0,
    otp_date TIMESTAMP WITHOUT TIME ZONE,
    email_verified BOOLEAN DEFAULT FALSE,
    reset_password_token VARCHAR(255),
    token_valid_upto TIMESTAMP WITHOUT TIME ZONE,
    otp VARCHAR(100)
);


CREATE TABLE IF NOT EXISTS user_authorities (
    id INTEGER NOT NULL,
    authority VARCHAR(100) NOT NULL,
    PRIMARY KEY (id, authority),
    CONSTRAINT fk_user_authorities_auth_users FOREIGN KEY (id)
    REFERENCES auth_users (id)
    ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS oauth2_registered_client (
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


CREATE TABLE IF NOT EXISTS oauth2_authorization (
    id varchar(100) PRIMARY KEY,
    registered_client_id varchar(100) NOT NULL,
    principal_name varchar(200) NOT NULL,
    authorization_grant_type varchar(100) NOT NULL,
    authorized_scopes varchar(1000),

    attributes text,
    state varchar(500),

    authorization_code_value text,
    authorization_code_issued_at timestamp,
    authorization_code_expires_at timestamp,
    authorization_code_metadata text,

    access_token_value text,
    access_token_issued_at timestamp,
    access_token_expires_at timestamp,
    access_token_metadata text,
    access_token_type varchar(100),
    access_token_scopes varchar(1000),

    oidc_id_token_value text,
    oidc_id_token_issued_at timestamp,
    oidc_id_token_expires_at timestamp,
    oidc_id_token_metadata text,

    refresh_token_value text,
    refresh_token_issued_at timestamp,
    refresh_token_expires_at timestamp,
    refresh_token_metadata text,

    user_code_value text,
    user_code_issued_at timestamp,
    user_code_expires_at timestamp,
    user_code_metadata text,

    device_code_value text,
    device_code_issued_at timestamp,
    device_code_expires_at timestamp,
    device_code_metadata text
);


CREATE TABLE IF NOT EXISTS oauth2_authorization_consent (
    registered_client_id varchar(100) NOT NULL,
    principal_name varchar(200) NOT NULL,
    authorities varchar(1000) NOT NULL,
    PRIMARY KEY (registered_client_id, principal_name)
    );