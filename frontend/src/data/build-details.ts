import {
  Server,
  Database,
  Globe,
  Layout,
  Shield,
  Container,
  Network,
  Cpu,
} from "lucide-react"
import { createElement } from "react"

export interface TechItem {
  name: string
  version?: string
  description: string
  link?: string
}

export interface StackSection {
  title: string
  icon: React.ReactNode
  description: string
  technologies: TechItem[]
}

export interface QueryInfo {
  name: string
  endpoint: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  description: string
  sql: string
}

export interface QueryCategory {
  name: string
  description: string
  queries: QueryInfo[]
}

export const stackSections: StackSection[] = [
  {
    title: "Frontend",
    icon: createElement(Layout, { className: "h-5 w-5" }),
    description: "Modern React-based single-page application with TypeScript",
    technologies: [
      { name: "React", version: "19", description: "Component-based UI library for building interactive user interfaces", link: "https://react.dev" },
      { name: "TypeScript", version: "5.9", description: "Typed superset of JavaScript for improved developer experience and code quality", link: "https://www.typescriptlang.org" },
      { name: "Vite", version: "7", description: "Next-generation frontend build tool with lightning-fast HMR and optimized production builds", link: "https://vitejs.dev" },
      { name: "React Router", version: "7.13", description: "Declarative routing for React applications with nested routes support", link: "https://reactrouter.com" },
      { name: "TanStack Query", version: "5.90", description: "Powerful asynchronous state management for data fetching, caching, and synchronization", link: "https://tanstack.com/query" },
      { name: "Tailwind CSS", version: "4", description: "Utility-first CSS framework for rapid UI development", link: "https://tailwindcss.com" },
      { name: "shadcn/ui", version: "latest", description: "Re-usable components built with Radix UI and Tailwind CSS", link: "https://ui.shadcn.com" },
      { name: "Radix UI", version: "latest", description: "Unstyled, accessible component primitives for React", link: "https://www.radix-ui.com" },
      { name: "Recharts", version: "3", description: "Composable charting library built on React components for data visualization", link: "https://recharts.org" },
      { name: "Lucide React", version: "0.577", description: "Beautiful and consistent icon library with 1000+ icons", link: "https://lucide.dev" },
      { name: "Axios", version: "1.13", description: "Promise-based HTTP client for API requests", link: "https://axios-http.com" },
    ],
  },
  {
    title: "Backend",
    icon: createElement(Server, { className: "h-5 w-5" }),
    description: "High-performance Python API server with async support",
    technologies: [
      { name: "Python", version: "3.13", description: "Modern Python runtime with performance improvements and better error messages", link: "https://www.python.org" },
      { name: "FastAPI", version: "0.135", description: "Modern, fast web framework for building APIs with automatic OpenAPI documentation", link: "https://fastapi.tiangolo.com" },
      { name: "Uvicorn", version: "0.41", description: "Lightning-fast ASGI server implementation using uvloop and httptools", link: "https://www.uvicorn.org" },
      { name: "Pydantic", version: "2.12", description: "Data validation using Python type annotations with high performance", link: "https://docs.pydantic.dev" },
      { name: "psycopg2", version: "2.9", description: "PostgreSQL database adapter for Python with connection pooling", link: "https://www.psycopg.org" },
      { name: "FastAPI Users", version: "15.0", description: "Ready-to-use user registration and authentication system for FastAPI", link: "https://fastapi-users.github.io/fastapi-users" },
      { name: "python-jose", version: "3.3", description: "JavaScript Object Signing and Encryption (JOSE) implementation for JWT tokens", link: "https://python-jose.readthedocs.io" },
      { name: "passlib + bcrypt", version: "4.1", description: "Password hashing with bcrypt for secure authentication", link: "https://passlib.readthedocs.io" },
      { name: "httpx", version: "0.28", description: "Async HTTP client for making requests to external APIs (TMDB, OMDb)", link: "https://www.python-httpx.org" },
      { name: "pandas", version: "3.0", description: "Data processing library used for dataset import and transformation", link: "https://pandas.pydata.org" },
    ],
  },
  {
    title: "Database",
    icon: createElement(Database, { className: "h-5 w-5" }),
    description: "Robust relational database with advanced SQL features",
    technologies: [
      { name: "PostgreSQL", version: "18-alpine", description: "Advanced open-source relational database with ACID compliance and JSON support", link: "https://www.postgresql.org" },
      { name: "pgAdmin 4", version: "latest", description: "Web-based PostgreSQL administration and development platform", link: "https://www.pgadmin.org" },
    ],
  },
  {
    title: "Containerization & Orchestration",
    icon: createElement(Container, { className: "h-5 w-5" }),
    description: "Container-based deployment for consistency across environments",
    technologies: [
      { name: "Docker", version: "24.x", description: "Container platform for packaging applications with all dependencies", link: "https://www.docker.com" },
      { name: "Docker Compose", version: "2.x", description: "Multi-container orchestration tool for defining and running applications", link: "https://docs.docker.com/compose" },
      { name: "Alpine Linux", version: "3.x", description: "Minimal Docker base images for reduced container size and attack surface", link: "https://alpinelinux.org" },
    ],
  },
  {
    title: "Web Server & Networking",
    icon: createElement(Network, { className: "h-5 w-5" }),
    description: "Production-grade reverse proxy with SSL termination",
    technologies: [
      { name: "Nginx", version: "alpine", description: "High-performance HTTP server and reverse proxy for static file serving and API proxying", link: "https://nginx.org" },
      { name: "Let's Encrypt", version: "latest", description: "Free, automated SSL/TLS certificate authority for HTTPS", link: "https://letsencrypt.org" },
      { name: "Certbot", version: "latest", description: "Automatic certificate management and renewal tool", link: "https://certbot.eff.org" },
      { name: "Cloudflare DNS", version: "N/A", description: "DNS management with DDoS protection and CDN capabilities", link: "https://www.cloudflare.com" },
    ],
  },
  {
    title: "Security",
    icon: createElement(Shield, { className: "h-5 w-5" }),
    description: "Multi-layered security implementation",
    technologies: [
      { name: "JWT Authentication", version: "N/A", description: "Stateless authentication using JSON Web Tokens with access/refresh token rotation" },
      { name: "bcrypt", version: "N/A", description: "Adaptive password hashing algorithm with configurable work factor" },
      { name: "CORS", version: "N/A", description: "Cross-Origin Resource Sharing restricted to production domain" },
      { name: "Input Validation", version: "N/A", description: "Pydantic models with Field constraints (ge, le, max_length, regex) on all endpoints" },
      { name: "UFW Firewall", version: "N/A", description: "Uncomplicated Firewall for server-level network protection" },
    ],
  },
  {
    title: "External APIs",
    icon: createElement(Globe, { className: "h-5 w-5" }),
    description: "Third-party data sources and integrations",
    technologies: [
      { name: "TMDB API", version: "3", description: "The Movie Database API for movie metadata, posters, backdrops, and cast information", link: "https://www.themoviedb.org/documentation/api" },
      { name: "OMDb API", version: "1", description: "Open Movie Database API for IMDb ratings, Rotten Tomatoes scores, Metacritic scores, and awards", link: "https://www.omdbapi.com" },
      { name: "MovieLens Dataset", version: "ml-latest-small", description: "Research dataset with 100,000 ratings from 600 users across 9,700 movies", link: "https://grouplens.org/datasets/movielens" },
      { name: "GroupLens Personality", version: "synthetic", description: "Big Five personality trait data mapped to MovieLens users for personality-based analysis", link: "https://grouplens.org/datasets" },
    ],
  },
  {
    title: "Development & CI/CD",
    icon: createElement(Cpu, { className: "h-5 w-5" }),
    description: "Tools and automation for development workflow",
    technologies: [
      { name: "Bun", version: "1.x", description: "Fast JavaScript runtime, package manager, and bundler", link: "https://bun.sh" },
      { name: "ESLint", version: "10", description: "Static code analysis tool for identifying problematic patterns", link: "https://eslint.org" },
      { name: "GitHub Actions", version: "N/A", description: "CI/CD pipeline for automatic deployment on push to main via SSH", link: "https://github.com/features/actions" },
      { name: "Git", version: "2.x", description: "Distributed version control system for source code management", link: "https://git-scm.com" },
    ],
  },
]

