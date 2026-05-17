#!/usr/bin/env bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Atlas AI — Official Installer for macOS
# Usage: curl -fsSL https://atlas-site-2p2d.onrender.com/install | bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -euo pipefail

ATLAS_SERVER="https://atlas-site-2p2d.onrender.com"
INSTALL_DIR="/Library/Application Support/Atlas"
LAUNCH_AGENT_DIR="/Library/LaunchAgents"
LAUNCH_AGENT_ID="com.atlas.ai"
LAUNCH_AGENT_PLIST="$LAUNCH_AGENT_DIR/$LAUNCH_AGENT_ID.plist"
TMP_PKG="/tmp/atlas-latest.tar.gz"

# ── Styling helpers ──────────────────────────────────────────────────────────
BOLD="\033[1m"
CYAN="\033[36m"
GREEN="\033[32m"
RED="\033[31m"
YELLOW="\033[33m"
RESET="\033[0m"

title()   { echo -e "\n${BOLD}${CYAN}▶ $1${RESET}"; }
success() { echo -e "${GREEN}✔ $1${RESET}"; }
warn()    { echo -e "${YELLOW}⚠ $1${RESET}"; }
error()   { echo -e "${RED}✖ $1${RESET}" >&2; exit 1; }
step()    { echo -e "  ${BOLD}→${RESET} $1"; }

# ── Banner ───────────────────────────────────────────────────────────────────
clear
echo -e "${BOLD}${CYAN}"
echo "  ___  _   _      _    ____      _    ___ "
echo " / _ \| |_| |    / \  / ___|    / \  |_ _|"
echo "| | | | __| |   / _ \ \___ \   / _ \  | | "
echo "| |_| | |_| |__/ ___ \ ___) | / ___ \ | | "
echo " \___/ \__|_____/_/  \_\____/ /_/   \_\___|"
echo -e "${RESET}"
echo -e "${BOLD}Atlas AI — Cognitive Operating System for macOS${RESET}"
echo -e "${CYAN}──────────────────────────────────────────────────${RESET}\n"

# ── Step 1: System check ─────────────────────────────────────────────────────
title "Перевірка системи"

if [[ "$(uname -s)" != "Darwin" ]]; then
    error "Atlas AI підтримує тільки macOS. Ваша ОС: $(uname -s)"
fi

MAC_VER=$(sw_vers -productVersion)
MAC_MAJOR=$(echo "$MAC_VER" | cut -d. -f1)
if (( MAC_MAJOR < 13 )); then
    error "Потрібен macOS 13 (Ventura) або новіше. Ваша версія: $MAC_VER"
fi
success "macOS $MAC_VER — OK"

# Check Python 3.10+
if ! command -v python3 &>/dev/null; then
    warn "Python 3 не знайдено. Встановіть через https://brew.sh:"
    echo "    brew install python@3.12"
    exit 1
fi
PY_VER=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
PY_MAJOR=$(echo "$PY_VER" | cut -d. -f1)
PY_MINOR=$(echo "$PY_VER" | cut -d. -f2)
if (( PY_MAJOR < 3 || (PY_MAJOR == 3 && PY_MINOR < 10) )); then
    error "Потрібен Python 3.10 або новіше. Встановлена версія: $PY_VER"
fi
success "Python $PY_VER — OK"

# Check curl
if ! command -v curl &>/dev/null; then
    error "curl не знайдено. Встановіть Xcode Command Line Tools: xcode-select --install"
fi
success "curl — OK"

# ── Step 2: License key ──────────────────────────────────────────────────────
title "Активація ліцензії"

echo -e "  Придбайте ліцензію на: ${CYAN}${ATLAS_SERVER}${RESET}"
echo ""

while true; do
    read -r -p "  Введіть ваш ліцензійний ключ (ATLAS-XXXX-XXXX-XXXX-XXXX): " LICENSE_KEY
    LICENSE_KEY=$(echo "$LICENSE_KEY" | tr '[:lower:]' '[:upper:]' | xargs)

    if [[ -z "$LICENSE_KEY" ]]; then
        warn "Ключ не може бути порожнім"
        continue
    fi

    step "Перевірка ключа на сервері..."

    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ATLAS_SERVER/api/atlas/download-token" \
        -H "Content-Type: application/json" \
        -d "{\"key\": \"$LICENSE_KEY\"}" 2>/dev/null || true)

    HTTP_BODY=$(echo "$RESPONSE" | head -n -1)
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

    if [[ "$HTTP_CODE" == "200" ]]; then
        DOWNLOAD_URL=$(echo "$HTTP_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['download_url'])" 2>/dev/null)
        success "Ліцензія підтверджена! Отримано захищене посилання (дійсне 15 хв)."
        break
    elif [[ "$HTTP_CODE" == "404" ]]; then
        warn "Невірний ліцензійний ключ. Спробуйте ще раз."
    elif [[ "$HTTP_CODE" == "403" ]]; then
        ERROR_MSG=$(echo "$HTTP_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('detail',''))" 2>/dev/null)
        warn "Ліцензія неактивна: $ERROR_MSG"
        warn "Поновіть підписку на: $ATLAS_SERVER"
        exit 1
    else
        warn "Сервер тимчасово недоступний (HTTP $HTTP_CODE). Перевірте з'єднання."
    fi
done

# ── Step 3: Download Atlas package ───────────────────────────────────────────
title "Завантаження Atlas AI (~1.5 GB)"
echo -e "  ${YELLOW}Це займе 2-10 хвилин залежно від швидкості інтернету...${RESET}\n"

