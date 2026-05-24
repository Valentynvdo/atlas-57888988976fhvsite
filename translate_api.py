import json
import urllib.request
import urllib.parse
import time

def translate(text, sl="uk", tl="en"):
    # Avoid translating single characters or empty strings unnecessarily
    if not text.strip() or len(text.strip()) == 1 and not text.isalpha():
        return text
    
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl={sl}&tl={tl}&dt=t&q={urllib.parse.quote(text)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode())
            return "".join([x[0] for x in res[0]])
    except Exception as e:
        print("Error translating:", text, e)
        return text

with open("extracted_translations.json", "r", encoding="utf-8") as f:
    data = json.load(f)

en_data = {}
count = 0
total = len(data)

print(f"Starting translation of {total} items...")
for k, v in data.items():
    en_data[k] = translate(v)
    count += 1
    if count % 50 == 0:
        print(f"Translated {count}/{total}")
    time.sleep(0.05)

with open("en_extracted.json", "w", encoding="utf-8") as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("Done translating!")
