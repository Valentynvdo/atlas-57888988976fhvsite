import json
import os

uk_path = "uk.json"
en_path = "en.json"

uk_data = json.load(open(uk_path, 'r'))
en_data = json.load(open(en_path, 'r'))

seo_uk = {
    "seo_title": "Можливості та Кейси Використання",
    "seo_desc": "Повний огляд функцій: від автономного виконання завдань на Mac до захисту приватності та локальної обробки даних.",
    "seo_nav_voice": "Голосове керування",
    "seo_nav_privacy": "Локальна безпека та Приватність",
    "seo_nav_automation": "Автономна автоматизація macOS",
    "seo_nav_files": "Керування файлами та даними",
    "seo_nav_telegram": "Віддалений контроль (Telegram)",
    
    "seo_voice_h3": "Голосове керування (Voice Controlled Mac App)",
    "seo_voice_p1": "Забудьте про складні шорткати чи постійний пошук потрібного меню. Наш <strong>hands free mac control ai</strong> дозволяє вам віддавати складні голосові команди, які миттєво перетворюються на реальні дії у вашій системі.",
    "seo_voice_p2": "Як найкращий <em>speech to text assistant mac</em>, Atlas бездоганно розуміє українську та англійську, дозволяючи вам <strong>automate mac with voice commands</strong> з неймовірною точністю. Пишете код, монтуєте відео або готуєте презентацію? Залиште рутину штучному інтелекту: просто скажіть йому «закрий всі фонові програми та увімкни фокус-режим». Це справжній <strong>voice ai assistant macos</strong> нового покоління.",
    
    "seo_privacy_h3": "Локальна безпека та Приватність (Privacy Focused AI Mac)",
    "seo_privacy_p1": "Коли йдеться про ваші особисті дані, компромісів бути не може. Atlas розроблений як повністю <strong>offline ai agent mac</strong>, який гарантує, що ваші конфіденційні файли, паролі та листування ніколи не покинуть ваш пристрій.",
    "seo_privacy_p2": "Завдяки інноваційному <strong>local data ai processing mac</strong>, ви отримуєте потужність нейромереж безпосередньо на вашому Apple Silicon процесорі (M1/M2/M3). Цей <strong>privacy focused ai mac</strong> використовує локальну векторну базу знань (local knowledge base ai mac) для швидкого контекстного пошуку, забезпечуючи вам абсолютний контроль та безпеку (secure personal ai assistant mac).",
    
    "seo_automation_h3": "Автономна автоматизація macOS (Autonomous AI Agent Mac)",
    "seo_automation_p1": "Atlas AI — це не просто бот, який відповідає на питання. Це <strong>autonomous ai agent mac</strong>, здатний самостійно планувати та виконувати багатокрокові задачі.",
    "seo_automation_p2": "Відтепер <strong>automate macos routine tasks</strong> стало як ніколи легко. Завдяки системі <strong>autonomous task execution mac</strong>, асистент може самостійно переглядати ваш екран (за вашим дозволом), аналізувати інтерфейси та керувати застосунками (ai app management macos). Ви можете створювати <strong>custom ai skills macos</strong>, перетворюючи Atlas на ідеального компаньйона (personal ai companion mac) для специфічних розробницьких чи дизайнерських пайплайнів.",
    
    "seo_files_h3": "Керування файлами та Системою (AI File Manager Mac)",
    "seo_files_p1": "Уявіть, що ваш Mac розуміє вас з півслова. Як потужний <strong>ai system controller mac</strong>, Atlas глибоко інтегрований з файловою системою та нативними утилітами macOS (native ai app macos).",
    "seo_files_p2": "Використовуйте його як <strong>ai file manager mac</strong> для сортування завантажень, пошуку загублених документів за змістом (а не тільки за назвою) та масового перейменування файлів. З Atlas ви можете миттєво <strong>increase mac productivity with ai</strong>, делегуючи йому нудне впорядкування системи.",
    
    "seo_telegram_h3": "Віддалений контроль через Telegram (Telegram Remote Control Mac)",
    "seo_telegram_p1": "Залишили Mac увімкненим удома? Не проблема. З Atlas ви отримуєте можливість <strong>control macbook remotely with ai</strong> через захищений бот у Telegram.",
    "seo_telegram_p2": "Використовуйте <strong>telegram remote control mac</strong>, щоб попросити асистента завантажити файл, перевірити статус рендеру або навіть вимкнути комп'ютер (control mac via telegram). Це найкращий <strong>smart assistant for mac</strong>, який завжди залишається на зв'язку з вами, де б ви не знаходились."
}

