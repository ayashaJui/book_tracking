CREATE TABLE book_series (
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    series_id INT REFERENCES series(id) ON DELETE CASCADE,
    position INTEGER,
    PRIMARY KEY (book_id, series_id)
);
