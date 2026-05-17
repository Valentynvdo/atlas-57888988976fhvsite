import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, ChevronDown, Terminal, Package, Zap, Shield, Cpu, Download, ExternalLink } from "lucide-react";

/* ─── helpers ─── */
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll("[data-reveal]") || [];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; } }),
      { threshold: 0.1 }
    );
    els.forEach((el) => { el.style.opacity = "0"; el.style.transform = "translateY(24px)"; el.style.transition = "opacity 0.6s ease, transform 0.6s ease"; io.observe(el); });
    return () => io.disconnect();
  }, []);
  return ref;
}

function CodeBlock({ code, lang = "bash" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", margin: "16px 0" }}>
      <div style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)", padding: "4px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{lang}</span>
        <button onClick={copy} style={{ background: "none", border: "none", color: copied ? "#28C840" : "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "4px 0" }}>
          {copied ? <Check size={13} /> : <Copy size={13} />}{copied ? "Скопійовано" : "Копіювати"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "20px 20px", background: "rgba(0,0,0,0.5)", overflowX: "auto", fontSize: 13, lineHeight: 1.7, color: "#e2e8f0", fontFamily: "'Source Code Pro', 'Fira Code', monospace" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div data-reveal style={{ marginBottom: 40 }}>
      <div style={{ color: "#00E5FF", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>{eyebrow}</div>
      <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.02em" }}>{title}</h2>
      {desc && <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, maxWidth: 620 }}>{desc}</p>}
    </div>
  );
}

function Accordion({ q, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", marginBottom: 8, background: "rgba(255,255,255,0.02)" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "16px 20px", background: "none", border: "none", color: "#fff", textAlign: "left", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontFamily: "Inter, sans-serif" }}>
        {q}
        <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.4)", transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }} />
      </button>
      {open && <div style={{ padding: "0 20px 18px", color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.7 }}>{children}</div>}
    </div>
  );
}

const PACKAGES = [
  { name: "vosk", ver: "0.3.44", desc: "Офлайн розпізнавання мовлення (STT) — українська модель", icon: "🎙️", cat: "Голос" },
  { name: "edge-tts", ver: "7.2.8", desc: "Синтез мовлення через Microsoft Azure Edge (TTS) — uk-UA-OstapNeural", icon: "🔊", cat: "Голос" },
  { name: "PyAudio", ver: "0.2.14", desc: "Захоплення звуку з мікрофону в реальному часі", icon: "🎤", cat: "Голос" },
  { name: "sounddevice", ver: "0.5.5", desc: "Аудіо вивід для відтворення TTS-синтезу", icon: "🎵", cat: "Голос" },
  { name: "google-genai", ver: "1.47.0", desc: "Google Gemini API — основна LLM (Flash + Lite)", icon: "🧠", cat: "ШІ" },
  { name: "openai", ver: "2.33.0", desc: "OpenAI API — резервна LLM для складних завдань", icon: "🤖", cat: "ШІ" },
  { name: "pynput", ver: "1.8.1", desc: "Відстеження клавіатури та миші для контекстної інтеграції", icon: "⌨️", cat: "Система" },
  { name: "numpy", ver: "1.26.4", desc: "Числові обчислення та обробка аудіо-сигналів", icon: "📐", cat: "Система" },
  { name: "Pillow", ver: "11.3.0", desc: "Обробка зображень для Vision системи Atlas", icon: "🖼️", cat: "Система" },
  { name: "httpx", ver: "0.28.1", desc: "Async HTTP клієнт для запитів до API та ліцензійного сервера", icon: "🌐", cat: "Мережа" },
  { name: "requests", ver: "2.32.5", desc: "HTTP-запити для веб-дослідника та інтернет-пошуку", icon: "🔗", cat: "Мережа" },
  { name: "googlesearch-python", ver: "1.3.0", desc: "Google-пошук для автономного дослідника Atlas", icon: "🔍", cat: "Мережа" },
];

const STEPS = [
  {
    num: "01",
    title: "Клонування та середовище",
    desc: "Завантаж репозиторій і створи ізольоване Python-середовище",
    code: `# Клонуй репозиторій
git clone https://github.com/YOUR_USERNAME/atlas_ai.git
cd atlas_ai

# Створи віртуальне середовище
python3 -m venv .venv
source .venv/bin/activate  # macOS / Linux`,
  },
  {
    num: "02",
    title: "Встановлення залежностей",
    desc: "Основні пакети встановлюються автоматично через pip",
    code: `# Автоматичне встановлення всіх пакетів
pip install vosk edge-tts pyaudio sounddevice \\
    google-generativeai google-genai openai \\
    pynput numpy pillow httpx requests \\
    googlesearch-python scipy

# Перевір що все встановлено
pip list | grep -E "vosk|edge|pyaudio|google-genai|openai"`,
  },
  {
    num: "03",
    title: "Завантаження моделі Vosk",
    desc: "Необхідна Ukrainian STT модель (~50 MB)",
    code: `# Завантаж Ukrainian модель для розпізнавання мовлення
mkdir -p models
cd models

# Мала модель (швидша, ~50MB)
curl -L https://alphacephei.com/vosk/models/vosk-model-small-uk-v3-nano.zip -o model-uk.zip
unzip model-uk.zip
mv vosk-model-small-uk-v3-nano model-uk
rm model-uk.zip

cd ..`,
  },
  {
    num: "04",
    title: "Налаштування .env",
    desc: "Додай API ключі в файл конфігурації",
    code: `# Створи файл .env
cat > .env << 'EOF'
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI (резервний)
OPENAI_API_KEY=your_openai_api_key_here

# Ліцензійний сервер
LICENSE_SERVER=https://atlas-site-2p2d.onrender.com

# Telegram (опційно)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_OWNER_ID=your_telegram_id
EOF`,
  },
  {
    num: "05",
    title: "Активація ліцензії",
    desc: "Запусти Atlas — він попросить ліцензійний ключ",
    code: `# Запуск Atlas AI
./.venv/bin/python3 main.py

# При першому запуску з'явиться вікно активації
# Введи свій ліцензійний ключ формату:
# ATLAS-XXXX-XXXX-XXXX-XXXX

# Отримати ключ можна в особистому кабінеті:
# https://atlas-site-2p2d.onrender.com/dashboard`,
  },
];

const TROUBLESHOOT = [
  {
    q: "PyAudio не встановлюється — помилка з portaudio",
    a: (
      <div>
        <p>Спочатку встанови системну залежність через Homebrew:</p>
        <CodeBlock code={`brew install portaudio\npip install pyaudio`} />
        <p>Якщо Homebrew не встановлений:</p>
        <CodeBlock code={`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`} />
      </div>
    ),
  },
  {
    q: "Vosk: 'ERROR: model path does not exist'",
    a: (
      <div>
        <p>Переконайся що папка <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4 }}>models/model-uk</code> існує в кореневій директорії atlas_ai:</p>
        <CodeBlock code={`ls -la models/\n# Повинно бути: model-uk/`} />
      </div>
    ),
  },
  {
    q: "Помилка доступу до мікрофону або Accessibility",
    a: (
      <div>
        <p>На macOS потрібно дозволити доступ вручну:</p>
        <ol style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>System Settings → Privacy & Security → Microphone → увімкни Terminal або Python</li>
          <li>System Settings → Privacy & Security → Accessibility → увімкни Terminal або Python</li>
        </ol>
        <p style={{ marginTop: 8 }}>Перезапусти Atlas після надання дозволів.</p>
      </div>
    ),
  },
  {
    q: "Atlas не може під'єднатися до ліцензійного сервера",
    a: (
      <div>
        <p>Для розробки використовуй майстер-ключ обходу:</p>
        <CodeBlock code={`# Введи цей ключ при активації (офлайн режим, 10 років):\nATLAS-DEV-MODE-9999`} />
        <p>Для продакшн — перевір інтернет-з'єднання та статус сервера: <a href="/api/health" target="_blank" rel="noreferrer" style={{ color: "#00E5FF" }}>atlas-site/api/health</a></p>
      </div>
    ),
  },
  {
    q: "Помилка 'No module named X'",
    a: (
      <div>
        <p>Переконайся що активовано правильне venv та перевстанови залежності:</p>
        <CodeBlock code={`# Активуй venv
source .venv/bin/activate

# Перевір версію Python (потрібен 3.10+)
python3 --version

# Встанови відсутній модуль
pip install НАЗВА_МОДУЛЯ`} />
      </div>
    ),
  },
];

