from fastapi import APIRouter

from app.database import execute_query

router = APIRouter()


#only returns genres that have corresponding movies 
@router.get("")
async def get_genres():
    query = """
        SELECT
            g.genre_id,
            g.name,
            COUNT(mg.movie_id) as movie_count
        FROM genre g
        LEFT JOIN movie_genre mg ON g.genre_id = mg.genre_id
        GROUP BY g.genre_id
        ORDER BY g.name
    """
    return execute_query(query)


@router.get("/popularity")
async def get_genre_popularity():
    query = """
        SELECT
            g.name as genre,
            COUNT(DISTINCT r.rating_id) as total_ratings,
            COUNT(DISTINCT mg.movie_id) as movie_count,
            ROUND(AVG(r.rating)::numeric, 2) as avg_rating,
            ROUND(STDDEV(r.rating)::numeric, 2) as rating_stddev
        FROM genre g
        JOIN movie_genre mg ON g.genre_id = mg.genre_id
        JOIN rating r ON mg.movie_id = r.movie_id
        GROUP BY g.genre_id, g.name
        ORDER BY avg_rating DESC
    """
    return execute_query(query)


@router.get("/polarisation")
async def get_genre_polarisation():
    query = """
        WITH genre_raw AS (
            SELECT
                g.name as genre,
                r.rating
            FROM genre g
            JOIN movie_genre mg ON g.genre_id = mg.genre_id
            JOIN rating r ON mg.movie_id = r.movie_id
        )
        SELECT
            genre,
            COUNT(*) as total_ratings,
            ROUND(100.0 * SUM(CASE WHEN rating <= 2 THEN 1 ELSE 0 END) / COUNT(*), 1) as low_pct,
            ROUND(100.0 * SUM(CASE WHEN rating > 2 AND rating < 4 THEN 1 ELSE 0 END) / COUNT(*), 1) as mid_pct,
            ROUND(100.0 * SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) / COUNT(*), 1) as high_pct,
            ROUND(STDDEV(rating)::numeric, 3) as polarisation_score
        FROM genre_raw
        GROUP BY genre
        HAVING COUNT(*) >= 100
        ORDER BY polarisation_score DESC
    """
    return execute_query(query)
