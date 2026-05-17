#!/usr/bin/env python3
"""
Atlas AI — Build & Deploy Script
=====================================
Run this on Valentin's Mac to compile, pack and upload a new Atlas release.

Usage:
    python3 build.py [--version 1.0.5] [--skip-compile]

Steps:
    1. Compiles Atlas into a binary via PyInstaller (or skips if --skip-compile)
    2. Packs everything into atlas-latest.tar.gz
       - Binary / main.py (source for non-compiled mode)
       - assets/ (sounds, icons)
       - shared_knowledge/
       - models/ (Vosk Ukrainian, ~1.5GB)
       - skills/ (autonomous skills — NO personal data)
       - config.py, requirements.txt
       - LaunchAgent plist template
    3. Excludes personal/biometric data:
       - identity_data/ (owner face photos)
       - personal_memory/ (Valentin's personal context)
       - semantic_memory.json (Valentin's personal vector memory)
       - chat_history.json, goals.json, research_history.json
       - .env (API keys!)
       - *.log files
    4. Uploads atlas-latest.tar.gz to the server via POST /api/admin/version
    5. Updates version info on the server

Requirements:
    pip install pyinstaller requests
"""

import os
import sys
import json
import shutil
import hashlib
import argparse
import subprocess
import tarfile
import time
from pathlib import Path
from datetime import datetime

# ── Config ────────────────────────────────────────────────────────────────────
ATLAS_ROOT = Path(__file__).parent
DIST_DIR = ATLAS_ROOT / "dist"
BUILD_DIR = ATLAS_ROOT / "build_output"
OUTPUT_TAR = ATLAS_ROOT / "atlas-latest.tar.gz"

SERVER = "https://atlas-site-2p2d.onrender.com"
ADMIN_EMAIL = ""   # Fill in on first use or pass via env ATLAS_ADMIN_EMAIL
ADMIN_PIN = ""     # Fill in or pass via env ATLAS_ADMIN_PIN

# Files/dirs to INCLUDE in the distribution package
INCLUDE_DIRS = [
    "assets",
    "shared_knowledge",
    "models",          # Includes Vosk Ukrainian model (~1.5 GB)
    "skills",          # Atlas's learned skills
    "notifications",
]

INCLUDE_FILES = [
    "main.py",
    "config.py",
    "handlers.py",
    "ai_handler.py",
    "autonomous_researcher.py",
    "agent_core.py",
    "agent_context.py",
    "context_intelligence.py",
    "context_actions.py",
    "evolution.py",
    "license_manager.py",
    "semantic_memory.py",
    "ua_normalizer.py",
    "stt.py",
    "sound_effects.py",
    "sphere_window.py",
    "sphere_state.py",
    "sphere.html",
    "mac_control.py",
    "proactive_watcher.py",
    "vision_handler.py",
    "telegram_bridge.py",
    "telegram_formatter.py",
    "telegram_auth.py",
    "persona_manager.py",
    "planner.py",
    "researcher.py",
    "skills_loader.py",
    "metrics.py",
    "intent_cache.py",
    "sandbox.py",
    "requirements.txt",
    "Atlas.icns",
    "Atlas.png",
]

# Files/dirs to ALWAYS EXCLUDE (personal data, API keys, logs)
EXCLUDE_PATTERNS = {
    "identity_data",        # Owner face photos — NEVER include
    "personal_memory",      # Personal context — NEVER include
    "semantic_memory.json", # Owner's personal vector memory — NEVER include
    "chat_history.json",    # Personal conversation history
    "goals.json",           # Personal goals
    "research_history.json",# Personal research
    "evolution.json",       # Owner's personal evolution state
    "evolution_state.json",
    "atlas_metrics.json",
    "ai_cache.json",
    "skynet_log.json",
    "quality_log.json",
    "runtime_state.json",
    "ui_states.json",
    "sphere_state.json",
    "last_shutdown.json",
    "last_location.json",
    "guest_activity.json",
    "user_experience.json",
    "atlas_version.json",
    ".venv",
    "venv",
    "__pycache__",
    ".git",
    "*.log",
    "*.pyc",
    ".DS_Store",
    "website",              # Website source code
    "archive",
    "scratch",
    "sandbox",
    "build_output",
    "dist",
    "atlas-latest.tar.gz",
}


