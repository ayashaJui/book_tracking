-- Option 3: Use existing reading_collections for advanced wishlist management
-- This leverages the existing collection system for multiple wishlists

-- Create default wishlist collections for users
INSERT INTO reading_collections (user_id, name, description, is_default)
SELECT DISTINCT user_id, 'Main Wishlist', 'Primary book wishlist', true
FROM user_books
WHERE NOT EXISTS (
    SELECT 1 FROM reading_collections 
    WHERE reading_collections.user_id = user_books.user_id 
    AND name = 'Main Wishlist'
);

-- Enhance reading_collection_books for wishlist metadata
ALTER TABLE reading_collection_books ADD COLUMN collection_type VARCHAR(50) DEFAULT 'reading_list';
ALTER TABLE reading_collection_books ADD COLUMN item_status VARCHAR(50);
ALTER TABLE reading_collection_books ADD COLUMN priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5);
ALTER TABLE reading_collection_books ADD COLUMN target_price DECIMAL(10,2);
ALTER TABLE reading_collection_books ADD COLUMN price_alert_threshold DECIMAL(10,2);
ALTER TABLE reading_collection_books ADD COLUMN is_gift_idea BOOLEAN DEFAULT false;
ALTER TABLE reading_collection_books ADD COLUMN gift_recipient VARCHAR(255);
ALTER TABLE reading_collection_books ADD COLUMN target_acquisition_date DATE;
ALTER TABLE reading_collection_books ADD COLUMN wishlist_category VARCHAR(100);

-- Add constraint for wishlist collections
ALTER TABLE reading_collection_books 
ADD CONSTRAINT chk_wishlist_status 
CHECK (
    (collection_type = 'wishlist' AND item_status IN (
        'planned', 'priority_high', 'priority_medium', 'priority_low',
        'gift_idea', 'price_watch', 'pre_order', 'maybe', 'seasonal'
    )) OR 
    (collection_type != 'wishlist')
);

-- Create indexes for wishlist collection queries
CREATE INDEX idx_collection_books_wishlist ON reading_collection_books(collection_id, collection_type, item_status) 
WHERE collection_type = 'wishlist';

CREATE INDEX idx_collection_books_priority ON reading_collection_books(collection_id, priority) 
WHERE collection_type = 'wishlist';

CREATE INDEX idx_collection_books_gift_ideas ON reading_collection_books(collection_id, is_gift_idea) 
WHERE is_gift_idea = true;

-- Create wishlist-specific collection types
ALTER TABLE reading_collections ADD COLUMN collection_type VARCHAR(50) DEFAULT 'reading_list';
ALTER TABLE reading_collections ADD CONSTRAINT chk_collection_type 
CHECK (collection_type IN ('reading_list', 'wishlist', 'gift_ideas', 'price_watch', 'seasonal'));

-- Example: Create different types of wishlist collections
-- This would be done via application logic:
/*
INSERT INTO reading_collections (user_id, name, description, collection_type) VALUES
(1, 'High Priority Wishlist', 'Books I really want to read soon', 'wishlist'),
(1, 'Gift Ideas', 'Books that would make good gifts', 'gift_ideas'),
(1, 'Price Watch', 'Books I want when price drops', 'price_watch'),
(1, 'Holiday Reading', 'Books for vacation/holiday reading', 'seasonal');
*/

-- Comments
COMMENT ON COLUMN reading_collection_books.collection_type IS 'Type: reading_list, wishlist, gift_ideas, etc.';
COMMENT ON COLUMN reading_collection_books.item_status IS 'Status specific to the collection type';
COMMENT ON COLUMN reading_collections.collection_type IS 'Defines the purpose and behavior of the collection';