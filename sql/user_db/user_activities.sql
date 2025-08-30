CREATE TABLE user_activities (
    id SERIAL PRIMARY KEY,
    auth_user_id INT REFERENCES auth_users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    activity_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
