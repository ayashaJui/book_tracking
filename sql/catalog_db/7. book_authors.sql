CREATE TABLE book_authors (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'AUTHOR',
    UNIQUE (book_id, author_id, role)
);