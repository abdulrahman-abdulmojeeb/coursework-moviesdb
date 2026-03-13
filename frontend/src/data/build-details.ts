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
      { name: "React", version: "18.3", description: "Component-based UI library for building interactive user interfaces", link: "https://react.dev" },
      { name: "TypeScript", version: "5.6", description: "Typed superset of JavaScript for improved developer experience and code quality", link: "https://www.typescriptlang.org" },
      { name: "Vite", version: "6.0", description: "Next-generation frontend build tool with lightning-fast HMR and optimized production builds", link: "https://vitejs.dev" },
      { name: "React Router", version: "7.0", description: "Declarative routing for React applications with nested routes support", link: "https://reactrouter.com" },
      { name: "TanStack Query", version: "5.62", description: "Powerful asynchronous state management for data fetching, caching, and synchronization", link: "https://tanstack.com/query" },
      { name: "Tailwind CSS", version: "3.4", description: "Utility-first CSS framework for rapid UI development", link: "https://tailwindcss.com" },
      { name: "shadcn/ui", version: "latest", description: "Re-usable components built with Radix UI and Tailwind CSS", link: "https://ui.shadcn.com" },
      { name: "Radix UI", version: "latest", description: "Unstyled, accessible component primitives for React", link: "https://www.radix-ui.com" },
      { name: "Recharts", version: "2.15", description: "Composable charting library built on React components for data visualization", link: "https://recharts.org" },
      { name: "Lucide React", version: "0.468", description: "Beautiful and consistent icon library with 1000+ icons", link: "https://lucide.dev" },
      { name: "Axios", version: "1.7", description: "Promise-based HTTP client for API requests", link: "https://axios-http.com" },
    ],
  },
  {
    title: "Backend",
    icon: createElement(Server, { className: "h-5 w-5" }),
    description: "High-performance Python API server with async support",
    technologies: [
      { name: "Python", version: "3.12", description: "Modern Python runtime with performance improvements and better error messages", link: "https://www.python.org" },
      { name: "FastAPI", version: "0.115", description: "Modern, fast web framework for building APIs with automatic OpenAPI documentation", link: "https://fastapi.tiangolo.com" },
      { name: "Uvicorn", version: "0.34", description: "Lightning-fast ASGI server implementation using uvloop and httptools", link: "https://www.uvicorn.org" },
      { name: "Pydantic", version: "2.x", description: "Data validation using Python type annotations with high performance", link: "https://docs.pydantic.dev" },
      { name: "psycopg2", version: "2.9", description: "PostgreSQL database adapter for Python with connection pooling", link: "https://www.psycopg.org" },
      { name: "python-jose", version: "3.3", description: "JavaScript Object Signing and Encryption (JOSE) implementation for JWT tokens", link: "https://python-jose.readthedocs.io" },
      { name: "passlib", version: "1.7", description: "Password hashing library with bcrypt support for secure authentication", link: "https://passlib.readthedocs.io" },
      { name: "httpx", version: "0.28", description: "Async HTTP client for making requests to external APIs (TMDB)", link: "https://www.python-httpx.org" },
    ],
  },
  {
    title: "Database",
    icon: createElement(Database, { className: "h-5 w-5" }),
    description: "Robust relational database with advanced SQL features",
    technologies: [
      { name: "PostgreSQL", version: "16-alpine", description: "Advanced open-source relational database with ACID compliance and JSON support", link: "https://www.postgresql.org" },
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
      { name: "Nginx", version: "alpine", description: "High-performance HTTP server and reverse proxy for load balancing and SSL termination", link: "https://nginx.org" },
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
      { name: "JWT Authentication", version: "N/A", description: "Stateless authentication using JSON Web Tokens with secure signing" },
      { name: "bcrypt", version: "N/A", description: "Adaptive password hashing algorithm with configurable work factor" },
      { name: "CORS", version: "N/A", description: "Cross-Origin Resource Sharing configuration for API security" },
      { name: "UFW Firewall", version: "N/A", description: "Uncomplicated Firewall for server-level network protection" },
    ],
  },
  {
    title: "External APIs",
    icon: createElement(Globe, { className: "h-5 w-5" }),
    description: "Third-party data sources and integrations",
    technologies: [
      { name: "TMDB API", version: "3", description: "The Movie Database API for movie metadata, posters, and additional information", link: "https://www.themoviedb.org/documentation/api" },
      { name: "MovieLens Dataset", version: "ml-latest-small", description: "Research dataset with 100,000 ratings from 600 users across 9,700 movies", link: "https://grouplens.org/datasets/movielens" },
    ],
  },
  {
    title: "Development Tools",
    icon: createElement(Cpu, { className: "h-5 w-5" }),
    description: "Tools and utilities for development workflow",
    technologies: [
      { name: "Bun", version: "1.x", description: "Fast JavaScript runtime, package manager, and bundler", link: "https://bun.sh" },
      { name: "ESLint", version: "9.x", description: "Static code analysis tool for identifying problematic patterns", link: "https://eslint.org" },
      { name: "Git", version: "2.x", description: "Distributed version control system for source code management", link: "https://git-scm.com" },
    ],
  },
]

