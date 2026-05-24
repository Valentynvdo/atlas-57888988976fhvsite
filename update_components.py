import re
import os

components_dir = "frontend/src/components/atlas"
files = [
    "AtlasLiveThought.jsx",
    "LivingIntelligence.jsx",
    "MacOSControl.jsx",
    "SmartConcierge.jsx",
    "AbsoluteAwareness.jsx",
    "AtlasComparison.jsx",
    "FinalCTA.jsx",
    "Footer.jsx",
    "Hero.jsx",
    "Navbar.jsx"
]

# We will just write a specific dictionary of replacements for the key components
replacements = {
    "LivingIntelligence.jsx": [
        ('Розум, який', '{t("living_intel.title_1")}'),
        ('ніколи не зупиняється.', '{t("living_intel.title_2")}'),
        ('Атлас не обмежений заздалегідь написаними сценаріями. Він постійно розвивається, вивчає ваші звички та самостійно знаходить нові шляхи для вирішення щоденних завдань, щоб ставати кращим з кожним днем.', '{t("living_intel.desc")}'),
        ('"Самонавчання"', 't("living_intel.f1_title")'),
        ('"Адаптується до вашого ритму та стилю життя."', 't("living_intel.f1_desc")'),
        ('"Без обмежень"', 't("living_intel.f2_title")'),
        ('"Знаходить нові підходи там, де інші зупиняються."', 't("living_intel.f2_desc")'),
        ('"Жива еволюція"', 't("living_intel.f3_title")'),
        ('"Кожен день — крок до кращої версії себе."', 't("living_intel.f3_desc")'),
        ('Активний у реальному часі', '{t("living_intel.live_badge")}')
    ],
    "AtlasLiveThought.jsx": [
        ('Що зараз вивчає Атлас:', '{t("live_thought.studying")}'),
    ],
    "FinalCTA.jsx": [
        ('Готовий до еволюції', '{t("final_cta.title_1")}'),
        ('mac', '{t("final_cta.title_2")}'), # Wait, the text is "Готовий до еволюції\nmacOS?" -> "Готовий до еволюції" "macOS?"
        ('Почни використовувати Atlas AI сьогодні та відчуй, як твій Mac стає по-справжньому живим.', '{t("final_cta.desc")}'),
        ('Спробувати зараз', '{t("final_cta.btn")}')
    ],
    "Footer.jsx": [
        ('"Приватність"', 't("footer.privacy")'),
        ('"Умови"', 't("footer.terms")'),
        ('"Контакти"', 't("footer.contacts")'),
        ('Створено з турботою для macOS.', '{t("footer.created_with_care")}')
    ]
}

# Apply to files
for file, reps in replacements.items():
    filepath = os.path.join(components_dir, file)
    if not os.path.exists(filepath): continue
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Add useTranslation if not there
    if 'useTranslation' not in content:
        content = content.replace(
            'import {',
            'import { useTranslation } from "react-i18next";\nimport {'
        )
        # Find the functional component export
        content = re.sub(
            r'(export default function \w+\([^)]*\)\s*\{)',
            r'\1\n  const { t } = useTranslation();',
            content
        )
    
    for old, new in reps:
        content = content.replace(old, new)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

