"""PostgreSQL async database via asyncpg — drop-in replacement for MongoDB Mock."""
import json
import logging
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import asyncpg

logger = logging.getLogger("atlas.db")

_pool: Optional[asyncpg.Pool] = None

DATABASE_URL = os.getenv("DATABASE_URL", "")
# asyncpg does not accept postgresql+asyncpg:// prefix
DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

COLLECTIONS = [
    "users", "licenses", "user_sessions", "atlas_stats",
    "payment_transactions", "app_config", "admin_pin_sessions",
    "admin_logs", "api_logs", "admin_pin_lock",
]


async def init_pool() -> None:
    global _pool
    if not DATABASE_URL:
        logger.error("DATABASE_URL is not set — DB will not work")
        return
    _pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10, ssl="require")
    await _create_tables()
    await _seed_defaults()
    logger.info("PostgreSQL pool ready")


async def close_pool() -> None:
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


async def _create_tables() -> None:
    async with _pool.acquire() as conn:
        for coll in COLLECTIONS:
            await conn.execute(f"""
                CREATE TABLE IF NOT EXISTS {coll} (
                    id SERIAL PRIMARY KEY,
                    data JSONB NOT NULL
                )
            """)
            await conn.execute(f"""
                CREATE INDEX IF NOT EXISTS idx_{coll}_gin ON {coll} USING GIN (data)
            """)


async def _seed_defaults() -> None:
    async with _pool.acquire() as conn:
        # atlas_version config
        row = await conn.fetchrow(
            "SELECT id FROM app_config WHERE data->>'_id' = $1", "atlas_version"
        )
        if not row:
            await conn.execute(
                "INSERT INTO app_config (data) VALUES ($1::jsonb)",
                json.dumps({
                    "_id": "atlas_version", "version": "0.9.0",
                    "url": "/downloads/atlas.dmg", "size_mb": 84,
                    "released_at": datetime.now(timezone.utc).isoformat(),
                }),
            )
        # admin_claimed flag
        row2 = await conn.fetchrow(
            "SELECT id FROM app_config WHERE data->>'_id' = $1", "admin_claimed"
        )
        if not row2:
            await conn.execute(
                "INSERT INTO app_config (data) VALUES ($1::jsonb)",
                json.dumps({"_id": "admin_claimed", "claimed": False}),
            )


# ──────────────────────────────────────────────────────────────────────────────
# Query builder helpers
# ──────────────────────────────────────────────────────────────────────────────

def _build_where(filter_dict: dict) -> tuple:
    """Return (where_sql, params_list). Supports simple equality + $gte/$lt/$in."""
    if not filter_dict:
        return "TRUE", []
    conditions, params = [], []
    for key, value in filter_dict.items():
        if isinstance(value, dict) and any(k.startswith("$") for k in value):
            for op, op_val in value.items():
                if op == "$gte":
                    params.append(str(op_val))
                    conditions.append(f"(data->>'{key}') >= ${len(params)}")
                elif op == "$lt":
                    params.append(str(op_val))
                    conditions.append(f"(data->>'{key}') < ${len(params)}")
                elif op == "$in" and op_val:
                    phs = []
                    for v in op_val:
                        params.append(str(v))
                        phs.append(f"${len(params)}")
                    conditions.append(f"data->>'{key}' IN ({', '.join(phs)})")
        elif value is None:
            conditions.append(f"(data->>'{key}' IS NULL OR data->'{key}' = 'null'::jsonb)")
        else:
            params.append(json.dumps({key: value}))
            conditions.append(f"data @> ${len(params)}::jsonb")
    return (" AND ".join(conditions) or "TRUE"), params


def _parse_row_data(data) -> dict:
    if isinstance(data, str):
        try:
            return json.loads(data)
        except Exception as e:
            logger.error("Failed to parse JSON string: %s, error: %s", data, e)
            return {}
    elif isinstance(data, dict):
        return data
    else:
        try:
            return dict(data)
        except Exception:
            return {}


# ──────────────────────────────────────────────────────────────────────────────
# Cursor (supports .sort().limit().to_list())
# ──────────────────────────────────────────────────────────────────────────────

