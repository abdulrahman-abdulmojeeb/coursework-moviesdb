TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"


def build_poster_url(poster_path: str | None) -> str | None:
    if poster_path:
        return f"{TMDB_IMAGE_BASE}{poster_path}"
    return None