def log(msg: str, color: str = ""):
    colors = {"green": "\033[32m", "yellow": "\033[33m", "red": "\033[31m", "cyan": "\033[36m", "reset": "\033[0m", "bold": "\033[1m"}
    prefix = colors.get(color, "") + "▶ " + colors.get("reset", "")
    print(f"{prefix}{msg}")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def get_admin_token() -> str:
    """Login to admin panel and get a session token."""
    import requests
    log("Авторизація адміністратора...", "cyan")

    email = ADMIN_EMAIL or os.getenv("ATLAS_ADMIN_EMAIL") or input("Admin email: ").strip()
    pin = ADMIN_PIN or os.getenv("ATLAS_ADMIN_PIN") or input("Admin PIN: ").strip()

    # First login with email/password
    resp = requests.post(f"{SERVER}/api/auth/login",
                         json={"email": email, "password": input("Admin password: ").strip()},
                         timeout=30)
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        sys.exit(1)

    token = resp.json().get("token") or resp.cookies.get("session")

    # Submit admin PIN
    resp2 = requests.post(f"{SERVER}/api/auth/admin/pin",
                          json={"pin": pin},
                          headers={"Authorization": f"Bearer {token}"} if token else {},
                          timeout=30)
    log(f"Admin auth: {resp2.status_code}", "green" if resp2.status_code == 200 else "red")
    return token or ""


def compile_with_pyinstaller(version: str):
    """Compile Atlas main.py into a single binary."""
    log("Компіляція через PyInstaller...", "cyan")

    if not shutil.which("pyinstaller"):
        log("PyInstaller не знайдено. Встановлення...", "yellow")
        subprocess.run([sys.executable, "-m", "pip", "install", "pyinstaller"], check=True)

    # Clean previous build
    shutil.rmtree(DIST_DIR, ignore_errors=True)
    shutil.rmtree(ATLAS_ROOT / "build", ignore_errors=True)

    cmd = [
        "pyinstaller",
        "--onefile",
        "--name", "atlas",
        "--icon", str(ATLAS_ROOT / "Atlas.icns"),
        "--add-data", f"{ATLAS_ROOT / 'assets'}:assets",
        "--add-data", f"{ATLAS_ROOT / 'shared_knowledge'}:shared_knowledge",
        "--hidden-import", "vosk",
        "--hidden-import", "edge_tts",
        "--hidden-import", "pyaudio",
        "--noconfirm",
        str(ATLAS_ROOT / "main.py"),
    ]

    result = subprocess.run(cmd, cwd=str(ATLAS_ROOT), capture_output=False)
    if result.returncode != 0:
        log("PyInstaller завершився з помилкою. Пакуємо без компіляції...", "yellow")
        return False

    log(f"Бінарний файл: {DIST_DIR / 'atlas'}", "green")
    return True


