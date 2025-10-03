-- User-specific book data linked to catalog service books (the WORK level)
CREATE TABLE user_books (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- References user_service.users.id
    catalog_book_id BIGINT NOT NULL, -- References catalog_service.books.id (the work, not edition)
    status VARCHAR(50) NOT NULL, -- want_to_read, currently_reading, read, did_not_finish, on_hold
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    current_page INTEGER DEFAULT 0,
    start_date DATE,
    finish_date DATE,
    is_favorite BOOLEAN DEFAULT false,
    reading_format VARCHAR(50) DEFAULT 'physical',
    notes TEXT,
    private_notes TEXT,
    acquired_date DATE,
    acquisition_method VARCHAR(100),
    purchase_price DECIMAL(10,2),
    purchase_currency VARCHAR(10) DEFAULT 'USD',
    purchase_location VARCHAR(255),
    condition VARCHAR(50), -- new, used, excellent, good, fair
    location VARCHAR(255), -- where the book is stored
    source_type VARCHAR(50) DEFAULT 'catalog_existing', -- catalog_existing, catalog_created, manual
    original_search_query TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, catalog_book_id)
);

-- Indexes
CREATE INDEX idx_user_books_user ON user_books(user_id);
CREATE INDEX idx_user_books_catalog_book ON user_books(catalog_book_id);
CREATE INDEX idx_user_books_status ON user_books(user_id, status);
CREATE INDEX idx_user_books_rating ON user_books(user_id, rating) WHERE rating IS NOT NULL;
CREATE INDEX idx_user_books_favorite ON user_books(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX idx_user_books_dates ON user_books(user_id, start_date, finish_date);

-- Comments
COMMENT ON COLUMN user_books.catalog_book_id IS 'References catalog_service.books.id (the work, not edition)';
