import asyncio
from db import db, init_pool

async def main():
    import os
    os.environ["DATABASE_URL"] = "postgresql://atlas_65dr_user:ZlCGeV2iyAeJ4ZEe3q1374QhsHlkoEWy@dpg-d84m5cnaqgkc73ao2ih0-a.oregon-postgres.render.com/atlas_65dr"
    
    # Reload db.py DATABASE_URL
    import db as db_module
    db_module.DATABASE_URL = os.environ["DATABASE_URL"]
    
    await init_pool()
    try:
        apps = await db.job_applications.find({}).sort("created_at", -1).to_list(1000)
        print("Success, found", len(apps))
    except Exception as e:
        print("ERROR:", e)

asyncio.run(main())