def create_package(version: str, use_binary: bool = False) -> Path:
    """Pack Atlas into atlas-latest.tar.gz, excluding all personal data."""
    log(f"Пакування Atlas {version}...", "cyan")

    # Clean build output dir
    shutil.rmtree(BUILD_DIR, ignore_errors=True)
    BUILD_DIR.mkdir(parents=True)

    pkg_dir = BUILD_DIR / "atlas"
    pkg_dir.mkdir()

    # Write version file
    with open(pkg_dir / "VERSION", "w") as f:
        f.write(version)

    # Write a fresh empty config template (NO personal data, no API keys)
    starter_config = {
        "owner": "",
        "owner_configured": False,
        "first_run": True,
    }
    with open(pkg_dir / "config.json", "w") as f:
        json.dump(starter_config, f)

    # Write empty initial memory files (clean slate for new owner)
    (pkg_dir / "memory.json").write_text("{}")
    (pkg_dir / "skills.json").write_text("{}")
    (pkg_dir / "speech_learning.json").write_text("{}")
    (pkg_dir / "dynamic_responses.json").write_text("{}")

    # Create empty identity_data folder (without Valentin's face)
    identity_dir = pkg_dir / "identity_data"
    identity_dir.mkdir()
    (identity_dir / ".gitkeep").touch()

    # ── Inject Shared AI API Keys into the package .env ─────────────────────────
    local_env = ATLAS_ROOT / ".env"
    env_content = []
    if local_env.exists():
        log("Зчитування ключів з локального .env для надання доступу клієнтам...", "cyan")
        # List of shared AI API keys that Valentin wants to pay for his users
        shared_keys = [
            "GEMINI_API_KEY",
            "GEMINI_KEYS",
            "GROQ_API_KEY",
            "ELEVENLABS_API_KEY",
            "GROK_API_KEY",
            "OPENROUTER_API_KEY"
        ]
        with open(local_env, "r", encoding="utf-8") as f:
            for line in f:
                line_striped = line.strip()
                if not line_striped or line_striped.startswith("#"):
                    continue
                if "=" in line_striped:
                    k, v = line_striped.split("=", 1)
                    k = k.strip()
                    if k in shared_keys:
                        env_content.append(f"{k}={v.strip()}")
                        log(f"  + Додано спільний ключ: {k}")
                    elif k in ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"]:
                        log(f"  - Виключено особистий ключ Telegram: {k}", "yellow")
    
    # Write the shared .env into the distribution folder
    with open(pkg_dir / ".env", "w", encoding="utf-8") as f:
        f.write("\n".join(env_content) + "\n")
    log("Спільний .env файл успішно створено у пакеті", "green")

    # LaunchAgent plist template
    plist_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.atlas.ai</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Library/Application Support/Atlas/atlas</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
    <key>WorkingDirectory</key>
    <string>/Library/Application Support/Atlas</string>
