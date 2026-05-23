import logging
import os
import re
import uuid
from datetime import datetime, timezone

from aiogram import Bot, Dispatcher, Router, types
from aiogram.filters import Command, CommandObject
from dotenv import load_dotenv

from db import db

logger = logging.getLogger(__name__)

# Load .env variables
load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
ADMIN_TELEGRAM_ID = os.getenv("ADMIN_TELEGRAM_ID")

bot = Bot(token=TELEGRAM_BOT_TOKEN) if TELEGRAM_BOT_TOKEN else None
dp = Dispatcher()
router = Router()

def get_priority(category: str) -> str:
    cat = category.upper()
    if cat == "PAYMENT":
        return "HIGH"
    elif cat == "BUG":
        return "MEDIUM"
    return "LOW"

@router.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.answer(
        "👋 Вітаємо в ATLAS Support Hub!\n\n"
        "Чим ми можемо вам допомогти?\n"
        "Використовуйте зручне меню зліва від поля вводу або команди:\n\n"
        "📚 /faq - Поширені запитання (Швидкі відповіді)\n"
        "🐛 /bug [опис] - Повідомити про технічну помилку\n"
        "❓ /help [опис] - Загальне запитання до підтримки\n"
        "💳 /payment [опис] - Питання щодо оплати\n"
        "📋 /mytickets - Ваші відкриті тикети\n"
        "✅ /close [номер] - Закрити тикет\n"
    )

