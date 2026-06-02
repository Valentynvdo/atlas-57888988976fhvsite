import asyncio
import os
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.abspath('.'))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from db import db, init_pool, close_pool

async def update_link():
    await init_pool()
    url = "https://drive.google.com/uc?export=download&id=1mkEs6GUNf86GhEwlQ65WKmhEo1B-wf4m"
    print(f"Updating atlas_version url to: {url}")
    
    await db.app_config.update_one(
        {"_id": "atlas_version"},
        {"$set": {
            "url": url,
            "released_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )
    
    doc = await db.app_config.find_one({"_id": "atlas_version"})
    print("Updated doc:", doc)
    await close_pool()

asyncio.run(update_link())
