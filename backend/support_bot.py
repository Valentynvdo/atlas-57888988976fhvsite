import os
import logging
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from bot_translations import TEXTS
from db import db
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
ADMIN_ID = 743820908

# ──────────────────────────────────────────────
# FSM States
# ──────────────────────────────────────────────
class SupportFlow(StatesGroup):
    waiting_for_issue = State()


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────
def get_lang(user: types.User) -> str:
    """Return 'en' for English-speaking users, 'uk' for everyone else."""
    lc = (user.language_code or "")
    return "en" if lc.startswith("en") else "uk"


def main_keyboard(lang: str, is_linked: bool = False) -> types.InlineKeyboardMarkup:
    t = TEXTS[lang]
    rows = [
        [types.InlineKeyboardButton(text=t["btn_install"],  callback_data="faq_install")],
        [types.InlineKeyboardButton(text=t["btn_bugs"],     callback_data="faq_bugs")],
        [types.InlineKeyboardButton(text=t["btn_billing"],  callback_data="faq_billing")],
        [types.InlineKeyboardButton(text=t["btn_general"],  callback_data="faq_general")],
    ]
    if is_linked:
        rows.append([types.InlineKeyboardButton(text="👤 Мій профіль (Ліцензія)" if lang == "uk" else "👤 My Profile (License)", callback_data="my_profile")])
    
    rows.append([types.InlineKeyboardButton(text=t["btn_support"],  callback_data="live_support")])
    return types.InlineKeyboardMarkup(inline_keyboard=rows)


def back_keyboard(lang: str) -> types.InlineKeyboardMarkup:
    label = "⬅️ Повернутися до меню" if lang == "uk" else "⬅️ Back to menu"
    return types.InlineKeyboardMarkup(inline_keyboard=[
        [types.InlineKeyboardButton(text=label, callback_data="back_menu")]
    ])


async def notify_admin(bot_inst: Bot, user: types.User, event_type: str, desc: str, full_text: str):
    from datetime import datetime, timezone
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    uname = f"@{user.username}" if user.username else f"(немає username)"
    msg = (
        "🚨 <b>НОВЕ ЗВЕРНЕННЯ — Atlas AI Support</b>\n\n"
        f"👤 Користувач: {uname} (ID: <code>{user.id}</code>)\n"
        f"🕐 Час: {ts}\n"
        f"🏷 Тип: {event_type}\n"
        f"📌 Проблема: {desc}\n\n"
        f"💬 Повний текст:\n<i>{full_text[:1500]}</i>"
    )
    try:
        await bot_inst.send_message(chat_id=ADMIN_ID, text=msg, parse_mode="HTML")
    except Exception as e:
        logger.error("Admin notify failed: %s", e)


