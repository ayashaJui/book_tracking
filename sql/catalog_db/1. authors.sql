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

ALTER TABLE authors
ADD COLUMN instagram_url VARCHAR(500);

ALTER TABLE authors
ADD COLUMN threads_url VARCHAR(500);

ALTER TABLE authors
ADD COLUMN goodread_url VARCHAR(500);
