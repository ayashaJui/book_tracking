CREATE TABLE book_authors (
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    author_id INT REFERENCES authors(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'author',
    PRIMARY KEY (book_id, author_id, role)
);
