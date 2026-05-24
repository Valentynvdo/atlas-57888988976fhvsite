import json

def update_locale(file_path, new_data):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data.update(new_data)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

uk_login = {
    "login": {
        "success_reset": "📩 Інструкції та код скидання відправлені на ваш email.",
        "success_changed": "✅ Пароль успішно змінено. Тепер ви можете увійти.",
        "success_registered": "🎉 Ви успішно зареєстровані! Налаштування особистого кабінету...",
        "error_generic": "Сталася помилка при авторизації. Перевірте з'єднання.",
        "back_home": "← На головну",
        "subtitle": "Особистий кабінет клієнта та система управління ліцензіями",
        "tab_login": "Увійти",
        "tab_register": "Реєстрація",
        "recover_title": "Відновлення пароля",
        "recover_desc": "Введіть email, і ми надішлемо вам код відновлення.",
        "enter_code_title": "Введіть код",
        "enter_code_desc": "Перевірте пошту {email} та введіть 6-значний код і новий пароль.",
        "name_label": "Ім'я",
        "name_placeholder": "Іван Франко",
        "email_label": "Електронна пошта",
        "code_label": "Код відновлення (6 цифр)",
        "password_label": "Пароль",
        "new_password_label": "Новий пароль",
        "forgot_password": "Забули пароль?",
        "pass_placeholder_reg": "Мінімум 6 символів",
        "hide": "Сховати",
        "show": "Показати",
        "btn_loading": "Завантаження...",
        "btn_get_code": "Отримати код",
        "btn_save_pass": "Зберегти новий пароль",
        "btn_create": "Створити акаунт",
        "back_to_login": "Повернутися до входу",
        "dev_mode": "DEV режим",
        "encryption_info": "Вся інформація шифрується та передається через захищене з'єднання."
    }
}

en_login = {
    "login": {
        "success_reset": "📩 Reset instructions and code sent to your email.",
        "success_changed": "✅ Password changed successfully. You can now log in.",
        "success_registered": "🎉 Successfully registered! Setting up your dashboard...",
        "error_generic": "An error occurred during authorization. Please check your connection.",
        "back_home": "← Back to Home",
        "subtitle": "Client dashboard and license management system",
        "tab_login": "Login",
        "tab_register": "Register",
        "recover_title": "Password Recovery",
        "recover_desc": "Enter your email, and we'll send you a recovery code.",
        "enter_code_title": "Enter Code",
        "enter_code_desc": "Check your email {email} and enter the 6-digit code and a new password.",
        "name_label": "Name",
        "name_placeholder": "John Doe",
        "email_label": "Email",
        "code_label": "Recovery Code (6 digits)",
        "password_label": "Password",
        "new_password_label": "New Password",
        "forgot_password": "Forgot password?",
        "pass_placeholder_reg": "Minimum 6 characters",
        "hide": "Hide",
        "show": "Show",
        "btn_loading": "Loading...",
        "btn_get_code": "Get Code",
        "btn_save_pass": "Save New Password",
        "btn_create": "Create Account",
        "back_to_login": "Back to login",
        "dev_mode": "DEV Mode",
        "encryption_info": "All information is encrypted and transmitted via a secure connection."
    }
}

update_locale('/Users/valentinvdovicenko/Desktop/atlas_ai/website/frontend/src/locales/uk.json', uk_login)
update_locale('/Users/valentinvdovicenko/Desktop/atlas_ai/website/frontend/src/locales/en.json', en_login)
