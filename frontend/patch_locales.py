import json
import os

files = {
    'src/locales/en.json': {
        "awareness": {
            "eyebrow": "Absolute Consciousness",
            "badge": "Atlas Vision",
            "title_1": "remembers that",
            "title_2": "what is important to you",
            "desc": "Atlas recognizes you by face, remembers your addresses, preferences and names of your guests, ensuring a completely personalized experience - no questions asked.",
            "stat1_title": "Recognition",
            "stat1_val": "Face & Voice",
            "stat2_title": "Addresses",
            "stat2_val": "Home · Work",
            "stat3_title": "Contacts",
            "stat3_val": "Family · Friends",
            "stat4_title": "Likes",
            "stat4_val": "Always at hand"
        },
        "interactions": {
            "eyebrow": "Seamless Control",
            "title": "Always Connected.",
            "desc": "Control your Mac locally with your voice or remotely from anywhere in the world via a secure Telegram bot.",
            "voice_title": "Local Voice",
            "voice_desc": "Atlas constantly listens to the space in the background. No clicks or activation — just say what you need, and the system will react instantly.",
            "tg_title": "Remote Access",
            "tg_desc": "Control your computer via the official Telegram bot. Atlas will execute the command on your Mac, even if you are on another continent."
        },
        "comparison": {
            "title": "This is not just a chatbot.",
            "subtitle": "ATLAS is an autonomous AI operating system.",
            "normal_ai": "Normal AI",
            "system_active": "System Active",
            "tabs": {
                "intelligence": "Intelligence",
                "vision": "Perception",
                "infrastructure": "Infrastructure"
            },
            "items": {
                "intelligence_n1": "Limited by pre-programmed skills",
                "intelligence_n2": "Every chat is a blank slate",
                "intelligence_n3": "Always waits for a command",
                "intelligence_a1": "Writes its own code",
                "intelligence_a2": "Has deep long-term memory",
                "intelligence_a3": "Acts autonomously and proactively",
                "vision_n1": "Disconnected from your system",
                "vision_n2": "Only analyzes uploaded files",
                "vision_n3": "Forgets you after closing",
                "vision_a1": "Sees and understands your screen",
                "vision_a2": "Recognizes your face (FaceID)",
                "vision_a3": "Perceives context in real-time",
                "infrastructure_n1": "Sends data to third-party servers",
                "infrastructure_n2": "Slow API connection",
                "infrastructure_n3": "Single heavy model for everything",
                "infrastructure_a1": "100% local privacy",
                "infrastructure_a2": "Minimal latency < 300ms",
                "infrastructure_a3": "Smart cascade of local neural networks"
            }
        }
    },
    'src/locales/uk.json': {
        "awareness": {
            "eyebrow": "Абсолютна Свідомість",
            "badge": "Atlas Vision",
            "title_1": "Пам'ятає те,",
            "title_2": "що важливо для вас",
            "desc": "Атлас впізнає вас в обличчя, пам'ятає ваші адреси, вподобання та імена ваших гостей, забезпечуючи абсолютно персоналізований досвід — без зайвих запитань.",
            "stat1_title": "Розпізнавання",
            "stat1_val": "Обличчя та Голос",
            "stat2_title": "Адреси",
            "stat2_val": "Дім · Робота",
            "stat3_title": "Контакти",
            "stat3_val": "Сім'я · Друзі",
            "stat4_title": "Вподобання",
            "stat4_val": "Завжди під рукою"
        },
        "interactions": {
            "eyebrow": "Безшовний контроль",
            "title": "Завжди на зв'язку.",
            "desc": "Керуйте своїм Mac локально за допомогою голосу або віддалено з будь-якої точки світу через захищеного Telegram-бота.",
            "voice_title": "Локальний голос",
            "voice_desc": "Atlas постійно слухає простір у фоновому режимі. Жодних натискань чи активації — просто скажіть, що вам потрібно, і система миттєво відреагує.",
            "tg_title": "Віддалений доступ",
            "tg_desc": "Керуйте комп'ютером через офіційного бота в Telegram. Atlas виконає команду на вашому Mac, навіть якщо ви на іншому континенті."
        },
        "comparison": {
            "title": "Це не просто чат-бот.",
            "subtitle": "ATLAS — це автономна ШІ операційна система.",
            "normal_ai": "Звичайний ШІ",
            "system_active": "System Active",
            "tabs": {
                "intelligence": "Інтелект",
                "vision": "Сприйняття",
                "infrastructure": "Інфраструктура"
            },
            "items": {
                "intelligence_n1": "Обмежений зашитими навичками",
                "intelligence_n2": "Кожен чат — чистий аркуш",
                "intelligence_n3": "Завжди чекає на команду",
                "intelligence_a1": "Самостійно пише для себе код",
                "intelligence_a2": "Має глибоку довгострокову пам'ять",
                "intelligence_a3": "Діє автономно та проактивно",
                "vision_n1": "Відірваний від вашої системи",
                "vision_n2": "Аналізує лише завантажені файли",
                "vision_n3": "Забуває вас після закриття",
                "vision_a1": "Бачить і розуміє ваш екран",
                "vision_a2": "Впізнає вас в обличчя (FaceID)",
                "vision_a3": "Сприймає контекст у реальному часі",
                "infrastructure_n1": "Віддає дані на чужі сервери",
                "infrastructure_n2": "Повільне API-з'єднання",
                "infrastructure_n3": "Єдина важка модель для всього",
                "infrastructure_a1": "100% локальна конфіденційність",
                "infrastructure_a2": "Мінімальна затримка < 300мс",
                "infrastructure_a3": "Розумний каскад локальних нейромереж"
            }
        }
    }
}

for filepath, new_data in files.items():
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data['atlas_v2'] = new_data
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {filepath}")
