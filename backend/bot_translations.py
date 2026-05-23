# Translations for Atlas AI Support Bot

TEXTS = {
    "uk": {
        "welcome": (
            "👋 Вітаємо в офіційній підтримці Atlas AI!\n\n"
            "🤖 Я — Атлас, Ваш цифровий помічник. Я тут, щоб допомогти Вам із будь-якими питаннями щодо використання Atlas AI на macOS.\n\n"
            "👇 Чим я можу допомогти сьогодні? Оберіть категорію або напишіть своє питання:"
        ),
        "btn_install": "💻 Встановлення та налаштування",
        "btn_bugs": "⚠️ Помилки та технічні проблеми",
        "btn_billing": "💳 Підписка та оплата",
        "btn_general": "ℹ️ Загальні питання",
        "btn_support": "💬 Зв'язатись з підтримкою",
        "btn_lang": "🇺🇸 English",
        "faq_install": (
            "🔧 **ВСТАНОВЛЕННЯ ТА НАЛАШТУВАННЯ:**\n\n"
            "**Q: Як встановити Atlas AI?**\n"
            "A: Завантажте актуальну версію з офіційного сайту. Відкрийте завантажений файл .dmg, перетягніть Atlas AI до папки «Програми». Запустіть і дотримуйтесь інструкцій першого налаштування.\n\n"
            "**Q: Які версії macOS підтримуються?**\n"
            "A: macOS 12 Monterey та новіші (Ventura, Sonoma, Sequoia). Рекомендується використовувати останню версію macOS.\n\n"
            "**Q: Додаток не відкривається після встановлення — що робити?**\n"
            "A: Перейдіть у «Системні налаштування» → «Конфіденційність і безпека» → натисніть «Все одно відкрити» для Atlas AI. Якщо не допомогло — перевстановіть додаток.\n\n"
            "**Q: Скільки місця займає Atlas AI?**\n"
            "A: Додаток займає близько 84 МБ на диску."
        ),
        "faq_bugs": (
            "⚠️ **ТЕХНІЧНІ ПРОБЛЕМИ:**\n\n"
            "**Q: Atlas AI зависає або не відповідає — що робити?**\n"
            "A: Примусово завершіть процес (Cmd+Option+Esc), перезапустіть додаток. Якщо проблема повторюється — перезавантажте Mac і спробуйте знову.\n\n"
            "**Q: Atlas AI не бачить мої файли — чому?**\n"
            "A: Надайте додатку доступ до диска: «Системні налаштування» → «Конфіденційність і безпека» → «Повний доступ до диска» → увімкніть Atlas AI.\n\n"
            "**Q: Помилка «Додаток пошкоджено» при запуску?**\n"
            "A: Відкрийте Термінал і введіть: `xattr -cr /Applications/AtlasAI.app` — потім спробуйте запустити знову.\n\n"
            "**Q: Як оновити Atlas AI до нової версії?**\n"
            "A: Завантажте актуальну версію з офіційного сайту та замініть стару. Всі налаштування збережуться.\n\n"
            "**Q: Atlas AI споживає багато оперативної пам'яті — це нормально?**\n"
            "A: ШІ-асистенти вимагають ресурсів для роботи. Рекомендується мати мінімум 8 ГБ RAM. Закрийте зайві вкладки та програми для покращення роботи."
        ),
        "faq_billing": (
            "💳 **ПІДПИСКА ТА ОПЛАТА:**\n\n"
            "**Q: Atlas AI безкоштовний?**\n"
            "A: Atlas AI має безкоштовну версію з базовими можливостями. Для повного доступу до всіх ШІ-функцій доступна преміум підписка.\n\n"
            "**Q: Як скасувати підписку?**\n"
            "A: Ви можете скасувати підписку в будь-який момент через свій особистий кабінет на сайті в розділі «Підписка».\n\n"
            "**Q: Чи є пробний безкоштовний період?**\n"
            "A: Так, ми надаємо безкоштовний пробний період на 14 днів для тестування преміум функцій."
        ),
        "faq_general": (
            "ℹ️ **ЗАГАЛЬНІ ПИТАННЯ:**\n\n"
            "**Q: Чи зберігаються мої дані на серверах Atlas AI?**\n"
            "A: Ми не зберігаємо Ваші особисті файли. Atlas AI обробляє дані локально або використовує зашифровані канали для передачі запитів до ШІ-моделей. Згідно з нашою Політикою конфіденційності, ваші дані ніколи не використовуються для навчання моделей.\n\n"
            "**Q: Atlas AI безпечно використовувати для робочих файлів?**\n"
            "A: Так. Atlas AI розроблений з дотриманням стандартів безпеки macOS. Додаток встановлюється у захищену директорію і вимагає Вашого дозволу на доступ до кожної папки.\n\n"
            "**Q: Чи Atlas AI працює без інтернету?**\n"
            "A: Частково. Базові функції автоматизації працюють офлайн, проте для розпізнавання тексту та складних ШІ-запитів потрібне підключення до мережі.\n\n"
            "**Q: На яких мовах працює Atlas AI?**\n"
            "A: Інтерфейс додатку доступний українською та англійською мовами. ШІ розуміє запити будь-якою мовою.\n\n"
            "**Q: Як зв'язатись із живою підтримкою?**\n"
            "A: Натисніть кнопку «Зв'язатись з підтримкою» нижче, і я з'єднаю Вас з оператором."
        ),
        "tpl_complaint_tech": (
            "🛠 Дякуємо, що повідомили нас про цю ситуацію. Нам шкода, що Ви зіткнулися з цією технічною проблемою. Ми розуміємо, наскільки це важливо для Вас.\n\n"
            "Будь ласка, спробуйте наступне: 1) Перезапустіть додаток; 2) Перевірте наявність оновлень на сайті. Якщо проблема залишається — наша команда вже отримала повідомлення і зв'яжеться з Вами найближчим часом.\n\n"
            "Чи є ще щось, з чим я можу допомогти?"
        ),
        "tpl_complaint_feature": (
            "💡 Дякуємо за Ваш відгук — він дуже цінний для нас. Ми передамо Ваше зауваження команді розробки для розгляду.\n\n"
            "Ваш запит зафіксовано. ✅"
        ),
        "tpl_complaint_service": (
            "😔 Перш за все, дозвольте принести щирі вибачення за незручності. Ми цінуємо кожного користувача і хочемо вирішити цю ситуацію якнайшвидше.\n\n"
            "Я передаю Вашу ситуацію безпосередньо до команди підтримки. Очікуйте відповідь протягом 24 годин. Дякуємо за Ваше терпіння."
        ),
        "tpl_refund": (
            "💸 Розуміємо Вашу ситуацію. Для обробки запиту на повернення коштів, будь ласка, надайте оператору: дату оплати, email, який використовувався під час покупки, та опис проблеми.\n\n"
            "Ваш запит буде розглянуто протягом 3-5 робочих днів."
        ),
        "support_prompt": (
            "👤 Розумію, що Вам потрібна допомога живого оператора. Передаю Ваш запит прямо зараз.\n\n"
            "Щоб прискорити обробку, будь ласка, коротко опишіть єдиним повідомленням:\n"
            "1. Яка у Вас проблема або питання?\n"
            "2. Яка версія macOS у Вас встановлена?\n"
            "3. Як давно виникла ця ситуація?\n\n"
            "Оператор отримає Ваше повідомлення і зв'яжеться з Вами найближчим часом. Дякуємо за терпіння! 🙏"
        ),
        "support_received": "✅ Ваш запит надіслано оператору! Ми зв'яжемося з Вами найближчим часом.",
        "choose_action": "Оберіть дію нижче:",
    },
    "en": {
        "welcome": (
            "👋 Welcome to the official Atlas AI Support!\n\n"
            "🤖 I am Atlas, your digital assistant. I am here to help you with any questions regarding the use of Atlas AI on macOS.\n\n"
            "👇 How can I help you today? Choose a category or write your question:"
        ),
        "btn_install": "💻 Installation & Setup",
        "btn_bugs": "⚠️ Bugs & Technical Issues",
        "btn_billing": "💳 Subscription & Billing",
        "btn_general": "ℹ️ General Questions",
        "btn_support": "💬 Contact Support",
        "btn_lang": "🇺🇦 Українська",
        "faq_install": (
            "🔧 **INSTALLATION & SETUP:**\n\n"
            "**Q: How to install Atlas AI?**\n"
            "A: Download the latest version from the official website. Open the downloaded .dmg file and drag Atlas AI to the Applications folder. Launch it and follow the initial setup instructions.\n\n"
            "**Q: Which macOS versions are supported?**\n"
            "A: macOS 12 Monterey and newer (Ventura, Sonoma, Sequoia). We recommend using the latest macOS version.\n\n"
            "**Q: The app doesn't open after installation — what should I do?**\n"
            "A: Go to System Settings → Privacy & Security → click 'Open Anyway' for Atlas AI. If it doesn't help, reinstall the app.\n\n"
            "**Q: How much space does Atlas AI take?**\n"
            "A: The application takes about 84 MB of disk space."
        ),
        "faq_bugs": (
            "⚠️ **TECHNICAL ISSUES:**\n\n"
            "**Q: Atlas AI freezes or doesn't respond — what to do?**\n"
            "A: Force quit the process (Cmd+Option+Esc) and restart the app. If the problem persists, restart your Mac and try again.\n\n"
            "**Q: Atlas AI doesn't see my files — why?**\n"
            "A: Grant the app disk access: System Settings → Privacy & Security → Full Disk Access → toggle Atlas AI on.\n\n"
            "**Q: Error 'App is damaged' on launch?**\n"
            "A: Open Terminal and type: `xattr -cr /Applications/AtlasAI.app` — then try launching again.\n\n"
            "**Q: How to update Atlas AI to a new version?**\n"
            "A: Download the latest version from the official site and replace the old one. All settings will be saved.\n\n"
            "**Q: Atlas AI consumes a lot of RAM — is it normal?**\n"
            "A: AI assistants require resources to operate. It is recommended to have at least 8 GB of RAM. Close unnecessary tabs and apps for better performance."
        ),
        "faq_billing": (
            "💳 **SUBSCRIPTION & BILLING:**\n\n"
            "**Q: Is Atlas AI free?**\n"
            "A: Atlas AI has a free version with basic features. For full access to all AI features, a premium subscription is available.\n\n"
            "**Q: How to cancel the subscription?**\n"
            "A: You can cancel your subscription at any time via your personal dashboard on the website in the 'Subscription' section.\n\n"
            "**Q: Is there a free trial period?**\n"
            "A: Yes, we provide a 14-day free trial period to test premium features."
        ),
        "faq_general": (
            "ℹ️ **GENERAL QUESTIONS:**\n\n"
            "**Q: Are my data stored on Atlas AI servers?**\n"
            "A: We do not store your personal files. Atlas AI processes data locally or uses encrypted channels to send requests to AI models. According to our Privacy Policy, your data is never used to train models.\n\n"
            "**Q: Is Atlas AI safe to use for work files?**\n"
            "A: Yes. Atlas AI is developed in compliance with macOS security standards. The app is installed in a secure directory and requires your permission to access each folder.\n\n"
            "**Q: Does Atlas AI work offline?**\n"
            "A: Partially. Basic automation features work offline, but text recognition and complex AI queries require an internet connection.\n\n"
            "**Q: What languages does Atlas AI support?**\n"
            "A: The app interface is available in Ukrainian and English. The AI understands queries in any language.\n\n"
            "**Q: How to contact live support?**\n"
            "A: Click the 'Contact Support' button below, and I will connect you with an operator."
        ),
        "tpl_complaint_tech": (
            "🛠 Thank you for reporting this to us. We are sorry you encountered this technical issue. We understand how important this is to you.\n\n"
            "Please try the following: 1) Restart the app; 2) Check for updates on the website. If the problem persists, our team has already received the report and will contact you shortly.\n\n"
            "Is there anything else I can help with?"
        ),
        "tpl_complaint_feature": (
            "💡 Thank you for your feedback — it is very valuable to us. We will forward your comment to the development team for consideration.\n\n"
            "Your request has been recorded. ✅"
        ),
        "tpl_complaint_service": (
            "😔 First of all, please accept our sincere apologies for the inconvenience. We value every user and want to resolve this situation as quickly as possible.\n\n"
            "I am forwarding your situation directly to the support team. Expect a response within 24 hours. Thank you for your patience."
        ),
        "tpl_refund": (
            "💸 We understand your situation. To process a refund request, please provide the operator with: the date of payment, the email used during purchase, and a description of the problem.\n\n"
            "Your request will be reviewed within 3-5 business days."
        ),
        "support_prompt": (
            "👤 I understand you need help from a live operator. I am forwarding your request right now.\n\n"
            "To speed up processing, please briefly describe in a single message:\n"
            "1. What is your problem or question?\n"
            "2. What macOS version do you have installed?\n"
            "3. How long has this situation been occurring?\n\n"
            "The operator will receive your message and contact you shortly. Thank you for your patience! 🙏"
        ),
        "support_received": "✅ Your request has been sent to the operator! We will contact you shortly.",
        "choose_action": "Choose an action below:",
    }
}
