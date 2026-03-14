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
    "personality-data.csv": ["userid", "openness", "agreeableness", "emotional_stability", "conscientiousness", "extraversion", "assigned metric", "assigned condition", "movie_1", "predicted_rating_1", "movie_2", "predicted_rating_2", "movie_3", "predicted_rating_3", "movie_4", "predicted_rating_4", "movie_5", "predicted_rating_5", "movie_6", "predicted_rating_6", "movie_7", "predicted_rating_7", "movie_8", "predicted_rating_8", "movie_9", "predicted_rating_9", "movie_10", "predicted_rating_10", "movie_11", "predicted_rating_11", "movie_12", "predicted_rating_12", "is_personalized", "enjoy_watching"],
}

def validate_file(filepath, expected_cols):
    """Check CSV headers match expected schema."""
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        headers = [h.strip() for h in next(reader)]
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


PERSONALITY_TRAITS = ["openness", "agreeableness", "emotional_stability",
                      "conscientiousness", "extraversion"]


def validate_personality_completeness(filepath):
    """Report completeness of personality trait data.

    Checks each Big Five trait column for missing or empty values
    and reports the percentage of complete records.
    """
    total = 0
    missing_counts = {trait: 0 for trait in PERSONALITY_TRAITS}
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            total += 1
            for trait in PERSONALITY_TRAITS:
                val = row.get(trait, "").strip()
                if not val:
                    missing_counts[trait] += 1

    if total == 0:
        print("  No personality records found")
        return

    print(f"  Personality data completeness ({total} records):")
    for trait in PERSONALITY_TRAITS:
        complete = total - missing_counts[trait]
        pct = complete / total * 100
        status = "OK" if pct == 100 else "GAPS"
        print(f"    {trait}: {complete}/{total} ({pct:.1f}%) [{status}]")


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
    personality_path = os.path.join(data_dir, "personality-data.csv")
    if os.path.exists(personality_path):
        validate_personality_completeness(personality_path)
    sys.exit(0 if all_ok else 1)

if __name__ == "__main__":
    main()
