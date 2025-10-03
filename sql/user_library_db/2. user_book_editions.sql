-- Specific editions owned by user for each book
CREATE TABLE user_book_editions (
    id BIGSERIAL PRIMARY KEY,
    user_book_id BIGINT REFERENCES user_books(id) ON DELETE CASCADE,
    catalog_edition_id BIGINT NOT NULL, -- References catalog_service.book_editions.id
    is_primary_edition BOOLEAN DEFAULT true,
    condition VARCHAR(50), -- new, used, excellent, good, fair
    acquisition_date DATE,
    acquisition_method VARCHAR(100), -- purchase, gift, borrowed, library
    purchase_price DECIMAL(10,2),
    purchase_currency VARCHAR(10) DEFAULT 'USD',
    purchase_location VARCHAR(255),
    storage_location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_book_id, catalog_edition_id)
);

-- Indexes
CREATE INDEX idx_user_book_editions_user_book ON user_book_editions(user_book_id);
CREATE INDEX idx_user_book_editions_catalog ON user_book_editions(catalog_edition_id);
CREATE INDEX idx_user_book_editions_primary ON user_book_editions(user_book_id, is_primary_edition) WHERE is_primary_edition = true;

-- Comments
COMMENT ON COLUMN user_book_editions.catalog_edition_id IS 'References catalog_service.book_editions.id';
COMMENT ON COLUMN user_book_editions.is_primary_edition IS 'Which edition user considers primary';
