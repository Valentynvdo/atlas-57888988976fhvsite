import json

uk_path = "frontend/src/locales/uk.json"
en_path = "frontend/src/locales/en.json"

with open(uk_path, "r", encoding="utf-8") as f: uk_data = json.load(f)
with open(en_path, "r", encoding="utf-8") as f: en_data = json.load(f)

new_uk = {
    "seo_nav_performance": "Продуктивність та Архітектура",
    "seo_performance_h3": "Apple Silicon AI Assistant & Desktop Optimization",
    "seo_performance_p1": "Створений спеціально для екосистеми Apple, Atlas функціонує як високопродуктивний, <strong>native apple silicon ai assistant</strong>, що використовує всю потужність Neural Engine. На відміну від веб-інструментів, цей <strong>native ai app macos</strong> обходить браузерні обмеження, щоб забезпечити миттєву швидкість обробки.",
    "seo_performance_p2": "Він слугує елітним <strong>mac productivity ai tool</strong>, який обробляє важкі скрипти автоматизації без виснаження батареї чи сповільнення інтерфейсу. Якщо ви шукаєте <strong>best ai tools for mac</strong>, які поважають апаратне забезпечення вашого комп'ютера, Atlas забезпечує легку <strong>desktop ai assistant mac</strong> інфраструктуру, оптимізовану для чипів M1, M2, M3 та M4, роблячи його найкращим <strong>best automation software for mac</strong> для power-користувачів.",

    "seo_nav_investors": "Екосистема та Інвестиції",
    "seo_investors_h3": "AI Startup Investment Opportunities & B2B Scaling",
    "seo_investors_p1": "Atlas AI переосмислює ринок десктопних застосунків, створюючи високомасштабовану автономну екосистему. Ми активно розширюємо наші корпоративні можливості, відкриваючи потужні <strong>ai startup investment opportunities</strong> для венчурних фондів та бізнес-ангелів, які бажають інвестувати у <strong>macos ai software</strong> ринки.",
    "seo_investors_p2": "Наша дорожня карта фокусується на крос-додаткових модулях (<strong>workflow automation ai startup</strong>) та спеціалізованих B2B-функціях, позиціонуючи Atlas як <strong>next generation ai assistant b2b</strong> рішення для сучасних корпоративних команд. Як високопродуктивна <strong>saas ai assistant macos</strong> архітектура, що підтримує створення кастомних навичок, ми представляємо собою надзвичайно руйнівну силу на ринку десктопної AI автоматизації. Дослідіть наші <strong>artificial intelligence startup pitch</strong> деталі, щоб дізнатись, як ми масштабуємо майбутнє локальних, безпечних та розумних десктопних обчислень."
}

new_en = {
    "seo_nav_performance": "Performance & Architecture",
    "seo_performance_h3": "Apple Silicon AI Assistant & Desktop Optimization",
    "seo_performance_p1": "Engineered specifically for the Apple ecosystem, Atlas functions as a high-performance, <strong>native apple silicon ai assistant</strong> that utilizes the full power of the Neural Engine. Unlike web-based tools, this <strong>native ai app macos</strong> installation bypasses browser limitations to deliver instantaneous processing speeds.",
    "seo_performance_p2": "It serves as an elite <strong>mac productivity ai tool</strong> that handles heavy automation scripts without draining your battery or lagging your interface. If you are looking for the <strong>best ai tools for mac</strong> that respect your machine's hardware, Atlas provides a lightweight <strong>desktop ai assistant mac</strong> infrastructure optimized for M1, M2, M3, and M4 chips, making it the premier <strong>best automation software for mac</strong> power users.",

    "seo_nav_investors": "Ecosystem & Investment",
    "seo_investors_h3": "AI Startup Investment Opportunities & B2B Scaling",
    "seo_investors_p1": "Atlas AI is redefining the desktop landscape by building a highly scalable, autonomous ecosystem. We are actively expanding our enterprise capabilities, opening high-growth <strong>ai startup investment opportunities</strong> for venture capital funds and angel investors looking to invest in <strong>macos ai software</strong> markets.",
    "seo_investors_p2": "Our roadmap focuses on cross-application <strong>workflow automation ai startup</strong> modules and specialized B2B features, positioning Atlas as a <strong>next generation ai assistant b2b</strong> solution for modern corporate teams. As a high-performance <strong>saas ai assistant macos</strong> architecture that supports custom skill creation, we represent a highly disruptive force in the desktop ai automation market. Explore our <strong>artificial intelligence startup pitch</strong> details to learn how we are scaling the future of local, secure, and intelligent desktop computing."
}

uk_data.update(new_uk)
en_data.update(new_en)

json.dump(uk_data, open(uk_path, 'w'), ensure_ascii=False, indent=2)
json.dump(en_data, open(en_path, 'w'), ensure_ascii=False, indent=2)
