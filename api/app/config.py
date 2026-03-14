import logging
import os

from pydantic_settings import BaseSettings
from functools import lru_cache

logger = logging.getLogger(__name__)

_DEFAULT_SECRET = "your-secret-key-change-in-production"


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://moviesdb:moviesdb@db:5432/moviesdb"

    # Security
    secret_key: str = _DEFAULT_SECRET
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    if settings.secret_key == _DEFAULT_SECRET:
        env = os.environ.get("ENVIRONMENT", "development")
        if env.lower() in ("production", "prod"):
            raise RuntimeError(
                "SECRET_KEY must be changed from the default value in production"
            )
        logger.warning("Using default SECRET_KEY — do not use in production")
    return settings
