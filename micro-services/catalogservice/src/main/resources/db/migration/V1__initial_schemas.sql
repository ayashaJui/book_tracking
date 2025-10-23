CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    birth_date DATE,
    death_date DATE,
    nationality VARCHAR(100),
    website VARCHAR(500),
    instagram_url VARCHAR(500),
    threads_url VARCHAR(500),
    goodread_url VARCHAR(500),
    image_id VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_genre_id INT REFERENCES genres(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS publishers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    website VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    publication_date DATE,
    page_count INTEGER,
    language VARCHAR(10) DEFAULT 'en',
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    goodreads_id VARCHAR(50),
    google_books_id VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS series (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    total_books INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS series_authors (
    id SERIAL PRIMARY KEY,
    series_id INT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'AUTHOR',
    UNIQUE (series_id, author_id, role)
);


CREATE TABLE IF NOT EXISTS series_genres (
    id SERIAL PRIMARY KEY,
    series_id INT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    genre_id INT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    UNIQUE (series_id, genre_id)
);

CREATE TABLE IF NOT EXISTS book_authors (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'AUTHOR',
    UNIQUE (book_id, author_id, role)
    );


CREATE TABLE IF NOT EXISTS book_genres (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    genre_id INT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    UNIQUE (book_id, genre_id)
);


CREATE TABLE IF NOT EXISTS book_series (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    series_id INT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    position INT,
    UNIQUE (book_id, series_id)
);


CREATE TABLE IF NOT EXISTS book_editions (
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