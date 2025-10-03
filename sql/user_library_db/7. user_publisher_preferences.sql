-- User preferences for catalog publishers
CREATE TABLE user_publisher_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- References user_service.users.id
    catalog_publisher_id BIGINT NOT NULL, -- References catalog_service.publishers.id
    preference_level INTEGER DEFAULT 3 CHECK (preference_level >= 1 AND preference_level <= 5),
    is_favorite BOOLEAN DEFAULT false,
    personal_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, catalog_publisher_id)
);

-- Indexes
CREATE INDEX idx_user_publisher_preferences_user ON user_publisher_preferences(user_id);
CREATE INDEX idx_user_publisher_preferences_catalog ON user_publisher_preferences(catalog_publisher_id);

-- Comments
COMMENT ON COLUMN user_publisher_preferences.catalog_publisher_id IS 'References catalog_service.publishers.id';
