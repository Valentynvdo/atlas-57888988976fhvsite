#!/bin/bash
# uninstall.sh — Secure Uninstaller for Atlas AI Platform
# Usage: curl -fsSL https://atlas-site-2p2d.onrender.com/uninstall | bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}=== Видалення Atlas AI Platform ===${NC}\n"

# 1. Check OS
if [ "$(uname)" != "Darwin" ]; then
    echo -e "${RED}Помилка: Цей скрипт призначений тільки для macOS.${NC}"
    exit 1
fi

# 2. Stop running processes
echo -e "${BLUE}[1/4] Зупинка фонових процесів Atlas AI...${NC}"
killall atlas_core 2>/dev/null || true
killall Python 2>/dev/null || true
echo "Фонові сервіси зупинено."

# 3. Create Backup of Personal Semantic Memory
echo -e "\n${BLUE}[2/4] Резервне копіювання когнітивної пам'яті...${NC}"
INSTALL_DIR="/Library/Application Support/Atlas"
BACKUP_DIR="$HOME/Desktop/Atlas_Personal_Backup"

if sudo [ -d "$INSTALL_DIR/personal_memory" ]; then
    echo "Знайдено когнітивну пам'ять користувача."
    mkdir -p "$BACKUP_DIR"
    # Copy using sudo since source folder is restricted (chmod 700)
    sudo cp -r "$INSTALL_DIR/personal_memory/" "$BACKUP_DIR/"
    sudo chown -R $(whoami) "$BACKUP_DIR"
    echo -e "${GREEN}✓ Ваша особиста пам'ять та налаштування надійно збережені на Робочому столі:${NC}"
    echo -e "➔ ${BACKUP_DIR}"
else
    echo "Когнітивну пам'ять не знайдено (можливо, Atlas ще не запускався)."
fi

# 4. Remove installation files
echo -e "\n${BLUE}[3/4] Видалення системних компонентів...${NC}"
echo "Для видалення захищеної системної папки потрібні права адміністратора (sudo):"
sudo rm -rf "$INSTALL_DIR"
sudo rm -f /Applications/Atlas.app || true
sudo rm -f /Library/LaunchAgents/com.atlas.ai.plist 2>/dev/null || true

echo -e "${GREEN}✓ Системні папки та бінарні файли успішно видалені.${NC}"

# 5. Ask to delete Backup
echo -e "\n${YELLOW}Бажаєте також ПОВНІСТЮ видалити збережену на Робочому столі пам'ять користувача? [y/N]${NC}"
read -r -p "Вибір: " DELETE_BACKUP
if [[ "$DELETE_BACKUP" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    rm -rf "$BACKUP_DIR"
    echo -e "${RED}✓ Резервну копію пам'яті повністю видалено.${NC}"
else
    echo -e "${GREEN}✓ Резервна копія пам'яті збережена.${NC}"
fi

echo -e "\n${GREEN}===========================================${NC}"
echo -e "${GREEN}✓ ATLAS AI УСПІШНО ВИДАЛЕНО З ВАШОГО MAC!${NC}"
echo -e "===========================================${NC}\n"
