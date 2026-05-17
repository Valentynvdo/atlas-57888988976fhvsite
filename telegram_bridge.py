import os
import asyncio
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import telegram_auth
import telegram_formatter
import command_queue
import session_context
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    import keyring
    stored_key = keyring.get_password("Atlas-AI", "license_key")
    
    # ── Automatic pairing via deep link /start ACT_... ────────────────────────
    if context.args:
        activation_arg = context.args[0]
        if activation_arg.startswith("ACT_"):
            passed_key = activation_arg.replace("ACT_", "").strip().upper()
            
            # Verify passed key matches local keychain key
            if stored_key and passed_key == stored_key.strip().upper():
                telegram_auth.save_allowed_user_id(user_id)
                await update.message.reply_text(
                    f"🎉 Авторизація успішна!\n\n"
                    f"Ваш Telegram Chat ID ({user_id}) успішно прив'язано до ліцензії {stored_key}.\n"
                    f"Тепер ви можете віддалено керувати вашим Atlas AI!"
                )
                print(f"✅ [Telegram Security] Успішна авторизація власника ID {user_id} для ключа {stored_key}")
                return
            else:
                await update.message.reply_text(
                    "❌ Помилка активації: Ключ з посилання не збігається з ліцензійним ключем, встановленим на вашому Mac.\n"
                    "Переконайтеся, що ви зайшли під правильним акаунтом."
                )
                print(f"⚠️ [Telegram Security] Спроба авторизації з невірним ключем: {passed_key}")
                return

    # Normal authorization check
    if not telegram_auth.is_authorized(user_id):
        instructions = (
            "🤖 *Вітаємо в Atlas AI!*\n\n"
            "Цей бот призначений для віддаленого керування вашим персональним комп'ютером.\n\n"
            "Для активації:\n"
            "1️⃣ Перейдіть в ваш *Особистий кабінет* на сайті.\n"
            "2️⃣ Натисніть кнопку *«Підключити Telegram-бота»*.\n"
            "3️⃣ Або надішліть боту команду:\n"
            f"`/start ACT_ВАШ_ЛІЦЕНЗІЙНИЙ_КЛЮЧ`"
        )
        await update.message.reply_text(instructions, parse_mode='Markdown')
        print(f"⚠️ [Telegram Security] /start від невідомого ID: {user_id}")
        return

    await update.message.reply_text("🤖 Atlas онлайн. Готовий до роботи.")

async def setup(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if telegram_auth.get_allowed_user_id() is not None:
        if telegram_auth.is_authorized(user_id):
            await update.message.reply_text("Ви вже авторизовані як власник цього пристрою.")
        else:
            await update.message.reply_text("Цей пристрій вже має зареєстрованого власника.")
        return

    import keyring
    stored_key = keyring.get_password("Atlas-AI", "license_key")

    if context.args:
        passed_key = context.args[0].replace("ACT_", "").strip().upper()
        if stored_key and passed_key == stored_key.strip().upper():
            telegram_auth.save_allowed_user_id(user_id)
            await update.message.reply_text(f"🎉 Авторизація успішна. ID {user_id} збережено як власника.")
            return
        else:
            await update.message.reply_text("❌ Введений ліцензійний ключ не збігається з ключем на цьому Mac.")
            return

    await update.message.reply_text(
        "Для авторизації надішліть команду:\n"
        "`/setup ВАШ_ЛІЦЕНЗІЙНИЙ_КЛЮЧ`",
        parse_mode='Markdown'
    )

async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if not telegram_auth.is_authorized(user_id):
        print(f"⚠️ [Telegram Security] /status від невідомого ID: {user_id}")
        return
    await update.message.reply_text(f"🤖 Atlas Status: Online\nВерсія: 2.0.0-Hive\nРежим: {session_context.context.get_mode()}")

async def report(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not telegram_auth.is_authorized(update.effective_user.id): return
    report_dir = "Atlas_Notebook"
    if os.path.exists(report_dir):
        files = [f for f in os.listdir(report_dir) if f.endswith(".md")]
        if files:
            latest = max([os.path.join(report_dir, f) for f in files], key=os.path.getctime)
            with open(latest, "r") as f:
                content = f.read()
            for part in telegram_formatter.split_message(content):
                await update.message.reply_text(part)
            return
    await update.message.reply_text("Звітів не знайдено.")

async def skills(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not telegram_auth.is_authorized(update.effective_user.id): return
    import handlers
    skills_list = list(handlers.AUTONOMOUS_SKILLS.keys())
    await update.message.reply_text("🚀 Активні скіли:\n" + "\n".join([f"🔹 {s}" for s in skills_list]))

async def errors(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not telegram_auth.is_authorized(update.effective_user.id): return
    if os.path.exists("errors.log"):
        with open("errors.log", "r") as f:
            lines = f.readlines()[-20:]
        msg = "⚠️ Останні помилки:\n" + "".join(lines)
        for part in telegram_formatter.split_message(msg):
            await update.message.reply_text(f"```\n{part}\n```", parse_mode='MarkdownV2')
    else:
        await update.message.reply_text("Лог помилок порожній.")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if not telegram_auth.is_authorized(user_id):
        print(f"⚠️ [Telegram Security] Спроба доступу від невідомого ID: {user_id}")
        return
    text = update.message.text
    command_queue.add_command(text, session_context.MODE_CHAT)
    session_context.context.add_message("user", text, session_context.MODE_CHAT)

async def response_listener(application: Application):
    """Слухає чергу відповідей і надсилає в Telegram."""
    while True:
        resp_text = command_queue.get_response()
        if resp_text:
            allowed_id = telegram_auth.get_allowed_user_id()
            if allowed_id:
                formatted = telegram_formatter.format_response(resp_text)
                for part in telegram_formatter.split_message(formatted):
                    try:
                        await application.bot.send_message(chat_id=allowed_id, text=part)
                    except Exception as e:
                        logger.error(f"Error sending message: {e}")
        await asyncio.sleep(0.5)

async def command_processor():
    """Читає команди з черги і передає в handlers."""
    import handlers
    print("[Telegram Bridge] Процесор команд активовано.")
    while True:
        try:
            item = command_queue.get_command()
            if item:
                text = item.get("text")
                mode = item.get("mode", session_context.MODE_CHAT)
                session_context.context.set_mode(mode)
                print(f"[Telegram Bridge] Виконання: {text}")
                try:
                    await asyncio.get_event_loop().run_in_executor(
                        None, handlers.execute_cmd, None, text
                    )
                except Exception as e:
                    logger.error(f"Error executing command: {e}")
            await asyncio.sleep(0.1)
        except Exception as e:
            logger.error(f"Error in command_processor: {e}")
            await asyncio.sleep(1)

# ← ВСІ ФУНКЦІЇ НА ВЕРХНЬОМУ РІВНІ, run_bot ОКРЕМО

def run_bot():
    if not BOT_TOKEN:
        print("[Telegram Bridge] BOT_TOKEN не знайдено!")
        return

    async def _main():
        application = Application.builder().token(BOT_TOKEN).build()

        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("setup", setup))
        application.add_handler(CommandHandler("status", status))
        application.add_handler(CommandHandler("report", report))
        application.add_handler(CommandHandler("skills", skills))
        application.add_handler(CommandHandler("errors", errors))
        application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

        await application.initialize()
        await application.start()
        await application.updater.start_polling()

        asyncio.create_task(response_listener(application))
        asyncio.create_task(command_processor())

        print("[Telegram Bridge] Бот запущений.")
        while True:
            await asyncio.sleep(10)

    asyncio.run(_main())

if __name__ == "__main__":
    run_bot()