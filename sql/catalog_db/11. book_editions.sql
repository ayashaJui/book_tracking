CREATE TABLE book_editions (
    id SERIAL PRIMARY KEY,
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    format VARCHAR(50) NOT NULL,
    isbn VARCHAR(20),
    publisher_id INT REFERENCES publishers(id),
    publication_date DATE,
    page_count INTEGER,
    price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    cover_image_id INT,
    availability_status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partial unique index for ISBN if not null
CREATE UNIQUE INDEX uq_book_editions_isbn
ON book_editions(isbn)
WHERE isbn IS NOT NULL;
