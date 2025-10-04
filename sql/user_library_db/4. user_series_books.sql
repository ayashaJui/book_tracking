-- User-specific tracking of books within a series
CREATE TABLE user_series_books (
    id BIGSERIAL PRIMARY KEY,
    user_series_id BIGINT REFERENCES user_series(id) ON DELETE CASCADE,
    catalog_book_id BIGINT NOT NULL,
    user_book_id BIGINT REFERENCES user_books(id),
    order_in_series INTEGER,
    is_read BOOLEAN DEFAULT false,
    reading_priority INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_series_id, catalog_book_id)
);

-- Indexes
CREATE INDEX idx_user_series_books_series ON user_series_books(user_series_id);
CREATE INDEX idx_user_series_books_catalog_book ON user_series_books(catalog_book_id);
CREATE INDEX idx_user_series_books_user_book ON user_series_books(user_book_id);
CREATE INDEX idx_user_series_books_order ON user_series_books(user_series_id, order_in_series);
