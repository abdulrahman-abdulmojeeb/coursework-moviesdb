"""
Data validation checks for MovieLens CSV files.
Run before loading to catch schema issues early.
"""
import csv
import sys
import os

EXPECTED_SCHEMAS = {
    "movies.csv": ["movieId", "title", "genres"],
    "ratings.csv": ["userId", "movieId", "rating", "timestamp"],
    "tags.csv": ["userId", "movieId", "tag", "timestamp"],
    "links.csv": ["movieId", "imdbId", "tmdbId"],
}

def validate_file(filepath, expected_cols):
    """Check CSV headers match expected schema."""
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        headers = next(reader)
        if headers != expected_cols:
            print(f"  FAIL: {os.path.basename(filepath)}")
            print(f"    Expected: {expected_cols}")
            print(f"    Got:      {headers}")
            return False
        row_count = sum(1 for _ in reader)
        print(f"  OK: {os.path.basename(filepath)} ({row_count:,} rows)")
        return True

import re

MIN_MOVIE_YEAR = 1888  # earliest known film
MAX_MOVIE_YEAR = 2030


def validate_movie_years(filepath):
    """Check that movie titles contain plausible release years."""
    year_pattern = re.compile(r"\((\d{4})\)\s*$")
    bad_years = 0
    checked = 0
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            match = year_pattern.search(row["title"])
            if match:
                year = int(match.group(1))
                checked += 1
                if year < MIN_MOVIE_YEAR or year > MAX_MOVIE_YEAR:
                    bad_years += 1
    if bad_years > 0:
        print(f"  WARNING: {bad_years} movies with implausible years (of {checked} checked)")
    else:
        print(f"  OK: all {checked} movie years in range {MIN_MOVIE_YEAR}-{MAX_MOVIE_YEAR}")
    return bad_years == 0


def main():
    data_dir = sys.argv[1] if len(sys.argv) > 1 else "data/ml-latest-small"
    print(f"Validating MovieLens data in {data_dir}...")
    all_ok = True
    for filename, cols in EXPECTED_SCHEMAS.items():
        path = os.path.join(data_dir, filename)
        if not os.path.exists(path):
            print(f"  MISSING: {filename}")
            all_ok = False
            continue
        if not validate_file(path, cols):
            all_ok = False
    movies_path = os.path.join(data_dir, "movies.csv")
    if os.path.exists(movies_path):
        validate_movie_years(movies_path)
    sys.exit(0 if all_ok else 1)

if __name__ == "__main__":
    main()
