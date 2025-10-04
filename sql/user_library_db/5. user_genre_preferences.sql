-- User preferences for catalog genres
CREATE TABLE user_genre_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    catalog_genre_id BIGINT NOT NULL, -- References catalog_service.genres.id
    preference_level INTEGER DEFAULT 3 CHECK (preference_level >= 1 AND preference_level <= 5),
    is_excluded BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, catalog_genre_id)
);

-- Indexes
CREATE INDEX idx_user_genre_preferences_user ON user_genre_preferences(user_id);
CREATE INDEX idx_user_genre_preferences_catalog ON user_genre_preferences(catalog_genre_id);
CREATE INDEX idx_user_genre_preferences_level ON user_genre_preferences(user_id, preference_level);

-- Comments
COMMENT ON COLUMN user_genre_preferences.catalog_genre_id IS 'References catalog_service.genres.id';
