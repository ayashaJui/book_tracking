CREATE TABLE auth_users (
    id SERIAL PRIMARY KEY,
    email_address VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    account_non_expired BOOLEAN NOT NULL DEFAULT true,
    account_non_locked BOOLEAN NOT NULL DEFAULT true,
    credentials_non_expired BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    blocked_at TIMESTAMP,
    blocked_to TIMESTAMP,
    login_attempt INTEGER NOT NULL DEFAULT 0,
    otp_retry_count INTEGER,
    otp_date TIMESTAMP,
    email_verified BOOLEAN,
    reset_password_token VARCHAR(255),
    token_valid_upto TIMESTAMP
);

CREATE TABLE user_authorities (
    id INTEGER REFERENCES auth_users(id) ON DELETE CASCADE,
    authority VARCHAR(100) NOT NULL,
    PRIMARY KEY (id, authority)
);