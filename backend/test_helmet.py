import re

html = '<title data-rh="true">Old</title><meta name="description" content="Old desc" data-rh="true" />'
meta = {"title": "New Title", "description": "New Desc"}

if re.search(r'<title[^>]*>[^<]*</title>', html):
    html = re.sub(r'<title[^>]*>[^<]*</title>', f'<title data-rh="true">{meta["title"]}</title>', html, count=1)

html = re.sub(
    r'<meta name="description" content="[^"]*"',
    f'<meta name="description" content="{meta["description"]}"',
    html, count=1
)

print(html)
