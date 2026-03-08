"""
Response caching utilities for the MoviesDB API.

Provides cache-control headers for endpoints that return
relatively static data (genre lists, popularity reports).
"""

from starlette.responses import Response

# Cache durations in seconds
CACHE_SHORT = 300       # 5 minutes - for data that updates occasionally
CACHE_MEDIUM = 1800     # 30 minutes - for aggregated reports
CACHE_LONG = 3600       # 1 hour - for near-static reference data


def set_cache_headers(response: Response, max_age: int = CACHE_SHORT):
    """Add Cache-Control headers to a response.

    Use CACHE_SHORT for genre lists, CACHE_MEDIUM for popularity
    reports, CACHE_LONG for rarely changing reference data.
    """
    response.headers["Cache-Control"] = f"public, max-age={max_age}"
    response.headers["Vary"] = "Accept"


def no_cache(response: Response):
    """Mark a response as non-cacheable (user-specific data)."""
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    response.headers["Pragma"] = "no-cache"
