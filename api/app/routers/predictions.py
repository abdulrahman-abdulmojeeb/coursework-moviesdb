from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional

from app.database import execute_query, execute_query_one
from app.helpers import build_poster_url

router = APIRouter()


class MoviePredictionRequest(BaseModel):
    genres: list[str] = Field(..., min_length=1, max_length=20)
    panel_size: Optional[int] = Field(None, ge=50, le=500)


@router.post("/predict")
async def predict_rating(request: MoviePredictionRequest):
    if not request.genres:
        raise HTTPException(status_code=400, detail="At least one genre is required")

    panel_cte = ""
    panel_filter = ""
    panel_filter_bare = ""
    panel_params: tuple = ()

    if request.panel_size:
        panel_cte = """
        preview_panel AS (
            SELECT user_id
            FROM rating
            GROUP BY user_id
            HAVING COUNT(*) >= 50 AND STDDEV(rating) > 0.5
            ORDER BY RANDOM()
            LIMIT %s
        ),
        """
        panel_filter = "AND r.user_id IN (SELECT user_id FROM preview_panel)"
        panel_filter_bare = "AND user_id IN (SELECT user_id FROM preview_panel)"
        panel_params = (request.panel_size,)

    query = f"""
        WITH {panel_cte}target_genres AS (
            SELECT genre_id FROM genre WHERE name = ANY(%s)
        ),
        similar_movies AS (
            SELECT
                m.movie_id,
                m.title,
                m.release_year,
                COUNT(DISTINCT mg.genre_id) as matching_genres,
                (SELECT COUNT(*) FROM target_genres) as total_target_genres
            FROM movie m
            JOIN movie_genre mg ON m.movie_id = mg.movie_id
            WHERE mg.genre_id IN (SELECT genre_id FROM target_genres)
            GROUP BY m.movie_id
            HAVING COUNT(DISTINCT mg.genre_id) >= GREATEST(1, (SELECT COUNT(*) FROM target_genres) / 2)
            ORDER BY matching_genres DESC
            LIMIT 50
        ),
        similar_ratings AS (
            SELECT
                r.rating,
                r.user_id,
                sm.matching_genres::float / sm.total_target_genres as genre_similarity
            FROM similar_movies sm
            JOIN rating r ON sm.movie_id = r.movie_id
            WHERE 1=1 {panel_filter}
        )
        SELECT
            ROUND(AVG(rating)::numeric, 2) as predicted_rating,
            ROUND(STDDEV(rating)::numeric, 2) as uncertainty,
            COUNT(*) as based_on_ratings,
            ROUND((AVG(rating * genre_similarity) / NULLIF(AVG(genre_similarity), 0))::numeric, 2) as weighted_prediction,
            COUNT(DISTINCT user_id) as unique_users
        FROM similar_ratings
    """

    result = execute_query_one(query, panel_params + (request.genres,))

    if not result or result["based_on_ratings"] == 0:
        raise HTTPException(
            status_code=404,
            detail="Not enough similar movies found to make prediction"
        )

    distribution_query = f"""
        WITH {panel_cte}target_genres AS (
            SELECT genre_id FROM genre WHERE name = ANY(%s)
        ),
        similar_movies AS (
            SELECT m.movie_id
            FROM movie m
            JOIN movie_genre mg ON m.movie_id = mg.movie_id
            WHERE mg.genre_id IN (SELECT genre_id FROM target_genres)
            GROUP BY m.movie_id
            HAVING COUNT(DISTINCT mg.genre_id) >= GREATEST(1, (SELECT COUNT(*) FROM target_genres) / 2)
            LIMIT 50
        )
        SELECT
            rating,
            COUNT(*) as count,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) as percentage
        FROM rating
        WHERE movie_id IN (SELECT movie_id FROM similar_movies)
        {panel_filter_bare}
        GROUP BY rating
        ORDER BY rating
    """

    distribution = execute_query(distribution_query, panel_params + (request.genres,))

    response = {
        "genres": request.genres,
        "prediction": {
            "mean_rating": result["predicted_rating"],
            "weighted_rating": result["weighted_prediction"],
            "uncertainty": result["uncertainty"],
            "confidence_interval": {
                "low": max(0.5, float(result["predicted_rating"]) - float(result["uncertainty"] or 0)),
                "high": min(5.0, float(result["predicted_rating"]) + float(result["uncertainty"] or 0)),
            },
            "based_on_ratings": result["based_on_ratings"],
        },
        "distribution": distribution,
    }

    if request.panel_size:
        response["panel"] = {
            "requested_size": request.panel_size,
            "users_in_results": result["unique_users"],
        }

    return response


