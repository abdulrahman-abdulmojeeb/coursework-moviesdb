from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional
import io

from app.database import execute_query, execute_query_one, get_db_connection
from app.helpers import build_poster_url

router = APIRouter()


@router.get("")
async def get_movies(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    title: Optional[str] = None,
    genre: Optional[str] = None,
    year_from: Optional[int] = None,
    year_to: Optional[int] = None,
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    sort_by: str = Query("title", regex="^(title|year|rating|weighted_rating)$"),
    sort_order: str = Query("asc", regex="^(asc|desc)$"),
    director: Optional[str] = None,
):
    offset = (page - 1) * limit

    # Build WHERE conditions (min_rating handled separately via weighted_rating post-filter)
    conditions = []
    base_params = []

    if title:
        conditions.append("m.title ILIKE %s")
        base_params.append(f"%{title}%")

    if genre:
        conditions.append("""
            m.movie_id IN (
                SELECT mg2.movie_id FROM movie_genre mg2
                JOIN genre g2 ON mg2.genre_id = g2.genre_id
                WHERE g2.name ILIKE %s
            )
        """)
        base_params.append(f"%{genre}%")

    if year_from:
        conditions.append("m.release_year >= %s")
        base_params.append(year_from)

    if year_to:
        conditions.append("m.release_year <= %s")
        base_params.append(year_to)

    if director:
        conditions.append("md.director ILIKE %s")
        base_params.append(f"%{director}%")

    where_clause = " AND ".join(conditions) if conditions else "1=1"

    # Sort configuration (no table aliases — used in outer query over subquery)
    sort_field_map = {
        "title": "title",
        "year": "release_year",
        "rating": "avg_rating",
        "weighted_rating": "weighted_rating",
    }
    sort_col = sort_field_map[sort_by]
    order_dir = sort_order.upper()

    # Base query with all computed fields
    base_query = f"""
        SELECT
            m.movie_id,
            m.title,
            m.release_year,
            m.imdb_id,
            m.tmdb_id,
            md.poster_path,
            md.overview,
            md.vote_average,
            md.vote_count,
            er.imdb_rating,
            er.imdb_votes,
            COALESCE(ra.avg_rating, 0) as avg_rating,
            COALESCE(ra.rating_count, 0) as rating_count,
            ARRAY_AGG(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL) as genres,
            ROUND(CAST(
              (CASE WHEN er.imdb_rating IS NOT NULL THEN 0.30 * er.imdb_rating / 2.0 ELSE 0 END
             + CASE WHEN md.vote_average IS NOT NULL AND md.vote_count >= 5 THEN 0.25 * md.vote_average / 2.0 ELSE 0 END
             + CASE WHEN er.rotten_tomatoes_score IS NOT NULL THEN 0.25 * er.rotten_tomatoes_score / 20.0 ELSE 0 END
             + CASE WHEN ra.avg_rating IS NOT NULL THEN
                 CASE WHEN ra.rating_count >= 5 THEN 0.10 ELSE 0.05 END * ra.avg_rating
               ELSE 0 END
             + CASE WHEN er.metacritic_score IS NOT NULL THEN 0.10 * er.metacritic_score / 20.0 ELSE 0 END)
             / NULLIF(
                CASE WHEN er.imdb_rating IS NOT NULL THEN 0.30 ELSE 0 END
              + CASE WHEN md.vote_average IS NOT NULL AND md.vote_count >= 5 THEN 0.25 ELSE 0 END
              + CASE WHEN er.rotten_tomatoes_score IS NOT NULL THEN 0.25 ELSE 0 END
              + CASE WHEN ra.avg_rating IS NOT NULL THEN
                  CASE WHEN ra.rating_count >= 5 THEN 0.10 ELSE 0.05 END
                ELSE 0 END
              + CASE WHEN er.metacritic_score IS NOT NULL THEN 0.10 ELSE 0 END
             , 0)
            AS NUMERIC), 2) as weighted_rating
        FROM movie m
        LEFT JOIN movie_detail md ON m.movie_id = md.movie_id
        LEFT JOIN external_ratings er ON m.movie_id = er.movie_id
        LEFT JOIN (
            SELECT movie_id, AVG(rating) as avg_rating, COUNT(rating_id) as rating_count
            FROM rating GROUP BY movie_id
        ) ra ON m.movie_id = ra.movie_id
        LEFT JOIN movie_genre mg ON m.movie_id = mg.movie_id
        LEFT JOIN genre g ON mg.genre_id = g.genre_id
        WHERE {where_clause}
        GROUP BY m.movie_id, md.poster_path, md.overview, md.vote_average, md.vote_count,
                 er.imdb_rating, er.imdb_votes, er.rotten_tomatoes_score, er.metacritic_score,
                 ra.avg_rating, ra.rating_count
    """

    # Outer filter for min_rating (applied to computed weighted_rating)
    outer_where = ""
    query_params = list(base_params)

    if min_rating is not None:
        outer_where = "WHERE weighted_rating >= %s"
        query_params.append(min_rating)

    # Main query: wrap base in subquery for post-filters, sorting, pagination
    query = f"""
        SELECT * FROM ({base_query}) base
        {outer_where}
        ORDER BY {sort_col} {order_dir} NULLS LAST
        LIMIT %s OFFSET %s
    """
    query_params.extend([limit, offset])

    movies = execute_query(query, tuple(query_params))

    # Add poster_url to each movie
    for movie in movies:
        movie["poster_url"] = build_poster_url(movie.get("poster_path"))

    # Count query
    if min_rating is not None:
        count_query = f"""
            SELECT COUNT(*) as count FROM ({base_query}) base
            WHERE weighted_rating >= %s
        """
        count_params = list(base_params) + [min_rating]
    else:
        count_query = f"""
            SELECT COUNT(DISTINCT m.movie_id)
            FROM movie m
            LEFT JOIN movie_detail md ON m.movie_id = md.movie_id
            LEFT JOIN movie_genre mg ON m.movie_id = mg.movie_id
            LEFT JOIN genre g ON mg.genre_id = g.genre_id
            WHERE {where_clause}
        """
        count_params = list(base_params)

    total_result = execute_query_one(count_query, tuple(count_params) if count_params else None)
    total = total_result["count"] if total_result else 0

    return {
        "movies": movies,
        "page": page,
        "limit": limit,
        "total": total,
        "pages": (total + limit - 1) // limit,
    }


