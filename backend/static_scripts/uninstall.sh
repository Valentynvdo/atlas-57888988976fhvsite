#!/usr/bin/env bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Atlas AI — Official Uninstaller for macOS
# Usage: curl -fsSL https://atlas-assistant.online/uninstall | bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -euo pipefail

INSTALL_DIR="/Library/Application Support/Atlas"
LAUNCH_AGENT_ID="com.atlas.ai"
LAUNCH_AGENT_PLIST="/Library/LaunchAgents/$LAUNCH_AGENT_ID.plist"
BACKUP_DIR="$HOME/Desktop/Atlas_Personal_Backup"

BOLD="\033[1m"
CYAN="\033[36m"
GREEN="\033[32m"
RED="\033[31m"
YELLOW="\033[33m"
RESET="\033[0m"

title()   { echo -e "\n${BOLD}${CYAN}▶ $1${RESET}"; }
success() { echo -e "${GREEN}✔ $1${RESET}"; }
warn()    { echo -e "${YELLOW}⚠ $1${RESET}"; }
step()    { echo -e "  ${BOLD}→${RESET} $1"; }

clear
echo -e "${BOLD}${RED}"
echo "  Atlas AI — Uninstaller"
echo -e "${RESET}"
echo -e "${YELLOW}Ця дія видалить Atlas AI з вашого Mac.${RESET}"
echo -e "${CYAN}Ваші особисті дані будуть збережені на Робочому столі перед видаленням.${RESET}\n"

read -r -p "Ви впевнені, що хочете видалити Atlas AI? (так/ні): " CONFIRM
CONFIRM_LOWER=$(echo "$CONFIRM" | tr '[:upper:]' '[:lower:]')
if [[ "$CONFIRM_LOWER" != "так" && "$CONFIRM_LOWER" != "yes" && "$CONFIRM_LOWER" != "y" ]]; then
    echo -e "${GREEN}Видалення скасовано.${RESET}"
    exit 0
fi

# ── Step 1: Stop Atlas ───────────────────────────────────────────────────────
title "Зупинка Atlas AI"

# Kill any running atlas processes
pkill -f "atlas" 2>/dev/null || true
pkill -f "Atlas" 2>/dev/null || true
step "Процеси Atlas зупинено"

# Unload LaunchAgent
if [[ -f "$LAUNCH_AGENT_PLIST" ]]; then
    sudo launchctl unload "$LAUNCH_AGENT_PLIST" 2>/dev/null || true
    step "LaunchAgent вивантажено"
fi
success "Atlas зупинено"

# ── Step 2: Backup personal data ─────────────────────────────────────────────
title "Збереження особистих даних"

mkdir -p "$BACKUP_DIR"

# Files/dirs to backup (personal memory, NOT owner biometric data)
PERSONAL_DATA_PATHS=(
    "$INSTALL_DIR/personal_memory"
    "$INSTALL_DIR/semantic_memory.json"
    "$INSTALL_DIR/evolution.json"
    "$INSTALL_DIR/evolution_state.json"
    "$INSTALL_DIR/goals.json"
    "$INSTALL_DIR/skills"
    "$INSTALL_DIR/shared_knowledge"
    "$INSTALL_DIR/speech_learning.json"
    "$INSTALL_DIR/dynamic_responses.json"
    "$INSTALL_DIR/atlas_self_improvement_plan.md"
    "$INSTALL_DIR/learning_roadmap.json"
)

BACKED_UP=0
for PATH_TO_BACKUP in "${PERSONAL_DATA_PATHS[@]}"; do
    if [[ -e "$PATH_TO_BACKUP" ]]; then
        BASENAME=$(basename "$PATH_TO_BACKUP")
        sudo cp -r "$PATH_TO_BACKUP" "$BACKUP_DIR/$BASENAME" 2>/dev/null && {
            BACKED_UP=$((BACKED_UP + 1))
            step "Збережено: $BASENAME"
        }
    fi
done

if (( BACKED_UP > 0 )); then
    # Fix ownership so user can access the backup
    sudo chown -R "$(whoami)" "$BACKUP_DIR" 2>/dev/null || true
    success "Особисті дані збережено в: $BACKUP_DIR"
else
    warn "Особисті дані не знайдено або Atlas не був запущений раніше."
fi

# ── Step 3: Remove Atlas installation ────────────────────────────────────────
title "Видалення Atlas AI"

if [[ -d "$INSTALL_DIR" ]]; then
    step "Видалення: $INSTALL_DIR"
    sudo rm -rf "$INSTALL_DIR"
    success "Основна директорія видалена"
else
    warn "Директорія Atlas не знайдена: $INSTALL_DIR"
fi

# Remove LaunchAgent plist
if [[ -f "$LAUNCH_AGENT_PLIST" ]]; then
    sudo rm -f "$LAUNCH_AGENT_PLIST"
    success "LaunchAgent видалено"
fi

# Remove Atlas.app from Applications if present
if [[ -d "/Applications/Atlas.app" ]]; then
    sudo rm -rf "/Applications/Atlas.app"
    success "Atlas.app видалено з Applications"
fi

# Remove license key from Keychain
CURRENT_USER=$(whoami)
security delete-generic-password -a "$CURRENT_USER" -s "Atlas-AI" 2>/dev/null && {
    success "Ліцензійний ключ видалено з Keychain"
} || true

# Remove license cache
rm -rf "$HOME/.atlas" 2>/dev/null || true

# Remove temp logs
rm -f /tmp/atlas-error.log /tmp/atlas-out.log 2>/dev/null || true

# ── Step 4: Ask about personal backup ────────────────────────────────────────
if (( BACKED_UP > 0 )); then
    echo ""
    echo -e "${YELLOW}Ваші особисті дані збережено в:${RESET}"
    echo -e "  ${BOLD}$BACKUP_DIR${RESET}"
    echo ""
    read -r -p "Видалити також особисті дані (пам'ять, навички, цілі)? (так/ні): " DEL_PERSONAL
    DEL_PERSONAL_LOWER=$(echo "$DEL_PERSONAL" | tr '[:upper:]' '[:lower:]')

    if [[ "$DEL_PERSONAL_LOWER" == "так" || "$DEL_PERSONAL_LOWER" == "yes" || "$DEL_PERSONAL_LOWER" == "y" ]]; then
        rm -rf "$BACKUP_DIR"
        success "Особисті дані видалено"
    else
        success "Особисті дані збережено для майбутнього використання"
    fi
fi

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}${GREEN}  ✔ Atlas AI успішно видалено з вашого Mac.${RESET}"
echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -e "  Дякуємо, що користувалися Atlas AI!"
echo -e "  Ви завжди можете повернутися: ${CYAN}https://atlas-assistant.online${RESET}"
echo ""
