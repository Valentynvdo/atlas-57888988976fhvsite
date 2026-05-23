import asyncio
import os
import sys

# Змінюємо шлях, щоб імпортувати auth.py
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'Desktop', 'atlas_ai', 'website', 'backend'))

import auth
from db import init_pool, close_pool
from fastapi import Request, Header

class DummyRequest:
    def __init__(self, headers):
        self.headers = headers
        self.cookies = {}

async def test():
    await init_pool()
    
    # 1. Login
    body = {
        "email": "admin@atlas.com",
        "password": "srv-d84mtqjtqb8s73fgcjog"
    }
    
    class DummyResponse:
        def __init__(self):
            self.cookies = {}
        def set_cookie(self, **kwargs):
            pass
            
    try:
        resp = await auth.login(body, DummyResponse())
        print("Login response:", resp)
        
        token = resp.get("token")
        if not token:
            print("ERROR: No token returned in JSON!")
            return
            
        print("Token:", token)
        
        # 2. Test get_current_user
        req = DummyRequest({"authorization": f"Bearer {token}"})
        try:
            user = await auth.get_current_user(req, authorization=f"Bearer {token}")
            print("Current user:", user)
        except Exception as e:
            print("get_current_user Error:", e)
            
    finally:
        await close_pool()

if __name__ == "__main__":
    asyncio.run(test())
