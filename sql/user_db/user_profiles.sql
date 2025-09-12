
CREATE TABLE user_profiles (
    id int PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id INTEGER NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    location VARCHAR(250),
    profile_image_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_auth_user
        FOREIGN KEY(auth_user_id)
        REFERENCES auth_users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);