# Translations for Atlas AI Support Bot

TEXTS = {
    "uk": {
        "welcome": (
            "👋 Вітаємо в офіційній підтримці Atlas AI!\n\n"
            "🤖 Я — Атлас, Ваш цифровий помічник. Я тут, щоб допомогти Вам із будь-якими питаннями щодо використання Atlas AI на macOS.\n\n"
            "👇 Чим я можу допомогти сьогодні? Оберіть категорію або напишіть своє питання:"
        ),
        "btn_install": "💻 Встановлення",
        "btn_bugs": "⚠️ Тех. проблеми",
        "btn_billing": "🎟 Ранній доступ",
        "btn_general": "ℹ️ Загальне",
        "btn_support": "💬 Оператор",
        "btn_lang": "🇺🇸 English",
        "faq_install": (
            "🔧 **ВСТАНОВЛЕННЯ ТА НАЛАШТУВАННЯ:**\n\n"
            "**Q: Як встановити Atlas AI? 🖥️**\n"
            "A: Відкрийте Terminal на вашому Mac і виконайте команду:\n`curl -fsSL https://atlas-site-2p2d.onrender.com/install | bash`\nПісля завантаження введіть Ваш ліцензійний ключ для активації. 🚀\n\n"
            "**Q: Які системні вимоги? 💻**\n"
            "A: macOS 13 Ventura або новіша версія, Apple Silicon або Intel. Рекомендується мінімум 8 ГБ RAM (бажано 16 ГБ). ⚡️\n\n"
            "**Q: Додаток не має доступу до мікрофона? 🎙️**\n"
            "A: Перейдіть у «Системні параметри» → «Конфіденційність і безпека» → увімкніть доступ для мікрофона та «Спеціальні можливості» (Accessibility) для Atlas AI. 🔒\n\n"
            "**Q: Скільки місця займає Atlas AI? 💽**\n"
            "A: Додаток займає близько 1.5 ГБ на диску. 💾"
        ),
        "faq_bugs": (
            "⚠️ **ТЕХНІЧНІ ПРОБЛЕМИ:**\n\n"
            "**Q: Atlas AI зависає або не відповідає — що робити? 🛑**\n"
            "A: Примусово завершіть процес (Cmd+Option+Esc), перезапустіть додаток. Якщо проблема повторюється — перезавантажте Mac і спробуйте знову. 🔄\n\n"
            "**Q: Не працюють автономні агенти? 🌐**\n"
            "A: Переконайтеся, що Ваш Mac підключено до інтернету. Автономним дослідникам потрібен інтернет для аналізу сторінок та виконання запитів. 📡\n\n"
            "**Q: Як перенести ліцензію на інший Mac? 🔄**\n"
            "A: У Вашому кабінеті на сайті (Dashboard) натисніть «Перенести на інший Mac». Atlas на поточному пристрої зупиниться, і Ви зможете ввести ключ на новому Mac. 💻➡️💻"
        ),
        "faq_billing": (
            "🎟 **РАННІЙ ДОСТУП ТА ЧЕРГА:**\n\n"
            "**Q: Як отримати доступ до Atlas AI? 🚀**\n"
            "A: Наразі Atlas AI знаходиться в стадії закритого бета-тестування. Ви можете записатися в чергу на сайті. Коли підійде ваша черга, ви отримаєте ліцензійний ключ від адміністратора. 🏆\n\n"
            "**Q: Скільки це коштує? 💎**\n"
            "A: На етапі раннього доступу ми не приймаємо оплату. Ви записуєтесь у чергу, і після схвалення адміністратором отримуєте безкоштовний тестовий період. 📅\n\n"
            "**Q: Скільки часу чекати на схвалення? ⏳**\n"
            "A: Швидкість схвалення залежить від загальної кількості запитів. Ми поступово відкриваємо доступ новим користувачам для забезпечення стабільної роботи серверів. 🚀"
        ),
        "faq_general": (
            "ℹ️ **ЗАГАЛЬНІ ПИТАННЯ:**\n\n"
            "**Q: Чи зберігаються мої дані в хмарі? ☁️**\n"
            "A: Atlas AI використовує гібридну архітектуру. Уся Ваша когнітивна пам'ять та особисті вподобання зберігаються суто локально. Згідно з нашою Політикою конфіденційності, ваші дані ніколи не використовуються для навчання. 🛡️\n\n"
            "**Q: Як працює віддалений контроль? 📱**\n"
            "A: У Вашому кабінеті (Dashboard) є кнопка «Підключити Telegram-бота». Це дозволить Вам відправляти команди до Вашого Atlas AI на Mac прямо зі смартфона. 🕹️\n\n"
            "**Q: Чи Atlas AI працює без інтернету? 🔌**\n"
            "A: Базові функції автоматизації можуть працювати офлайн, проте для повноцінної роботи LLM, нових скілів та глибоких досліджень потрібне постійне підключення до мережі. 🌐\n\n"
            "**Q: Як зв'язатись із живою підтримкою? 💬**\n"
            "A: Натисніть кнопку «Оператор» нижче, і я з'єднаю Вас із нашою командою. 👨‍💻"
        ),
        "tpl_complaint_tech": (
            "🛠 Дякуємо, що повідомили нас. Нам дуже шкода, що Ви зіткнулися з цією проблемою. 😔\n\n"
            "Будь ласка, спробуйте перезапустити додаток або перевірте налаштування приватності (Accessibility). Якщо це не допомогло — наша команда вже отримала Ваш запит і зв'яжеться з Вами. ⚙️\n\n"
            "Чи потрібна допомога оператора? 💬"
        ),
        "tpl_complaint_feature": (
            "💡 Дякуємо за відгук! Ми постійно розвиваємо Atlas AI, і Ваші ідеї дуже цінні. Ми передамо Ваше зауваження команді розробки. 🚀\n\n"
            "Ваш запит успішно зафіксовано. ✅"
        ),
        "tpl_complaint_service": (
            "😔 Приносимо щирі вибачення за можливі незручності. Ми цінуємо кожного клієнта і зробимо все можливе для швидкого вирішення. 🙏\n\n"
            "Я вже передав інформацію оператору підтримки. Очікуйте на відповідь. ⏳"
        ),
        "tpl_refund": (
            "🎟 Для перевірки статусу вашої заявки в черзі, будь ласка, надайте оператору email від вашого акаунту. 📝\n\n"
            "Натисніть кнопку «Оператор» нижче, щоб залишити ці дані. 👇"
        ),
        "support_prompt": (
            "👤 Я з'єднаю Вас із живим оператором підтримки. 👨‍💻\n\n"
            "Будь ласка, опишіть Вашу ситуацію одним повідомленням: 📝\n"
            "1. Суть питання або проблеми ❓\n"
            "2. Який у Вас Mac та версія macOS 💻\n"
            "3. Ваш email акаунту (якщо стосується доступу/черги) 📧\n\n"
            "Оператор отримає повідомлення і відповість Вам найближчим часом. 🙏"
        ),
        "support_received": "✅ Ваш запит надіслано оператору! Ми зв'яжемося з Вами найближчим часом. ⏳",
        "choose_action": "Оберіть дію нижче: 👇",
    },
    "en": {
        "welcome": (
            "👋 Welcome to the official Atlas AI Support!\n\n"
            "🤖 I am Atlas, your digital assistant. I am here to help you with any questions regarding the use of Atlas AI on macOS.\n\n"
            "👇 How can I help you today? Choose a category or write your question:"
        ),
        "btn_install": "💻 Installation",
        "btn_bugs": "⚠️ Tech Issues",
        "btn_billing": "🎟 Early Access",
        "btn_general": "ℹ️ General",
        "btn_support": "💬 Operator",
        "btn_lang": "🇺🇦 Українська",
        "faq_install": (
            "🔧 **INSTALLATION & SETUP:**\n\n"
            "**Q: How to install Atlas AI? 🖥️**\n"
            "A: Open Terminal on your Mac and run:\n`curl -fsSL https://atlas-site-2p2d.onrender.com/install | bash`\nOnce downloaded, enter your license key to activate. 🚀\n\n"
            "**Q: What are the system requirements? 💻**\n"
            "A: macOS 13 Ventura or newer, Apple Silicon or Intel. Minimum 8 GB of RAM is required (16 GB recommended). ⚡️\n\n"
            "**Q: App doesn't have microphone access? 🎙️**\n"
            "A: Go to System Settings → Privacy & Security → enable Microphone and Accessibility access for Atlas AI. 🔒\n\n"
            "**Q: How much space does Atlas AI take? 💽**\n"
            "A: The application requires about 1.5 GB of disk space. 💾"
        ),
        "faq_bugs": (
            "⚠️ **TECHNICAL ISSUES:**\n\n"
            "**Q: Atlas AI freezes or doesn't respond — what to do? 🛑**\n"
            "A: Force quit the process (Cmd+Option+Esc) and restart the app. If the problem persists, restart your Mac and try again. 🔄\n\n"
            "**Q: Autonomous agents are not working? 🌐**\n"
            "A: Make sure your Mac is connected to the internet. Autonomous researchers require an internet connection to analyze pages and execute queries. 📡\n\n"
            "**Q: How to transfer my license to another Mac? 🔄**\n"
            "A: In your Dashboard on the website, click «Transfer to another Mac». Atlas will stop working on the current device, and you can enter the key on your new Mac. 💻➡️💻"
        ),
        "faq_billing": (
            "🎟 **EARLY ACCESS & WAITLIST:**\n\n"
            "**Q: How to get access to Atlas AI? 🚀**\n"
            "A: Atlas AI is currently in closed beta. You can join the waitlist on our website. Once approved by the administrator, you will receive a license key. 🏆\n\n"
            "**Q: How much does it cost? 💎**\n"
            "A: During the early access phase, we do not accept payments. You simply join the waitlist, and upon approval, you receive a free trial period. 📅\n\n"
            "**Q: How long does approval take? ⏳**\n"
            "A: Approval speed depends on the total queue volume. We are gradually granting access to new users to ensure server stability. 🚀"
        ),
        "faq_general": (
            "ℹ️ **GENERAL QUESTIONS:**\n\n"
            "**Q: Is my data stored in the cloud? ☁️**\n"
            "A: Atlas AI uses a hybrid architecture. All your cognitive memory and personal preferences are stored strictly locally. According to our Privacy Policy, your data is never used to train models. 🛡️\n\n"
            "**Q: How does remote control work? 📱**\n"
            "A: In your Dashboard, there is a «Connect Telegram Bot» button. It allows you to send commands to your Atlas AI on Mac directly from your smartphone. 🕹️\n\n"
            "**Q: Does Atlas AI work offline? 🔌**\n"
            "A: Basic automation features can work offline, but full LLM capabilities, new skills, and deep research require a stable internet connection. 🌐\n\n"
            "**Q: How to contact live support? 💬**\n"
            "A: Click the «Operator» button below, and I will connect you with our team. 👨‍💻"
        ),
        "tpl_complaint_tech": (
            "🛠 Thank you for reporting this. We are very sorry you encountered this issue. 😔\n\n"
            "Please try restarting the app or checking your Privacy settings (Accessibility). If that didn't help, our team has already received your request and will contact you. ⚙️\n\n"
            "Do you need operator assistance? 💬"
        ),
        "tpl_complaint_feature": (
            "💡 Thank you for your feedback! We are constantly developing Atlas AI, and your ideas are very valuable. We will pass your comment to the development team. 🚀\n\n"
            "Your request has been successfully recorded. ✅"
        ),
        "tpl_complaint_service": (
            "😔 Please accept our sincere apologies for any inconvenience. We value every customer and will do our best to resolve this quickly. 🙏\n\n"
            "I have already forwarded the information to a support operator. Please wait for a reply. ⏳"
        ),
        "tpl_refund": (
            "🎟 To check your waitlist status, please provide the operator with your account email. 📝\n\n"
            "Click the «Operator» button below to leave these details. 👇"
        ),
        "support_prompt": (
            "👤 I will connect you with a live support operator. 👨‍💻\n\n"
            "Please describe your situation in a single message: 📝\n"
            "1. The nature of your question or problem ❓\n"
            "2. Your Mac model and macOS version 💻\n"
            "3. Your account email (if regarding waitlist access) 📧\n\n"
            "The operator will receive your message and reply as soon as possible. 🙏"
        ),
        "support_received": "✅ Your request has been sent to the operator! We will contact you shortly. ⏳",
        "choose_action": "Choose an action below: 👇",
    }
}
