CREATE TABLE series_authors (
    series_id INT REFERENCES series(id) ON DELETE CASCADE,
    author_id INT REFERENCES authors(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'author',
    PRIMARY KEY (series_id, author_id, role)
);
