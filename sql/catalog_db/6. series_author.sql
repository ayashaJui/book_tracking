CREATE TABLE series_authors (
    id SERIAL PRIMARY KEY,
    series_id INT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'AUTHOR',
    UNIQUE (series_id, author_id, role)
);
