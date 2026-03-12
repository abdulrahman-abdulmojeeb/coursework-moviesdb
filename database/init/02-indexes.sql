-- Movie Search Indexes
CREATE INDEX IF NOT EXISTS idx_movie_title_lower ON movie (LOWER(title));
CREATE INDEX IF NOT EXISTS idx_movie_release_year ON movie (release_year);
CREATE INDEX IF NOT EXISTS idx_movie_tmdb_id ON movie (tmdb_id);

-- Rating Indexes
CREATE INDEX IF NOT EXISTS idx_rating_movie_id ON rating (movie_id);
CREATE INDEX IF NOT EXISTS idx_rating_user_id ON rating (user_id);
CREATE INDEX IF NOT EXISTS idx_rating_value ON rating (rating);

-- Composite index
CREATE INDEX IF NOT EXISTS idx_rating_user_movie ON rating (user_id, movie_id);

-- Genre Indexes
CREATE INDEX IF NOT EXISTS idx_genre_name ON genre (name);
CREATE INDEX IF NOT EXISTS idx_movie_genre_movie ON movie_genre (movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_genre_genre ON movie_genre (genre_id);

-- Tag Indexes

-- Index optimised for searching
CREATE INDEX IF NOT EXISTS idx_tag_text ON tag USING gin (to_tsvector('english', tag_text)); --used this doc: https://www.postgresql.org/docs/current/textsearch-controls.html
CREATE INDEX IF NOT EXISTS idx_tag_movie_id ON tag (movie_id);
CREATE INDEX IF NOT EXISTS idx_tag_user_id ON tag (user_id);

-- Personality Analysis Indexes
CREATE INDEX IF NOT EXISTS idx_personality_openness ON personality_user (openness);
CREATE INDEX IF NOT EXISTS idx_personality_extraversion ON personality_user (extraversion);
CREATE INDEX IF NOT EXISTS idx_personality_agreeableness ON personality_user (agreeableness);
CREATE INDEX IF NOT EXISTS idx_personality_conscientiousness ON personality_user (conscientiousness);
CREATE INDEX IF NOT EXISTS idx_personality_stability ON personality_user (emotional_stability);

-- Collection Indexes
CREATE INDEX IF NOT EXISTS idx_movie_collection_user_id ON movie_collection (user_id);

CREATE INDEX IF NOT EXISTS idx_collection_item_collection ON collection_item (collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_item_movie ON collection_item (movie_id);

-- App User Indexes

-- Used a lot for login
CREATE INDEX IF NOT EXISTS idx_app_user_username ON app_user (username);

CREATE INDEX IF NOT EXISTS idx_app_user_email ON app_user (email);

-- Partial indexes for common filtered queries
-- High-rated movies (frequently accessed in recommendations)
CREATE INDEX IF NOT EXISTS idx_rating_high
    ON rating (movie_id) WHERE rating >= 4.0;

-- Active app users (skip deactivated in auth lookups)
CREATE INDEX IF NOT EXISTS idx_app_user_active
    ON app_user (username) WHERE is_active = true;
