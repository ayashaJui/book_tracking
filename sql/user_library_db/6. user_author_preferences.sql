-- User preferences for catalog authors
CREATE TABLE user_author_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- References user_service.users.id
    catalog_author_id BIGINT NOT NULL, -- References catalog_service.authors.id
    preference_level INTEGER DEFAULT 3 CHECK (preference_level >= 1 AND preference_level <= 5),
    is_favorite BOOLEAN DEFAULT false,
    is_excluded BOOLEAN DEFAULT false,
    personal_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, catalog_author_id)
);

-- Indexes
CREATE INDEX idx_user_author_preferences_user ON user_author_preferences(user_id);
CREATE INDEX idx_user_author_preferences_catalog ON user_author_preferences(catalog_author_id);
CREATE INDEX idx_user_author_preferences_favorite ON user_author_preferences(user_id, is_favorite) WHERE is_favorite = true;

-- Comments
COMMENT ON COLUMN user_author_preferences.catalog_author_id IS 'References catalog_service.authors.id';
