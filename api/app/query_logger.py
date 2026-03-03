"""
Query performance logging utility.

Logs database queries that exceed a configurable time threshold
to help identify bottlenecks in analytics and reporting endpoints.
"""

import time
import logging
from contextlib import contextmanager

logger = logging.getLogger("moviesdb.queries")

SLOW_QUERY_THRESHOLD_MS = 500


@contextmanager
def log_query_time(query_name: str = "unnamed"):
    """Context manager that logs execution time for database queries.

    Queries exceeding SLOW_QUERY_THRESHOLD_MS are logged at WARNING level.
    All others are logged at DEBUG level for optional verbose tracing.
    """
    start = time.monotonic()
    yield
    elapsed_ms = (time.monotonic() - start) * 1000
    if elapsed_ms > SLOW_QUERY_THRESHOLD_MS:
        logger.warning(
            "Slow query [%s]: %.1fms (threshold: %dms)",
            query_name,
            elapsed_ms,
            SLOW_QUERY_THRESHOLD_MS,
        )
    else:
        logger.debug("Query [%s]: %.1fms", query_name, elapsed_ms)


def get_query_stats():
    """Return a summary dict for the /health endpoint."""
    return {
        "slow_query_threshold_ms": SLOW_QUERY_THRESHOLD_MS,
    }
