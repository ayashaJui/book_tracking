CREATE TABLE user_profile_settings (
    id SERIAL PRIMARY KEY,
    auth_user_id INT REFERENCES auth_users(id) ON DELETE CASCADE,
    profile_visibility VARCHAR(20) DEFAULT 'private', -- public, friends, private
    show_reading_progress BOOLEAN DEFAULT true,
    show_reading_goals BOOLEAN DEFAULT true,
    show_currently_reading BOOLEAN DEFAULT true,
    show_reviews BOOLEAN DEFAULT true,
    show_quotes BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