export const architectureDetails = [
  { layer: "Presentation Layer", components: "React 19 SPA, Tailwind CSS 4, shadcn/ui, Recharts 3", responsibility: "User interface rendering, client-side routing, data visualization, form validation" },
  { layer: "API Gateway", components: "Nginx reverse proxy (Alpine)", responsibility: "SSL termination, request routing, static file serving, API proxying" },
  { layer: "Application Layer", components: "FastAPI 0.135, Uvicorn ASGI server", responsibility: "Business logic, JWT authentication, request validation, rate limiting" },
  { layer: "Data Access Layer", components: "psycopg2, parameterized SQL queries", responsibility: "Connection pooling, query execution, data transformation" },
  { layer: "Persistence Layer", components: "PostgreSQL 18", responsibility: "Data storage, indexing, ACID transactions, referential integrity" },
]

export const databaseSchema = [
  { table: "movie", records: "9,742", description: "Core movie catalog with title, release year, TMDB/IMDb IDs" },
  { table: "movie_detail", records: "9,617", description: "Extended TMDB metadata: poster, backdrop, runtime, director, cast, budget, revenue" },
  { table: "external_ratings", records: "~8,500", description: "IMDb ratings, Rotten Tomatoes scores, Metacritic scores, awards (from OMDb)" },
  { table: "rating", records: "100,836", description: "MovieLens user ratings on 0.5\u20135 scale with timestamps" },
  { table: "ml_user", records: "610", description: "MovieLens user accounts" },
  { table: "genre", records: "20", description: "Movie genre categories (Action, Comedy, Drama, etc.)" },
  { table: "movie_genre", records: "22,084", description: "Movie-genre associations (M:N relationship)" },
  { table: "tag", records: "3,683", description: "User-generated movie tags with timestamps" },
  { table: "personality_dataset_user", records: "610", description: "Big Five personality traits (openness, agreeableness, etc.) on 1\u20137 scale" },
  { table: "personality_predicted_rating", records: "~500,000", description: "Predicted ratings per user-movie pair used for personality-based analysis" },
  { table: "app_user", records: "variable", description: "Application user accounts (registration, hashed passwords)" },
  { table: "app_user_rating", records: "variable", description: "Ratings submitted by app users (0.5\u20135 scale, upsert on conflict)" },
  { table: "personality_app_user", records: "variable", description: "Personality traits for app users (self-reported)" },
  { table: "movie_collection", records: "variable", description: "User-created movie collections with title and notes" },
  { table: "collection_item", records: "variable", description: "Movies in collections with added_at timestamps" },
]

