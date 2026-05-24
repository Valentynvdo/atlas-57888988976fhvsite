import json

def update_locale(file_path, new_data):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data.update(new_data)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

uk_data = {
    "living_intel": {
        "title_1": "Розум, який",
        "title_2": "ніколи не зупиняється.",
        "desc": "Атлас не обмежений заздалегідь написаними сценаріями. Він постійно розвивається, вивчає ваші звички та самостійно знаходить нові шляхи для вирішення щоденних завдань, щоб ставати кращим з кожним днем.",
        "f1_title": "Самонавчання",
        "f1_desc": "Адаптується до вашого ритму та стилю життя.",
        "f2_title": "Без обмежень",
        "f2_desc": "Знаходить нові підходи там, де інші зупиняються.",
        "f3_title": "Жива еволюція",
        "f3_desc": "Кожен день — крок до кращої версії себе.",
        "live_badge": "Активний у реальному часі"
    },
    "live_thought": {
        "studying": "Що зараз вивчає Атлас:"
    },
    "final_cta": {
        "title_1": "Готовий до еволюції",
        "title_2": "macOS?",
        "desc": "Почни використовувати Atlas AI сьогодні та відчуй, як твій Mac стає по-справжньому живим.",
        "btn": "Спробувати зараз"
    },
    "footer": {
        "privacy": "Приватність",
        "terms": "Умови",
        "contacts": "Контакти",
        "created_with_care": "Створено з турботою для macOS."
    }
}

en_data = {
    "living_intel": {
        "title_1": "A mind that",
        "title_2": "never stops.",
        "desc": "Atlas is not limited by pre-written scripts. It constantly evolves, learns your habits, and independently finds new ways to solve daily tasks, getting better every day.",
        "f1_title": "Self-learning",
        "f1_desc": "Adapts to your rhythm and lifestyle.",
        "f2_title": "No limits",
        "f2_desc": "Finds new approaches where others stop.",
        "f3_title": "Living evolution",
        "f3_desc": "Every day is a step towards a better version of itself.",
        "live_badge": "Active in real time"
    },
    "live_thought": {
        "studying": "What Atlas is learning right now:"
    },
    "final_cta": {
        "title_1": "Ready to evolve your",
        "title_2": "macOS?",
        "desc": "Start using Atlas AI today and feel your Mac come to life.",
        "btn": "Try Now"
    },
    "footer": {
        "privacy": "Privacy",
        "terms": "Terms",
        "contacts": "Contacts",
        "created_with_care": "Created with care for macOS."
    }
}

update_locale('/Users/valentinvdovicenko/Desktop/atlas_ai/website/frontend/src/locales/uk.json', uk_data)
update_locale('/Users/valentinvdovicenko/Desktop/atlas_ai/website/frontend/src/locales/en.json', en_data)
