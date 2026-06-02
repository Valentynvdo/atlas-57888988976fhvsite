import asyncio
import os
import sys

sys.path.insert(0, os.path.abspath('.'))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from db import db, init_pool, close_pool

async def check():
    await init_pool()
    doc = await db.app_config.find_one({"_id": "atlas_version"})
    print("CURRENT VERSION DOC:", doc)
    await close_pool()

asyncio.run(check())
