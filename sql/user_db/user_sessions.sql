CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    auth_user_id INT REFERENCES auth_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