async def handle_ticket_creation(message: types.Message, command: CommandObject, category: str):
    if not command.args:
        await message.answer(f"Please provide details for your {category} request. Example:\n/{category} App crashes on login")
        return

    text = command.args.strip()
    user_id = message.from_user.id
    ticket_number = f"{category.upper()}-{int(datetime.now().timestamp())}"
    priority = get_priority(category)
    
    # Store ticket in DB
    ticket_data = {
        "_id": str(uuid.uuid4()),
        "ticket_number": ticket_number,
        "telegram_account_id": user_id,
        "category": category.upper(),
        "title": text[:50] + "..." if len(text) > 50 else text,
        "description": text,
        "status": "OPEN",
        "priority": priority,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.tickets.insert_one(ticket_data)

    # Confirm to user
    await message.answer(
        f"📌 Ticket created: {ticket_number}\n\n"
        f"Category: {category.upper()}\n"
        f"Status: OPEN\n"
        f"Priority: {priority}\n\n"
        f"We will review your request shortly."
    )

    # Notify Admin
    if ADMIN_TELEGRAM_ID:
        try:
            admin_msg = (
                f"🚨 New Ticket: {ticket_number}\n"
                f"Type: {category.upper()}\n"
                f"User: {user_id}\n"
                f"Priority: {priority}\n\n"
                f"Message:\n{text}\n\n"
                f"<i>(Reply to this message to answer the user)</i>"
            )
            await bot.send_message(
                chat_id=ADMIN_TELEGRAM_ID, 
                text=admin_msg,
                parse_mode="HTML"
            )
        except Exception as e:
            logger.error(f"Failed to notify admin: {e}")

@router.message(Command("faq"))
async def cmd_faq(message: types.Message):
    keyboard = types.InlineKeyboardMarkup(inline_keyboard=[
        [types.InlineKeyboardButton(text="🔑 Як підключити API?", callback_data="faq_api")],
        [types.InlineKeyboardButton(text="💎 Тарифи та оплата", callback_data="faq_billing")],
        [types.InlineKeyboardButton(text="🔒 Безпека та конфіденційність", callback_data="faq_privacy")],
        [types.InlineKeyboardButton(text="🤖 Можливості ATLAS", callback_data="faq_features")]
    ])
    await message.answer("📚 <b>Поширені запитання (FAQ)</b>\n\nОберіть тему, яка вас цікавить:", reply_markup=keyboard, parse_mode="HTML")

@router.callback_query(lambda c: c.data and c.data.startswith('faq_'))
async def process_faq_callback(callback_query: types.CallbackQuery):
    code = callback_query.data
    
    faq_answers = {
        "faq_api": "<b>Як підключити API?</b>\nДля того, щоб ATLAS міг працювати автономно, вам потрібен власний API-ключ (OpenAI або Anthropic). Перейдіть в налаштування додатку ATLAS -> розділ API та вставте ваш ключ. Всі запити йдуть напряму до провайдера.",
        "faq_billing": "<b>Тарифи та оплата</b>\nATLAS продається за моделлю одноразової покупки (Lifetime License) або підписки. Ви отримуєте ліцензійний ключ на вказану пошту. Деталі на сторінці Pricing.",
        "faq_privacy": "<b>Безпека та конфіденційність</b>\nATLAS працює локально на вашому Mac. Ми не маємо доступу до ваших файлів, екрану чи листування. Аналіз відбувається через офіційні API провайдерів.",
        "faq_features": "<b>Можливості ATLAS</b>\nATLAS вміє писати код, аналізувати екран, створювати агентів для складних завдань і керуватися через Telegram, коли ви не за комп'ютером."
    }
    
    answer = faq_answers.get(code, "Вибачте, відповідь не знайдена.")
    
    await bot.answer_callback_query(callback_query.id)
    await bot.send_message(callback_query.from_user.id, f"💡 {answer}", parse_mode="HTML")

@router.message(Command("bug"))
async def cmd_bug(message: types.Message, command: CommandObject):
    await handle_ticket_creation(message, command, "bug")

@router.message(Command("help"))
async def cmd_help(message: types.Message, command: CommandObject):
    await handle_ticket_creation(message, command, "help")

@router.message(Command("payment"))
async def cmd_payment(message: types.Message, command: CommandObject):
    await handle_ticket_creation(message, command, "payment")

@router.message(Command("mytickets"))
async def cmd_mytickets(message: types.Message):
    user_id = message.from_user.id
    cursor = db.tickets.find({"telegram_account_id": user_id, "status": {"$in": ["OPEN", "IN_PROGRESS"]}}).sort("created_at", -1)
    tickets = await cursor.to_list()
    
    if not tickets:
        await message.answer("You don't have any open tickets.")
        return
    
    response = "📋 Your active tickets:\n\n"
    for t in tickets:
        response += f"• <b>{t['ticket_number']}</b> ({t['status']}) - {t['title']}\n"
        
    await message.answer(response, parse_mode="HTML")

@router.message(Command("status"))
async def cmd_status(message: types.Message, command: CommandObject):
    if not command.args:
        await message.answer("Please specify a ticket number. Example: /status BUG-1234567")
        return
        
    ticket_number = command.args.strip().upper()
    user_id = message.from_user.id
    
    ticket = await db.tickets.find_one({"ticket_number": ticket_number, "telegram_account_id": user_id})
    if not ticket:
        await message.answer(f"Ticket {ticket_number} not found or you don't have permission to view it.")
        return
        
    await message.answer(
        f"📌 Ticket: {ticket['ticket_number']}\n"
        f"Status: {ticket['status']}\n"
        f"Priority: {ticket.get('priority', 'MEDIUM')}\n"
        f"Created: {ticket.get('created_at', 'Unknown')}"
    )

@router.message(Command("close"))
async def cmd_close(message: types.Message, command: CommandObject):
    if not command.args:
        await message.answer("Please specify a ticket number. Example: /close BUG-1234567")
        return
        
    ticket_number = command.args.strip().upper()
    user_id = message.from_user.id
    
    ticket = await db.tickets.find_one({"ticket_number": ticket_number, "telegram_account_id": user_id})
    if not ticket:
        await message.answer(f"Ticket {ticket_number} not found.")
        return
        
    if ticket['status'] == "CLOSED":
        await message.answer(f"Ticket {ticket_number} is already closed.")
        return
        
    await db.tickets.update_one(
        {"ticket_number": ticket_number},
        {"$set": {"status": "CLOSED", "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    await message.answer(f"✅ Ticket {ticket_number} has been closed.")
    
    # Notify Admin
    if ADMIN_TELEGRAM_ID:
        try:
            await bot.send_message(
                chat_id=ADMIN_TELEGRAM_ID, 
                text=f"✅ User {user_id} closed ticket {ticket_number}."
            )
        except Exception:
            pass

@router.message()
async def handle_admin_reply_or_fallback(message: types.Message):
    # Check if this is an admin replying to a ticket notification
    if ADMIN_TELEGRAM_ID and str(message.chat.id) == str(ADMIN_TELEGRAM_ID):
        if message.reply_to_message and message.reply_to_message.text:
            # Try to extract User ID or Ticket Number from the replied message
            # Format: User: 1234567 \n Ticket: BUG-12345
            replied_text = message.reply_to_message.text
            
            user_id_match = re.search(r"User:\s*(\d+)", replied_text)
            ticket_match = re.search(r"Ticket:\s*([A-Z]+-\d+)", replied_text)
            
            if user_id_match and ticket_match:
                target_user_id = int(user_id_match.group(1))
                ticket_number = ticket_match.group(1)
                
                try:
                    await bot.send_message(
                        chat_id=target_user_id,
                        text=f"💬 <b>Support Reply to {ticket_number}:</b>\n\n{message.text}",
                        parse_mode="HTML"
                    )
                    
                    # Update ticket status to IN_PROGRESS if it was OPEN
                    ticket = await db.tickets.find_one({"ticket_number": ticket_number})
                    if ticket and ticket.get("status") == "OPEN":
                        await db.tickets.update_one(
                            {"ticket_number": ticket_number},
                            {"$set": {"status": "IN_PROGRESS", "updated_at": datetime.now(timezone.utc).isoformat()}}
                        )
                        
                    await message.answer(f"✅ Reply sent to user for ticket {ticket_number}.")
                except Exception as e:
                    await message.answer(f"❌ Failed to send reply: {e}")
                return

    # If it's a normal user not using a command, remind them to use commands
    if str(message.chat.id) != str(ADMIN_TELEGRAM_ID):
        await message.answer(
            "I only understand commands for creating tickets. Please use:\n"
            "/bug [desc] - Report bug\n"
            "/help [desc] - Get help\n"
            "/payment [desc] - Payment issues"
        )

dp.include_router(router)

async def start_bot():
    if not bot:
        logger.warning("TELEGRAM_BOT_TOKEN is not set. Support Bot is disabled.")
        return
    logger.info("Starting Support Telegram Bot...")
    
    # Auto-register commands so they appear in the Telegram menu
    commands = [
        types.BotCommand(command="faq", description="Поширені запитання (FAQ)"),
        types.BotCommand(command="bug", description="Report a technical issue"),
        types.BotCommand(command="help", description="General questions"),
        types.BotCommand(command="payment", description="Billing issues"),
        types.BotCommand(command="mytickets", description="View your active tickets"),
        types.BotCommand(command="status", description="Check ticket status"),
        types.BotCommand(command="close", description="Close a ticket"),
    ]
    try:
        await bot.set_my_commands(commands)
    except Exception as e:
        logger.error(f"Failed to set bot commands: {e}")

    # await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

async def stop_bot():
    if bot:
        logger.info("Stopping Support Telegram Bot...")
        await bot.session.close()
