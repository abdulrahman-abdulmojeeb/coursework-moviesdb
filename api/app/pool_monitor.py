"""
Database connection pool monitoring.

Provides pool status reporting for the health check endpoint
and optional logging of pool utilisation over time.
"""

import logging
from app.database import pool

logger = logging.getLogger("moviesdb.pool")


def get_pool_status() -> dict:
    """Return current connection pool metrics.

    Includes total size, number of connections in use,
    and number of idle connections available.
    """
    if pool is None:
        return {"status": "not_initialized"}

    try:
        used = pool._used  # noqa: SLF001
        size = pool.maxconn
        available = size - len(used)
        return {
            "status": "healthy",
            "max_connections": size,
            "in_use": len(used),
            "available": available,
        }
    except Exception:
        logger.exception("Failed to read pool status")
        return {"status": "error"}
