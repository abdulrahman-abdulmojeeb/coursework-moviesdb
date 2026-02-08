from fastapi import APIRouter, Query

from app.database import execute_query

router = APIRouter()


@router.get("/traits")
async def get_personality_traits():
    query = """
        SELECT trait,
               ROUND(AVG(val)::numeric, 2) as mean,
               ROUND(STDDEV(val)::numeric, 2) as stddev,
               MIN(val) as min,
               MAX(val) as max
        FROM personality_user,
             LATERAL unnest(
                 ARRAY['openness','agreeableness','emotional_stability','conscientiousness','extraversion'],
                 ARRAY[openness, agreeableness, emotional_stability, conscientiousness, extraversion]
             ) AS t(trait, val)
        GROUP BY trait
    """
    return execute_query(query)


@router.get("/genre-correlation")
async def get_personality_genre_correlation(
    trait: str = Query(
        ...,
        regex="^(openness|agreeableness|emotional_stability|conscientiousness|extraversion)$"
    ),
    threshold: str = Query("high", regex="^(high|low)$"),
):
    comparison = ">= 4.0" if threshold == "high" else "<= 2.0"

    query = f"""
        WITH trait_users AS (
            SELECT user_id
            FROM personality_user
            WHERE {trait} {comparison}
        ),
        trait_genre_ratings AS (
            SELECT
                g.name as genre,
                AVG(r.rating) as avg_rating,
                COUNT(*) as rating_count
            FROM trait_users tu
            JOIN rating r ON tu.user_id = r.user_id
            JOIN movie_genre mg ON r.movie_id = mg.movie_id
            JOIN genre g ON mg.genre_id = g.genre_id
            GROUP BY g.name
            HAVING COUNT(*) >= 50
        )
        SELECT
            genre,
            ROUND(avg_rating::numeric, 2) as avg_rating,
            rating_count
        FROM trait_genre_ratings
        ORDER BY avg_rating DESC
    """
    return {
        "trait": trait,
        "threshold": threshold,
        "correlations": execute_query(query),
    }


@router.get("/genre-traits")
async def get_genre_personality_profile(
    genre: str = Query(..., description="Genre to analyze"),
):
    query = """
        WITH genre_lovers AS (
            SELECT DISTINCT r.user_id
            FROM rating r
            JOIN movie_genre mg ON r.movie_id = mg.movie_id
            JOIN genre g ON mg.genre_id = g.genre_id
            WHERE g.name ILIKE %s
            GROUP BY r.user_id
            HAVING AVG(r.rating) >= 4.0 AND COUNT(*) >= 5
        )
        SELECT
            ROUND(AVG(p.openness)::numeric, 2) as avg_openness,
            ROUND(AVG(p.agreeableness)::numeric, 2) as avg_agreeableness,
            ROUND(AVG(p.emotional_stability)::numeric, 2) as avg_emotional_stability,
            ROUND(AVG(p.conscientiousness)::numeric, 2) as avg_conscientiousness,
            ROUND(AVG(p.extraversion)::numeric, 2) as avg_extraversion,
            COUNT(*) as user_count
        FROM genre_lovers gl
        JOIN personality_user p ON gl.user_id = p.user_id
    """
    result = execute_query(query, (genre,))

    overall_query = """
        SELECT
            ROUND(AVG(openness)::numeric, 2) as avg_openness,
            ROUND(AVG(agreeableness)::numeric, 2) as avg_agreeableness,
            ROUND(AVG(emotional_stability)::numeric, 2) as avg_emotional_stability,
            ROUND(AVG(conscientiousness)::numeric, 2) as avg_conscientiousness,
            ROUND(AVG(extraversion)::numeric, 2) as avg_extraversion
        FROM personality_user
    """
    overall = execute_query(overall_query)

    return {
        "genre": genre,
        "genre_lovers_profile": result[0] if result else None,
        "overall_average": overall[0] if overall else None,
    }


@router.get("/segments")
async def get_personality_segments():
    query = """
        WITH user_segments AS (
            SELECT
                user_id,
                CASE
                    WHEN extraversion >= 4.0 AND openness >= 4.0 THEN 'adventurous_social'
                    WHEN extraversion >= 4.0 AND openness < 3.0 THEN 'social_traditional'
                    WHEN extraversion < 3.0 AND openness >= 4.0 THEN 'curious_introvert'
                    WHEN extraversion < 3.0 AND openness < 3.0 THEN 'traditional_introvert'
                    ELSE 'balanced'
                END as segment
            FROM personality_user
        ),
        segment_preferences AS (
            SELECT
                us.segment,
                g.name as genre,
                ROUND(AVG(r.rating)::numeric, 2) as avg_rating,
                COUNT(*) as rating_count
            FROM user_segments us
            JOIN rating r ON us.user_id = r.user_id
            JOIN movie_genre mg ON r.movie_id = mg.movie_id
            JOIN genre g ON mg.genre_id = g.genre_id
            GROUP BY us.segment, g.name
            HAVING COUNT(*) >= 20
        )
        SELECT
            segment,
            json_agg(json_build_object(
                'genre', genre,
                'avg_rating', avg_rating,
                'rating_count', rating_count
            ) ORDER BY avg_rating DESC) as genres
        FROM segment_preferences
        GROUP BY segment
    """
    results = execute_query(query)
    return {row["segment"]: row["genres"] for row in results}