# ──────────────────────────────────────────────
# Bot & Dispatcher factory (called from server.py)
# ──────────────────────────────────────────────
def create_bot_and_dispatcher():
    if not TELEGRAM_BOT_TOKEN:
        logger.warning("TELEGRAM_BOT_TOKEN not set — support bot disabled")
        return None, None

    _bot = Bot(token=TELEGRAM_BOT_TOKEN, parse_mode="HTML")
    _dp  = Dispatcher(storage=MemoryStorage())

    # ── /start ──────────────────────────────
    @_dp.message(Command("start"))
    async def cmd_start(message: types.Message, state: FSMContext):
        await state.clear()
        lang = get_lang(message.from_user)
        text_parts = message.text.split(maxsplit=1)
        token = text_parts[1] if len(text_parts) > 1 else None

        if token and token.startswith("LINK_"):
            # Check link token
            link_doc = await db.telegram_link_tokens.find_one({"token": token, "used": False})
            if link_doc:
                exp = datetime.fromisoformat(link_doc["expires_at"])
                if datetime.now(timezone.utc) < exp:
                    # Valid token -> Link account
                    await db.telegram_link_tokens.update_one({"_id": link_doc["_id"]}, {"$set": {"used": True}})
                    await db.telegram_links.delete_many({"user_id": link_doc["user_id"]}) # remove old links
                    await db.telegram_links.insert_one({
                        "user_id": link_doc["user_id"],
                        "telegram_id": message.from_user.id,
                        "telegram_username": message.from_user.username,
                        "linked_at": datetime.now(timezone.utc).isoformat()
                    })
                    msg = "✅ Акаунт успішно синхронізовано з сайтом!" if lang == "uk" else "✅ Account successfully synced with website!"
                    await message.answer(msg)
                else:
                    msg = "❌ Посилання застаріло. Згенеруйте нове на сайті." if lang == "uk" else "❌ Link expired. Generate a new one on the website."
                    await message.answer(msg)
            else:
                msg = "❌ Недійсне посилання для синхронізації." if lang == "uk" else "❌ Invalid sync link."
                await message.answer(msg)

        # Check if already linked
        link = await db.telegram_links.find_one({"telegram_id": message.from_user.id})
        is_linked = bool(link)
        await message.answer(TEXTS[lang]["welcome"], reply_markup=main_keyboard(lang, is_linked))

    # ── /lang (switch language) ──────────────
    @_dp.message(Command("lang"))
    async def cmd_lang(message: types.Message, state: FSMContext):
        await state.clear()
        data = await state.get_data()
        current = data.get("lang", get_lang(message.from_user))
        new_lang = "en" if current == "uk" else "uk"
        await state.update_data(lang=new_lang)
        link = await db.telegram_links.find_one({"telegram_id": message.from_user.id})
        is_linked = bool(link)
        await message.answer(TEXTS[new_lang]["welcome"], reply_markup=main_keyboard(new_lang, is_linked))

    # ── /help ────────────────────────────────
    @_dp.message(Command("help"))
    async def cmd_help(message: types.Message, state: FSMContext):
        await state.clear()
        lang = get_lang(message.from_user)
        await message.answer(TEXTS[lang]["welcome"], reply_markup=main_keyboard(lang))

    # ── FAQ callbacks ────────────────────────
    @_dp.callback_query(F.data.in_({"faq_install", "faq_bugs", "faq_billing", "faq_general"}))
    async def process_faq(cb: types.CallbackQuery, state: FSMContext):
        await state.clear()
        data = await state.get_data()
        lang = data.get("lang", get_lang(cb.from_user))
        key  = cb.data  # e.g. "faq_install"
        await cb.message.answer(TEXTS[lang][key], parse_mode="Markdown", reply_markup=back_keyboard(lang))
        await cb.answer()
        
    # ── My Profile callback ──────────────────
    @_dp.callback_query(F.data == "my_profile")
    async def process_my_profile(cb: types.CallbackQuery, state: FSMContext):
        data = await state.get_data()
        lang = data.get("lang", get_lang(cb.from_user))
        link = await db.telegram_links.find_one({"telegram_id": cb.from_user.id})
        
        if not link:
            await cb.message.answer("❌ Акаунт не синхронізовано." if lang == "uk" else "❌ Account not synced.", reply_markup=back_keyboard(lang))
            await cb.answer()
            return
            
        user_id = link["user_id"]
        user_doc = await db.users.find_one({"user_id": user_id})
        lic = await db.licenses.find_one({"user_id": user_id})
        
        if not user_doc or not lic:
            await cb.message.answer("❌ Дані не знайдено." if lang == "uk" else "❌ Data not found.", reply_markup=back_keyboard(lang))
            await cb.answer()
            return
            
        email = user_doc.get("email", "N/A")
        key = lic.get("key", "N/A")
        mac_name = lic.get("mac_name", "Не прив'язано" if lang == "uk" else "Not bound")
        active = "✅ Активна" if lic.get("active") else "❌ Неактивна"
        exp_str = lic.get("expires_at", "N/A")
        
        if exp_str != "N/A":
            try:
                exp_dt = datetime.fromisoformat(exp_str)
                exp_str = exp_dt.strftime("%Y-%m-%d")
            except:
                pass
                
        msg = (
            f"👤 <b>Ваш Профіль Atlas AI</b>\n\n"
            f"📧 Email: {email}\n"
            f"🔑 Ліцензія: <code>{key}</code>\n"
            f"💻 Пристрій: {mac_name}\n"
            f"Статус: {active}\n"
            f"Діє до: {exp_str}\n"
        ) if lang == "uk" else (
            f"👤 <b>Your Atlas AI Profile</b>\n\n"
            f"📧 Email: {email}\n"
            f"🔑 License: <code>{key}</code>\n"
            f"💻 Device: {mac_name}\n"
            f"Status: {active}\n"
            f"Valid until: {exp_str}\n"
        )
        
        await cb.message.answer(msg, reply_markup=back_keyboard(lang), parse_mode="HTML")
        await cb.answer()

    # ── Live support button ──────────────────
    @_dp.callback_query(F.data == "live_support")
    async def process_live_support(cb: types.CallbackQuery, state: FSMContext):
        data = await state.get_data()
        lang = data.get("lang", get_lang(cb.from_user))
        await cb.message.answer(TEXTS[lang]["support_prompt"])
        await state.set_state(SupportFlow.waiting_for_issue)
        await cb.answer()

    # ── Back to menu ─────────────────────────
    @_dp.callback_query(F.data == "back_menu")
    async def back_menu(cb: types.CallbackQuery, state: FSMContext):
        await state.clear()
        data = await state.get_data()
        lang = data.get("lang", get_lang(cb.from_user))
        link = await db.telegram_links.find_one({"telegram_id": cb.from_user.id})
        is_linked = bool(link)
        await cb.message.answer(TEXTS[lang]["choose_action"], reply_markup=main_keyboard(lang, is_linked))
        await cb.answer()

    # ── User sent issue details (FSM) ────────
    @_dp.message(SupportFlow.waiting_for_issue)
    async def receive_issue(message: types.Message, state: FSMContext):
        data = await state.get_data()
        lang = data.get("lang", get_lang(message.from_user))
        await message.answer(TEXTS[lang]["support_received"], reply_markup=main_keyboard(lang))
        await notify_admin(_bot, message.from_user, "Запит оператора", "Звернення до живої підтримки", message.text or "")
        await state.clear()

    # ── Free-text handler ────────────────────
    @_dp.message(F.text)
    async def handle_free_text(message: types.Message, state: FSMContext):
        data  = await state.get_data()
        lang  = data.get("lang", get_lang(message.from_user))
        t     = TEXTS[lang]
        text  = (message.text or "").lower()

        # keyword categories
        kw_support   = ["підтримка", "оператор", "людина", "менеджер", "support", "operator", "human", "manager", "agent"]
        kw_refund    = ["повернення", "гроші", "кошти", "скасуй", "refund", "money", "cancel subscription"]
        kw_tech      = ["помилка", "зависає", "не відповідає", "вилітає", "збій", "баг",
                        "error", "crash", "bug", "freeze", "doesn't work", "not working"]
        kw_complaint = ["скарга", "незадоволен", "жах", "жахливо", "погано", "terrible", "awful", "complaint", "angry", "bad service"]
        kw_feature   = ["не вистачає", "додайте", "хочу", "зробіть", "feature request", "add feature", "missing"]

        if any(k in text for k in kw_support):
            await message.answer(t["support_prompt"])
            await state.set_state(SupportFlow.waiting_for_issue)
            return

        if any(k in text for k in kw_refund):
            await message.answer(t["tpl_refund"])
            await notify_admin(_bot, message.from_user, "Повернення коштів", "Запит на повернення", message.text or "")
            await message.answer(t["choose_action"], reply_markup=main_keyboard(lang))
            return

        if any(k in text for k in kw_tech):
            await message.answer(t["tpl_complaint_tech"])
            await notify_admin(_bot, message.from_user, "Технічна проблема", "Повідомлення про помилку", message.text or "")
            await message.answer(t["choose_action"], reply_markup=main_keyboard(lang))
            return

        if any(k in text for k in kw_complaint):
            await message.answer(t["tpl_complaint_service"])
            await notify_admin(_bot, message.from_user, "Скарга", "Невдоволення сервісом", message.text or "")
            await message.answer(t["choose_action"], reply_markup=main_keyboard(lang))
            return

        if any(k in text for k in kw_feature):
            await message.answer(t["tpl_complaint_feature"])
            await notify_admin(_bot, message.from_user, "Пропозиція", "Запит на функціонал", message.text or "")
            await message.answer(t["choose_action"], reply_markup=main_keyboard(lang))
            return

        # Default — show menu
        link = await db.telegram_links.find_one({"telegram_id": message.from_user.id})
        is_linked = bool(link)
        await message.answer(t["welcome"], reply_markup=main_keyboard(lang, is_linked))

    return _bot, _dp
