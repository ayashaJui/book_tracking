-- Specific editions owned by user for each book work
-- This table tracks physical/digital copy details for each edition
-- Each user_book (work) can have multiple editions (hardcover, paperback, ebook, etc.)
CREATE TABLE user_book_editions (
    id BIGSERIAL PRIMARY KEY,
    user_book_id BIGINT REFERENCES user_books(id) ON DELETE CASCADE,
    catalog_edition_id BIGINT NOT NULL, -- References catalog_service.book_editions.id
    is_primary_edition BOOLEAN DEFAULT true, -- Which edition user considers primary for reading
    
    -- Edition-specific physical attributes
    condition VARCHAR(50), -- new, used, excellent, good, fair, poor
    storage_location VARCHAR(255), -- where this specific edition is stored
    
    -- Edition-specific acquisition details  
    acquisition_date DATE, -- when THIS edition was acquired
    acquisition_method VARCHAR(100), -- purchase, gift, borrowed, library, inherited
    purchase_price DECIMAL(10,2), -- price paid for THIS edition
    purchase_currency VARCHAR(10) DEFAULT 'BDT',
    purchase_location VARCHAR(255), -- where THIS edition was purchased
    
    -- Edition-specific notes
    notes TEXT, -- notes about this specific edition (condition, features, etc.)
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_book_id, catalog_edition_id)
);

-- Indexes
CREATE INDEX idx_user_book_editions_user_book ON user_book_editions(user_book_id);
CREATE INDEX idx_user_book_editions_catalog ON user_book_editions(catalog_edition_id);
CREATE INDEX idx_user_book_editions_primary ON user_book_editions(user_book_id, is_primary_edition) WHERE is_primary_edition = true;

-- Comments  
COMMENT ON TABLE user_book_editions IS 'Tracks specific physical/digital copies owned by user for each book work';
COMMENT ON COLUMN user_book_editions.catalog_edition_id IS 'References catalog_service.book_editions.id - specific edition details';
COMMENT ON COLUMN user_book_editions.is_primary_edition IS 'Which edition user considers primary for reading (only one per work)';
COMMENT ON COLUMN user_book_editions.condition IS 'Physical condition of THIS specific edition';
COMMENT ON COLUMN user_book_editions.storage_location IS 'Where THIS specific edition is physically stored';
COMMENT ON COLUMN user_book_editions.acquisition_date IS 'When THIS specific edition was acquired (may differ from work acquisition)';
COMMENT ON COLUMN user_book_editions.notes IS 'Notes specific to this edition (damage, special features, etc.)';