seo_en = {
    "seo_title": "Features & Use Cases",
    "seo_desc": "Comprehensive overview: from autonomous task execution on Mac to strict privacy protection and local data processing.",
    "seo_nav_voice": "Voice Control",
    "seo_nav_privacy": "Local Security & Privacy",
    "seo_nav_automation": "Autonomous macOS Automation",
    "seo_nav_files": "Files & Data Management",
    "seo_nav_telegram": "Remote Control (Telegram)",
    
    "seo_voice_h3": "Voice Controlled Mac App",
    "seo_voice_p1": "Forget complex shortcuts or digging through menus. Our <strong>hands free mac control ai</strong> allows you to issue complex voice commands that instantly translate into real actions on your system.",
    "seo_voice_p2": "As the premier <em>speech to text assistant mac</em>, Atlas understands context flawlessly, allowing you to <strong>automate mac with voice commands</strong> with incredible precision. Writing code, editing video, or preparing a presentation? Leave the routine to AI: just tell it 'close all background apps and turn on focus mode.' This is a true next-generation <strong>voice ai assistant macos</strong>.",
    
    "seo_privacy_h3": "Local Security & Privacy (Privacy Focused AI Mac)",
    "seo_privacy_p1": "When it comes to your personal data, there can be no compromises. Atlas is designed as a fully <strong>offline ai agent mac</strong>, ensuring your confidential files, passwords, and messages never leave your device.",
    "seo_privacy_p2": "Thanks to innovative <strong>local data ai processing mac</strong>, you get neural network power directly on your Apple Silicon chip (M1/M2/M3). This <strong>privacy focused ai mac</strong> leverages a local knowledge base (local knowledge base ai mac) for lightning-fast contextual search, granting you absolute control and security (secure personal ai assistant mac).",
    
    "seo_automation_h3": "Autonomous macOS Automation (Autonomous AI Agent Mac)",
    "seo_automation_p1": "Atlas AI is not just a chatbot. It is a genuine <strong>autonomous ai agent mac</strong> capable of planning and executing multi-step workflows on its own.",
    "seo_automation_p2": "Now it's easier than ever to <strong>automate macos routine tasks</strong>. With <strong>autonomous task execution mac</strong>, the assistant can independently view your screen (with permission), analyze interfaces, and manage applications (ai app management macos). You can even build <strong>custom ai skills macos</strong>, turning Atlas into the perfect <strong>personal ai companion mac</strong> for specific development or design pipelines.",
    
    "seo_files_h3": "System & File Management (AI File Manager Mac)",
    "seo_files_p1": "Imagine your Mac understanding exactly what you mean. As a powerful <strong>ai system controller mac</strong>, Atlas is deeply integrated with the file system and native macOS utilities (native ai app macos).",
    "seo_files_p2": "Use it as an <strong>ai file manager mac</strong> to sort downloads, find lost documents by content (not just title), and batch rename files. With Atlas, you can instantly <strong>increase mac productivity with ai</strong> by delegating tedious system organization.",
    
    "seo_telegram_h3": "Telegram Remote Control Mac",
    "seo_telegram_p1": "Left your Mac running at home? Not a problem. With Atlas, you can <strong>control macbook remotely with ai</strong> via a secure Telegram bot.",
    "seo_telegram_p2": "Use the <strong>telegram remote control mac</strong> feature to ask the assistant to download a file, check render status, or even shut down the computer (control mac via telegram). It's the ultimate <strong>smart assistant for mac</strong> that stays connected with you, wherever you are."
}

uk_data.update(seo_uk)
en_data.update(seo_en)

json.dump(uk_data, open(uk_path, 'w'), ensure_ascii=False, indent=2)
json.dump(en_data, open(en_path, 'w'), ensure_ascii=False, indent=2)

print("Locales updated!")