@router.get("/export/enrichment.sql")
async def export_enrichment_sql():
    buf = io.BytesIO()

    with get_db_connection() as conn:
        cursor = conn.cursor()

        # movie_detail
        buf.write(b"TRUNCATE movie_detail;\n")
        buf.write(b"COPY movie_detail FROM stdin;\n")
        cursor.copy_to(buf, "movie_detail")
        buf.write(b"\\.\n")

        # external_ratings
        buf.write(b"TRUNCATE external_ratings;\n")
        buf.write(b"COPY external_ratings FROM stdin;\n")
        cursor.copy_to(buf, "external_ratings")
        buf.write(b"\\.\n")

        cursor.close()

    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/sql",
        headers={"Content-Disposition": "attachment; filename=enrichment.sql"},
    )


@router.get("/{movie_id}")
async def get_movie(movie_id: int):
    query = """
        SELECT
            m.movie_id,
            m.title,
            m.release_year,
            m.imdb_id,
            m.tmdb_id,
            md.poster_path,
            md.backdrop_path,
            md.overview,
            md.runtime,
            md.budget,
            md.revenue,
            md.popularity,
            md.vote_average,
            md.vote_count,
            md.director,
            md.lead_actors,
            er.imdb_rating,
            er.imdb_votes,
            er.rotten_tomatoes_score,
            er.metacritic_score,
            er.box_office,
            er.awards,
            er.rated,
            COALESCE(ra.avg_rating, 0) as avg_rating,
            COALESCE(ra.rating_count, 0) as rating_count,
            ARRAY_AGG(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL) as genres,
            ARRAY_AGG(DISTINCT t.tag_text) FILTER (WHERE t.tag_text IS NOT NULL) as tags,
            ROUND(CAST(
              (CASE WHEN er.imdb_rating IS NOT NULL THEN 0.30 * er.imdb_rating / 2.0 ELSE 0 END
             + CASE WHEN md.vote_average IS NOT NULL AND md.vote_count >= 5 THEN 0.25 * md.vote_average / 2.0 ELSE 0 END
             + CASE WHEN er.rotten_tomatoes_score IS NOT NULL THEN 0.25 * er.rotten_tomatoes_score / 20.0 ELSE 0 END
             + CASE WHEN ra.avg_rating IS NOT NULL THEN
                 CASE WHEN ra.rating_count >= 5 THEN 0.10 ELSE 0.05 END * ra.avg_rating
               ELSE 0 END
             + CASE WHEN er.metacritic_score IS NOT NULL THEN 0.10 * er.metacritic_score / 20.0 ELSE 0 END)
             / NULLIF(
                CASE WHEN er.imdb_rating IS NOT NULL THEN 0.30 ELSE 0 END
              + CASE WHEN md.vote_average IS NOT NULL AND md.vote_count >= 5 THEN 0.25 ELSE 0 END
              + CASE WHEN er.rotten_tomatoes_score IS NOT NULL THEN 0.25 ELSE 0 END
              + CASE WHEN ra.avg_rating IS NOT NULL THEN
                  CASE WHEN ra.rating_count >= 5 THEN 0.10 ELSE 0.05 END
                ELSE 0 END
              + CASE WHEN er.metacritic_score IS NOT NULL THEN 0.10 ELSE 0 END
             , 0)
            AS NUMERIC), 2) as weighted_rating
        FROM movie m
        LEFT JOIN movie_detail md ON m.movie_id = md.movie_id
        LEFT JOIN external_ratings er ON m.movie_id = er.movie_id
        LEFT JOIN (
            SELECT movie_id, AVG(rating) as avg_rating, COUNT(rating_id) as rating_count
            FROM rating GROUP BY movie_id
        ) ra ON m.movie_id = ra.movie_id
        LEFT JOIN movie_genre mg ON m.movie_id = mg.movie_id
        LEFT JOIN genre g ON mg.genre_id = g.genre_id
        LEFT JOIN tag t ON m.movie_id = t.movie_id
        WHERE m.movie_id = %s
        GROUP BY m.movie_id, md.poster_path, md.backdrop_path, md.overview,
                 md.runtime, md.budget, md.revenue, md.popularity,
                 md.vote_average, md.vote_count, md.director, md.lead_actors,
                 er.imdb_rating, er.imdb_votes, er.rotten_tomatoes_score,
                 er.metacritic_score, er.box_office, er.awards, er.rated,
                 ra.avg_rating, ra.rating_count
    """
    movie = execute_query_one(query, (movie_id,))

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    # Add poster URLs
    movie["poster_url"] = build_poster_url(movie.get("poster_path"))
    movie["backdrop_url"] = build_poster_url(movie.get("backdrop_path"))

    return movie


@router.get("/{movie_id}/ratings")
async def get_movie_ratings(movie_id: int):
    query = """
        WITH rating_counts AS (
            SELECT
                rating,
                COUNT(*) as count
            FROM rating
            WHERE movie_id = %s
            GROUP BY rating
        )
        SELECT
            rating,
            count,
            ROUND(100.0 * count / SUM(count) OVER(), 1) as percentage
        FROM rating_counts
        ORDER BY rating
    """
    distribution = execute_query(query, (movie_id,))

    stats_query = """
        SELECT
            ROUND(AVG(rating)::numeric, 2) as mean,
            ROUND(STDDEV(rating)::numeric, 2) as stddev,
            MIN(rating) as min,
            MAX(rating) as max,
            COUNT(*) as total
        FROM rating
        WHERE movie_id = %s
    """
    stats = execute_query_one(stats_query, (movie_id,))

    return {
        "movie_id": movie_id,
        "distribution": distribution,
        "stats": stats,
    }