export const architectureDetails = [
  { layer: "Presentation Layer", components: "React SPA, Tailwind CSS, shadcn/ui components", responsibility: "User interface rendering, client-side routing, form validation" },
  { layer: "API Gateway", components: "Nginx reverse proxy", responsibility: "SSL termination, request routing, static file serving, load balancing" },
  { layer: "Application Layer", components: "FastAPI, Uvicorn ASGI server", responsibility: "Business logic, authentication, request validation, API endpoints" },
  { layer: "Data Access Layer", components: "psycopg2, raw SQL queries", responsibility: "Database connections, query execution, data transformation" },
  { layer: "Persistence Layer", components: "PostgreSQL 16", responsibility: "Data storage, indexing, ACID transactions, referential integrity" },
]

export const databaseSchema = [
  { table: "movie", records: "9,742", description: "Core movie catalog with TMDB/IMDB IDs" },
  { table: "movie_detail", records: "9,617", description: "Extended metadata from TMDB API" },
  { table: "rating", records: "100,836", description: "User ratings (0.5-5 scale)" },
  { table: "ml_user", records: "610", description: "MovieLens user accounts" },
  { table: "genre", records: "20", description: "Movie genre categories" },
  { table: "movie_genre", records: "22,084", description: "Movie-genre associations (M:N)" },
  { table: "tag", records: "3,683", description: "User-generated movie tags" },
  { table: "personality_user", records: "610", description: "Synthetic Big Five personality data" },
  { table: "movie_collection", records: "variable", description: "User-created movie collections" },
  { table: "collection_item", records: "variable", description: "Movies in collections" },
  { table: "app_user", records: "variable", description: "Application user accounts" },
]

