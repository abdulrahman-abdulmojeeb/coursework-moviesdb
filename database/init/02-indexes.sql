-- Performance Indexes for MovieLens Database
-- These indexes optimize the queries required for the dashboard and reports

-- ============================================
-- Movie Search Indexes
-- ============================================

-- Index for title search (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_movie_title_lower ON movie (LOWER(title));

-- Index for year-based filtering
CREATE INDEX IF NOT EXISTS idx_movie_release_year ON movie (release_year);

-- Index for TMDB lookups
CREATE INDEX IF NOT EXISTS idx_movie_tmdb_id ON movie (tmdb_id);

-- ============================================
-- Rating Indexes (Critical for Performance)
-- ============================================

-- Composite index for movie rating aggregations
CREATE INDEX IF NOT EXISTS idx_rating_movie_id ON rating (movie_id);

-- Composite index for user rating history
CREATE INDEX IF NOT EXISTS idx_rating_user_id ON rating (user_id);

-- Index for rating value filtering
CREATE INDEX IF NOT EXISTS idx_rating_value ON rating (rating);

-- Composite index for user-movie lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_rating_user_movie ON rating (user_id, movie_id);

-- ============================================
-- Genre Indexes
-- ============================================

-- Index for genre name lookups
CREATE INDEX IF NOT EXISTS idx_genre_name ON genre (name);

-- Indexes for movie-genre junction table
CREATE INDEX IF NOT EXISTS idx_movie_genres_movie ON movie_genre (movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_genres_genre ON movie_genre (genre_id);

-- ============================================
-- Tag Indexes
-- ============================================

-- Index for tag text search
CREATE INDEX IF NOT EXISTS idx_tag_text ON tag USING gin (to_tsvector('english', tag_text));

-- Index for movie tags
CREATE INDEX IF NOT EXISTS idx_tag_movie_id ON tag (movie_id);

-- Index for user tags
CREATE INDEX IF NOT EXISTS idx_tag_user_id ON tag (user_id);

-- ============================================
-- Personality Analysis Indexes
-- ============================================

-- Indexes for personality trait queries
CREATE INDEX IF NOT EXISTS idx_personality_openness ON personality_user (openness);
CREATE INDEX IF NOT EXISTS idx_personality_extraversion ON personality_user (extraversion);
CREATE INDEX IF NOT EXISTS idx_personality_agreeableness ON personality_user (agreeableness);
CREATE INDEX IF NOT EXISTS idx_personality_conscientiousness ON personality_user (conscientiousness);
CREATE INDEX IF NOT EXISTS idx_personality_stability ON personality_user (emotional_stability);

-- ============================================
-- Collection Indexes
-- ============================================

-- Index for user collections lookup
CREATE INDEX IF NOT EXISTS idx_movie_collection_user_id ON movie_collection (user_id);

-- Index for collection items
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_item (collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_movie ON collection_item (movie_id);

-- ============================================
-- App User Indexes
-- ============================================

-- Index for username lookup (login)
CREATE INDEX IF NOT EXISTS idx_app_users_username ON app_user (username);

-- Index for email lookup
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_user (email);
