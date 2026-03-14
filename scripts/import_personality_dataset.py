#!/usr/bin/env python3
import argparse
import csv
import os
import sys
from datetime import datetime

import psycopg2
from psycopg2.extras import execute_values

DEFAULT_PERSONALITY_CSV = "personality-data.csv"
DEFAULT_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/movielens"

NUM_MOVIE_SLOTS = 12

def get_db_connection():
    return psycopg2.connect(
        os.environ.get("DATABASE_URL", DEFAULT_DATABASE_URL)
    )

def parse_float(value: str, default=None):
    """Return float or default if value is empty / unparseable."""
    try:
        return float(value.strip())
    except (ValueError, AttributeError):
        return default


def load_valid_movie_ids(cursor) -> set:
    """Fetch all movie_ids that exist in the `movie` table."""
    cursor.execute("SELECT movie_id FROM movie")
    return {row[0] for row in cursor.fetchall()}

def import_dataset_users(cursor, csv_path: str) -> dict:
    """
    Parse the CSV and upsert rows into personality_dataset_user.

    Returns a dict mapping hashed_user_id -> db id (for use in step 2).
    Also returns the raw predicted-rating data keyed by hashed_user_id so
    step 2 doesn't need to re-read the file.
    """
    print("\n[1/2] Importing personality_dataset_user …")

    user_rows = []        # (hashed_user_id, openness, …, assigned_metric, assigned_condition)
    predicted_raw = {}    # hashed_user_id -> [(movie_id, predicted_rating), …]

    with open(csv_path, newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        reader.fieldnames = [f.strip() for f in reader.fieldnames]

        for row in reader:
            huid = row["userid"].strip()

            openness            = parse_float(row.get("openness"))
            agreeableness       = parse_float(row.get("agreeableness"))
            emotional_stability = parse_float(row.get("emotional_stability"))
            conscientiousness   = parse_float(row.get("conscientiousness"))
            extraversion        = parse_float(row.get("extraversion"))
            assigned_metric     = row.get("assigned metric", "").strip() or None
            assigned_condition  = row.get("assigned condition", "").strip() or None

            user_rows.append((
                huid,
                openness,
                agreeableness,
                emotional_stability,
                conscientiousness,
                extraversion,
                assigned_metric,
                assigned_condition,
            ))

            ratings = []
            for i in range(1, NUM_MOVIE_SLOTS + 1):
                movie_id_raw       = row.get(f"movie_{i}", "").strip()
                predicted_raw_val  = row.get(f"predicted_rating_{i}", "").strip()
                movie_id           = int(movie_id_raw) if movie_id_raw else None
                predicted_rating   = parse_float(predicted_raw_val)
                if movie_id and predicted_rating is not None:
                    ratings.append((movie_id, predicted_rating))
            predicted_raw[huid] = ratings

    seen = {}
    for row in user_rows:
        seen[row[0]] = row  # row[0] is hashed_user_id
    user_rows = list(seen.values())
    print(f"    After deduplication: {len(user_rows)} unique users.")

    # Upsert users
    execute_values(
        cursor,
        """
        INSERT INTO personality_dataset_user
            (hashed_user_id, openness, agreeableness, emotional_stability,
             conscientiousness, extraversion, assigned_metric, assigned_condition)
        VALUES %s
        ON CONFLICT (hashed_user_id) DO UPDATE SET
            openness            = EXCLUDED.openness,
            agreeableness       = EXCLUDED.agreeableness,
            emotional_stability = EXCLUDED.emotional_stability,
            conscientiousness   = EXCLUDED.conscientiousness,
            extraversion        = EXCLUDED.extraversion,
            assigned_metric     = EXCLUDED.assigned_metric,
            assigned_condition  = EXCLUDED.assigned_condition
        """,
        user_rows,
    )
    print(f"    Upserted {len(user_rows)} dataset users.")

    # Fetch back the id, hashed_user_id mapping
    cursor.execute("SELECT id, hashed_user_id FROM personality_dataset_user")
    id_map = {huid: db_id for db_id, huid in cursor.fetchall()}
    return id_map, predicted_raw

def import_predicted_ratings(cursor, id_map: dict, predicted_raw: dict, valid_movie_ids: set):
    """
    Insert predicted ratings for every dataset user, skipping any movie_id
    that doesn't exist in the `movie` table.
    """
    print("\n[2/2] Importing personality_predicted_rating …")

    rating_rows = []
    skipped_movies = set()

    for huid, ratings in predicted_raw.items():
        db_id = id_map.get(huid)
        if db_id is None:
            continue
        for movie_id, predicted_rating in ratings:
            if movie_id not in valid_movie_ids:
                skipped_movies.add(movie_id)
                continue
            rating_rows.append((db_id, movie_id, predicted_rating))

    # Delete existing predicted ratings for all dataset users then re-insert,
    # so a re-run doesn't accumulate duplicates.
    cursor.execute("DELETE FROM personality_predicted_rating")

    execute_values(
        cursor,
        """
        INSERT INTO personality_predicted_rating
            (personality_user_id, movie_id, predicted_rating)
        VALUES %s
        """,
        rating_rows,
    )

    print(f"    Inserted {len(rating_rows)} predicted ratings.")
    if skipped_movies:
        print(f"    Skipped {len(skipped_movies)} movie_ids not found in `movie` table "
              f"(e.g. {sorted(skipped_movies)[:5]} …)")



def print_summary(cursor):
    print("\n" + "=" * 50)
    print("Import summary")
    print("=" * 50)

    cursor.execute("SELECT COUNT(*) FROM personality_dataset_user")
    print(f"  personality_dataset_user    : {cursor.fetchone()[0]:>6} rows")

    cursor.execute("SELECT COUNT(*) FROM personality_predicted_rating")
    print(f"  personality_predicted_rating: {cursor.fetchone()[0]:>6} rows")





def main():
    parser = argparse.ArgumentParser(description="Import Personality 2018 dataset")
    parser.add_argument(
        "--personality-csv",
        default=DEFAULT_PERSONALITY_CSV,
        help=f"Path to personality-data.csv (default: {DEFAULT_PERSONALITY_CSV})",
    )
    args = parser.parse_args()

    if not os.path.exists(args.personality_csv):
        print(f"ERROR: CSV file not found: {args.personality_csv}", file=sys.stderr)
        sys.exit(1)

    print("Personality 2018 Dataset Importer")
    print(f"CSV  : {args.personality_csv}")
    print(f"Start: {datetime.now()}")
    print("-" * 50)

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        valid_movie_ids = load_valid_movie_ids(cursor)
        print(f"    Found {len(valid_movie_ids)} movies in the `movie` table.")

        id_map, predicted_raw = import_dataset_users(cursor, args.personality_csv)
        import_predicted_ratings(cursor, id_map, predicted_raw, valid_movie_ids)

        conn.commit()
        print_summary(cursor)

    except Exception as exc:
        conn.rollback()
        print(f"\nERROR – transaction rolled back: {exc}", file=sys.stderr)
        raise
    finally:
        cursor.close()
        conn.close()

    print(f"\nFinished: {datetime.now()}")


if __name__ == "__main__":
    main()