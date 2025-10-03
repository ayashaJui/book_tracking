-- User-defined collections (custom reading lists)
CREATE TABLE reading_collections (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    is_default BOOLEAN DEFAULT false, -- e.g. "Currently Reading"
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);

-- Indexes
CREATE INDEX idx_reading_collections_user ON reading_collections(user_id);
CREATE INDEX idx_reading_collections_public ON reading_collections(is_public) WHERE is_public = true;
CREATE INDEX idx_reading_collections_default ON reading_collections(user_id, is_default) WHERE is_default = true;
