-- Tracks how books were added to user library for analytics/debugging
CREATE TABLE user_book_sources (
    id BIGSERIAL PRIMARY KEY,
    user_book_id BIGINT REFERENCES user_books(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL, -- catalog_existing, catalog_created, manual, import
    catalog_search_query TEXT,
    duplicate_detection_results JSONB,
    user_choice VARCHAR(50), -- used_existing, created_new, ignored_duplicates
    created_entities JSONB, -- track new entities created in catalog
    import_source VARCHAR(100), -- e.g. goodreads, csv, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_user_book_sources_user_book ON user_book_sources(user_book_id);
CREATE INDEX idx_user_book_sources_type ON user_book_sources(source_type);
