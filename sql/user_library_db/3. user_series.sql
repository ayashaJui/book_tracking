-- User-specific series tracking linked to catalog service series
CREATE TABLE user_series (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    catalog_series_id BIGINT NOT NULL, -- References catalog_service.series.id
    books_read INTEGER DEFAULT 0,
    books_owned INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active', -- active, completed, paused, dropped
    start_date DATE,
    completion_date DATE,
    is_favorite BOOLEAN DEFAULT false,
    reading_order_preference VARCHAR(50) DEFAULT 'publication',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, catalog_series_id)
);

-- Indexes
CREATE INDEX idx_user_series_user ON user_series(user_id);
CREATE INDEX idx_user_series_catalog ON user_series(catalog_series_id);
CREATE INDEX idx_user_series_status ON user_series(user_id, status);
CREATE INDEX idx_user_series_favorite ON user_series(user_id, is_favorite) WHERE is_favorite = true;

-- Comments
COMMENT ON COLUMN user_series.catalog_series_id IS 'References catalog_service.series.id';