export const queryCategories: QueryCategory[] = [
  {
    name: "Movies",
    description: "Movie catalogue and details endpoints",
    queries: [
      { name: "Get Movies (Paginated)", endpoint: "GET /api/movies", method: "GET", description: "Retrieves paginated list of movies with optional filters for title, genre, year range, and minimum rating.", sql: `SELECT m.movie_id, m.title, m.release_year, m.imdb_id, m.tmdb_id,
    md.poster_path, md.overview,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.rating_id) as rating_count,
    ARRAY_AGG(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL) as genres
FROM movie m
LEFT JOIN movie_detail md ON m.movie_id = md.movie_id
LEFT JOIN rating r ON m.movie_id = r.movie_id
LEFT JOIN movie_genre mg ON m.movie_id = mg.movie_id
LEFT JOIN genre g ON mg.genre_id = g.genre_id
WHERE {dynamic_filters}
GROUP BY m.movie_id, md.poster_path, md.overview
ORDER BY {sort_field} {sort_order}
LIMIT %s OFFSET %s` },
      { name: "Get Movie Details", endpoint: "GET /api/movies/{id}", method: "GET", description: "Retrieves detailed information about a specific movie including TMDB metadata, ratings, genres, and tags.", sql: `SELECT m.movie_id, m.title, m.release_year, m.imdb_id, m.tmdb_id,
    md.poster_path, md.backdrop_path, md.overview, md.runtime,
    md.budget, md.revenue, md.popularity, md.vote_average,
    md.vote_count, md.director, md.lead_actors,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.rating_id) as rating_count,
    ARRAY_AGG(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL) as genres,
    ARRAY_AGG(DISTINCT t.tag_text) FILTER (WHERE t.tag_text IS NOT NULL) as tags
FROM movie m
LEFT JOIN movie_detail md ON m.movie_id = md.movie_id
LEFT JOIN rating r ON m.movie_id = r.movie_id
LEFT JOIN movie_genre mg ON m.movie_id = mg.movie_id
LEFT JOIN genre g ON mg.genre_id = g.genre_id
LEFT JOIN tag t ON m.movie_id = t.movie_id
WHERE m.movie_id = %s
GROUP BY m.movie_id, md.poster_path, md.backdrop_path, md.overview,
         md.runtime, md.budget, md.revenue, md.popularity,
         md.vote_average, md.vote_count, md.director, md.lead_actors` },
      { name: "Get Rating Distribution", endpoint: "GET /api/movies/{id}/ratings", method: "GET", description: "Returns rating distribution and statistics for a specific movie.", sql: `WITH rating_counts AS (
    SELECT rating, COUNT(*) as count
    FROM rating WHERE movie_id = %s
    GROUP BY rating
)
SELECT rating, count,
    ROUND(100.0 * count / SUM(count) OVER(), 1) as percentage
FROM rating_counts ORDER BY rating` },
    ],
  },
  {
    name: "Genres",
    description: "Genre popularity and polarisation analysis",
    queries: [
      { name: "Get All Genres", endpoint: "GET /api/genres", method: "GET", description: "Lists all genres with their movie counts.", sql: `SELECT g.genre_id, g.name, COUNT(mg.movie_id) as movie_count
FROM genre g
LEFT JOIN movie_genre mg ON g.genre_id = mg.genre_id
GROUP BY g.genre_id ORDER BY g.name` },
      { name: "Genre Popularity Report", endpoint: "GET /api/genres/popularity", method: "GET", description: "Ranks genres by average rating, including total ratings and movie count.", sql: `SELECT g.name as genre,
    COUNT(DISTINCT r.rating_id) as total_ratings,
    COUNT(DISTINCT mg.movie_id) as movie_count,
    ROUND(AVG(r.rating)::numeric, 2) as avg_rating,
    ROUND(STDDEV(r.rating)::numeric, 2) as rating_stddev
FROM genre g
JOIN movie_genre mg ON g.genre_id = mg.genre_id
JOIN rating r ON mg.movie_id = r.movie_id
GROUP BY g.genre_id, g.name ORDER BY avg_rating DESC` },
      { name: "Genre Polarisation", endpoint: "GET /api/genres/polarisation", method: "GET", description: "Identifies polarising genres by calculating extreme ratings percentage.", sql: `WITH genre_stats AS (
    SELECT genre, SUM(count) as total_ratings,
        SUM(CASE WHEN rating <= 2 THEN count ELSE 0 END) as low_ratings,
        SUM(CASE WHEN rating >= 4 THEN count ELSE 0 END) as high_ratings
    FROM genre_ratings GROUP BY genre
)
SELECT genre, total_ratings,
    ROUND(100.0 * low_ratings / total_ratings, 1) as low_pct,
    ROUND(100.0 * high_ratings / total_ratings, 1) as high_pct,
    ROUND(100.0 * (low_ratings + high_ratings) / total_ratings, 1) as polarisation_score
FROM genre_stats WHERE total_ratings >= 100
ORDER BY polarisation_score DESC` },
    ],
  },
  {
    name: "Rating Patterns",
    description: "Analysis of viewer rating behaviors",
    queries: [
      { name: "User Rating Patterns", endpoint: "GET /api/ratings/patterns", method: "GET", description: "Analyzes how users rate different genres.", sql: `WITH user_genre_ratings AS (
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
FROM user_genre_ratings GROUP BY genre ORDER BY mean_user_avg DESC` },
      { name: "Cross-Genre Preferences", endpoint: "GET /api/ratings/cross-genre", method: "GET", description: "Finds which genres fans of a specific genre also enjoy.", sql: `WITH genre_lovers AS (
    SELECT DISTINCT r.user_id FROM rating r
    JOIN movie_genre mg ON r.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
    WHERE g.name ILIKE %s GROUP BY r.user_id
    HAVING COUNT(*) >= %s AND AVG(r.rating) >= 4.0
)
SELECT g.name as genre, ROUND(AVG(r.rating)::numeric, 2) as avg_rating
FROM rating r
JOIN movie_genre mg ON r.movie_id = mg.movie_id
JOIN genre g ON mg.genre_id = g.genre_id
WHERE r.user_id IN (SELECT user_id FROM genre_lovers)
GROUP BY g.name HAVING COUNT(*) >= 50 ORDER BY avg_rating DESC` },
      { name: "Low Rater Analysis", endpoint: "GET /api/ratings/low-raters", method: "GET", description: "Categorizes users into harsh critics, balanced, and generous raters.", sql: `WITH user_categories AS (
    SELECT user_id, AVG(rating) as overall_avg,
        CASE
            WHEN AVG(rating) <= 2.5 THEN 'harsh_critic'
            WHEN AVG(rating) >= 4.0 THEN 'generous_rater'
            ELSE 'balanced_rater'
        END as rater_type
    FROM rating GROUP BY user_id HAVING COUNT(*) >= 20
)
SELECT rater_type, COUNT(*) as user_count,
    ROUND(AVG(overall_avg)::numeric, 2) as avg_rating
FROM user_categories GROUP BY rater_type ORDER BY avg_rating` },
    ],
  },
  {
    name: "Predictions",
    description: "Rating prediction algorithms",
    queries: [
      { name: "Predict Rating", endpoint: "POST /api/predictions/predict", method: "POST", description: "Predicts ratings for new movies based on genre similarity.", sql: `WITH similar_movies AS (
    SELECT m.movie_id, COUNT(DISTINCT mg.genre_id) as matching_genres,
        (SELECT COUNT(*) FROM target_genres) as total_target_genres
    FROM movie m
    JOIN movie_genre mg ON m.movie_id = mg.movie_id
    WHERE mg.genre_id IN (SELECT genre_id FROM target_genres)
    GROUP BY m.movie_id
    HAVING COUNT(*) >= GREATEST(1, (SELECT COUNT(*) FROM target_genres) / 2)
    LIMIT 50
)
SELECT ROUND(AVG(rating)::numeric, 2) as predicted_rating,
    ROUND(STDDEV(rating)::numeric, 2) as uncertainty,
    COUNT(*) as based_on_ratings
FROM similar_movies sm JOIN rating r ON sm.movie_id = r.movie_id` },
      { name: "Find Similar Movies", endpoint: "GET /api/predictions/similar/{id}", method: "GET", description: "Finds movies similar based on genre overlap.", sql: `WITH genre_similarity AS (
    SELECT m.movie_id, m.title, m.release_year,
        COUNT(DISTINCT mg.genre_id) as matching_genres
    FROM movie m
    JOIN movie_genre mg ON m.movie_id = mg.movie_id
    WHERE mg.genre_id IN (SELECT genre_id FROM target_genres)
      AND m.movie_id != %s
    GROUP BY m.movie_id
)
SELECT *, ROUND(100.0 * matching_genres / total_genres, 1) as similarity_pct,
    ROUND(AVG(r.rating)::numeric, 2) as avg_rating
FROM genre_similarity gs LEFT JOIN rating r ON gs.movie_id = r.movie_id
GROUP BY gs.movie_id ORDER BY similarity_pct DESC LIMIT %s` },
    ],
  },
  {
    name: "Personality",
    description: "Personality traits and viewing preferences",
    queries: [
      { name: "Get Personality Traits", endpoint: "GET /api/personality/traits", method: "GET", description: "Returns Big Five personality trait statistics.", sql: `SELECT 'openness' as trait,
    ROUND(AVG(openness)::numeric, 2) as mean,
    ROUND(STDDEV(openness)::numeric, 2) as stddev,
    MIN(openness) as min, MAX(openness) as max
FROM personality_user
UNION ALL SELECT 'agreeableness', ROUND(AVG(agreeableness)::numeric, 2),
    ROUND(STDDEV(agreeableness)::numeric, 2), MIN(agreeableness), MAX(agreeableness)
FROM personality_user
-- (similar for other traits)` },
      { name: "Trait-Genre Correlation", endpoint: "GET /api/personality/genre-correlation", method: "GET", description: "Correlates personality traits with genre preferences.", sql: `WITH trait_users AS (
    SELECT user_id FROM personality_user
    WHERE {trait} {>= 4.0 | <= 2.0}
)
SELECT g.name as genre, ROUND(AVG(r.rating)::numeric, 2) as avg_rating
FROM trait_users tu
JOIN rating r ON tu.user_id = r.user_id
JOIN movie_genre mg ON r.movie_id = mg.movie_id
JOIN genre g ON mg.genre_id = g.genre_id
GROUP BY g.name HAVING COUNT(*) >= 50 ORDER BY avg_rating DESC` },
      { name: "Viewer Segments", endpoint: "GET /api/personality/segments", method: "GET", description: "Identifies viewer segments based on personality clusters.", sql: `WITH user_segments AS (
    SELECT user_id,
        CASE
            WHEN extraversion >= 4 AND openness >= 4 THEN 'adventurous_social'
            WHEN extraversion >= 4 AND openness < 3 THEN 'social_traditional'
            WHEN extraversion < 3 AND openness >= 4 THEN 'curious_introvert'
            ELSE 'balanced'
        END as segment
    FROM personality_user
)
SELECT segment, g.name as genre, ROUND(AVG(r.rating)::numeric, 2) as avg_rating
FROM user_segments us
JOIN rating r ON us.user_id = r.user_id
JOIN movie_genre mg ON r.movie_id = mg.movie_id
JOIN genre g ON mg.genre_id = g.genre_id
GROUP BY segment, g.name HAVING COUNT(*) >= 20
ORDER BY segment, avg_rating DESC` },
    ],
  },
  {
    name: "Collections",
    description: "User curated collection management",
    queries: [
      { name: "Get User Collections", endpoint: "GET /api/collections", method: "GET", description: "Retrieves all collections for the current user.", sql: `SELECT c.collection_id, c.title, c.note, c.created_at,
    COUNT(ci.item_id) as movie_count
FROM movie_collection c
LEFT JOIN collection_item ci ON c.collection_id = ci.collection_id
WHERE c.user_id = %s
GROUP BY c.collection_id ORDER BY c.created_at DESC` },
      { name: "Get Collection Details", endpoint: "GET /api/collections/{id}", method: "GET", description: "Retrieves collection with movies grouped by genre.", sql: `SELECT g.name as genre,
    JSON_AGG(JSON_BUILD_OBJECT(
        'movie_id', m.movie_id, 'title', m.title,
        'release_year', m.release_year, 'added_at', ci.added_at
    ) ORDER BY m.title) as movies
FROM collection_item ci
JOIN movie m ON ci.movie_id = m.movie_id
JOIN movie_genre mg ON m.movie_id = mg.movie_id
JOIN genre g ON mg.genre_id = g.genre_id
WHERE ci.collection_id = %s
GROUP BY g.name ORDER BY g.name` },
      { name: "Add Movie to Collection", endpoint: "POST /api/collections/{id}/movies", method: "POST", description: "Adds a movie to an existing collection.", sql: `INSERT INTO collection_item (collection_id, movie_id, added_at)
VALUES (%s, %s, %s) RETURNING *` },
    ],
  },
]
