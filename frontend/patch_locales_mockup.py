import json
import os

files = {
    'src/locales/en.json': {
        "commands": [
            '"Atlas, close all work windows"',
            '"Atlas, find the investor presentation"',
            '"Atlas, translate this text to English"',
            '"Atlas, open the latest project code"'
        ],
        "telegram": [
            {
                "req": "Turn on background music for concentration",
                "res": "🎵 Got it. Started 'Deep Focus' playlist on Spotify."
            },
            {
                "req": "Put Mac to sleep",
                "res": "✅ Done. Mac successfully locked."
            },
            {
                "req": "Find all logs from yesterday",
                "res": "📂 Found 3 files. Should I send them here?"
            }
        ],
        "telegram_ui": {
            "bot": "bot",
            "message": "Message..."
        }
    },
    'src/locales/uk.json': {
        "commands": [
            '"Atlas, закрий всі робочі вікна"',
            '"Atlas, знайди презентацію для інвесторів"',
            '"Atlas, переклади цей текст англійською"',
            '"Atlas, відкрий код останнього проекту"'
        ],
        "telegram": [
            {
                "req": "Увімкни фонову музику для концентрації",
                "res": "🎵 Зрозумів. Запустив плейлист 'Deep Focus' у Spotify."
            },
            {
                "req": "Переведи Mac у сплячий режим",
                "res": "✅ Готово. Mac успішно заблоковано."
            },
            {
                "req": "Знайди всі логи за вчорашній день",
                "res": "📂 Знайшов 3 файли. Відправити їх сюди?"
            }
        ],
        "telegram_ui": {
            "bot": "бот",
            "message": "Повідомлення..."
        }
    }
}

for filepath, new_data in files.items():
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data['atlas_v2']['mockups'] = new_data
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {filepath} mockups")
