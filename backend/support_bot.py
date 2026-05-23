import os
import logging
from aiogram import Bot, Dispatcher, types, F
from aiogram.client.default import DefaultBotProperties
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from bot_translations import TEXTS

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


def main_keyboard(lang: str) -> types.InlineKeyboardMarkup:
    t = TEXTS[lang]
    rows = [
        [types.InlineKeyboardButton(text=t["btn_install"],  callback_data="faq_install")],
        [types.InlineKeyboardButton(text=t["btn_bugs"],     callback_data="faq_bugs")],
        [types.InlineKeyboardButton(text=t["btn_billing"],  callback_data="faq_billing")],
        [types.InlineKeyboardButton(text=t["btn_general"],  callback_data="faq_general")],
        [
            types.InlineKeyboardButton(text=t["btn_support"], callback_data="live_support"),
            types.InlineKeyboardButton(text=t["btn_lang"],    callback_data="switch_lang")
        ],
    ]
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

    _bot = Bot(token=TELEGRAM_BOT_TOKEN, default=DefaultBotProperties(parse_mode="HTML"))
    _dp  = Dispatcher(storage=MemoryStorage())

    # ── /start ──────────────────────────────
    @_dp.message(Command("start"))
    async def cmd_start(message: types.Message, state: FSMContext):
        await state.clear()
        lang = get_lang(message.from_user)
        await message.answer(TEXTS[lang]["welcome"], reply_markup=main_keyboard(lang))

    # ── /lang (switch language) ──────────────
    @_dp.message(Command("lang"))
    async def cmd_lang(message: types.Message, state: FSMContext):
        await state.clear()
        data = await state.get_data()
        current = data.get("lang", get_lang(message.from_user))
        new_lang = "en" if current == "uk" else "uk"
        await state.update_data(lang=new_lang)
        await message.answer(TEXTS[new_lang]["welcome"], reply_markup=main_keyboard(new_lang))

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

    # ── Language switch callback ─────────────
    @_dp.callback_query(F.data == "switch_lang")
    async def process_switch_lang(cb: types.CallbackQuery, state: FSMContext):
        await state.clear()
        data = await state.get_data()
        current = data.get("lang", get_lang(cb.from_user))
        new_lang = "en" if current == "uk" else "uk"
        await state.update_data(lang=new_lang)
        await cb.message.edit_text(TEXTS[new_lang]["welcome"], reply_markup=main_keyboard(new_lang))
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
        await cb.message.answer(TEXTS[lang]["choose_action"], reply_markup=main_keyboard(lang))
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
        await message.answer(t["welcome"], reply_markup=main_keyboard(lang))

    return _bot, _dp
