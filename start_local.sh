#!/bin/bash

echo "🚀 Запуск Atlas Website (Локально)..."

# Отримуємо локальний IP-адрес Mac
ACTIVE_IF=$(route get default 2>/dev/null | grep interface | awk '{print $2}')
if [ -n "$ACTIVE_IF" ]; then
    LOCAL_IP=$(ipconfig getifaddr $ACTIVE_IF)
fi
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="localhost"
fi
echo "📡 Виявлено локальний IP: $LOCAL_IP"

# 1. Запуск бекенду
echo "📦 Встановлення залежностей бекенду..."
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install python-dotenv httpx

# Перевірка наявності .env
if [ ! -f .env ]; then
    echo "⚙️ Створення базового .env..."
    echo "MONGO_URL=mongodb://localhost:27017" > .env
    echo "DB_NAME=atlas_db" >> .env
    echo "JWT_SECRET=super-secret-key-123" >> .env
    echo "STRIPE_API_KEY=sk_test_..." >> .env
    echo "ADMIN_PIN=0000" >> .env
fi

echo "🟢 Запуск бекенду (uvicorn) на порту 8000..."
.venv/bin/python3 -m uvicorn server:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# 2. Запуск фронтенду
echo "💻 Перехід до фронтенду..."
cd frontend
echo "📦 Встановлення NPM пакетів (якщо потрібно)..."
npm install --legacy-peer-deps
npm install ajv@^8.12.0 ajv-keywords@^5.1.0 --legacy-peer-deps

echo "🔵 Запуск React (npm start)..."
export REACT_APP_BACKEND_URL="http://$LOCAL_IP:8000"
npm start

# Коли закривають фронтенд, зупиняємо і бекенд
kill $BACKEND_PID
echo "🛑 Всі сервери зупинено."