export default function Docs() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal();

  return (
    <div
      ref={revealRef}
      style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* ── Hero ── */}
      <div style={{
        background: "radial-gradient(ellipse 1200px 600px at 50% -100px, rgba(0,122,255,0.2) 0%, transparent 70%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "80px 24px 60px",
        textAlign: "center",
      }}>
        <button
          onClick={() => navigate("/")}
          style={{ position: "absolute", top: 28, left: 28, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", borderRadius: 999, padding: "8px 16px", fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <ArrowLeft size={14} /> Назад
        </button>

        <div data-reveal style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", marginBottom: 24 }}>
          <Terminal size={13} color="#00E5FF" />
          <span style={{ fontSize: 12, color: "#00E5FF", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Документація</span>
        </div>

        <h1 data-reveal style={{ fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1 }}>
          Встановлення Atlas AI
        </h1>
        <p data-reveal style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.6 }}>
          Повний посібник для розгортання та налаштування Atlas AI на macOS
        </p>

        <div data-reveal style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="/dashboard"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg, #007AFF, #00E5FF)", color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none" }}
          >
            <Download size={15} /> Отримати ліцензію
          </a>
          <a
            href="https://t.me/atlas_support"
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none" }}
          >
            <ExternalLink size={15} /> Підтримка
          </a>
        </div>
      </div>

      <div style={{ maxWidth: "100%", padding: "72px 5% 100px" }}>

        {/* ── System Requirements ── */}
        <section style={{ marginBottom: 80 }}>
          <SectionTitle eyebrow="Вимоги до системи" title="Що потрібно для запуску" />
          <div data-reveal style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { icon: <Cpu size={20} />, label: "macOS 13+", sub: "Ventura або новіше" },
              { icon: <Package size={20} />, label: "Python 3.10+", sub: "Рекомендовано 3.11–3.12" },
              { icon: <Shield size={20} />, label: "8 GB RAM", sub: "Рекомендовано 16 GB" },
              { icon: <Zap size={20} />, label: "Мікрофон", sub: "Вбудований або USB" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "20px 22px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,229,255,0.1)", display: "grid", placeItems: "center", color: "#00E5FF", flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginTop: 2 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Steps ── */}
        <section style={{ marginBottom: 80 }}>
          <SectionTitle eyebrow="Встановлення" title="Покрокова інструкція" desc="Слідуй кожному кроку по порядку. Весь процес займає близько 5–10 хвилин." />
          {STEPS.map((step, i) => (
            <div key={i} data-reveal style={{ marginBottom: 40, display: "flex", gap: 24 }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, rgba(0,122,255,0.2), rgba(0,229,255,0.1))", border: "1px solid rgba(0,122,255,0.3)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 15, color: "#00E5FF" }}>
                  {step.num}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "8px 0 4px" }}>{step.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 0 }}>{step.desc}</p>
                <CodeBlock code={step.code} />
              </div>
            </div>
          ))}
        </section>

        {/* ── Packages ── */}
        <section style={{ marginBottom: 80 }}>
          <SectionTitle eyebrow="Залежності" title="Python пакети Atlas AI" desc="Всі встановлені бібліотеки та їх призначення в системі." />
          {["Голос", "ШІ", "Система", "Мережа"].map((cat) => (
            <div key={cat} data-reveal style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>{cat}</div>
              <div style={{ display: "grid", gap: 8 }}>
                {PACKAGES.filter((p) => p.cat === cat).map((pkg) => (
                  <div key={pkg.name} style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 20 }}>{pkg.icon}</span>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <span style={{ fontFamily: "'Fira Code', monospace", color: "#00E5FF", fontWeight: 600, fontSize: 14 }}>{pkg.name}</span>
                      <span style={{ marginLeft: 8, fontSize: 12, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 6 }}>v{pkg.ver}</span>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, flex: 2 }}>{pkg.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div data-reveal>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 12 }}>Встановити всі одразу:</p>
            <CodeBlock code={`pip install vosk edge-tts pyaudio sounddevice google-generativeai google-genai openai pynput numpy pillow httpx requests googlesearch-python scipy`} />
          </div>
        </section>

        {/* ── Architecture ── */}
        <section style={{ marginBottom: 80 }}>
          <SectionTitle eyebrow="Архітектура" title="Як працює Atlas AI" />
          <div data-reveal style={{ padding: 28, borderRadius: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { step: "Голос", desc: "Vosk (офлайн STT) → розпізнавання мовлення → intent detection", color: "#007AFF" },
              { step: "Обробка", desc: "Handlers → Skills → Agent Core → Gemini 2.5 Flash / OpenAI", color: "#9D4CDD" },
              { step: "Відповідь", desc: "edge-tts (uk-UA-OstapNeural) → синтез мовлення → аудіо вивід", color: "#00E5FF" },
              { step: "Еволюція", desc: "Evolution Engine → нові навички → семантична пам'ять → self-improvement", color: "#28C840" },
              { step: "Синхронізація", desc: "License Server API → статистика → особистий кабінет на сайті", color: "#FEBC2E" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: i < 4 ? 16 : 0, paddingBottom: i < 4 ? 16 : 0, borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ width: 80, flexShrink: 0, fontSize: 12, fontWeight: 700, color: item.color, paddingTop: 2 }}>{item.step}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Troubleshooting ── */}
        <section style={{ marginBottom: 80 }}>
          <SectionTitle eyebrow="Вирішення проблем" title="Часті помилки та рішення" />
          <div data-reveal>
            {TROUBLESHOOT.map((item, i) => (
              <Accordion key={i} q={item.q}>{item.a}</Accordion>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section data-reveal style={{ textAlign: "center", padding: "48px 32px", borderRadius: 28, background: "linear-gradient(135deg, rgba(0,122,255,0.08), rgba(0,229,255,0.04))", border: "1px solid rgba(0,122,255,0.2)" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Готовий до роботи?</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginBottom: 28 }}>Отримай ліцензійний ключ і запускай Atlas AI вже зараз</p>
          <a
            href="/login"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 14, background: "linear-gradient(135deg, #007AFF, #00E5FF)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "0 0 30px rgba(0,122,255,0.3)" }}
          >
            <Zap size={16} /> Отримати доступ
          </a>
        </section>

      </div>
    </div>
  );
}
