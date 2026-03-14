from datetime import datetime
from typing import Optional

from app.database import execute_query_one, execute_returning

_USER_COLS = "user_id as id, username, email, password_hash, created_at, is_active"


def _get_user(where: str, param) -> Optional[dict]:
    return execute_query_one(f"SELECT {_USER_COLS} FROM app_user WHERE {where}", (param,))


def get_user_by_id(user_id: int) -> Optional[dict]:
    return _get_user("user_id = %s", user_id)


def get_user_by_username(username: str) -> Optional[dict]:
    return _get_user("username = %s", username)


def get_user_by_email(email: str) -> Optional[dict]:
    return _get_user("email = %s", email)


def create_user(username: str, email: Optional[str], password_hash: str) -> dict:
    query = """
        INSERT INTO app_user (username, email, password_hash, created_at, is_active)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING user_id as id, username, email, created_at, is_active
    """
    return execute_returning(query, (username, email, password_hash, datetime.utcnow(), True))


_ALLOWED_UPDATE_FIELDS = {"username", "email", "password_hash"}


def update_user(user_id: int, updates: dict) -> Optional[dict]:
    if not updates:
        return get_user_by_id(user_id)

    set_clauses = []
    params = []

    for field, value in updates.items():
        if field not in _ALLOWED_UPDATE_FIELDS:
            raise ValueError(f"Field not allowed: {field}")
        set_clauses.append(f"{field} = %s")
        params.append(value)

    params.append(user_id)

    query = f"""
        UPDATE app_user
        SET {", ".join(set_clauses)}
        WHERE user_id = %s
        RETURNING user_id as id, username, email, created_at, is_active
    """
    return execute_returning(query, tuple(params))


def deactivate_user(user_id: int) -> bool:
    query = """
        UPDATE app_user
        SET is_active = FALSE
        WHERE user_id = %s
        RETURNING user_id
    """
    result = execute_returning(query, (user_id,))
    return result is not None