@router.get("/similar/{movie_id}")
async def get_similar_movies(
    movie_id: int,
    limit: int = Query(10, ge=1, le=50),
):
    # First get the target movie's genres
    movie = execute_query_one(
        "SELECT movie_id, title FROM movie WHERE movie_id = %s",
        (movie_id,)
    )

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    query = """
        WITH target_genres AS (
            SELECT genre_id FROM movie_genre WHERE movie_id = %s
        ),
        genre_similarity AS (
            SELECT
                m.movie_id,
                m.title,
                m.release_year,
                md.poster_path,
                COUNT(DISTINCT mg.genre_id) as matching_genres,
                (SELECT COUNT(*) FROM target_genres) as total_genres
            FROM movie m
            JOIN movie_genre mg ON m.movie_id = mg.movie_id
            LEFT JOIN movie_detail md ON m.movie_id = md.movie_id
            WHERE mg.genre_id IN (SELECT genre_id FROM target_genres)
              AND m.movie_id != %s
            GROUP BY m.movie_id, md.poster_path
        )
        SELECT
            gs.movie_id,
            gs.title,
            gs.release_year,
            gs.poster_path,
            gs.matching_genres,
            ROUND(100.0 * gs.matching_genres / gs.total_genres, 1) as genre_similarity_pct,
            ROUND(AVG(r.rating)::numeric, 2) as avg_rating,
            COUNT(r.rating_id) as rating_count
        FROM genre_similarity gs
        LEFT JOIN rating r ON gs.movie_id = r.movie_id
        GROUP BY gs.movie_id, gs.title, gs.release_year, gs.poster_path, gs.matching_genres, gs.total_genres
        ORDER BY genre_similarity_pct DESC, avg_rating DESC
        LIMIT %s
    """

    similar = execute_query(query, (movie_id, movie_id, limit))

    for item in similar:
        item["poster_url"] = build_poster_url(item.get("poster_path"))

    return {
        "source_movie": movie,
        "similar_movies": similar,
    }


@router.get("/preview-panel")
async def get_preview_panel_prediction(
    movie_id: int,
    panel_size: int = Query(100, ge=10, le=500),
):
    # Select diverse users who rate frequently and have varied tastes
    query = """
        WITH active_users AS (
            SELECT
                user_id,
                AVG(rating) as avg_rating,
                STDDEV(rating) as rating_variance,
                COUNT(*) as rating_count
            FROM rating
            GROUP BY user_id
            HAVING COUNT(*) >= 50 AND STDDEV(rating) > 0.5
            ORDER BY RANDOM()
            LIMIT %s
        ),
        target_movie_genres AS (
            SELECT genre_id FROM movie_genre WHERE movie_id = %s
        ),
        panel_genre_preferences AS (
            SELECT
                au.user_id,
                AVG(r.rating) as genre_avg_rating
            FROM active_users au
            JOIN rating r ON au.user_id = r.user_id
            JOIN movie_genre mg ON r.movie_id = mg.movie_id
            WHERE mg.genre_id IN (SELECT genre_id FROM target_movie_genres)
            GROUP BY au.user_id
        )
        SELECT
            ROUND(AVG(genre_avg_rating)::numeric, 2) as predicted_rating,
            ROUND(STDDEV(genre_avg_rating)::numeric, 2) as uncertainty,
            COUNT(*) as panel_members_with_data
        FROM panel_genre_preferences
    """

    result = execute_query_one(query, (panel_size, movie_id))

    if not result or result["panel_members_with_data"] == 0:
        raise HTTPException(
            status_code=404,
            detail="Could not generate prediction - insufficient data"
        )

    return {
        "movie_id": movie_id,
        "panel_size": panel_size,
        "prediction": {
            "rating": result["predicted_rating"],
            "uncertainty": result["uncertainty"],
            "panel_coverage": result["panel_members_with_data"],
        },
    }

@router.post("/similar-by-genres")
async def get_similar_by_genres(request: MoviePredictionRequest, limit: int = Query(6, ge=1, le=50)):
    if not request.genres:
        raise HTTPException(status_code=400, detail="At least one genre is required")

    query = """
        WITH target_genres AS (
            SELECT genre_id FROM genre WHERE name = ANY(%s)
        ),
        genre_similarity AS (
            SELECT
                m.movie_id,
                m.title,
                m.release_year,
                md.poster_path,
                COUNT(DISTINCT mg.genre_id) as matching_genres,
                (SELECT COUNT(*) FROM target_genres) as total_genres
            FROM movie m
            JOIN movie_genre mg ON m.movie_id = mg.movie_id
            LEFT JOIN movie_detail md ON m.movie_id = md.movie_id
            WHERE mg.genre_id IN (SELECT genre_id FROM target_genres)
            GROUP BY m.movie_id, md.poster_path
            HAVING COUNT(DISTINCT mg.genre_id) >= GREATEST(1, (SELECT COUNT(*) FROM target_genres) / 2)
        )
        SELECT
            gs.movie_id,
            gs.title,
            gs.release_year,
            gs.poster_path,
            gs.matching_genres,
            ROUND(100.0 * gs.matching_genres / gs.total_genres, 1) as genre_similarity_pct,
            ROUND(AVG(r.rating)::numeric, 2) as avg_rating,
            COUNT(r.rating_id) as rating_count
        FROM genre_similarity gs
        LEFT JOIN rating r ON gs.movie_id = r.movie_id
        GROUP BY gs.movie_id, gs.title, gs.release_year, gs.poster_path, gs.matching_genres, gs.total_genres
        ORDER BY genre_similarity_pct DESC, avg_rating DESC
        LIMIT %s
    """

    similar = execute_query(query, (request.genres, limit))

    if not similar:
        raise HTTPException(status_code=404, detail="No similar movies found for these genres")

    for item in similar:
        item["poster_url"] = build_poster_url(item.get("poster_path"))

    return {
        "genres": request.genres,
        "similar_movies": similar,
    }
