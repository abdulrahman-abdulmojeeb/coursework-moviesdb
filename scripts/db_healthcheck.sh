#!/usr/bin/env bash
# Database readiness check for container orchestration.
# Used by Docker health checks and the setup script to verify
# PostgreSQL is accepting connections and the schema is loaded.
#
# Usage: ./scripts/db_healthcheck.sh [--schema]
#   --schema  Also verify that core tables exist

set -euo pipefail

DB_HOST="${POSTGRES_HOST:-db}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_USER="${POSTGRES_USER:-moviesdb}"
DB_NAME="${POSTGRES_DB:-moviesdb}"

check_connection() {
    pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -q
}

check_schema() {
    local tables
    tables=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'" 2>/dev/null)
    tables=$(echo "$tables" | tr -d ' ')
    if [ "$tables" -gt 0 ]; then
        echo "Schema loaded: $tables tables found"
        return 0
    else
        echo "Schema not loaded: no tables found"
        return 1
    fi
}

if ! check_connection; then
    echo "Database not ready"
    exit 1
fi

echo "Database connection OK"

if [ "${1:-}" = "--schema" ]; then
    check_schema
fi
