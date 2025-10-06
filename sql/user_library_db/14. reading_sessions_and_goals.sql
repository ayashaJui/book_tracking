-- Reading session tracking for detailed analytics
-- This complements the user_books table with granular session data
CREATE TABLE reading_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_book_id BIGINT NOT NULL, -- References user_books.id
    session_date DATE NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    start_page INTEGER,
    end_page INTEGER,
    pages_read INTEGER GENERATED ALWAYS AS (end_page - start_page) STORED,
    session_duration_minutes INTEGER,
    location VARCHAR(100), -- where they read (home, train, cafe, etc.)
    mood VARCHAR(50), -- reading mood/feeling
    comprehension_rating INTEGER CHECK (comprehension_rating >= 1 AND comprehension_rating <= 5),
    focus_rating INTEGER CHECK (focus_rating >= 1 AND focus_rating <= 5),
    notes TEXT,
    weather VARCHAR(50), -- optional environmental context
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_book_id) REFERENCES user_books(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_reading_sessions_user_book ON reading_sessions(user_book_id);
CREATE INDEX idx_reading_sessions_date ON reading_sessions(session_date);
CREATE INDEX idx_reading_sessions_duration ON reading_sessions(session_duration_minutes);

-- Reading goals and challenges
CREATE TABLE reading_goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    goal_type VARCHAR(50) NOT NULL, -- books_count, pages_count, hours_count, genre_variety
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    goal_period VARCHAR(20) NOT NULL, -- yearly, monthly, weekly
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reading streaks and achievements
CREATE TABLE reading_streaks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    streak_type VARCHAR(50) NOT NULL, -- daily_reading, weekly_books, monthly_goals
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    streak_start_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, streak_type)
);

-- Comments
COMMENT ON TABLE reading_sessions IS 'Detailed reading session tracking for analytics and progress monitoring';
COMMENT ON COLUMN reading_sessions.session_duration_minutes IS 'Total minutes spent reading in this session';
COMMENT ON COLUMN reading_sessions.location IS 'Physical location where reading took place';
COMMENT ON COLUMN reading_sessions.mood IS 'Reader mood or emotional state during session';
COMMENT ON COLUMN reading_sessions.comprehension_rating IS 'Self-assessed understanding level (1-5)';
COMMENT ON COLUMN reading_sessions.focus_rating IS 'Self-assessed focus/concentration level (1-5)';

COMMENT ON TABLE reading_goals IS 'User-defined reading goals and challenges';
COMMENT ON COLUMN reading_goals.goal_type IS 'Type of goal: books_count, pages_count, hours_count, etc.';
COMMENT ON COLUMN reading_goals.goal_period IS 'Time period for the goal: yearly, monthly, weekly';

COMMENT ON TABLE reading_streaks IS 'Reading streak tracking for gamification';
COMMENT ON COLUMN reading_streaks.streak_type IS 'Type of streak being tracked';
COMMENT ON COLUMN reading_streaks.current_streak IS 'Current active streak count';
COMMENT ON COLUMN reading_streaks.longest_streak IS 'Historical longest streak achieved';