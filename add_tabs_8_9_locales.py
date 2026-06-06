import json

uk_path = "frontend/src/locales/uk.json"
en_path = "frontend/src/locales/en.json"

with open(uk_path, "r", encoding="utf-8") as f: uk_data = json.load(f)
with open(en_path, "r", encoding="utf-8") as f: en_data = json.load(f)

new_uk = {
    "seo_nav_skills": "Skills & Extensions",
    "seo_skills_h3": "How to Build Custom AI Skills & Developer Framework",
    "seo_skills_p1": "Візьміть свій робочий процес під повний контроль, дізнавшись, <strong>how to build custom ai skills</strong>, ідеально адаптовані під ваші щоденні задачі. Atlas має модульний фреймворк для розробників, де ви можете писати код, скрипти та розгортати унікальні моделі поведінки, що інтегруються безпосередньо з нативними десктопними додатками.",
    "seo_skills_p2": "Незалежно від того, чи ви об'єднуєте термінальні команди, автоматизуєте API-ендпоінти, або створюєте макро-подібні послідовності, наше середовище підтримує створення безмежної кількості кастомних навичок. Це робить Atlas значно більшим, ніж просто інструмент — це розширюване <strong>autonomous ai app macbook</strong> середовище, де розробники можуть створювати глибокі системні інтеграції, повністю перевершуючи традиційні статичні макро-утиліти та жорстке програмне забезпечення для автоматизації.",

    "seo_nav_agents": "Agents vs Assistants",
    "seo_agents_h3": "AI Agents vs Traditional Assistants: The Next Generation",
    "seo_agents_p1": "Розуміння різниці між <strong>ai agents vs traditional assistants</strong> є критично важливим для сучасної цифрової ефективності. У той час як застаріле програмне забезпечення лише відповідає на статичні, одноразові запити, <strong>autonomous ai agent macos</strong> архітектура розуміє кінцеву мету, самостійно планує необхідні кроки та виконує їх.",
    "seo_agents_p2": "Atlas не просто відповідає на запитання — він орієнтується у вашій файловій системі, взаємодіє з інтерфейсами додатків і самостійно виправляє помилки в реальному часі. Відмовляючись від залежних від хмари чат-ботів, ця архітектура забезпечує постійне та безпечне рішення щодо того, <strong>how to automate routine tasks on mac</strong>, встановлюючи новий стандарт на ринку десктопної AI автоматизації."
}

new_en = {
    "seo_nav_skills": "Skills & Extensions",
    "seo_skills_h3": "How to Build Custom AI Skills & Developer Framework",
    "seo_skills_p1": "Take control of your workflow by learning <strong>how to build custom ai skills</strong> tailored precisely to your daily operations. Atlas features a modular developer framework where you can code, script, and deploy unique behaviors that integrate directly with native desktop apps.",
    "seo_skills_p2": "Whether you are chaining terminal commands, automating API endpoints, or creating macro-like sequences, our environment supports unlimited custom skill creation. This makes Atlas much more than a standard tool—it is an expandable <strong>autonomous ai app macbook</strong> environment where developers can build deep system integrations, completely outclassing traditional static macro utilities and rigid automation software.",

    "seo_nav_agents": "Agents vs Assistants",
    "seo_agents_h3": "AI Agents vs Traditional Assistants: The Next Generation",
    "seo_agents_p1": "Understanding the difference between <strong>ai agents vs traditional assistants</strong> is crucial for modern digital efficiency. While legacy software only responds to static, single-turn prompts, an <strong>autonomous ai agent macos</strong> architecture understands the ultimate goal, plans the necessary steps, and executes them independently.",
    "seo_agents_p2": "Atlas does not just answer questions—it navigates your file system, interacts with application interfaces, and self-corrects errors in real-time. By moving away from cloud-dependent chatbots, this architecture delivers a permanent solution to <strong>how to automate routine tasks on mac</strong> securely, establishing a new benchmark in the desktop ai automation market."
}

uk_data.update(new_uk)
en_data.update(new_en)

json.dump(uk_data, open(uk_path, 'w'), ensure_ascii=False, indent=2)
json.dump(en_data, open(en_path, 'w'), ensure_ascii=False, indent=2)
