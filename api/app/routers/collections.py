from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.database import execute_query, execute_query_one, execute_returning, execute_command
from app.auth.users import get_current_user, UserRead

router = APIRouter()


class CollectionCreate(BaseModel):
    title: str
    note: Optional[str] = None


class CollectionUpdate(BaseModel):
    title: Optional[str] = None
    note: Optional[str] = None


class CollectionItemAdd(BaseModel):
    movie_id: int


def _verify_ownership(collection_id: int, user_id: int):
    collection = execute_query_one(
        "SELECT * FROM movie_collection WHERE collection_id = %s AND user_id = %s",
        (collection_id, user_id)
    )
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection


@router.get("")
async def get_user_collections(current_user: UserRead = Depends(get_current_user)):
    query = """
        SELECT
            c.collection_id,
            c.title,
            c.note,
            c.created_at,
            COUNT(ci.item_id) as movie_count
        FROM movie_collection c
        LEFT JOIN collection_item ci ON c.collection_id = ci.collection_id
        WHERE c.user_id = %s
        GROUP BY c.collection_id
        ORDER BY c.created_at DESC
    """
    return execute_query(query, (current_user.id,))


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_collection(
    collection: CollectionCreate,
    current_user: UserRead = Depends(get_current_user),
):
    query = """
        INSERT INTO movie_collection (user_id, title, note, created_at)
        VALUES (%s, %s, %s, %s)
        RETURNING collection_id, user_id, title, note, created_at
    """
    return execute_returning(
        query,
        (current_user.id, collection.title, collection.note, datetime.utcnow())
    )


@router.get("/{collection_id}")
async def get_collection(
    collection_id: int,
    current_user: UserRead = Depends(get_current_user),
):
    collection = _verify_ownership(collection_id, current_user.id)

    query = """
        SELECT
            m.movie_id,
            m.title,
            m.release_year,
            COALESCE(
                (SELECT ROUND(AVG(rating)::numeric, 1) FROM rating WHERE movie_id = m.movie_id),
                0
            ) as avg_rating,
            ci.added_at,
            ARRAY_AGG(g.name ORDER BY g.name) as genres
        FROM collection_item ci
        JOIN movie m ON ci.movie_id = m.movie_id
        JOIN movie_genre mg ON m.movie_id = mg.movie_id
        JOIN genre g ON mg.genre_id = g.genre_id
        WHERE ci.collection_id = %s
        GROUP BY m.movie_id, m.title, m.release_year, ci.added_at
        ORDER BY m.title
    """
    movies = execute_query(query, (collection_id,))

    return {
        **collection,
        "movies": movies,
    }


@router.put("/{collection_id}")
async def update_collection(
    collection_id: int,
    updates: CollectionUpdate,
    current_user: UserRead = Depends(get_current_user),
):
    collection = _verify_ownership(collection_id, current_user.id)

    update_fields = []
    params = []

    if updates.title is not None:
        update_fields.append("title = %s")
        params.append(updates.title)

    if updates.note is not None:
        update_fields.append("note = %s")
        params.append(updates.note)

    if not update_fields:
        return collection

    params.extend([collection_id, current_user.id])
    query = f"""
        UPDATE movie_collection
        SET {", ".join(update_fields)}
        WHERE collection_id = %s AND user_id = %s
        RETURNING *
    """
    return execute_returning(query, tuple(params))


@router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_collection(
    collection_id: int,
    current_user: UserRead = Depends(get_current_user),
):
    rows = execute_command(
        "DELETE FROM movie_collection WHERE collection_id = %s AND user_id = %s",
        (collection_id, current_user.id)
    )

    if rows == 0:
        raise HTTPException(status_code=404, detail="Collection not found")


@router.post("/{collection_id}/movies", status_code=status.HTTP_201_CREATED)
async def add_movie_to_collection(
    collection_id: int,
    item: CollectionItemAdd,
    current_user: UserRead = Depends(get_current_user),
):
    _verify_ownership(collection_id, current_user.id)

    movie = execute_query_one(
        "SELECT movie_id FROM movie WHERE movie_id = %s",
        (item.movie_id,)
    )
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    existing = execute_query_one(
        "SELECT * FROM collection_item WHERE collection_id = %s AND movie_id = %s",
        (collection_id, item.movie_id)
    )
    if existing:
        raise HTTPException(status_code=400, detail="Movie already in collection")

    query = """
        INSERT INTO collection_item (collection_id, movie_id, added_at)
        VALUES (%s, %s, %s)
        RETURNING *
    """
    return execute_returning(query, (collection_id, item.movie_id, datetime.utcnow()))


@router.delete("/{collection_id}/movies/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_movie_from_collection(
    collection_id: int,
    movie_id: int,
    current_user: UserRead = Depends(get_current_user),
):
    _verify_ownership(collection_id, current_user.id)

    rows = execute_command(
        "DELETE FROM collection_item WHERE collection_id = %s AND movie_id = %s",
        (collection_id, movie_id)
    )

    if rows == 0:
        raise HTTPException(status_code=404, detail="Movie not in collection")
