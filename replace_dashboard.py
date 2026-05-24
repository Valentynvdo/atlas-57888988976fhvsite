import re

with open("/Users/valentinvdovicenko/Desktop/atlas_ai/website/frontend/src/pages/Dashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add useTranslation import
content = content.replace(
    'import { useAuth } from "../lib/auth";',
    'import { useAuth } from "../lib/auth";\nimport { useTranslation, Trans } from "react-i18next";'
)

content = content.replace(
    'const { user, logout } = useAuth();',
    'const { t } = useTranslation();\n  const { user, logout } = useAuth();'
)

reps = {
    '"Оплата пройшла. Підписка активна!"': 't("dashboard.payment_success")',
    '"Сесія оплати завершилась."': 't("dashboard.payment_session_expired")',
    '"Активна"': 't("dashboard.status_active")',
    '`Закінчується через ${license.days_left} дн.`': 't("dashboard.status_expiring_soon", { days: license.days_left })',
    '"Неактивна"': 't("dashboard.status_inactive")',
    '"Завантажую ціни, спробуй ще раз..."': 't("dashboard.loading_prices")',
    '"Верифікую транзакцію..."': 't("dashboard.verifying_tx")',
    '"Транзакцію скасовано"': 't("dashboard.tx_cancelled")',
    '"Помилка оплати"': 't("dashboard.payment_error")',
    '"Ліцензію скинуто. Введи ключ на новому Mac."': 't("dashboard.license_reset")',
    '"Помилка перенесення"': 't("dashboard.transfer_error")',
    '"Авто-поновлення вимкнено"': 't("dashboard.autorenew_disabled")',
    '"Помилка скасування"': 't("dashboard.cancel_error")',
    '"Ключ скопійовано"': 't("dashboard.key_copied")',
    'Вийти\n          </button>': '{t("dashboard.logout_btn")}\n          </button>',
    'title="Ваш Ліцензійний Ключ" eyebrow="Активація"': 'title={t("dashboard.license_block_title")} eyebrow={t("dashboard.license_block_eyebrow")}',
    '{keyHidden ? "Показати ключ" : "Сховати"}': '{keyHidden ? t("dashboard.show_key") : t("dashboard.hide_key")}',
    'Скопіювати\n            </button>': '{t("dashboard.copy_btn")}\n            </button>',
    'Перенести на інший Mac\n              </button>': '{t("dashboard.transfer_btn")}\n              </button>',
    '`Активований на: ${license.mac_name || "Mac"} · ${license.mac_id.slice(0, 8)}…`': '`${t("dashboard.activated_on")} ${license.mac_name || "Mac"} · ${license.mac_id.slice(0, 8)}…`',
    '"Ще не активований на вашому пристрої"': 't("dashboard.not_activated")',
    'title="Віддалений контроль (Telegram)" eyebrow="Підключення бота"': 'title={t("dashboard.tg_block_title")} eyebrow={t("dashboard.tg_block_eyebrow")}',
    'Керуйте Atlas AI віддалено зі смартфона! Отримуйте сповіщення, переглядайте результати досліджень та відправляйте команди у будь-який час.': '{t("dashboard.tg_desc")}',
    'Натисніть кнопку <strong>«Підключити Telegram-бота»</strong> нижче для переходу до <span style={{ color: "#00E5FF", fontWeight: 600 }}>@Atlas_aimac_bot</span>.': '<Trans i18nKey="dashboard.tg_step_1">Натисніть кнопку <strong>«Підключити Telegram-бота»</strong> нижче для переходу до <span style={{ color: "#00E5FF", fontWeight: 600 }}>@Atlas_aimac_bot</span>.</Trans>',
    'Натисніть <strong>«Запустити» (Start)</strong> в Telegram. Бот автоматично зчитає ваш унікальний код активації.': '<Trans i18nKey="dashboard.tg_step_2">Натисніть <strong>«Запустити» (Start)</strong> в Telegram. Бот автоматично зчитає ваш унікальний код активації.</Trans>',
    'Підключити Telegram-бота\n          </a>': '{t("dashboard.tg_btn")}\n          </a>',
    'title="Завантаження" eyebrow="Atlas для macOS"': 'title={t("dashboard.download_title")} eyebrow={t("dashboard.download_eyebrow")}',
    'Відкрийте Terminal на вашому Mac і виконайте команду:': '{t("dashboard.download_desc")}',
    'macOS 13 Ventura або новіший. Apple Silicon або Intel. 200 MB вільного місця.': '{t("dashboard.download_reqs")}',
    'Скопіюйте команду вище та вставте її у Terminal.': '{t("dashboard.download_step1")}',
    "Дочекайтесь завершення встановлення. Atlas автоматично з'явиться в Applications.": '{t("dashboard.download_step2")}',
    'Запустіть Atlas та введіть свій ліцензійний ключ для активації.': '{t("dashboard.download_step3")}',
    'Надайте доступи до мікрофона та Accessibility (Спеціальні можливості).': '{t("dashboard.download_step4")}',
    'title="Управління підпискою" eyebrow="Тарифний план"': 'title={t("dashboard.sub_title")} eyebrow={t("dashboard.sub_eyebrow")}',
    'Поточний статус\n              </div>': '{t("dashboard.current_status")}\n              </div>',
    'Залишилось днів: {license.days_left}': '{t("dashboard.days_left", { days: license.days_left })}',
    'Дата закінчення: {fmtDate(license.expires_at)}': '{t("dashboard.expires_at", { date: fmtDate(license.expires_at) })}',
    'Скасувати авто-поновлення\n                </button>': '{t("dashboard.cancel_autorenew")}\n                </button>',
    '`Гаманець підключено`': 't("dashboard.wallet_connected")',
    '"TON гаманець не підключено"': 't("dashboard.wallet_not_connected")',
    '1 TON = ${tonPrices.ton_usd_price.toFixed(3)} USD (live)': '{t("dashboard.ton_live_price", { price: tonPrices.ton_usd_price.toFixed(3) })}',
    '{tonWallet ? "Змінити гаманець" : "Підключити TON гаманець"}': '{tonWallet ? t("dashboard.change_wallet") : t("dashboard.connect_wallet")}',
    'Оберіть тарифний план для подовження\n            </h3>': '{t("dashboard.choose_plan")}\n            </h3>',
    'p.id === "atlas_monthly" ? "Місячний" : p.id === "atlas_quarterly" ? "Квартальний" : "Річний"': 'p.id === "atlas_monthly" ? t("dashboard.plan_monthly") : p.id === "atlas_quarterly" ? t("dashboard.plan_quarterly") : t("dashboard.plan_yearly")',
    'p.id === "atlas_monthly" ? "Гнучкий старт для знайомства з ШІ" : p.id === "atlas_quarterly" ? "Оптимальний баланс вартості та можливостей" : "Максимальна вигода для професіоналів"': 'p.id === "atlas_monthly" ? t("dashboard.plan_desc_monthly") : p.id === "atlas_quarterly" ? t("dashboard.plan_desc_quarterly") : t("dashboard.plan_desc_yearly")',
    'p.days === 30 ? "місяць" : p.days === 90 ? "3 міс." : "рік"': 'p.days === 30 ? t("dashboard.per_month") : p.days === 90 ? t("dashboard.per_quarter") : t("dashboard.per_year")',
    'Еквівалент: ${monthlyCost} / міс.': '{t("dashboard.equiv_monthly", { cost: monthlyCost })}',
    'Популярний вибір\n                      </span>': '{t("dashboard.popular_choice")}\n                      </span>',
    'Економія 30%\n                      </span>': '{t("dashboard.save_30")}\n                      </span>',
    'Ціна в TON (live):': '{t("dashboard.ton_price")}',
    'Оплатити TON': '{t("dashboard.pay_ton")}',
    'Підключити гаманець': '{t("dashboard.connect_wallet")}',
    'title="Статистика Atlas" eyebrow="Активність"': 'title={t("dashboard.stats_title")} eyebrow={t("dashboard.stats_eyebrow")}',
    'label="Версія"': 'label={t("dashboard.stat_version")}',
    'label="Активний" value={`${license.stats.days_active} дн.`}': 'label={t("dashboard.stat_active")} value={`${license.stats.days_active} дн.`}',
    'label="Скілів створено"': 'label={t("dashboard.stat_skills")}',
    'label="Запитів оброблено"': 'label={t("dashboard.stat_requests")}',
    'label="Остання еволюція"': 'label={t("dashboard.stat_evolution")}',
    'Встанови Atlas щоб бачити статистику\n            </div>': '{t("dashboard.stats_empty")}\n            </div>',
    'title="Підтримка" eyebrow="Допомога"': 'title={t("dashboard.support_title")} eyebrow={t("dashboard.support_eyebrow")}',
    'Виникли питання? Наш офіційний бот підтримки Атлас відповість на будь-яке запитання щодо Atlas AI — цілодобово та двома мовами.': '{t("dashboard.support_desc")}',
    'Відкрити чат підтримки\n            </a>': '{t("dashboard.open_chat")}\n            </a>',
    'title="Впевнений?"': 'title={t("dashboard.confirm_sure")}',
    '`Atlas перестане працювати після ${fmtDate(license.expires_at)}.`': 't("dashboard.confirm_cancel_msg", { date: fmtDate(license.expires_at) })',
    'title="Перенести на інший Mac?"': 'title={t("dashboard.confirm_transfer_title")}',
    '"Atlas на поточному Mac зупиниться. Введи цей ключ на новому Mac щоб активувати."': 't("dashboard.confirm_transfer_msg")',
    'Ні\n          </button>': '{t("dashboard.confirm_no")}\n          </button>',
    'Так\n          </button>': '{t("dashboard.confirm_yes")}\n          </button>'
}

for old, new in reps.items():
    content = content.replace(old, new)

# Update features arrays
features_monthly = """                  atlas_monthly: [
                    t("dashboard.feature_1"),
                    t("dashboard.feature_2"),
                    t("dashboard.feature_3"),
                    t("dashboard.feature_4"),
                    t("dashboard.feature_5")
                  ],"""

features_quarterly = """                  atlas_quarterly: [
                    t("dashboard.feature_q1"),
                    t("dashboard.feature_q2"),
                    t("dashboard.feature_q3"),
                    t("dashboard.feature_q4"),
                    t("dashboard.feature_q5")
                  ],"""

features_yearly = """                  atlas_yearly: [
                    t("dashboard.feature_y1"),
                    t("dashboard.feature_y2"),
                    t("dashboard.feature_y3"),
                    t("dashboard.feature_y4"),
                    t("dashboard.feature_y5")
                  ]"""

content = re.sub(r'atlas_monthly: \[.*?\]\,', features_monthly, content, flags=re.DOTALL)
content = re.sub(r'atlas_quarterly: \[.*?\]\,', features_quarterly, content, flags=re.DOTALL)
content = re.sub(r'atlas_yearly: \[.*?\]', features_yearly, content, flags=re.DOTALL)

# Update FAQ_ITEMS
# Instead of replacing the whole array, we can just replace the strings in FAQ_ITEMS
faq_reps = {
    '"Як перенести Atlas на інший Mac?"': 't("dashboard.faq_q1")',
    '"В блоці \'Ліцензійний ключ\' натисни \'Перенести на інший Mac\'. Поточний Mac зупинить роботу, ти зможеш ввести цей же ключ на новому Mac."': 't("dashboard.faq_a1")',
    '"Що якщо я забув ключ?"': 't("dashboard.faq_q2")',
    '"Ключ завжди тут, у твоєму кабінеті. Якщо ключ скомпрометовано — звернися в підтримку, ми його регенеруємо."': 't("dashboard.faq_a2")',
    '"Як скасувати підписку?"': 't("dashboard.faq_q3")',
    '"Натисни \'Скасувати авто-поновлення\' в блоці Підписка. Atlas працюватиме до дати закінчення поточного періоду."': 't("dashboard.faq_a3")',
    '"Atlas не запускається — що робити?"': 't("dashboard.faq_q4")',
    '"Перевір що дозволив Accessibility та Microphone у System Settings → Privacy. Перезапусти Atlas. Якщо не допомагає — пиши в підтримку."': 't("dashboard.faq_a4")',
    '"Чи працює Atlas без інтернету?"': 't("dashboard.faq_q5")',
    '"Базові команди працюють офлайн. Для еволюції, нових скілів і мовних моделей потрібен інтернет."': 't("dashboard.faq_a5")'
}

for old, new in faq_reps.items():
    content = content.replace(old, new)
    
# Wait, FAQ_ITEMS is defined outside the component where `t` is not available.
# We must move FAQ_ITEMS into the Dashboard component or use t inside the map loop.
# Ah! Let's pass t to the FAQ component.
content = content.replace('function FAQ({ items }) {', 'function FAQ({ items, t }) {')
content = content.replace('<FAQ items={FAQ_ITEMS} />', '<FAQ items={FAQ_ITEMS} t={t} />')
# And in FAQ_ITEMS we just store the keys, and in FAQ component we do t(it.q) and t(it.a).
# Let's fix that properly:
content = content.replace(
    'q: "Як перенести Atlas на інший Mac?"', 'q: "dashboard.faq_q1"'
).replace(
    'a: "В блоці \'Ліцензійний ключ\' натисни \'Перенести на інший Mac\'. Поточний Mac зупинить роботу, ти зможеш ввести цей же ключ на новому Mac."', 'a: "dashboard.faq_a1"'
).replace(
    'q: "Що якщо я забув ключ?"', 'q: "dashboard.faq_q2"'
).replace(
    'a: "Ключ завжди тут, у твоєму кабінеті. Якщо ключ скомпрометовано — звернися в підтримку, ми його регенеруємо."', 'a: "dashboard.faq_a2"'
).replace(
    'q: "Як скасувати підписку?"', 'q: "dashboard.faq_q3"'
).replace(
    'a: "Натисни \'Скасувати авто-поновлення\' в блоці Підписка. Atlas працюватиме до дати закінчення поточного періоду."', 'a: "dashboard.faq_a3"'
).replace(
    'q: "Atlas не запускається — що робити?"', 'q: "dashboard.faq_q4"'
).replace(
    'a: "Перевір що дозволив Accessibility та Microphone у System Settings → Privacy. Перезапусти Atlas. Якщо не допомагає — пиши в підтримку."', 'a: "dashboard.faq_a4"'
).replace(
    'q: "Чи працює Atlas без інтернету?"', 'q: "dashboard.faq_q5"'
).replace(
    'a: "Базові команди працюють офлайн. Для еволюції, нових скілів і мовних моделей потрібен інтернет."', 'a: "dashboard.faq_a5"'
)

content = content.replace('{it.q}', '{t(it.q)}')
content = content.replace('{it.a}', '{t(it.a)}')


with open("/Users/valentinvdovicenko/Desktop/atlas_ai/website/frontend/src/pages/Dashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

