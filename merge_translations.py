import json

with open("extracted_translations.json", "r", encoding="utf-8") as f:
    uk_new = json.load(f)

with open("en_extracted.json", "r", encoding="utf-8") as f:
    en_new = json.load(f)

with open("frontend/src/locales/uk.json", "r", encoding="utf-8") as f:
    uk_base = json.load(f)

with open("frontend/src/locales/en.json", "r", encoding="utf-8") as f:
    en_base = json.load(f)

# Merge
uk_base.update(uk_new)
en_base.update(en_new)

with open("frontend/src/locales/uk.json", "w", encoding="utf-8") as f:
    json.dump(uk_base, f, ensure_ascii=False, indent=2)

with open("frontend/src/locales/en.json", "w", encoding="utf-8") as f:
    json.dump(en_base, f, ensure_ascii=False, indent=2)

print("Merged successfully!")
