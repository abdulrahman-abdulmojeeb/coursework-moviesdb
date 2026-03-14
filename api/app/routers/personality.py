from fastapi import APIRouter, HTTPException, Query

from app.database import execute_query

router = APIRouter()

_ALLOWED_TRAITS = {"openness", "agreeableness", "emotional_stability", "conscientiousness", "extraversion"}


@router.get("/traits")
async def get_personality_traits():
    query = """
        SELECT trait,
               ROUND(AVG(val)::numeric, 2)    AS mean,
               ROUND(STDDEV(val)::numeric, 2) AS stddev,
               MIN(val)                        AS min,
               MAX(val)                        AS max,
               7                               AS scale
        FROM personality_dataset_user,
             LATERAL unnest(
                 ARRAY[
                     'openness',
                     'agreeableness',
                     'emotional_stability',
                     'conscientiousness',
                     'extraversion'
                 ],
                 ARRAY[
                     openness,
                     agreeableness,
                     emotional_stability,
                     conscientiousness,
                     extraversion
                 ]
             ) AS t(trait, val)
        GROUP BY trait
        ORDER BY trait
    """
    return execute_query(query)

@router.get("/genre-correlation")
async def get_personality_genre_correlation(
    trait: str = Query(
        ...,
        regex="^(openness|agreeableness|emotional_stability|conscientiousness|extraversion)$",
    ),
    threshold: str = Query("high", regex="^(high|low)$"),
):
    if trait not in _ALLOWED_TRAITS:
        raise HTTPException(status_code=400, detail="Invalid trait")

    # Dataset mean for the requested trait (used to split high / low).
    # Scores range 1-7; empirically the mean sits near 4.5, but we compute it
    # dynamically so the split is always relative to the actual data.
    mean_query = f"""
        SELECT AVG({trait}) AS dataset_mean
        FROM personality_dataset_user
    """
    mean_row = execute_query(mean_query)
    dataset_mean = float(mean_row[0]["dataset_mean"]) if mean_row else 4.0

    comparison = f">= {dataset_mean}" if threshold == "high" else f"< {dataset_mean}"

    query = f"""
        WITH trait_users AS (
            -- Dataset users whose trait score qualifies as high or low
            SELECT id AS personality_user_id
            FROM personality_dataset_user
            WHERE {trait} {comparison}
        ),
        trait_genre_ratings AS (
            -- Average predicted rating per genre for those users
            SELECT
                g.name                          AS genre,
                AVG(ppr.predicted_rating)       AS avg_rating,
                COUNT(*)                        AS rating_count
            FROM trait_users tu
            JOIN personality_predicted_rating ppr
                ON tu.personality_user_id = ppr.personality_user_id
            JOIN movie_genre mg  ON ppr.movie_id = mg.movie_id
            JOIN genre g         ON mg.genre_id  = g.genre_id
            GROUP BY g.name
            HAVING COUNT(*) >= 10
        )
        SELECT
            genre,
            ROUND(avg_rating::numeric, 2) AS avg_rating,
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
    genre: str = Query(..., max_length=100, description="Genre name to analyse"),
):
    # Users who gave an above-average predicted rating to >= 3 films in
    # the requested genre (mirrors the original "avg rating >= 4.0, count >= 5"
    # logic, adjusted for the predicted-rating context).
    genre_query = """
        WITH genre_lovers AS (
            SELECT DISTINCT ppr.personality_user_id
            FROM personality_predicted_rating ppr
            JOIN movie_genre mg ON ppr.movie_id  = mg.movie_id
            JOIN genre g        ON mg.genre_id   = g.genre_id
            WHERE g.name ILIKE %s
            GROUP BY ppr.personality_user_id
            HAVING AVG(ppr.predicted_rating) >= 4.0
               AND COUNT(*)                 >= 3
        )
        SELECT
            ROUND(AVG(p.openness)::numeric,            2) AS avg_openness,
            ROUND(AVG(p.agreeableness)::numeric,       2) AS avg_agreeableness,
            ROUND(AVG(p.emotional_stability)::numeric, 2) AS avg_emotional_stability,
            ROUND(AVG(p.conscientiousness)::numeric,   2) AS avg_conscientiousness,
            ROUND(AVG(p.extraversion)::numeric,        2) AS avg_extraversion,
            COUNT(*)                                       AS user_count
        FROM genre_lovers gl
        JOIN personality_dataset_user p ON gl.personality_user_id = p.id
    """
    result = execute_query(genre_query, (genre,))

    overall_query = """
        SELECT
            ROUND(AVG(openness)::numeric,            2) AS avg_openness,
            ROUND(AVG(agreeableness)::numeric,       2) AS avg_agreeableness,
            ROUND(AVG(emotional_stability)::numeric, 2) AS avg_emotional_stability,
            ROUND(AVG(conscientiousness)::numeric,   2) AS avg_conscientiousness,
            ROUND(AVG(extraversion)::numeric,        2) AS avg_extraversion
        FROM personality_dataset_user
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
                id AS personality_user_id,
                CASE
                    WHEN extraversion >= 5.5 AND openness >= 5.5 THEN 'adventurous_social'
                    WHEN extraversion >= 5.5 AND openness <  3.5 THEN 'social_traditional'
                    WHEN extraversion <  3.5 AND openness >= 5.5 THEN 'curious_introvert'
                    WHEN extraversion <  3.5 AND openness <  3.5 THEN 'traditional_introvert'
                    ELSE 'balanced'
                END AS segment
            FROM personality_dataset_user
        ),
        segment_preferences AS (
            SELECT
                us.segment,
                g.name                              AS genre,
                ROUND(AVG(ppr.predicted_rating)::numeric, 2) AS avg_rating,
                COUNT(*)                            AS rating_count
            FROM user_segments us
            JOIN personality_predicted_rating ppr
                ON us.personality_user_id = ppr.personality_user_id
            JOIN movie_genre mg ON ppr.movie_id = mg.movie_id
            JOIN genre g        ON mg.genre_id  = g.genre_id
            GROUP BY us.segment, g.name
            HAVING COUNT(*) >= 10
        )
        SELECT
            segment,
            json_agg(
                json_build_object(
                    'genre',        genre,
                    'avg_rating',   avg_rating,
                    'rating_count', rating_count
                )
                ORDER BY avg_rating DESC
            ) AS genres
        FROM segment_preferences
        GROUP BY segment
        ORDER BY segment
    """
    results = execute_query(query)
    return {row["segment"]: row["genres"] for row in results}
