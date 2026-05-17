import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Check,
  ChevronDown,
  Terminal,
  Package,
  Zap,
  Shield,
  Cpu,
  Download,
  ExternalLink,
  Code,
  BookOpen,
  Activity,
  Layers,
  Sparkles,
  Key,
  Globe,
  Settings,
  HelpCircle,
  Play,
  CheckCircle,
} from "lucide-react";

// --- Custom Code Block with Copy Button ---
function CodeBlock({ code, lang = "javascript" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", margin: "16px 0", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ background: "rgba(10,10,12,0.85)", backdropFilter: "blur(12px)", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }}></div>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }}></div>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }}></div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginLeft: 8, fontFamily: "monospace" }}>{lang}</span>
        </div>
        <button onClick={copy} style={{ background: "none", border: "none", color: copied ? "#28C840" : "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "4px 8px", borderRadius: 6, transition: "all 0.2s" }} className="hover:bg-white/5">
          {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? "Скопійовано" : "Копіювати"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "20px", background: "rgba(5,5,7,0.95)", overflowX: "auto", fontSize: 13, lineHeight: 1.6, color: "#a5b4fc", fontFamily: "'Fira Code', monospace" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ color: "#00E5FF", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E5FF" }} />
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.03em", background: "linear-gradient(120deg, #fff, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{title}</h2>
      {desc && <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.7, maxWidth: 800 }}>{desc}</p>}
    </div>
  );
}

function Accordion({ q, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", marginBottom: 12, background: "rgba(255,255,255,0.01)", transition: "all 0.3s" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "18px 24px", background: "none", border: "none", color: "#fff", textAlign: "left", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontFamily: "Inter, sans-serif" }}>
        {q}
        <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.4)", transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }} />
      </button>
      {open && <div style={{ padding: "0 24px 20px", color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.7, borderTop: "1px solid rgba(255,255,255,0.04)" }}>{children}</div>}
    </div>
  );
}

export default function Docs() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("intro");
  const sectionsRef = useRef({});

  const SECTIONS = [
    { id: "intro", label: "Вступ", icon: <BookOpen size={16} /> },
    { id: "quickstart", label: "Швидкий старт (SDK)", icon: <Zap size={16} /> },
    { id: "architecture", label: "Архітектура", icon: <Layers size={16} /> },
    { id: "installation", label: "Встановлення локально", icon: <Package size={16} /> },
    { id: "activation", label: "Система ліцензування", icon: <Key size={16} /> },
    { id: "api", label: "REST API Reference", icon: <Globe size={16} /> },
    { id: "roadmap", label: "План розвитку (Beta)", icon: <Activity size={16} /> },
    { id: "faq", label: "Вирішення проблем / FAQ", icon: <HelpCircle size={16} /> }
  ];

  useEffect(() => {
    const handleScroll = () => {
      let current = "intro";
      const scrollPos = window.scrollY + 160;

      for (const section of SECTIONS) {
        const el = sectionsRef.current[section.id];
        if (el && el.offsetTop <= scrollPos) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = sectionsRef.current[id];
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030303", color: "#fff", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* --- Background Elements --- */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "100vh", background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 122, 255, 0.08), transparent 70%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(157, 76, 221, 0.04), transparent 60%)", pointerEvents: "none", zIndex: 0 }} />

      {/* --- Global Sticky Navigation Header --- */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(3,3,3,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 5%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/")} className="ghost-btn" style={{ padding: "6px 12px", fontSize: 13, borderRadius: 8, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}>
            <ArrowLeft size={14} /> На Головну
          </button>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ fontSize: 14, fontWeight: 700, background: "linear-gradient(90deg, #00E5FF, #9D4CDD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Atlas Docs v0.9.5</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/dashboard" style={{ padding: "8px 18px", borderRadius: 10, background: "linear-gradient(135deg, #007AFF, #00E5FF)", color: "#fff", fontWeight: 600, fontSize: 13, textDecoration: "none", transition: "transform 0.2s" }} className="hover:scale-105">Особистий кабінет</a>
        </div>
      </header>

      {/* --- Modern Product Docs Hero Section --- */}
      <section style={{ position: "relative", padding: "80px 5% 50px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", marginBottom: 18 }}>
          <Sparkles size={13} color="#00E5FF" />
          <span style={{ fontSize: 11, color: "#00E5FF", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Cognitive AI Platform</span>
        </div>
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.04em", margin: "0 0 16px", lineHeight: 1.1, background: "linear-gradient(120deg, #fff 20%, #d4dcff 60%, #b8f0ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Atlas AI Platform
        </h1>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", maxWidth: 680, margin: "0 auto 36px", lineHeight: 1.6 }}>
          Cognitive AI Operating System for local background research, multi-agent orchestrations, semantic memory sync, and intelligent hardware automation.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => scrollTo("quickstart")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 999, background: "#fff", color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none" }} className="hover:scale-105">
            <Play size={14} fill="#000" /> Швидкий старт
          </button>
          <button onClick={() => scrollTo("api")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }} className="hover:scale-105">
            <Code size={14} /> API Reference
          </button>
        </div>
      </section>

      {/* --- Main Workspace Layout: Sticky Sidebar + Scrolling Content Panel --- */}
      <div style={{ maxWidth: "100%", width: "100%", padding: "40px 5% 120px", display: "grid", gridTemplateColumns: "250px 1fr", gap: 48, position: "relative", zIndex: 1 }}>
        
        {/* --- Left Sticky Sidebar Navigation --- */}
        <aside style={{ position: "sticky", top: 120, height: "calc(100vh - 160px)", overflowY: "auto", alignSelf: "start", borderRight: "1px solid rgba(255,255,255,0.04)", paddingRight: 16 }} className="no-scrollbar">
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Навігація</div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollTo(sec.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: activeSection === sec.id ? "rgba(0, 229, 255, 0.08)" : "transparent",
                  color: activeSection === sec.id ? "#00E5FF" : "rgba(255,255,255,0.55)",
                  border: activeSection === sec.id ? "1px solid rgba(0, 229, 255, 0.15)" : "1px solid transparent",
                  fontSize: 13.5,
                  fontWeight: activeSection === sec.id ? 600 : 500,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                className="hover:text-white"
              >
                {sec.icon}
                {sec.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* --- Right Main Scrollable Documentation Contents --- */}
        <main style={{ minWidth: 0 }}>
          
          {/* 1. Introduction Section */}
          <section ref={(el) => (sectionsRef.current.intro = el)} style={{ scrollMarginTop: 100, marginBottom: 80 }}>
            <SectionTitle eyebrow="Вступ" title="Про платформу Atlas AI" desc="Atlas AI — це не просто чат-бот. Це повноцінне когнітивне середовище асистента, спроектоване для автономного виконання завдань, фонового збору інформації, безшовного керування Mac-оточенням та синхронізації контекстної пам'яті." />
            
            {/* Pill Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 24 }}>
              <div className="glass" style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(0, 122, 255, 0.12)", color: "#007AFF", display: "grid", placeItems: "center", marginBottom: 14 }}>
                  <Shield size={18} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Когнітивна пам'ять</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>Глибока семантична пам'ять із векторною базою даних для збереження інтересів, розкладу та вподобань користувача.</p>
              </div>

              <div className="glass" style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(157, 76, 221, 0.12)", color: "#9D4CDD", display: "grid", placeItems: "center", marginBottom: 14 }}>
                  <Cpu size={18} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Мульти-агентна система</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>Фонові автономні агенти вміють проводити глибокі інтернет-дослідження та планувати складні ланцюжки задач.</p>
              </div>

              <div className="glass" style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(0, 229, 255, 0.12)", color: "#00E5FF", display: "grid", placeItems: "center", marginBottom: 14 }}>
                  <Key size={18} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Безпечна активація</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>Прив'язка ліцензії на рівні залізо-ідентифікатора пристрою (Mac ID) гарантує високу безпеку та захист.</p>
              </div>
            </div>
          </section>

          {/* 2. Quick Start SDK Section */}
          <section ref={(el) => (sectionsRef.current.quickstart = el)} style={{ scrollMarginTop: 100, marginBottom: 80 }}>
            <SectionTitle eyebrow="Швидкий старт" title="Bring Your Own Frontend (Atlas SDK)" desc="Бажаєте інтегрувати розумні агенти Atlas у свій власний додаток чи сайт? Використовуйте наш офіційний SDK для підключення до локального або хмарного ядра Atlas AI." />
            
            <div style={{ padding: 24, borderRadius: 16, background: "rgba(0, 229, 255, 0.03)", border: "1px solid rgba(0, 229, 255, 0.15)", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <CheckCircle size={16} color="#00E5FF" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#00E5FF" }}>Когнітивний Aha-Момент за 30 секунд:</span>
              </div>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, margin: 0 }}>Встановіть пакет, ініціалізуйте сесію за допомогою ліцензійного ключа і виконайте свій перший запит.</p>
            </div>

            <CodeBlock lang="bash" code="npm install @atlas-ai/sdk" />
            <CodeBlock lang="javascript" code={`import { Atlas } from "@atlas-ai/sdk";

// Ініціалізуємо клієнта Atlas AI
const atlas = new Atlas({
  apiKey: "ATLAS-XXXX-XXXX-XXXX-XXXX", // Ваш ліцензійний або API-ключ
  endpoint: "https://api.atlas-ai.space" // Хмарне або локальне ядро
});

async function main() {
  // Викликаємо автономного агента-дослідника
  const agent = await atlas.agents.create({
    type: "researcher",
    objective: "Знайти та порівняти 3 найкращі фреймворки для асинхронного звуку в Python"
  });

  console.log("Дослідження розпочато...", agent.id);

  // Отримуємо поточний хід думок та результат у реальному часі
  agent.on("thought", (thought) => {
    console.log("[Atlas Thought]:", thought);
  });

  const report = await agent.waitForResult();
  console.log("Фінальний звіт:", report.result);
}

main();`} />
          </section>

          {/* 3. Product Architecture Diagram */}
          <section ref={(el) => (sectionsRef.current.architecture = el)} style={{ scrollMarginTop: 100, marginBottom: 80 }}>
            <SectionTitle eyebrow="Архітектура" title="Когнітивна Схема Платформи" desc="Як влаштовані потоки обробки інформації в Atlas AI. Завдяки ізольованості шарів, ваші дані надійно шифруються локально." />
            
            {/* Visual Interactive Flowchart */}
            <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: "32px 16px", display: "flex", flexDirection: "column", gap: 24, position: "relative", overflowX: "auto" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minWidth: 640, padding: "0 20px" }}>
                
                {/* Node 1 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ padding: "12px 18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 140 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Клієнт</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>macOS App / SDK</span>
                  </div>
                </div>

                {/* Arrow */}
                <div style={{ flex: 0.5, height: 1, background: "linear-gradient(90deg, #007AFF, #9D4CDD)", position: "relative" }}>
                  <div style={{ position: "absolute", right: 0, top: -4, borderLeft: "5px solid #9D4CDD", borderTop: "5px solid transparent", borderBottom: "5px solid transparent" }} />
                </div>

                {/* Node 2 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ padding: "12px 18px", borderRadius: 12, background: "rgba(157, 76, 221, 0.1)", border: "1px solid rgba(157, 76, 221, 0.3)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 140 }}>
                    <span style={{ fontSize: 11, color: "#9D4CDD", fontWeight: 700 }}>Оркестратор</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Atlas Core API</span>
                  </div>
                </div>

                {/* Arrow */}
                <div style={{ flex: 0.5, height: 1, background: "linear-gradient(90deg, #9D4CDD, #00E5FF)", position: "relative" }}>
                  <div style={{ position: "absolute", right: 0, top: -4, borderLeft: "5px solid #00E5FF", borderTop: "5px solid transparent", borderBottom: "5px solid transparent" }} />
                </div>

                {/* Node 3 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ padding: "12px 18px", borderRadius: 12, background: "rgba(0, 229, 255, 0.1)", border: "1px solid rgba(0, 229, 255, 0.3)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 140 }}>
                    <span style={{ fontSize: 11, color: "#00E5FF", fontWeight: 700 }}>Пам'ять</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Semantic Engine</span>
                  </div>
                </div>

                {/* Arrow */}
                <div style={{ flex: 0.5, height: 1, background: "linear-gradient(90deg, #00E5FF, #28C840)", position: "relative" }}>
                  <div style={{ position: "absolute", right: 0, top: -4, borderLeft: "5px solid #28C840", borderTop: "5px solid transparent", borderBottom: "5px solid transparent" }} />
                </div>

                {/* Node 4 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ padding: "12px 18px", borderRadius: 12, background: "rgba(40, 200, 64, 0.1)", border: "1px solid rgba(40, 200, 64, 0.3)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 140 }}>
                    <span style={{ fontSize: 11, color: "#28C840", fontWeight: 700 }}>Виконання</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>AI Models Layer</span>
                  </div>
                </div>

              </div>

              {/* Vertical link to DB */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                <div style={{ width: 1, height: 32, background: "linear-gradient(180deg, #00E5FF, rgba(0,229,255,0))" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ padding: "10px 20px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12.5, fontFamily: "monospace", display: "inline-flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00E5FF" }} />
                  MongoDB (Когнітивна База Контексту)
                </div>
              </div>

            </div>
          </section>

          {/* 4. Installation & Local Setup Section */}
          <section ref={(el) => (sectionsRef.current.installation = el)} style={{ scrollMarginTop: 100, marginBottom: 80 }}>
            <SectionTitle eyebrow="Швидке встановлення" title="Інсталяція в одну команду" desc="Завдяки вбудованому macOS-інсталятору, вам більше не потрібно клонувати репозиторій або вручну налаштовувати Python-середовище. Все відбувається повністю автоматично та безпечно." />
            
            {/* Main Single Command Code Box */}
            <div style={{ padding: 24, borderRadius: 16, background: "rgba(0, 229, 255, 0.04)", border: "1px solid rgba(0, 229, 255, 0.15)", marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#00E5FF", marginBottom: 12 }}>Просто вставте це у ваш термінал:</div>
              <CodeBlock lang="bash" code="curl -fsSL https://atlas-site-2p2d.onrender.com/install | bash" />
            </div>

            {/* Product Protection Matrix Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }} className="two-col">
              <div style={{ padding: 20, borderRadius: 12, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Shield size={16} color="#28C840" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Подвійний захист папок</span>
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: 0 }}>
                  Компоненти Atlas встановлюються у системну директорію <code style={{ color: "#FEBC2E" }}>/Library/Application Support/Atlas/</code> з правами доступу <code style={{ color: "#00E5FF" }}>chmod 700</code> та власником <code style={{ color: "#00E5FF" }}>root:wheel</code>. Користувач не може відкрити папку в Finder або прочитати файли конфігурації.
                </p>
              </div>

              <div style={{ padding: 20, borderRadius: 12, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Cpu size={16} color="#007AFF" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Бінарна компіляція (PyInstaller)</span>
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: 0 }}>
                  Вихідний Python-код повністю трансформується у захищений бінарний файл за допомогою команди <code style={{ color: "#00E5FF" }}>pyinstaller --onefile main.py</code>. У дистрибутиві немає жодного відкритого файлу <code style={{ color: "#FEBC2E" }}>.py</code>, що виключає декомпіляцію та копіювання технологій.
                </p>
              </div>
            </div>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                {
                  step: "01",
                  title: "Запуск інсталятора",
                  desc: "Скрипт перевіряє сумісність з вашою версією macOS та готує захищені системні директорії."
                },
                {
                  step: "02",
                  title: "Активація ліцензії",
                  desc: "Скрипт запитає ліцензійний ключ для перевірки на сервері та прив'яже сесію до апаратного Mac ID."
                },
                {
                  step: "03",
                  title: "Завантаження компонентів та Vosk",
                  desc: "Автоматично завантажується скомпільований бінарник та україномовна модель розпізнавання мовлення (~50MB)."
                }
              ].map((s, idx) => (
                <div key={idx} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, color: "#00E5FF", flexShrink: 0 }}>{s.step}</div>
                  <div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 700, margin: "0 0 4px" }}>{s.title}</h4>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.4 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Activation & Licensing Section */}
          <section ref={(el) => (sectionsRef.current.activation = el)} style={{ scrollMarginTop: 100, marginBottom: 80 }}>
            <SectionTitle eyebrow="Активація" title="Система перевірки ліцензії" desc="Кожен екземпляр Atlas AI при запуску перевіряє ліцензійний ключ. Ми прив'язуємо сесію до унікального залізо-ідентифікатора (Mac ID)." />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }} className="two-col">
              <div style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: "#00E5FF", marginBottom: 12 }}>🚀 Повний цикл активації:</h4>
                <ol style={{ paddingLeft: 18, margin: 0, fontSize: 13.5, color: "rgba(255,255,255,0.65)", display: "flex", flexDirection: "column", gap: 10 }}>
                  <li>Купівля тарифу через Stripe або TON-Connect.</li>
                  <li>Отримання унікального ключа форми <code style={{ fontFamily: "monospace", color: "#FEBC2E" }}>ATLAS-XXXX-...</code>.</li>
                  <li>Авторизація пристрою шляхом відправки запиту активації.</li>
                </ol>
              </div>

              <div style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: "#FEBC2E", marginBottom: 12 }}>⚡ Режим розробника (Bypass):</h4>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, margin: 0 }}>
                  Для локальних тестів без підключення до мережі ви можете скористатися спеціальним розробницьким ключем обходу ліцензії:
                </p>
                <div style={{ marginTop: 12, padding: "8px 16px", borderRadius: 8, background: "rgba(254,188,46,0.1)", border: "1px solid rgba(254,188,46,0.25)", fontFamily: "monospace", fontSize: 13, color: "#FEBC2E", textAlign: "center", fontWeight: 700 }}>
                  ATLAS-DEV-MODE-9999
                </div>
              </div>
            </div>

            <CodeBlock lang="javascript" code={`// Приклад перевірки ліцензії через API
fetch("https://api.atlas-ai.space/api/atlas/validate-key", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    key: "ATLAS-DEV-MODE-9999",
    mac_id: "7C:D1:C3:E4:F5:A6",
    mac_name: "MacBook Pro Valentyna"
  })
})
.then(res => res.json())
.then(data => console.log("Активація успішна:", data.active));`} />
          </section>

          {/* 6. REST API Reference Section */}
          <section ref={(el) => (sectionsRef.current.api = el)} style={{ scrollMarginTop: 100, marginBottom: 80 }}>
            <SectionTitle eyebrow="REST API" title="Довідник API Ендпоінтів" desc="Платформа Atlas AI надає повноцінне API для керування інтелектуальними сесіями, валідацією ліцензій та отриманням потоку думок у реальному часі." />
            
            {/* API Endpoint Grid Layout (Mintlify Style) */}
            <div style={{ display: "grid", gap: 32 }}>
              
              {/* Endpoint 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }} className="two-col">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ padding: "4px 8px", borderRadius: 6, background: "rgba(40,200,64,0.15)", color: "#28C840", fontWeight: 700, fontSize: 11 }}>POST</span>
                    <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 600 }}>/api/atlas/validate-key</span>
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Валідація та активація пристрою</h4>
                  <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                    Використовується для реєстрації пристрою за ліцензійним ключем. Якщо ключ валідний та не прив'язаний до іншого пристрою, створюється сесія.
                  </p>
                  <div style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    <b>Параметри запиту:</b>
                    <ul style={{ paddingLeft: 16, margin: "6px 0 0" }}>
                      <li><code style={{ color: "#00E5FF" }}>key</code> (string, required) — Ліцензійний ключ.</li>
                      <li><code style={{ color: "#00E5FF" }}>mac_id</code> (string, required) — Фізична адреса адаптера.</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <CodeBlock lang="json" code={`// Response (Success 200)
{
  "active": true,
  "expires_at": "2028-05-17T12:00:00Z",
  "license_id": "lic_9f8e7d6c5b",
  "message": "License validated successfully"
}`} />
                </div>
              </div>

              <hr style={{ border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)" }} />

              {/* Endpoint 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }} className="two-col">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ padding: "4px 8px", borderRadius: 6, background: "rgba(0,122,255,0.15)", color: "#007AFF", fontWeight: 700, fontSize: 11 }}>GET</span>
                    <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 600 }}>/api/atlas/thought</span>
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Отримання живих думок асистента</h4>
                  <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                    Дозволяє отримати останню когнітивну дію або думку автономного дослідника Atlas у реальному часі.
                  </p>
                </div>
                <div>
                  <CodeBlock lang="json" code={`// Response (Success 200)
{
  "task_id": "task_a1b2c3d4",
  "status": "researching",
  "current_thought": "Аналізую сторінки репозиторію Vosk для оптимізації голосових потоків..."
}`} />
                </div>
              </div>

            </div>
          </section>

          {/* 7. Roadmap & Upcoming Features */}
          <section ref={(el) => (sectionsRef.current.roadmap = el)} style={{ scrollMarginTop: 100, marginBottom: 80 }}>
            <SectionTitle eyebrow="План розвитку" title="Майбутні когнітивні можливості" desc="Atlas AI активно розвивається. Попереду багато цікавого!" />
            
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { version: "v1.0.0-Beta", title: "Повна синхронізація пам'яті в хмарі", desc: "Можливість синхронізувати досвід та навички асистента між різними Mac-пристроями через захищений канал.", tag: "У розробці", color: "#FEBC2E" },
                { version: "v1.1.0", title: "Інтеграція з локальними Smart Home хабами", desc: "Автономний запуск навичок керування пристроями розумного дому через протоколи HomeKit та Zigbee.", tag: "Заплановано", color: "#007AFF" },
                { version: "v1.2.0", title: "Мультимодальне бачення екрану в реальному часі", desc: "Періодичний аналіз робочого столу для надання контекстних підказок щодо розробки коду.", tag: "Upcoming", color: "#9D4CDD" }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: "20px 24px", borderRadius: 14, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: item.color, background: `${item.color}15`, padding: "4px 10px", borderRadius: 6 }}>{item.version}</div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{item.title}</h4>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "4px 0 0" }}>{item.desc}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.tag}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Troubleshooting & FAQ */}
          <section ref={(el) => (sectionsRef.current.faq = el)} style={{ scrollMarginTop: 100, marginBottom: 80 }}>
            <SectionTitle eyebrow="FAQ" title="Вирішення проблем та запитання" desc="Відповіді на найпоширеніші запитання розробників та користувачів." />
            
            <Accordion q="Помилка при встановленні PyAudio на macOS">
              <div>
                <p>Ця помилка зазвичай пов'язана з відсутністю бібліотеки PortAudio. Встановіть її через Homebrew перед встановленням pip-пакета:</p>
                <CodeBlock lang="bash" code="brew install portaudio\npip install pyaudio" />
              </div>
            </Accordion>

            <Accordion q="Як працює офлайн розпізнавання Vosk?">
              <div>
                <p>Компактна модель мовлення завантажується локально в папку `models/model-uk`. Це означає, що ваші голосові команди обробляються безпосередньо на вашому Mac без відправки аудіофайлів на сервери третіх сторін.</p>
              </div>
            </Accordion>

            <Accordion q="Що дає ліцензійний ключ ATLAS-DEV-MODE-9999?">
              <div>
                <p>Це локальний інженерний ключ для розробників, який повністю обходить валідацію на мережевому сервері та дозволяє тестувати всі навички Atlas в офлайн-режимі протягом 10 років.</p>
              </div>
            </Accordion>
          </section>

          {/* --- Bottom Doc CTA --- */}
          <section style={{ textAlign: "center", padding: "48px 32px", borderRadius: 24, background: "linear-gradient(135deg, rgba(0,122,255,0.06), rgba(0,229,255,0.02))", border: "1px solid rgba(0,122,255,0.15)", marginTop: 80 }}>
            <h3 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Потрібна допомога?</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14.5, marginBottom: 24 }}>Зв'яжіться з нашою підтримкою або приєднайтеся до спільноти розробників</p>
            <a href="https://t.me/atlas_support" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontWeight: 700, fontSize: 13.5, textDecoration: "none" }}>
              <ExternalLink size={14} /> Telegram Чат підтримки
            </a>
          </section>

        </main>
      </div>
    </div>
  );
}
