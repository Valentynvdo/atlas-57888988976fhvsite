import asyncio
import httpx

async def test():
    async with httpx.AsyncClient() as client:
        res = await client.post("https://atlas-backend-zhgz.onrender.com/api/auth/login", json={
            "email": "admin@atlas.com",
            "password": "srv-d84mtqjtqb8s73fgcjog"
        })
        print("Login status:", res.status_code)
        data = res.json()
        print("Login data:", data)
        token = data.get("token")
        
        if not token:
            print("NO TOKEN!")
            return
            
        res2 = await client.get("https://atlas-backend-zhgz.onrender.com/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        print("Me status:", res2.status_code)
        print("Me data:", res2.text)

asyncio.run(test())