if ! curl -L --progress-bar --fail "$DOWNLOAD_URL" -o "$TMP_PKG"; then
    error "Помилка завантаження. Токен дійсний 15 хвилин — запустіть установник знову."
fi
success "Завантаження завершено: $TMP_PKG"

# Verify file is not corrupted
if [[ ! -s "$TMP_PKG" ]]; then
    rm -f "$TMP_PKG"
    error "Завантажений файл порожній або пошкоджений. Спробуйте ще раз."
fi

# ── Step 4: Install to protected directory ───────────────────────────────────
title "Встановлення в системну директорію"
echo -e "  ${YELLOW}Потрібні права адміністратора (sudo) для захисту файлів Atlas.${RESET}\n"

step "Створення директорії: $INSTALL_DIR"
sudo mkdir -p "$INSTALL_DIR"

step "Розпакування пакету..."
sudo tar -xzf "$TMP_PKG" -C "$INSTALL_DIR" 2>/dev/null || {
    sudo tar -xf "$TMP_PKG" -C "$INSTALL_DIR" 2>/dev/null || error "Помилка розпакування архіву"
}

step "Застосування прав доступу (захист від читання стороннім)..."
sudo chmod -R 700 "$INSTALL_DIR"
sudo chown -R root:wheel "$INSTALL_DIR"

# Allow execution and install Python dependencies if running raw python files
CURRENT_USER=$(whoami)
sudo chmod a+rx "$INSTALL_DIR" 2>/dev/null || true
ATLAS_BIN=$(find "$INSTALL_DIR" -name "atlas" -o -name "Atlas" -o -name "main" 2>/dev/null | head -1)
if [[ -n "$ATLAS_BIN" ]]; then
    sudo chmod a+x "$ATLAS_BIN"
fi

# ── Step 4.5: Dependency installation (if uncompiled) ───────────────────────
ATLAS_EXEC=$(find "$INSTALL_DIR" -maxdepth 2 -name "atlas" -o -name "Atlas" -o -name "main.py" 2>/dev/null | head -1)
if [[ "$ATLAS_EXEC" == *.py ]]; then
    title "Встановлення залежностей Python"
    step "Створення віртуального середовища (.venv)..."
    sudo python3 -m venv "$INSTALL_DIR/.venv"
    
    # Fix .venv ownership for pip install
    sudo chown -R root:wheel "$INSTALL_DIR/.venv"
    
    step "Встановлення модулів STT/TTS та ШІ бібліотек..."
    sudo "$INSTALL_DIR/.venv/bin/pip" install --upgrade pip
    sudo "$INSTALL_DIR/.venv/bin/pip" install --no-cache-dir -r "$INSTALL_DIR/requirements.txt"
    
    # Fix pyaudio / portaudio links if needed
    success "Усі бібліотеки успішно встановлено у віртуальне середовище (.venv)"
fi

rm -f "$TMP_PKG"
success "Встановлено в: $INSTALL_DIR"

# ── Step 5: Configure auto-start (LaunchAgent) ───────────────────────────────
title "Налаштування автозапуску"

if [[ -n "$ATLAS_EXEC" ]]; then
    # Determine how to launch
    if [[ "$ATLAS_EXEC" == *.py ]]; then
        PROGRAM_ARR="<string>$INSTALL_DIR/.venv/bin/python3</string><string>$ATLAS_EXEC</string>"
    else
        PROGRAM_ARR="<string>$ATLAS_EXEC</string>"
    fi

    sudo tee "$LAUNCH_AGENT_PLIST" > /dev/null <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$LAUNCH_AGENT_ID</string>
    <key>ProgramArguments</key>
    <array>
        $PROGRAM_ARR
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
    <key>StandardErrorPath</key>
    <string>/tmp/atlas-error.log</string>
    <key>StandardOutPath</key>
    <string>/tmp/atlas-out.log</string>
    <key>WorkingDirectory</key>
    <string>$INSTALL_DIR</string>
</dict>
</plist>
PLIST

    sudo launchctl load "$LAUNCH_AGENT_PLIST" 2>/dev/null || true
    success "LaunchAgent встановлено — Atlas запускатиметься автоматично"
else
    warn "Виконуваний файл не знайдено. Автозапуск не налаштовано."
fi

# ── Step 6: First launch ─────────────────────────────────────────────────────
title "Перший запуск Atlas AI"
step "Збереження ліцензійного ключа в macOS Keychain..."

# Store key in keychain for Atlas to use on first launch
security add-generic-password -a "$CURRENT_USER" -s "Atlas-AI" -w "$LICENSE_KEY" -U 2>/dev/null || true
success "Ключ збережено в Keychain"

echo ""
echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}${GREEN}  ✔ Atlas AI встановлено успішно!${RESET}"
echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -e "  ${BOLD}Ліцензійний ключ:${RESET} $LICENSE_KEY"
echo -e "  ${BOLD}Директорія:${RESET}       $INSTALL_DIR"
echo ""
echo -e "  ${CYAN}Atlas запуститься автоматично при наступному вході в систему.${RESET}"
echo -e "  ${CYAN}Для негайного запуску відкрийте Atlas.app із папки Applications.${RESET}"
echo ""
echo -e "  Підтримка: ${CYAN}$ATLAS_SERVER${RESET}"
echo ""
