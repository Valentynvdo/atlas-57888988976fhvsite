import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { toast, Toaster } from "sonner";
import api from "../lib/api";
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("intro");
  const sectionsRef = useRef({});
  const [customDocs, setCustomDocs] = useState([]);

  useEffect(() => {
    const fetchCustomDocs = async () => {
      try {
        const res = await api.get("/api/admin/docs/custom");
        setCustomDocs(res.data || []);
      } catch (err) {
        console.error("Failed to load custom docs:", err);
      }
    };
    fetchCustomDocs();
  }, []);

  const SECTIONS = useMemo(() => {
    const base = [
      { id: "intro", label: "Вступ", icon: <BookOpen size={16} /> },
      { id: "quickstart", label: "Швидкий старт (SDK)", icon: <Zap size={16} /> },
      { id: "architecture", label: "Архітектура", icon: <Layers size={16} /> },
      { id: "installation", label: "Встановлення локально", icon: <Package size={16} /> },
      { id: "activation", label: "Система ліцензування", icon: <Key size={16} /> },
      { id: "api", label: "REST API Reference", icon: <Globe size={16} /> },
      { id: "roadmap", label: "План розвитку (Beta)", icon: <Activity size={16} /> },
      { id: "faq", label: "Вирішення проблем / FAQ", icon: <HelpCircle size={16} /> }
    ];

    const lucideIcons = {
      BookOpen: <BookOpen size={16} />,
      Zap: <Zap size={16} />,
      Layers: <Layers size={16} />,
      Package: <Package size={16} />,
      Key: <Key size={16} />,
      Globe: <Globe size={16} />,
      Activity: <Activity size={16} />,
      HelpCircle: <HelpCircle size={16} />,
      Settings: <Settings size={16} />,
      Shield: <Shield size={16} />,
      Code: <Code size={16} />,
      Sparkles: <Sparkles size={16} />
    };

    const mappedCustom = customDocs.map(doc => ({
      id: doc.id,
      label: doc.title,
      icon: lucideIcons[doc.icon] || <BookOpen size={16} />,
      isCustom: true,
      eyebrow: doc.eyebrow,
      desc: doc.desc,
      content: doc.content
    }));

    return [...base, ...mappedCustom];
  }, [customDocs]);

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
  }, [SECTIONS]);

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
      <Toaster theme="dark" position="top-center" />
      {/* --- Background Elements --- */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "100vh", background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 122, 255, 0.08), transparent 70%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(157, 76, 221, 0.04), transparent 60%)", pointerEvents: "none", zIndex: 0 }} />

      {/* --- Global Sticky Navigation Header --- */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(3,3,3,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 5%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.72)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "color 0.3s ease",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.72)")}
          >
            <ArrowLeft size={14} /> На Головну
          </button>
          <span className="docs-divider" style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span className="docs-version" style={{ fontSize: 14, fontWeight: 700, background: "linear-gradient(90deg, #00E5FF, #9D4CDD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Atlas Docs v0.9.5</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            data-testid="nav-cta-btn"
            onClick={() => (user ? navigate("/dashboard") : navigate("/login"))}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.72)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "color 0.3s ease",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.72)")}
          >
            {user ? "Кабінет" : "Увійти"}
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00E5FF",
                boxShadow: "0 0 12px #00E5FF",
              }}
            />
          </button>
        </div>
      </header>

      {/* --- Modern Product Docs Hero Section --- */}
      <section className="docs-hero" style={{ position: "relative", padding: "40px 5% 40px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", zIndex: 1 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #00E5FF, #9D4CDD)", display: "grid", placeItems: "center", marginBottom: 20, boxShadow: "0 0 30px rgba(0, 229, 255, 0.2)" }}>
          <Terminal size={22} color="#fff" />
        </div>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.03em", background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.7))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Документація Atlas AI
        </h1>
        <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "rgba(255,255,255,0.6)", maxWidth: 600, margin: 0, lineHeight: 1.6 }}>
          Дізнайтеся, як налаштувати, активувати та інтегрувати когнітивну операційну систему Atlas у свій щоденний робочий процес.
        </p>
      </section>

      {/* --- Main Two-Column Layout --- */}
      <div style={{ display: "flex", gap: 40, maxWidth: "100%", margin: "0 auto", padding: "40px 5% 100px", position: "relative", zIndex: 1 }} className="docs-layout">
        {/* Left Navigation Sidebar */}
        <aside style={{ width: 280, flexShrink: 0, position: "sticky", top: 120, height: "fit-content", display: "flex", flexDirection: "column", gap: 16 }} className="sidebar">
          <div style={{ padding: "0 8px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Навігація по розділах</span>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {SECTIONS.map((sec) => {
              const active = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: active ? "rgba(0, 229, 255, 0.08)" : "transparent",
                    color: active ? "#00E5FF" : "rgba(255,255,255,0.65)",
                    fontSize: 13.5,
                    fontWeight: active ? 600 : 500,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                    }
                  }}
                >
                  <span style={{ display: "flex", color: active ? "#00E5FF" : "rgba(255,255,255,0.4)" }}>{sec.icon}</span>
                  {sec.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Content Area */}
        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {/* 1. Intro Section */}
          <section ref={(el) => (sectionsRef.current.intro = el)} style={{ scrollMarginTop: 100, marginBottom: 80 }}>
            <SectionTitle eyebrow="Вступ" title="Про продукт" desc="Atlas AI — це повнофункціональна когнітивна операційна система, розроблена для глибокої автоматизації вашого Mac, ведення розумного розкладу та автономних досліджень." />
            
            <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 24 }}>
              Платформа складається з двох ключових частин: локального інтелектуального клієнта (який працює безпосередньо у вашій системі macOS) та захищеного веб-інтерфейсу хмарної синхронізації. Завдяки цьому ви отримуєте безпрецедентний рівень швидкодії, безпеки та приватного контролю за своїми даними.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginTop: 30 }}>
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

            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden" }}>
              {/* Blurred container */}
              <div style={{ filter: "blur(4.5px)", pointerEvents: "none", opacity: 0.45 }}>
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
              </div>

              {/* Glassmorphic Overlay Badge */}
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(3, 3, 5, 0.45)",
                backdropFilter: "blur(2.5px)",
                WebkitBackdropFilter: "blur(2.5px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 16,
                zIndex: 2,
                padding: 24,
                textAlign: "center"
              }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "rgba(0, 229, 255, 0.1)",
                  border: "1px solid rgba(0, 229, 255, 0.3)",
                  boxShadow: "0 0 20px rgba(0, 229, 255, 0.2)",
                  display: "grid",
                  placeItems: "center",
                  color: "#00E5FF",
                  marginBottom: 16
                }}>
                  <Zap size={24} style={{ animation: "pulse 2s infinite" }} />
                </div>
                <h4 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#fff" }}>Atlas Cloud SDK (Coming Soon)</h4>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255, 255, 255, 0.6)", maxWidth: 360, lineHeight: 1.5 }}>
                  SDK наразі перебуває у закритому бета-тестуванні. Можливість підключення зовнішніх систем буде активована найближчим часом.
                </p>
                <button 
                  className="cta-btn" 
                  style={{ marginTop: 20, padding: "8px 20px", fontSize: 12, cursor: "pointer" }}
                  onClick={() => toast.success("Ви успішно записалися у список очікування на Beta-тест SDK!")}
                >
                  Отримати ранній доступ
                </button>
              </div>
            </div>
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
            <SectionTitle eyebrow="Встановлення" title="Одна команда. Повний Atlas." desc="Захищений інсталятор перевіряє вашу ліцензію, завантажує Atlas та встановлює його в системну директорію macOS із захистом доступу." />
            
            {/* System Requirements */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
              {[
                { icon: <Cpu size={16} />, label: "macOS 13+", sub: "Ventura або новіше" },
                { icon: <Package size={16} />, label: "Python 3.10+", sub: "Рекомендовано 3.11–3.12" },
                { icon: <Shield size={16} />, label: "8 GB RAM", sub: "Рекомендовано 16 GB" },
                { icon: <Zap size={16} />, label: "Мікрофон", sub: "Вбудований або USB" },
              ].map((item, i) => (
                <div key={i} style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,229,255,0.08)", display: "grid", placeItems: "center", color: "#00E5FF" }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{item.label}</div>
                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11.5 }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* The One Command */}
            <div style={{ padding: 24, borderRadius: 16, background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.2)", marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#00E5FF", marginBottom: 8 }}>⚡ Відкрийте Terminal та запустіть:</div>
              <CodeBlock lang="bash" code="curl -fsSL https://atlas-site-2p2d.onrender.com/install | bash" />
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "8px 0 0", lineHeight: 1.5 }}>
                Скрипт перевірить macOS версію, запитає ваш ліцензійний ключ, перевірить його на сервері та автоматично завантажить і встановить Atlas (~1.5 GB).
              </p>
            </div>

            {/* What install.sh does */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { step: "01", title: "Перевірка системи", desc: "Автоматична перевірка macOS 13+ та Python 3.10+" },
                { step: "02", title: "Валідація ліцензії", desc: "Ваш ключ перевіряється на сервері → генерується тимчасовий токен завантаження (15 хвилин)" },
                { step: "03", title: "Захищене завантаження", desc: "Atlas завантажується по одноразовому токену. Без валідного ключа — завантаження неможливе." },
                { step: "04", title: "Захист директорії", desc: "Atlas встановлюється в /Library/Application Support/Atlas/ з правами chmod 700. Код недоступний для читання." },
                { step: "05", title: "Автозапуск", desc: "LaunchAgent налаштовується для автоматичного старту Atlas при вході в систему." },
              ].map((s, idx) => (
                <div key={idx} style={{ display: "flex", gap: 16, padding: "16px 20px", borderRadius: 12, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "#00E5FF", flexShrink: 0 }}>{s.step}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Activation & Licensing Section */}
          <section ref={(el) => (sectionsRef.current.activation = el)} style={{ scrollMarginTop: 100, marginBottom: 80 }}>
            <SectionTitle eyebrow="Активація" title="Система перевірки ліцензії" desc="Кожен екземпляр Atlas AI при запуску перевіряє ліцензійний ключ. Ми прив'язуємо сесію до унікального залізо-ідентифікатора (Mac ID)." />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginBottom: 24 }}>
              <div style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: "#00E5FF", marginBottom: 12 }}>🚀 Повний цикл активації:</h4>
                <ol style={{ paddingLeft: 18, margin: 0, fontSize: 13.5, color: "rgba(255,255,255,0.65)", display: "flex", flexDirection: "column", gap: 10 }}>
                  <li>Купівля тарифу через Stripe або TON-Connect.</li>
                  <li>Отримання унікального ключа форми <code style={{ fontFamily: "monospace", color: "#FEBC2E" }}>ATLAS-XXXX-...</code>.</li>
                  <li>Авторизація пристрою шляхом відправки запиту активації.</li>
                </ol>
              </div>
            </div>

            <CodeBlock lang="javascript" code={`// Приклад перевірки ліцензії через API
fetch("https://api.atlas-ai.space/api/atlas/validate-key", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    key: "ATLAS-XXXX-XXXX-XXXX-XXXX",
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
              <div style={{ gap: 24 }} className="two-col">
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
              <div style={{ gap: 24 }} className="two-col">
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
          </section>

          {/* Dynamic Custom Sections from Database (CMS) */}
          {SECTIONS.filter(s => s.isCustom).map((sec) => (
            <section 
              key={sec.id} 
              ref={(el) => (sectionsRef.current[sec.id] = el)} 
              style={{ scrollMarginTop: 100, marginBottom: 80 }}
              className="fade-in"
            >
              <SectionTitle eyebrow={sec.eyebrow} title={sec.label} desc={sec.desc} />
              
              <div 
                style={{ 
                  fontSize: "14.5px", 
                  color: "rgba(255,255,255,0.75)", 
                  lineHeight: 1.8, 
                  whiteSpace: "pre-wrap"
                }}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(sec.content) }}
              />
            </section>
          ))}

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

// Simple Markdown Formatter for CMS dynamic text content
function formatMarkdown(text) {
  if (!text) return "";
  
  // Basic HTML Escaping
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Format code blocks (```lang ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<div style="position: relative; border-radius: 12px; overflow: hidden; margin: 16px 0; border: 1px solid rgba(255,255,255,0.08); font-family: monospace;">
      <div style="background: rgba(10,10,12,0.85); padding: 8px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase;">${lang || 'code'}</div>
      <pre style="margin: 0; padding: 20px; background: rgba(5,5,7,0.95); overflow-x: auto; color: #a5b4fc; font-size: 13px; line-height: 1.6;"><code>${code.trim()}</code></pre>
    </div>`;
  });

  // Format inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code style="font-family: monospace; background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; color: #00E5FF;">$1</code>');

  // Format headers (### title, ## title, # title)
  html = html.replace(/^### (.*?)$/gm, '<h4 style="font-size: 16px; font-weight: 700; margin: 24px 0 12px; color: #fff;">$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3 style="font-size: 20px; font-weight: 700; margin: 32px 0 16px; color: #fff;">$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2 style="font-size: 24px; font-weight: 800; margin: 40px 0 20px; color: #fff;">$1</h2>');

  // Format bold (**text**)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Format bullets (* item)
  html = html.replace(/^\* (.*?)$/gm, '<li style="margin-left: 20px; margin-bottom: 6px; list-style-type: disc; color: rgba(255,255,255,0.75);">$1</li>');

  // Format links ([text](url))
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" style="color: #00E5FF; text-decoration: underline;">$1</a>');

  return html;
}
