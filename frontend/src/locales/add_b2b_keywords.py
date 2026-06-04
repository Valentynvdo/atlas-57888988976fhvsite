import json
import re

uk_path = "uk.json"
en_path = "en.json"

with open(uk_path, 'r') as f:
    uk_data = json.load(f)
with open(en_path, 'r') as f:
    en_data = json.load(f)

def clean_html(text):
    return re.sub(r'<[^>]*>', '', text)

uk_data["investors_page"]["subtitle"] = clean_html(uk_data["investors_page"]["subtitle"])
uk_data["investors_page"]["h1_desc"] = clean_html(uk_data["investors_page"]["h1_desc"])
uk_data["investors_page"]["h2_desc"] = clean_html(uk_data["investors_page"]["h2_desc"])

en_data["investors_page"]["subtitle"] = clean_html(en_data["investors_page"]["subtitle"])
en_data["investors_page"]["h1_desc"] = clean_html(en_data["investors_page"]["h1_desc"])
en_data["investors_page"]["h2_desc"] = clean_html(en_data["investors_page"]["h2_desc"])

with open(uk_path, 'w') as f:
    json.dump(uk_data, f, ensure_ascii=False, indent=2)
with open(en_path, 'w') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("Cleaned B2B/Investors keywords from HTML tags.")
