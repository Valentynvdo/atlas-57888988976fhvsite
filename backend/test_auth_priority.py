def get_token(cookie_val, auth_val):
    token = auth_val
    if token and token.lower().startswith("bearer "):
        token = token.split(None, 1)[1].strip()
    if not token:
        token = cookie_val
    return token

print("Test 1:", get_token("stale_cookie", "Bearer valid_token"))
print("Test 2:", get_token("stale_cookie", None))
print("Test 3:", get_token(None, "Bearer valid_token"))
