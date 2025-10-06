-- Alternative: Separate wishlist table if you want complete isolation
-- This approach keeps wishlist completely separate from library

CREATE TABLE user_wishlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- References user_service.users.id
    catalog_book_id BIGINT NOT NULL, -- References catalog_service.books.id
    
    -- Wishlist-specific status
    wishlist_status VARCHAR(50) NOT NULL CHECK (wishlist_status IN (
        'planned',           -- General wishlist item
        'priority_high',     -- High priority
        'priority_medium',   -- Medium priority  
        'priority_low',      -- Low priority
        'gift_idea',         -- Gift idea
        'price_watch',       -- Watching for price drop
        'pre_order',         -- Pre-order/upcoming
        'maybe',             -- Maybe/considering
        'seasonal',          -- Holiday/seasonal
        'research',          -- Need to research more
        'completed'          -- Moved to library or no longer wanted
    )),
    
    -- Wishlist metadata
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    target_price DECIMAL(10,2),
    target_currency VARCHAR(10) DEFAULT 'USD',
    price_alert_threshold DECIMAL(10,2),
    target_acquisition_date DATE,
    wishlist_category VARCHAR(100), -- 'gift', 'vacation', 'work', 'personal'
    
    -- Gift-related fields
    is_gift_idea BOOLEAN DEFAULT false,
    gift_recipient VARCHAR(255),
    gift_occasion VARCHAR(100), -- 'birthday', 'christmas', 'graduation'
    
    -- Notes and reasoning
    wishlist_notes TEXT,
    wishlist_reason TEXT, -- Why they want to read it
    
    -- Source tracking
    source_type VARCHAR(50) DEFAULT 'manual', -- manual, recommendation, review, social
    source_reference TEXT, -- URL, friend name, etc.
    
    -- Timestamps
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    target_read_date DATE, -- When they plan to read it
    
    UNIQUE(user_id, catalog_book_id)
);

-- Indexes
CREATE INDEX idx_user_wishlists_user ON user_wishlists(user_id);
CREATE INDEX idx_user_wishlists_catalog_book ON user_wishlists(catalog_book_id);
CREATE INDEX idx_user_wishlists_status ON user_wishlists(user_id, wishlist_status);
CREATE INDEX idx_user_wishlists_priority ON user_wishlists(user_id, priority);
CREATE INDEX idx_user_wishlists_category ON user_wishlists(user_id, wishlist_category);
CREATE INDEX idx_user_wishlists_gift_ideas ON user_wishlists(user_id, is_gift_idea) WHERE is_gift_idea = true;
CREATE INDEX idx_user_wishlists_price_alerts ON user_wishlists(user_id, price_alert_threshold) WHERE price_alert_threshold IS NOT NULL;
CREATE INDEX idx_user_wishlists_target_date ON user_wishlists(user_id, target_acquisition_date) WHERE target_acquisition_date IS NOT NULL;

-- Comments
COMMENT ON TABLE user_wishlists IS 'Separate wishlist management with detailed status tracking';
COMMENT ON COLUMN user_wishlists.wishlist_status IS 'Specific wishlist status separate from reading status';
COMMENT ON COLUMN user_wishlists.priority IS 'User-defined priority: 1=highest, 5=lowest';
COMMENT ON COLUMN user_wishlists.wishlist_category IS 'Category for organization: gift, vacation, work, personal';
COMMENT ON COLUMN user_wishlists.source_type IS 'How the book was added: manual, recommendation, review, social';