</dict>
</plist>"""
    (pkg_dir / "com.atlas.ai.plist").write_text(plist_content)

    # Copy binary if compiled, otherwise copy Python source files
    if use_binary and (DIST_DIR / "atlas").exists():
        shutil.copy2(DIST_DIR / "atlas", pkg_dir / "atlas")
        log("Бінарний файл скопійовано", "green")
    else:
        log("Пакуємо Python-файли (без компіляції)...", "yellow")
        for fname in INCLUDE_FILES:
            src = ATLAS_ROOT / fname
            if src.exists():
                shutil.copy2(src, pkg_dir / fname)
                log(f"  + {fname}")

    # Copy directories
    for dname in INCLUDE_DIRS:
        src = ATLAS_ROOT / dname
        if src.exists():
            dest = pkg_dir / dname
            shutil.copytree(src, dest, ignore=shutil.ignore_patterns(
                "__pycache__", "*.pyc", ".DS_Store", "*.log"
            ))
            size_mb = sum(f.stat().st_size for f in dest.rglob("*") if f.is_file()) / (1024**2)
            log(f"  + {dname}/ ({size_mb:.0f} MB)")

    # Create tar.gz archive
    log(f"Архівування → {OUTPUT_TAR}...", "cyan")
    with tarfile.open(OUTPUT_TAR, "w:gz") as tar:
        tar.add(pkg_dir, arcname="atlas")

    size_mb = OUTPUT_TAR.stat().st_size / (1024**2)
    checksum = sha256_file(OUTPUT_TAR)
    log(f"Архів створено: {OUTPUT_TAR} ({size_mb:.0f} MB)", "green")
    log(f"SHA256: {checksum}", "cyan")

    # Save build info
    with open(ATLAS_ROOT / "build_info.json", "w") as f:
        json.dump({
            "version": version,
            "built_at": datetime.utcnow().isoformat(),
            "size_mb": round(size_mb, 1),
            "sha256": checksum,
            "binary": use_binary,
        }, f, indent=2)

    return OUTPUT_TAR


def upload_to_server(pkg_path: Path, version: str):
    """Upload atlas-latest.tar.gz to the server via admin API."""
    import requests
    log(f"Завантаження на сервер ({SERVER})...", "cyan")

    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"} if token else {}

    size_mb = pkg_path.stat().st_size / (1024**2)
    log(f"Розмір файлу: {size_mb:.0f} MB — це може зайняти кілька хвилин...", "yellow")

    with open(pkg_path, "rb") as f:
        resp = requests.post(
            f"{SERVER}/api/admin/version",
            headers=headers,
            data={"version": version},
            files={"file": (f"atlas-{version}.tar.gz", f, "application/gzip")},
            timeout=600,  # 10 minutes for large files
        )

    if resp.status_code == 200:
        data = resp.json()
        log(f"✔ Завантажено! Версія: {data.get('version')}, {data.get('size_mb')} MB", "green")
    else:
        log(f"Помилка завантаження: {resp.status_code} — {resp.text[:300]}", "red")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Atlas AI Build & Deploy")
    parser.add_argument("--version", default=None, help="Version string (e.g. 1.0.5)")
    parser.add_argument("--skip-compile", action="store_true", help="Skip PyInstaller, pack Python source")
    parser.add_argument("--skip-upload", action="store_true", help="Only build, don't upload")
    args = parser.parse_args()

    # Determine version
    version = args.version
    if not version:
        try:
            with open(ATLAS_ROOT / "atlas_version.json") as f:
                version = json.load(f).get("version", "1.0.0")
        except Exception:
            version = "1.0.0"
        new_ver = input(f"Версія [{version}]: ").strip()
        if new_ver:
            version = new_ver

    log(f"Atlas AI Build — Версія: {version}", "bold")
    log(f"Корінь проекту: {ATLAS_ROOT}", "cyan")

    # Warn about what will be excluded
    log("\nКонфіденційність та захист даних:", "cyan")
    log("Що НЕ потрапить у пакет (захищено):", "yellow")
    for ex in ["identity_data/ (ваші фото обличчя)", "personal_memory/ (ваші особисті файли)", 
               "semantic_memory.json (ваші спогади)", "chat_history.json (історія розмов)", 
               "goals.json (особисті цілі)", "TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID (особистий бот)"]:
        print(f"  ✗ {ex}")
    
    log("\nЩо буде додано для спільного використання клієнтами (поповнюється вами):", "green")
    for sh in ["GEMINI_API_KEY", "GROQ_API_KEY", "OPENROUTER_API_KEY", "ELEVENLABS_API_KEY", "GROK_API_KEY"]:
        print(f"  ✓ {sh}")
    print()

    # Compile
    use_binary = False
    if not args.skip_compile:
        try:
            use_binary = compile_with_pyinstaller(version)
        except Exception as e:
            log(f"Компіляція не вдалася: {e}. Пакуємо Python-файли.", "yellow")

    # Pack
    pkg = create_package(version, use_binary=use_binary)

    # Upload
    if not args.skip_upload:
        log("", "")
        upload_to_server(pkg, version)
    else:
        log(f"Пакет готовий: {pkg}", "green")
        log("Щоб завантажити пізніше: python3 build.py --skip-compile (або вручну через адмін панель)", "yellow")

    # Update local version file
    with open(ATLAS_ROOT / "atlas_version.json", "w") as f:
        json.dump({"version": version, "built_at": datetime.utcnow().isoformat()}, f)

    log("\n✔ Готово! Нова версія Atlas доступна для завантаження.", "green")
    log(f"  Посилання: curl -fsSL {SERVER}/install | bash", "cyan")


if __name__ == "__main__":
    main()
