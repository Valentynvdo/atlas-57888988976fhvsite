import xml.etree.ElementTree as ET

paths = [
    "",
    "privacy",
    "terms",
    "contacts",
    "docs",
    "careers",
    "team",
    "investors",
    "blog",
    "blog/why-we-created-atlas",
    "blog/ai-impact-on-humanity",
    "blog/macos-automation-future",
    "blog/privacy-first-ai",
    "blog/evolution-of-ai-assistants",
    "blog/top-10-mac-hacks",
    "blog/ai-in-software-development",
    "blog/getting-started-with-atlas",
    "blog/future-of-voice-interfaces",
    "blog/security-in-ai-tools"
]

base_url = "https://atlas-assistant.online"

xml_str = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for path in paths:
    # Ukrainian (base)
    loc = f"{base_url}/{path}" if path else f"{base_url}/"
    freq = "daily" if path in ("", "blog") else "monthly"
    pri = "1.0" if not path else ("0.8" if path in ("blog", "docs") else "0.7")
    
    xml_str += f"""  <url>
    <loc>{loc}</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{pri}</priority>
  </url>\n"""

    # English (/en)
    loc_en = f"{base_url}/en/{path}" if path else f"{base_url}/en"
    xml_str += f"""  <url>
    <loc>{loc_en}</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{pri}</priority>
  </url>\n"""

xml_str += '</urlset>\n'

with open('/Users/valentinvdovicenko/Desktop/atlas_ai/website/frontend/public/sitemap.xml', 'w') as f:
    f.write(xml_str)