class PGCursor:
    def __init__(self, table: str, filter_dict: dict):
        self.table = table
        self.filter_dict = filter_dict
        self._sort_key = None
        self._sort_dir = -1
        self._limit_n = None

    def sort(self, key, direction=-1):
        self._sort_key = key
        self._sort_dir = direction
        return self

    def limit(self, n: int):
        self._limit_n = n
        return self

    async def to_list(self, length=None):
        where, params = _build_where(self.filter_dict)
        order = ""
        if self._sort_key:
            direction = "ASC" if self._sort_dir == 1 else "DESC"
            order = f" ORDER BY data->>'{self._sort_key}' {direction}"
        limit_sql = ""
        cap = self._limit_n or length
        if cap:
            params.append(cap)
            limit_sql = f" LIMIT ${len(params)}"
        sql = f"SELECT data FROM {self.table} WHERE {where}{order}{limit_sql}"
        async with _pool.acquire() as conn:
            rows = await conn.fetch(sql, *params)
        return [_parse_row_data(r["data"]) for r in rows]

    def __aiter__(self):
        self._iter_data = None
        self._iter_index = 0
        return self

    async def __anext__(self):
        if self._iter_data is None:
            self._iter_data = await self.to_list()
        if self._iter_index >= len(self._iter_data):
            raise StopAsyncIteration
        item = self._iter_data[self._iter_index]
        self._iter_index += 1
        return item


# ──────────────────────────────────────────────────────────────────────────────
# Collection — MongoDB-compatible async API on top of PostgreSQL JSONB
# ──────────────────────────────────────────────────────────────────────────────

class PGCollection:
    def __init__(self, table: str):
        self.table = table

    async def find_one(self, filter_dict: dict, projection=None):
        where, params = _build_where(filter_dict)
        sql = f"SELECT data FROM {self.table} WHERE {where} LIMIT 1"
        async with _pool.acquire() as conn:
            row = await conn.fetchrow(sql, *params)
        return _parse_row_data(row["data"]) if row else None

    def find(self, filter_dict=None, projection=None):
        return PGCursor(self.table, filter_dict or {})

    async def insert_one(self, doc: dict):
        if "_id" not in doc:
            doc["_id"] = str(uuid.uuid4())
        async with _pool.acquire() as conn:
            await conn.execute(
                f"INSERT INTO {self.table} (data) VALUES ($1::jsonb)",
                json.dumps(doc, default=str),
            )
        class InsertResult:
            inserted_id = doc["_id"]
        return InsertResult()

    async def update_one(self, filter_dict: dict, update_dict: dict, upsert: bool = False):
        where, params = _build_where(filter_dict)
        set_data = update_dict.get("$set", {})
        # Check existing
        sql_find = f"SELECT id, data FROM {self.table} WHERE {where} LIMIT 1"
        async with _pool.acquire() as conn:
            row = await conn.fetchrow(sql_find, *params)
            if row:
                merged = {**_parse_row_data(row["data"]), **set_data}
                await conn.execute(
                    f"UPDATE {self.table} SET data = $1::jsonb WHERE id = $2",
                    json.dumps(merged, default=str), row["id"],
                )
            elif upsert:
                new_doc = {**filter_dict, **set_data, "_id": str(uuid.uuid4())}
                await conn.execute(
                    f"INSERT INTO {self.table} (data) VALUES ($1::jsonb)",
                    json.dumps(new_doc, default=str),
                )

    async def delete_one(self, filter_dict: dict):
        where, params = _build_where(filter_dict)
        async with _pool.acquire() as conn:
            row = await conn.fetchrow(
                f"SELECT id FROM {self.table} WHERE {where} LIMIT 1", *params
            )
            if row:
                await conn.execute(f"DELETE FROM {self.table} WHERE id = $1", row["id"])

    async def delete_many(self, filter_dict: dict):
        where, params = _build_where(filter_dict)
        async with _pool.acquire() as conn:
            await conn.execute(f"DELETE FROM {self.table} WHERE {where}", *params)

    async def count_documents(self, filter_dict: dict) -> int:
        where, params = _build_where(filter_dict)
        async with _pool.acquire() as conn:
            row = await conn.fetchrow(
                f"SELECT COUNT(*) AS cnt FROM {self.table} WHERE {where}", *params
            )
        return row["cnt"] if row else 0


# ──────────────────────────────────────────────────────────────────────────────
# DB facade — attribute access creates collection on demand
# ──────────────────────────────────────────────────────────────────────────────

class PGDB:
    _caches: dict = {}

    def __getattr__(self, name: str) -> PGCollection:
        if name not in self._caches:
            self._caches[name] = PGCollection(name)
        return self._caches[name]


class _NoopClient:
    def close(self): pass


db = PGDB()
client = _NoopClient()