export const queryCategories: QueryCategory[] = [
  {
    name: "Movies",
    description: "Movie catalogue, details, and weighted rating computation",
    queries: [
      {
        name: "Get Movies (Paginated with Weighted Rating)",
        endpoint: "GET /api/movies",
        method: "GET",
        description: "Retrieves paginated movies with filters (title, genre, year range, director, min rating). Computes a weighted rating from IMDb (30%), TMDB (25%), Rotten Tomatoes (25%), MovieLens (10%), and Metacritic (10%). Min rating filter is applied as a post-filter on the computed weighted_rating.",
        sql: `SELECT m.movie_id, m.title, m.release_year, m.imdb_id, m.tmdb_id,
    md.poster_path, md.overview, md.vote_average, md.vote_count,
    er.imdb_rating, er.imdb_votes,
    COALESCE(ra.avg_rating, 0) as avg_rating,
    COALESCE(ra.rating_count, 0) as rating_count,
    ARRAY_AGG(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL) as genres,
    ROUND(CAST(
      (CASE WHEN er.imdb_rating IS NOT NULL THEN 0.30 * er.imdb_rating / 2.0 ELSE 0 END
     + CASE WHEN md.vote_average IS NOT NULL AND md.vote_count >= 5
           THEN 0.25 * md.vote_average / 2.0 ELSE 0 END
     + CASE WHEN er.rotten_tomatoes_score IS NOT NULL
           THEN 0.25 * er.rotten_tomatoes_score / 20.0 ELSE 0 END
     + CASE WHEN ra.avg_rating IS NOT NULL THEN
         CASE WHEN ra.rating_count >= 5 THEN 0.10 ELSE 0.05 END * ra.avg_rating
       ELSE 0 END
     + CASE WHEN er.metacritic_score IS NOT NULL
           THEN 0.10 * er.metacritic_score / 20.0 ELSE 0 END)
     / NULLIF(/* sum of active weights */, 0)
    AS NUMERIC), 2) as weighted_rating
FROM movie m
LEFT JOIN movie_detail md ON m.movie_id = md.movie_id
LEFT JOIN external_ratings er ON m.movie_id = er.movie_id
LEFT JOIN (SELECT movie_id, AVG(rating) as avg_rating,
           COUNT(rating_id) as rating_count
           FROM rating GROUP BY movie_id) ra ON m.movie_id = ra.movie_id
LEFT JOIN movie_genre mg ON m.movie_id = mg.movie_id
LEFT JOIN genre g ON mg.genre_id = g.genre_id
WHERE {dynamic_filters}
GROUP BY m.movie_id, md.poster_path, md.overview, md.vote_average,
         md.vote_count, er.imdb_rating, er.imdb_votes,
         er.rotten_tomatoes_score, er.metacritic_score,
         ra.avg_rating, ra.rating_count
-- Wrapped in subquery for post-filter and pagination:
-- WHERE weighted_rating >= %s ORDER BY {sort_col} LIMIT %s OFFSET %s`,
      },
      {
        name: "Get Movie Details",
        endpoint: "GET /api/movies/{id}",
        method: "GET",
        description: "Retrieves full movie details including TMDB metadata, external ratings (IMDb, Rotten Tomatoes, Metacritic), tags, genres, and computed weighted rating.",
        sql: `SELECT m.movie_id, m.title, m.release_year, m.imdb_id, m.tmdb_id,
    md.poster_path, md.backdrop_path, md.overview, md.runtime,
    md.budget, md.revenue, md.popularity, md.vote_average,
    md.vote_count, md.director, md.lead_actors,
    er.imdb_rating, er.imdb_votes, er.rotten_tomatoes_score,
    er.metacritic_score, er.box_office, er.awards, er.rated,
    COALESCE(ra.avg_rating, 0) as avg_rating,
    COALESCE(ra.rating_count, 0) as rating_count,
    ARRAY_AGG(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL) as genres,
    ARRAY_AGG(DISTINCT t.tag_text) FILTER (WHERE t.tag_text IS NOT NULL) as tags,
    ROUND(CAST(/* weighted rating formula */ AS NUMERIC), 2) as weighted_rating
FROM movie m
LEFT JOIN movie_detail md ON m.movie_id = md.movie_id
LEFT JOIN external_ratings er ON m.movie_id = er.movie_id
LEFT JOIN (SELECT movie_id, AVG(rating) as avg_rating,
           COUNT(rating_id) as rating_count
           FROM rating GROUP BY movie_id) ra ON m.movie_id = ra.movie_id
LEFT JOIN movie_genre mg ON m.movie_id = mg.movie_id
LEFT JOIN genre g ON mg.genre_id = g.genre_id
LEFT JOIN tag t ON m.movie_id = t.movie_id
WHERE m.movie_id = %s
GROUP BY m.movie_id, md.poster_path, md.backdrop_path, md.overview,
         md.runtime, md.budget, md.revenue, md.popularity,
         md.vote_average, md.vote_count, md.director, md.lead_actors,
         er.imdb_rating, er.imdb_votes, er.rotten_tomatoes_score,
         er.metacritic_score, er.box_office, er.awards, er.rated,
         ra.avg_rating, ra.rating_count`,
      },
      {
        name: "Get Movie Rating Distribution",
        endpoint: "GET /api/movies/{id}/ratings",
        method: "GET",
        description: "Returns per-rating count, percentage, and aggregate stats (mean, stddev, min, max) for a specific movie.",
        sql: `WITH rating_counts AS (
    SELECT rating, COUNT(*) as count
    FROM rating WHERE movie_id = %s
    GROUP BY rating
)
SELECT rating, count,
    ROUND(100.0 * count / SUM(count) OVER(), 1) as percentage
FROM rating_counts ORDER BY rating

-- Plus stats query:
SELECT ROUND(AVG(rating)::numeric, 2) as mean,
    ROUND(STDDEV(rating)::numeric, 2) as stddev,
    MIN(rating) as min, MAX(rating) as max, COUNT(*) as total
FROM rating WHERE movie_id = %s`,
      },
    ],
  },
  {
    name: "Genres",
    description: "Genre popularity, polarisation, and analysis",
    queries: [
      {
        name: "Get All Genres",
        endpoint: "GET /api/genres",
        method: "GET",
        description: "Lists all genres with their movie counts, sorted alphabetically.",
        sql: `SELECT g.genre_id, g.name, COUNT(mg.movie_id) as movie_count
FROM genre g
LEFT JOIN movie_genre mg ON g.genre_id = mg.genre_id
GROUP BY g.genre_id ORDER BY g.name`,
      },
      {
        name: "Genre Popularity Report",
        endpoint: "GET /api/genres/popularity",
        method: "GET",
        description: "Ranks genres by average rating, including total ratings, movie count, and rating standard deviation.",
        sql: `SELECT g.name as genre,
    COUNT(DISTINCT r.rating_id) as total_ratings,
    COUNT(DISTINCT mg.movie_id) as movie_count,
    ROUND(AVG(r.rating)::numeric, 2) as avg_rating,
    ROUND(STDDEV(r.rating)::numeric, 2) as rating_stddev
FROM genre g
JOIN movie_genre mg ON g.genre_id = mg.genre_id
JOIN rating r ON mg.movie_id = r.movie_id
GROUP BY g.genre_id, g.name ORDER BY avg_rating DESC`,
      },
      {
        name: "Genre Polarisation",
        endpoint: "GET /api/genres/polarisation",
        method: "GET",
        description: "Identifies polarising genres by computing low/mid/high rating percentages and standard deviation as a polarisation score.",
        sql: `WITH genre_raw AS (
    SELECT g.name as genre, r.rating
    FROM genre g
    JOIN movie_genre mg ON g.genre_id = mg.genre_id
    JOIN rating r ON mg.movie_id = r.movie_id
)
SELECT genre, COUNT(*) as total_ratings,
    ROUND(100.0 * SUM(CASE WHEN rating <= 2 THEN 1 ELSE 0 END)
          / COUNT(*), 1) as low_pct,
    ROUND(100.0 * SUM(CASE WHEN rating > 2 AND rating < 4 THEN 1 ELSE 0 END)
          / COUNT(*), 1) as mid_pct,
    ROUND(100.0 * SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END)
          / COUNT(*), 1) as high_pct,
    ROUND(STDDEV(rating)::numeric, 3) as polarisation_score
FROM genre_raw
GROUP BY genre HAVING COUNT(*) >= 100
ORDER BY polarisation_score DESC`,
      },
    ],
  },
  {
    name: "Rating Patterns",
    description: "Analysis of viewer rating behaviors, low-rater patterns, and cross-genre preferences",
    queries: [
      {
        name: "Rating Profile",
        endpoint: "GET /api/ratings/profile",
        method: "GET",
        description: "Global rating statistics: total ratings, unique users/movies, mean, min/max, stddev, and full rating distribution with percentages.",
        sql: `SELECT COUNT(*) as total_ratings,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT movie_id) as unique_movies,
    ROUND(AVG(rating)::numeric, 2) as mean_rating,
    MIN(rating) as min_rating, MAX(rating) as max_rating,
    ROUND(STDDEV(rating)::numeric, 2) as stddev_rating
FROM rating

-- Plus distribution:
SELECT rating, COUNT(*) as count,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) as percentage
FROM rating GROUP BY rating ORDER BY rating`,
      },
      {
        name: "User Rating Patterns by Genre",
        endpoint: "GET /api/ratings/patterns",
        method: "GET",
        description: "Aggregates per-user genre averages (minimum 5 ratings per genre), then computes mean and stddev of those averages per genre.",
        sql: `WITH user_genre_ratings AS (
    SELECT r.user_id, g.name as genre,
        AVG(r.rating) as avg_rating, COUNT(*) as rating_count
    FROM rating r
    JOIN movie_genre mg ON r.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
    GROUP BY r.user_id, g.name HAVING COUNT(*) >= 5
)
SELECT genre, COUNT(DISTINCT user_id) as user_count,
    ROUND(AVG(avg_rating)::numeric, 2) as mean_user_avg,
    ROUND(STDDEV(avg_rating)::numeric, 2) as stddev_user_avg
FROM user_genre_ratings GROUP BY genre ORDER BY mean_user_avg DESC`,
      },
      {
        name: "Low Rater Categories",
        endpoint: "GET /api/ratings/low-raters",
        method: "GET",
        description: "Categorizes users with 20+ ratings into harsh critics (avg \u2264 2.5), balanced raters, and generous raters (avg \u2265 4.0).",
        sql: `WITH user_rating_stats AS (
    SELECT user_id, AVG(rating) as overall_avg,
        STDDEV(rating) as rating_stddev, COUNT(*) as total_ratings
    FROM rating GROUP BY user_id HAVING COUNT(*) >= 20
),
user_categories AS (
    SELECT *, CASE
        WHEN overall_avg <= 2.5 THEN 'harsh_critic'
        WHEN overall_avg >= 4.0 THEN 'generous_rater'
        ELSE 'balanced_rater'
    END as rater_type
    FROM user_rating_stats
)
SELECT rater_type, COUNT(*) as user_count,
    ROUND(AVG(overall_avg)::numeric, 2) as avg_rating,
    ROUND(AVG(rating_stddev)::numeric, 2) as avg_stddev,
    ROUND(AVG(total_ratings)::numeric, 0) as avg_total_ratings
FROM user_categories GROUP BY rater_type ORDER BY avg_rating`,
      },
      {
        name: "Harsh Critics vs Overall by Genre",
        endpoint: "GET /api/ratings/low-rater-genres",
        method: "GET",
        description: "Compares average ratings from harsh critics (avg \u2264 2.5, 20+ ratings) against overall averages per genre, showing whether low-raters are consistently harsh across all genres or only specific ones.",
        sql: `WITH harsh_critics AS (
    SELECT user_id FROM rating
    GROUP BY user_id
    HAVING COUNT(*) >= 20 AND AVG(rating) <= 2.5
),
harsh_genre_avg AS (
    SELECT g.name as genre,
        ROUND(AVG(r.rating)::numeric, 2) as harsh_avg,
        COUNT(*) as harsh_rating_count
    FROM rating r
    JOIN movie_genre mg ON r.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
    WHERE r.user_id IN (SELECT user_id FROM harsh_critics)
    GROUP BY g.name HAVING COUNT(*) >= 10
),
overall_genre_avg AS (
    SELECT g.name as genre,
        ROUND(AVG(r.rating)::numeric, 2) as overall_avg,
        COUNT(*) as overall_rating_count
    FROM rating r
    JOIN movie_genre mg ON r.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
    GROUP BY g.name
)
SELECT o.genre, h.harsh_avg, o.overall_avg,
    ROUND((o.overall_avg - h.harsh_avg)::numeric, 2) as gap
FROM overall_genre_avg o
JOIN harsh_genre_avg h ON o.genre = h.genre
ORDER BY h.harsh_avg ASC`,
      },
      {
        name: "Cross-Genre Preferences",
        endpoint: "GET /api/ratings/cross-genre",
        method: "GET",
        description: "Finds which genres fans of a given genre also enjoy. Fans are users with high avg ratings (\u2265 4.0) and sufficient ratings in the source genre.",
        sql: `WITH genre_lovers AS (
    SELECT DISTINCT r.user_id FROM rating r
    JOIN movie_genre mg ON r.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
    WHERE g.name ILIKE %s GROUP BY r.user_id
    HAVING COUNT(*) >= %s AND AVG(r.rating) >= 4.0
),
other_genre_ratings AS (
    SELECT g.name as genre, AVG(r.rating) as avg_rating,
        COUNT(*) as rating_count
    FROM rating r
    JOIN movie_genre mg ON r.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
    WHERE r.user_id IN (SELECT user_id FROM genre_lovers)
      AND g.name NOT ILIKE %s
    GROUP BY g.name
)
SELECT genre, ROUND(avg_rating::numeric, 2) as avg_rating, rating_count
FROM other_genre_ratings
WHERE rating_count >= 50 ORDER BY avg_rating DESC`,
      },
      {
        name: "Cross-Genre Rejection",
        endpoint: "GET /api/ratings/cross-genre-negative",
        method: "GET",
        description: "Inverse of cross-genre preferences: finds how users who dislike a genre (avg \u2264 2.0) rate other genres.",
        sql: `WITH genre_haters AS (
    SELECT DISTINCT r.user_id FROM rating r
    JOIN movie_genre mg ON r.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
    WHERE g.name ILIKE %s GROUP BY r.user_id
    HAVING COUNT(*) >= %s AND AVG(r.rating) <= 2.0
),
other_genre_ratings AS (
    SELECT g.name as genre, AVG(r.rating) as avg_rating,
        COUNT(*) as rating_count
    FROM rating r
    JOIN movie_genre mg ON r.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
    WHERE r.user_id IN (SELECT user_id FROM genre_haters)
      AND g.name NOT ILIKE %s
    GROUP BY g.name
)
SELECT genre, ROUND(avg_rating::numeric, 2) as avg_rating, rating_count
FROM other_genre_ratings
WHERE rating_count >= 50 ORDER BY avg_rating ASC`,
      },
      {
        name: "Rating Consistency",
        endpoint: "GET /api/ratings/consistency",
        method: "GET",
        description: "Groups users by consistency level based on their rating stddev. Optional genre filter. Users need 10+ ratings.",
        sql: `WITH user_genre_consistency AS (
    SELECT r.user_id,
        STDDEV(r.rating) as rating_consistency,
        COUNT(*) as rating_count, AVG(r.rating) as avg_rating
    FROM rating r
    {optional: JOIN movie_genre/genre WHERE g.name ILIKE %s}
    GROUP BY r.user_id HAVING COUNT(*) >= 10
)
SELECT CASE
    WHEN rating_consistency < 0.5 THEN 'very_consistent'
    WHEN rating_consistency < 1.0 THEN 'consistent'
    WHEN rating_consistency < 1.5 THEN 'varied'
    ELSE 'highly_varied'
END as consistency_level,
    COUNT(*) as user_count,
    ROUND(AVG(avg_rating)::numeric, 2) as mean_avg_rating
FROM user_genre_consistency
GROUP BY consistency_level ORDER BY consistency_level`,
      },
    ],
  },
  {
    name: "Predictions",
    description: "Genre-based rating prediction with optional preview panel, and similar movie discovery",
    queries: [
      {
        name: "Predict Rating (with Optional Preview Panel)",
        endpoint: "POST /api/predictions/predict",
        method: "POST",
        description: "Predicts ratings for a hypothetical movie by genre. Finds top 50 similar movies (50%+ genre overlap), then averages their ratings weighted by genre similarity. Optional panel_size parameter restricts to a diverse subset of frequent raters (50+ ratings, stddev > 0.5) instead of all users.",
        sql: `WITH preview_panel AS (
    -- Optional: only when panel_size is provided
    SELECT user_id FROM rating
    GROUP BY user_id
    HAVING COUNT(*) >= 50 AND STDDEV(rating) > 0.5
    ORDER BY RANDOM() LIMIT %s
),
target_genres AS (
    SELECT genre_id FROM genre WHERE name = ANY(%s)
),
similar_movies AS (
    SELECT m.movie_id, COUNT(DISTINCT mg.genre_id) as matching_genres,
        (SELECT COUNT(*) FROM target_genres) as total_target_genres
    FROM movie m
    JOIN movie_genre mg ON m.movie_id = mg.movie_id
    WHERE mg.genre_id IN (SELECT genre_id FROM target_genres)
    GROUP BY m.movie_id
    HAVING COUNT(DISTINCT mg.genre_id) >= GREATEST(1, (SELECT COUNT(*) FROM target_genres) / 2)
    ORDER BY matching_genres DESC LIMIT 50
),
similar_ratings AS (
    SELECT r.rating, r.user_id,
        sm.matching_genres::float / sm.total_target_genres as genre_similarity
    FROM similar_movies sm
    JOIN rating r ON sm.movie_id = r.movie_id
    WHERE 1=1 {AND r.user_id IN (SELECT user_id FROM preview_panel)}
)
SELECT ROUND(AVG(rating)::numeric, 2) as predicted_rating,
    ROUND(STDDEV(rating)::numeric, 2) as uncertainty,
    COUNT(*) as based_on_ratings,
    ROUND((AVG(rating * genre_similarity)
        / NULLIF(AVG(genre_similarity), 0))::numeric, 2) as weighted_prediction,
    COUNT(DISTINCT user_id) as unique_users
FROM similar_ratings`,
      },
      {
        name: "Find Similar Movies by Movie ID",
        endpoint: "GET /api/predictions/similar/{id}",
        method: "GET",
        description: "Finds movies with overlapping genres to a target movie, ranked by genre similarity percentage and average rating.",
        sql: `WITH target_genres AS (
    SELECT genre_id FROM movie_genre WHERE movie_id = %s
),
genre_similarity AS (
    SELECT m.movie_id, m.title, m.release_year, md.poster_path,
        COUNT(DISTINCT mg.genre_id) as matching_genres,
        (SELECT COUNT(*) FROM target_genres) as total_genres
    FROM movie m
    JOIN movie_genre mg ON m.movie_id = mg.movie_id
    LEFT JOIN movie_detail md ON m.movie_id = md.movie_id
    WHERE mg.genre_id IN (SELECT genre_id FROM target_genres)
      AND m.movie_id != %s
    GROUP BY m.movie_id, md.poster_path
)
SELECT gs.*, ROUND(100.0 * gs.matching_genres / gs.total_genres, 1)
        as genre_similarity_pct,
    ROUND(AVG(r.rating)::numeric, 2) as avg_rating,
    COUNT(r.rating_id) as rating_count
FROM genre_similarity gs
LEFT JOIN rating r ON gs.movie_id = r.movie_id
GROUP BY gs.movie_id, gs.title, gs.release_year, gs.poster_path,
         gs.matching_genres, gs.total_genres
ORDER BY genre_similarity_pct DESC, avg_rating DESC LIMIT %s`,
      },
      {
        name: "Find Similar Movies by Genre List",
        endpoint: "POST /api/predictions/similar-by-genres",
        method: "POST",
        description: "Like similar-by-ID but accepts a list of genre names directly. Used on the predictions page to show example movies matching selected genres.",
        sql: `WITH target_genres AS (
    SELECT genre_id FROM genre WHERE name = ANY(%s)
),
genre_similarity AS (
    SELECT m.movie_id, m.title, m.release_year, md.poster_path,
        COUNT(DISTINCT mg.genre_id) as matching_genres,
        (SELECT COUNT(*) FROM target_genres) as total_genres
    FROM movie m
    JOIN movie_genre mg ON m.movie_id = mg.movie_id
    LEFT JOIN movie_detail md ON m.movie_id = md.movie_id
    WHERE mg.genre_id IN (SELECT genre_id FROM target_genres)
    GROUP BY m.movie_id, md.poster_path
    HAVING COUNT(DISTINCT mg.genre_id) >=
        GREATEST(1, (SELECT COUNT(*) FROM target_genres) / 2)
)
SELECT gs.*, ROUND(100.0 * gs.matching_genres / gs.total_genres, 1)
        as genre_similarity_pct,
    ROUND(AVG(r.rating)::numeric, 2) as avg_rating
FROM genre_similarity gs
LEFT JOIN rating r ON gs.movie_id = r.movie_id
GROUP BY gs.movie_id, gs.title, gs.release_year, gs.poster_path,
         gs.matching_genres, gs.total_genres
ORDER BY genre_similarity_pct DESC, avg_rating DESC LIMIT %s`,
      },
      {
        name: "Preview Panel Prediction (by Movie)",
        endpoint: "GET /api/predictions/preview-panel",
        method: "GET",
        description: "Selects a random diverse panel of active users (50+ ratings, stddev > 0.5) and predicts how they would rate a specific movie based on their genre preferences.",
        sql: `WITH active_users AS (
    SELECT user_id, AVG(rating) as avg_rating,
        STDDEV(rating) as rating_variance, COUNT(*) as rating_count
    FROM rating GROUP BY user_id
    HAVING COUNT(*) >= 50 AND STDDEV(rating) > 0.5
    ORDER BY RANDOM() LIMIT %s
),
target_movie_genres AS (
    SELECT genre_id FROM movie_genre WHERE movie_id = %s
),
panel_genre_preferences AS (
    SELECT au.user_id, AVG(r.rating) as genre_avg_rating
    FROM active_users au
    JOIN rating r ON au.user_id = r.user_id
    JOIN movie_genre mg ON r.movie_id = mg.movie_id
    WHERE mg.genre_id IN (SELECT genre_id FROM target_movie_genres)
    GROUP BY au.user_id
)
SELECT ROUND(AVG(genre_avg_rating)::numeric, 2) as predicted_rating,
    ROUND(STDDEV(genre_avg_rating)::numeric, 2) as uncertainty,
    COUNT(*) as panel_members_with_data
FROM panel_genre_preferences`,
      },
    ],
  },
  {
    name: "Personality",
    description: "Big Five personality traits and their correlation with viewing preferences",
    queries: [
      {
        name: "Get Personality Traits",
        endpoint: "GET /api/personality/traits",
        method: "GET",
        description: "Returns Big Five personality trait statistics (mean, stddev, min, max) on a 1\u20137 scale using LATERAL unnest for a compact single-query approach.",
        sql: `SELECT trait,
    ROUND(AVG(val)::numeric, 2) AS mean,
    ROUND(STDDEV(val)::numeric, 2) AS stddev,
    MIN(val) AS min, MAX(val) AS max, 7 AS scale
FROM personality_dataset_user,
    LATERAL unnest(
        ARRAY['openness','agreeableness','emotional_stability',
              'conscientiousness','extraversion'],
        ARRAY[openness, agreeableness, emotional_stability,
              conscientiousness, extraversion]
    ) AS t(trait, val)
GROUP BY trait ORDER BY trait`,
      },
      {
        name: "Trait-Genre Correlation",
        endpoint: "GET /api/personality/genre-correlation",
        method: "GET",
        description: "Shows how users scoring high or low on a specific personality trait rate different genres, using predicted ratings from the personality dataset.",
        sql: `-- Dataset mean is computed dynamically for the split threshold
WITH trait_users AS (
    SELECT id AS personality_user_id
    FROM personality_dataset_user
    WHERE {trait} {>= dataset_mean | < dataset_mean}
),
trait_genre_ratings AS (
    SELECT g.name AS genre,
        AVG(ppr.predicted_rating) AS avg_rating,
        COUNT(*) AS rating_count
    FROM trait_users tu
    JOIN personality_predicted_rating ppr
        ON tu.personality_user_id = ppr.personality_user_id
    JOIN movie_genre mg ON ppr.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
    GROUP BY g.name HAVING COUNT(*) >= 10
)
SELECT genre, ROUND(avg_rating::numeric, 2) AS avg_rating, rating_count
FROM trait_genre_ratings ORDER BY avg_rating DESC`,
      },
      {
        name: "Genre Personality Profile",
        endpoint: "GET /api/personality/genre-traits",
        method: "GET",
        description: "Shows the average personality profile of users who love a specific genre (avg predicted rating \u2265 4.0, 3+ films), compared to the overall population average.",
        sql: `WITH genre_lovers AS (
    SELECT DISTINCT ppr.personality_user_id
    FROM personality_predicted_rating ppr
    JOIN movie_genre mg ON ppr.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
    WHERE g.name ILIKE %s
    GROUP BY ppr.personality_user_id
    HAVING AVG(ppr.predicted_rating) >= 4.0 AND COUNT(*) >= 3
)
SELECT
    ROUND(AVG(p.openness)::numeric, 2) AS avg_openness,
    ROUND(AVG(p.agreeableness)::numeric, 2) AS avg_agreeableness,
    ROUND(AVG(p.emotional_stability)::numeric, 2) AS avg_emotional_stability,
    ROUND(AVG(p.conscientiousness)::numeric, 2) AS avg_conscientiousness,
    ROUND(AVG(p.extraversion)::numeric, 2) AS avg_extraversion,
    COUNT(*) AS user_count
FROM genre_lovers gl
JOIN personality_dataset_user p ON gl.personality_user_id = p.id`,
      },
      {
        name: "Viewer Segments",
        endpoint: "GET /api/personality/segments",
        method: "GET",
        description: "Clusters users into personality segments (adventurous_social, social_traditional, curious_introvert, traditional_introvert, balanced) and shows top genre preferences per segment.",
        sql: `WITH user_segments AS (
    SELECT id AS personality_user_id,
        CASE
            WHEN extraversion >= 5.5 AND openness >= 5.5 THEN 'adventurous_social'
            WHEN extraversion >= 5.5 AND openness < 3.5 THEN 'social_traditional'
            WHEN extraversion < 3.5 AND openness >= 5.5 THEN 'curious_introvert'
            WHEN extraversion < 3.5 AND openness < 3.5 THEN 'traditional_introvert'
            ELSE 'balanced'
        END AS segment
    FROM personality_dataset_user
),
segment_preferences AS (
    SELECT us.segment, g.name AS genre,
        ROUND(AVG(ppr.predicted_rating)::numeric, 2) AS avg_rating,
        COUNT(*) AS rating_count
    FROM user_segments us
    JOIN personality_predicted_rating ppr
        ON us.personality_user_id = ppr.personality_user_id
    JOIN movie_genre mg ON ppr.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
    GROUP BY us.segment, g.name HAVING COUNT(*) >= 10
)
SELECT segment, json_agg(
    json_build_object('genre', genre, 'avg_rating', avg_rating,
        'rating_count', rating_count)
    ORDER BY avg_rating DESC
) AS genres
FROM segment_preferences GROUP BY segment ORDER BY segment`,
      },
    ],
  },
  {
    name: "Collections",
    description: "User-curated movie collection management (authenticated)",
    queries: [
      {
        name: "Get User Collections",
        endpoint: "GET /api/collections",
        method: "GET",
        description: "Retrieves all collections for the authenticated user with movie counts.",
        sql: `SELECT c.collection_id, c.title, c.note, c.created_at,
    COUNT(ci.item_id) as movie_count
FROM movie_collection c
LEFT JOIN collection_item ci ON c.collection_id = ci.collection_id
WHERE c.user_id = %s
GROUP BY c.collection_id ORDER BY c.created_at DESC`,
      },
      {
        name: "Get Collection Details",
        endpoint: "GET /api/collections/{id}",
        method: "GET",
        description: "Retrieves collection movies with genres and average ratings. Ownership verified before access.",
        sql: `SELECT m.movie_id, m.title, m.release_year,
    COALESCE(
        (SELECT ROUND(AVG(rating)::numeric, 1) FROM rating
         WHERE movie_id = m.movie_id), 0
    ) as avg_rating,
    ci.added_at,
    ARRAY_AGG(g.name ORDER BY g.name) as genres
FROM collection_item ci
JOIN movie m ON ci.movie_id = m.movie_id
JOIN movie_genre mg ON m.movie_id = mg.movie_id
JOIN genre g ON mg.genre_id = g.genre_id
WHERE ci.collection_id = %s
GROUP BY m.movie_id, m.title, m.release_year, ci.added_at
ORDER BY m.title`,
      },
      {
        name: "Create Collection",
        endpoint: "POST /api/collections",
        method: "POST",
        description: "Creates a new movie collection for the authenticated user.",
        sql: `INSERT INTO movie_collection (user_id, title, note, created_at)
VALUES (%s, %s, %s, %s)
RETURNING collection_id, user_id, title, note, created_at`,
      },
      {
        name: "Add Movie to Collection",
        endpoint: "POST /api/collections/{id}/movies",
        method: "POST",
        description: "Adds a movie to an existing collection. Verifies ownership, movie existence, and prevents duplicates.",
        sql: `INSERT INTO collection_item (collection_id, movie_id, added_at)
VALUES (%s, %s, %s) RETURNING *`,
      },
      {
        name: "Delete Collection",
        endpoint: "DELETE /api/collections/{id}",
        method: "DELETE",
        description: "Deletes a collection and its items. Ownership verified.",
        sql: `DELETE FROM movie_collection
WHERE collection_id = %s AND user_id = %s`,
      },
    ],
  },
  {
    name: "User Ratings",
    description: "App user rating submission and management (authenticated)",
    queries: [
      {
        name: "Add or Update Rating",
        endpoint: "POST /api/ratings/my-ratings",
        method: "POST",
        description: "Submits a rating (0.5\u20135.0) for a movie. Uses upsert to update if the user already rated the movie.",
        sql: `INSERT INTO app_user_rating (user_id, movie_id, rating, timestamp)
VALUES (%s, %s, %s, %s)
ON CONFLICT (user_id, movie_id)
DO UPDATE SET rating = EXCLUDED.rating, timestamp = EXCLUDED.timestamp
RETURNING *`,
      },
      {
        name: "Get My Ratings",
        endpoint: "GET /api/ratings/my-ratings",
        method: "GET",
        description: "Retrieves all ratings by the authenticated user with movie titles, ordered by most recent.",
        sql: `SELECT aur.movie_id, aur.rating, aur.timestamp, m.title, m.release_year
FROM app_user_rating aur
JOIN movie m ON aur.movie_id = m.movie_id
WHERE aur.user_id = %s
ORDER BY aur.timestamp DESC LIMIT %s`,
      },
      {
        name: "Delete My Rating",
        endpoint: "DELETE /api/ratings/my-ratings/{movie_id}",
        method: "DELETE",
        description: "Removes the authenticated user's rating for a specific movie.",
        sql: `DELETE FROM app_user_rating
WHERE user_id = %s AND movie_id = %s RETURNING *`,
      },
    ],
  },
  {
    name: "Recommendations",
    description: "Personalised movie recommendations using collaborative and content-based filtering",
    queries: [
      {
        name: "Get Recommendations",
        endpoint: "GET /api/ratings/recommendations",
        method: "GET",
        description: "Generates personalised recommendations. Uses collaborative filtering (Pearson correlation with top 100 similar users) if the user has 5+ ratings, falling back to content-based filtering (genre affinity scores) otherwise. Includes weighted ratings from external sources.",
        sql: `-- Collaborative filtering (when user has 5+ ratings):
WITH app_user_input AS (
    SELECT movie_id, (rating * 2) as rating
    FROM app_user_rating WHERE user_id = %s
),
all_ratings AS (
    SELECT user_id::text as user_key, movie_id, (rating * 2) as rating
    FROM rating
    UNION ALL
    SELECT ('app_' || user_id::text), movie_id, (rating * 2)
    FROM app_user_rating WHERE user_id != %s
),
similar_users AS (
    SELECT ar.user_key,
        CORR(ar.rating, aui.rating) as correlation,
        COUNT(*) as common_movies
    FROM all_ratings ar
    JOIN app_user_input aui ON ar.movie_id = aui.movie_id
    GROUP BY ar.user_key
    HAVING COUNT(*) >= 3 AND CORR(ar.rating, aui.rating) > 0
    ORDER BY correlation DESC LIMIT 100
),
candidate_movies AS (
    SELECT ar.movie_id,
        SUM(ar.rating * su.correlation) / SUM(su.correlation)
            as predicted_rating,
        COUNT(DISTINCT su.user_key) as vote_count
    FROM all_ratings ar
    JOIN similar_users su ON ar.user_key = su.user_key
    WHERE ar.movie_id NOT IN (SELECT movie_id FROM app_user_input)
      AND ar.rating >= 7
    GROUP BY ar.movie_id HAVING COUNT(DISTINCT su.user_key) >= 2
)
SELECT m.movie_id, m.title, m.release_year,
    ROUND(cm.predicted_rating::numeric, 2) as predicted_rating,
    ROUND(CAST(/* weighted rating formula */ AS NUMERIC), 2) as weighted_rating
FROM candidate_movies cm
JOIN movie m ON cm.movie_id = m.movie_id
LEFT JOIN movie_detail md ON m.movie_id = md.movie_id
LEFT JOIN external_ratings er ON m.movie_id = er.movie_id
ORDER BY cm.predicted_rating DESC LIMIT 20

-- Content-based fallback (when < 5 ratings):
-- Uses genre affinity from user's rated movies to find unrated films`,
      },
    ],
  },
]
