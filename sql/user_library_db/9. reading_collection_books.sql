-- Books inside reading collections
CREATE TABLE reading_collection_books (
    id BIGSERIAL PRIMARY KEY,
    collection_id BIGINT REFERENCES reading_collections(id) ON DELETE CASCADE,
    user_book_id BIGINT REFERENCES user_books(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(collection_id, user_book_id)
);

-- Indexes
CREATE INDEX idx_reading_collection_books_collection ON reading_collection_books(collection_id);
CREATE INDEX idx_reading_collection_books_user_book ON reading_collection_books(user_book_id);
CREATE INDEX idx_reading_collection_books_order ON reading_collection_books(collection_id, display_order);
