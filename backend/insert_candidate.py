import asyncio
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()
from db import init_pool, close_pool, db

async def insert_test_candidate():
    await init_pool()
    await db.job_applications.insert_one({
        "name": "Валентин Тестер",
        "contact": "@tester_pro",
        "portfolio": "https://github.com/atlas-tester",
        "experience": "Маю 5 років досвіду в розробці. Вмію будувати архітектуру, делегувати задачі AI та робити рев'ю.",
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    await close_pool()
    print("Test candidate inserted")

if __name__ == "__main__":
    asyncio.run(insert_test_candidate())
