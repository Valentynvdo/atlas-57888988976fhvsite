import asyncio
import asyncpg
import json

DATABASE_URL = "postgresql://atlas_65dr_user:ZlCGeV2iyAeJ4ZEe3q1374QhsHlkoEWy@dpg-d84m5cnaqgkc73ao2ih0-a.oregon-postgres.render.com/atlas_65dr"

async def main():
    conn = await asyncpg.connect(DATABASE_URL, ssl="require")
    rows = await conn.fetch("SELECT data FROM job_applications ORDER BY id DESC LIMIT 5")
    for row in rows:
        print(json.dumps(json.loads(row['data']), ensure_ascii=False, indent=2))
    await conn.close()

asyncio.run(main())
