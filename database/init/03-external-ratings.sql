-- External Ratings from OMDb API (IMDb, Rotten Tomatoes, Metacritic)
-- This table stores aggregated critic and audience scores from external sources

CREATE TABLE IF NOT EXISTS external_ratings (
    movie_id INTEGER PRIMARY KEY REFERENCES movie(movie_id) ON DELETE CASCADE,
    imdb_rating DECIMAL(3,1),
    imdb_votes INTEGER,
    rotten_tomatoes_score INTEGER,
    metacritic_score INTEGER,
    box_office VARCHAR(50),
    awards TEXT,
    rated VARCHAR(10),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE external_ratings IS 'External ratings from OMDb API (IMDb, Rotten Tomatoes, Metacritic)';
COMMENT ON COLUMN external_ratings.imdb_rating IS 'IMDb user rating out of 10';
COMMENT ON COLUMN external_ratings.imdb_votes IS 'Number of IMDb user votes';
COMMENT ON COLUMN external_ratings.rotten_tomatoes_score IS 'Rotten Tomatoes Tomatometer percentage (0-100)';
COMMENT ON COLUMN external_ratings.metacritic_score IS 'Metacritic score (0-100)';
COMMENT ON COLUMN external_ratings.box_office IS 'Domestic box office earnings';
COMMENT ON COLUMN external_ratings.awards IS 'Awards summary from OMDb';
COMMENT ON COLUMN external_ratings.rated IS 'Content rating (G, PG, PG-13, R, etc.)';

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_external_ratings_imdb ON external_ratings(imdb_rating) WHERE imdb_rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_external_ratings_rt ON external_ratings(rotten_tomatoes_score) WHERE rotten_tomatoes_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_external_ratings_meta ON external_ratings(metacritic_score) WHERE metacritic_score IS NOT NULL;
