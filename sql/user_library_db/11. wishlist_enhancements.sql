-- Enhanced user_books table for wishlist support
-- Add new status values and wishlist-specific fields

-- Update existing status enum to include wishlist statuses
ALTER TABLE user_books 
DROP CONSTRAINT IF EXISTS user_books_status_check;

ALTER TABLE user_books 
ALTER COLUMN status TYPE VARCHAR(50);
-- ADD CONSTRAINT user_books_status_check 
-- CHECK (status IN (
--     -- Library statuses
--     'currently_reading', 
--     'read', 
--     'did_not_finish', 
--     'on_hold',
    
--     -- Wishlist statuses
--     'want_to_read',
--     'wishlist_planned',      -- General wishlist item
--     'wishlist_priority_high', -- High priority wishlist
--     'wishlist_gift_idea',     -- Gift idea
--     'wishlist_price_watch',   -- Watching for price drop
--     'wishlist_pre_order',     -- Pre-order/upcoming release
--     'wishlist_maybe',         -- Maybe/considering
--     'wishlist_seasonal'       -- Holiday/seasonal reading
-- ));

-- Add wishlist-specific columns
ALTER TABLE user_books ADD COLUMN wishlist_priority INTEGER DEFAULT 3 CHECK (wishlist_priority BETWEEN 1 AND 5); -- 1=highest, 5=lowest
ALTER TABLE user_books ADD COLUMN target_price DECIMAL(10,2);
ALTER TABLE user_books ADD COLUMN target_currency VARCHAR(10) DEFAULT 'USD';
ALTER TABLE user_books ADD COLUMN price_alert_threshold DECIMAL(10,2);
ALTER TABLE user_books ADD COLUMN target_acquisition_date DATE;
ALTER TABLE user_books ADD COLUMN wishlist_category VARCHAR(100); -- 'gift', 'vacation', 'work', etc.
ALTER TABLE user_books ADD COLUMN wishlist_notes TEXT;
ALTER TABLE user_books ADD COLUMN is_gift_idea BOOLEAN DEFAULT false;
ALTER TABLE user_books ADD COLUMN gift_recipient VARCHAR(255);
ALTER TABLE user_books ADD COLUMN wishlist_added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE user_books ADD COLUMN wishlist_reason TEXT; -- Why they want to read it

-- Add indexes for wishlist queries
CREATE INDEX idx_user_books_wishlist_status ON user_books(user_id, status) 
WHERE status LIKE 'wishlist_%' OR status = 'want_to_read';

CREATE INDEX idx_user_books_wishlist_priority ON user_books(user_id, wishlist_priority) 
WHERE status LIKE 'wishlist_%' OR status = 'want_to_read';

CREATE INDEX idx_user_books_price_alerts ON user_books(user_id, price_alert_threshold) 
WHERE price_alert_threshold IS NOT NULL;

CREATE INDEX idx_user_books_gift_ideas ON user_books(user_id, is_gift_idea) 
WHERE is_gift_idea = true;

CREATE INDEX idx_user_books_wishlist_category ON user_books(user_id, wishlist_category) 
WHERE wishlist_category IS NOT NULL;

-- Comments
COMMENT ON COLUMN user_books.wishlist_priority IS 'Priority level: 1=highest, 5=lowest';
COMMENT ON COLUMN user_books.target_price IS 'Maximum price user willing to pay';
COMMENT ON COLUMN user_books.price_alert_threshold IS 'Alert when price drops below this';
COMMENT ON COLUMN user_books.wishlist_category IS 'Category like gift, vacation, work, etc.';
COMMENT ON COLUMN user_books.wishlist_notes IS 'Why user wants this book, notes specific to wishlist';
COMMENT ON COLUMN user_books.gift_recipient IS 'If gift idea, who is it for';