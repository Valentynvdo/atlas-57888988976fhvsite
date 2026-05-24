import re, json

with open("frontend/src/pages/Admin.jsx", "r", encoding="utf-8") as f:
    text = f.read()

matches = re.findall(r"(?:>|\"|'|`)([^<\"'`]*?[\u0400-\u04FF]+[^<\"'`]*?)(?:<|\"|'|`)", text)

strings = list(set([m.strip() for m in matches if m.strip()]))
print(f"Found {len(strings)} unique Cyrillic strings in Admin.jsx")
with open("admin_strings.json", "w", encoding="utf-8") as f:
    json.dump(strings, f, ensure_ascii=False, indent=2)
