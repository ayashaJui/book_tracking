-- User-specific book data linked to catalog service books (the WORK level)
-- This table tracks reading progress and general ownership for the abstract "work"
-- Physical/digital copy details are tracked in user_book_editions
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
    reading_format VARCHAR(50) DEFAULT 'PHYSICAL', -- PHYSICAL, DIGITAL
    notes TEXT, -- General reading notes about the work
    private_notes TEXT, -- Private thoughts about the work
    
    -- Work-level acquisition tracking (when user first got ANY edition)
    first_acquisition_date DATE,
    first_acquisition_method VARCHAR(100),
    
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
COMMENT ON TABLE user_books IS 'Tracks reading progress and status for book works (abstract books), not specific editions';
COMMENT ON COLUMN user_books.catalog_book_id IS 'References catalog_service.books.id (the work, not edition)';
COMMENT ON COLUMN user_books.status IS 'Reading status applies to the work as a whole, regardless of edition';
COMMENT ON COLUMN user_books.rating IS 'Rating applies to the work content, not specific edition';
COMMENT ON COLUMN user_books.first_acquisition_date IS 'When user first acquired ANY edition of this work';
COMMENT ON COLUMN user_books.notes IS 'Reading notes about the work content (edition-agnostic)';
COMMENT ON COLUMN user_books.private_notes IS 'Private thoughts about the work (edition-agnostic)';
