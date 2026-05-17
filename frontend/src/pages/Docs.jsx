import { useState, useEffect, useRef, useMemo } from "react";
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
  BookOpen,
  Layers,
  Key,
  Database,
  Search,
  CheckCircle,
  Menu,
  X,
  Code,
  Activity,
  Milestone
} from "lucide-react";

// CodeBlock with highlighting simulation and Copy button
function CodeBlock({ code, lang = "javascript" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to colorize key elements to simulate syntax highlighting
  const highlightedCode = useMemo(() => {
    return code.split("\n").map((line, idx) => {
      // Very simple token replacement for visual styling
      let rendered = line;
      if (lang === "javascript" || lang === "typescript" || lang === "json") {
        rendered = rendered
          .replace(/(const|let|await|import|from|new|return)/g, '<span style="color:#FF7B72">$1</span>')
          .replace(/(Atlas|Promise)/g, '<span style="color:#79C0FF">$1</span>')
          .replace(/(apiKey|message|response|status|key|email|days|success)/g, '<span style="color:#7EE787">$1</span>')
          .replace(/(".*?"|'.*?')/g, '<span style="color:#A5D6FF">$1</span>')
          .replace(/(\/\/.*)/g, '<span style="color:#8B949E">$1</span>');
      } else if (lang === "bash") {
        rendered = rendered
          .replace(/(npm install|git clone|cd|python3|source|pip install|curl|unzip)/g, '<span style="color:#FF7B72">$1</span>')
          .replace(/(--\w+|-\w+)/g, '<span style="color:#79C0FF">$1</span>')
          .replace(/(\/\/.*|#.*)/g, '<span style="color:#8B949E">$1</span>');
      }
      return (
        <div key={idx} dangerouslySetInnerHTML={{ __html: rendered || "&nbsp;" }} />
      );
    });
  }, [code, lang]);

  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", margin: "16px 0", border: "1px solid rgba(255,255,255,0.08)", background: "#0D1117" }}>
      <div style={{ background: "#161B22", padding: "6px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontSize: 11, color: "#8B949E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{lang}</span>
        <button
          onClick={copy}
          style={{
            background: "none",
            border: "none",
            color: copied ? "#28C840" : "#8B949E",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            padding: "4px 0",
            transition: "color 0.2s"
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Скопійовано" : "Копіювати"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "20px", overflowX: "auto", fontSize: 13, lineHeight: 1.7, color: "#c9d1d9", fontFamily: "Fira Code, Source Code Pro, monospace", textAlign: "left" }}>
        <code>{highlightedCode}</code>
      </pre>
    </div>
  );
}

// Interactive API Tester component
function ApiTester() {
  const [method, setMethod] = useState("POST");
  const [endpoint, setEndpoint] = useState("/api/chat");
  const [requestBody, setRequestBody] = useState(
    JSON.stringify({ message: "Привіт, Атласе!" }, null, 2)
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const testApi = async () => {
    setLoading(true);
    setResponse(null);
    // Simulate real request delay
    await new Promise((r) => setTimeout(r, 1000));
    
    if (endpoint === "/api/chat") {
      setResponse({
        success: true,
        response: "Привіт, Валентине! Я повністю готовий до роботи. Усі системи функціонують у штатному режимі.",
        context: {
          intent: "ai_greeting",
          confidence: 0.98,
          active_skills: ["voice", "semantic_memory"]
        }
      });
    } else {
      setResponse({
        success: true,
        license_id: "lic_9x7f83ad9",
        status: "activated",
        expires_at: "2026-06-17T00:00:00Z",
        mac_registered: "00:1A:2B:3C:4D:5E"
      });
    }
    setLoading(false);
  };

  return (
    <div className="glass" style={{ padding: 20, borderRadius: 16, marginTop: 24, border: "1px solid rgba(0,229,255,0.15)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#00E5FF", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
        <Activity size={14} />
        Інтерактивна консоль тестування API
      </div>
      
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={{ padding: "8px 12px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 8, outline: "none", fontSize: 13 }}
        >
          <option value="POST">POST</option>
        </select>
        <select
          value={endpoint}
          onChange={(e) => {
            setEndpoint(e.target.value);
            if (e.target.value === "/api/chat") {
              setRequestBody(JSON.stringify({ message: "Привіт, Атласе!" }, null, 2));
            } else {
              setRequestBody(JSON.stringify({ key: "ATLAS-XXXX-XXXX-XXXX", mac_id: "00:1A:2B:3C:4D:5E" }, null, 2));
            }
          }}
          style={{ flex: 1, padding: "8px 12px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 8, outline: "none", fontSize: 13 }}
        >
          <option value="/api/chat">/api/chat (Діалог)</option>
          <option value="/api/activate">/api/activate (Активація)</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minHeight: 160 }}>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Запит Body</div>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            rows={6}
            style={{ width: "100%", padding: 12, background: "#050507", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, color: "#A5D6FF", fontFamily: "monospace", fontSize: 12, resize: "none", outline: "none" }}
          />
        </div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Відповідь</div>
          <div style={{ height: "128px", padding: 12, background: "#050507", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, color: response ? "#85E89D" : "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: 12, overflowY: "auto", textAlign: "left", whiteSpace: "pre-wrap" }}>
            {loading ? "Надсилання запиту..." : response ? JSON.stringify(response, null, 2) : "// Натисніть кнопку Тестувати нижче"}
          </div>
        </div>
      </div>
      
      <button onClick={testApi} disabled={loading} className="cta-btn" style={{ marginTop: 12, width: "100%", padding: "10px 0", display: "flex", justifyContent: "center" }}>
        {loading ? "Обробка..." : "Виконати тестовий запит"}
      </button>
    </div>
  );
}

// Side-by-side card items
function PillCard({ title, desc, icon, badge }) {
  return (
    <div className="glass" style={{ padding: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", textAlign: "left", position: "relative" }}>
      {badge && (
        <span style={{ position: "absolute", top: 12, right: 12, fontSize: 9, background: "rgba(0,229,255,0.15)", color: "#00E5FF", padding: "2px 8px", borderRadius: 999, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {badge}
        </span>
      )}
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, rgba(0,122,255,0.15), rgba(0,229,255,0.05))", border: "1px solid rgba(0,122,255,0.25)", display: "grid", placeItems: "center", color: "#00E5FF", marginBottom: 12 }}>
        {icon}
      </div>
      <h4 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px", color: "#fff" }}>{title}</h4>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{desc}</p>
    </div>
  );
}

export default function Docs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("intro");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const menu = [
    {
      group: "ВСТУП",
      items: [
        { id: "intro", label: "Про Atlas AI", icon: <BookOpen size={14} /> },
        { id: "architecture", label: "Архітектура системи", icon: <Layers size={14} /> }
      ]
    },
    {
      group: "ШВИДКИЙ СТАРТ",
      items: [
        { id: "quickstart", label: "Встановлення та SDK", icon: <Terminal size={14} /> },
        { id: "auth", label: "Налаштування оточення", icon: <Shield size={14} /> }
      ]
    },
    {
      group: "ЛІЦЕНЗУВАННЯ",
      items: [
        { id: "activation", label: "Ключі активації", icon: <Key size={14} /> }
      ]
    },
    {
      group: "API СПЕЦИФІКАЦІЯ",
      items: [
        { id: "api-chat", label: "POST /api/chat", icon: <Code size={14} /> },
        { id: "api-activate", label: "POST /api/activate", icon: <Code size={14} /> },
        { id: "api-tester", label: "Консоль тестування", icon: <Activity size={14} /> }
      ]
    },
    {
      group: "ROADMAP & FAQ",
      items: [
        { id: "roadmap", label: "План розвитку", icon: <Milestone size={14} /> },
        { id: "faq", label: "Часті запитання", icon: <ChevronDown size={14} /> }
      ]
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#050507", color: "#fff", fontFamily: "Inter, system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* ── Dynamic Floating Header ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(5, 5, 7, 0.75)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "12px 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <ArrowLeft size={13} /> Сайт
          </button>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #007AFF, #00E5FF)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800 }}>A</div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>Atlas Docs</div>
            <span style={{ fontSize: 9, background: "rgba(0, 229, 255, 0.12)", color: "#00E5FF", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>v1.0.0</span>
          </div>
        </div>

        {/* Global Search bar (visual) */}
        <div style={{ position: "relative", width: "min(320px, 45%)" }} className="hidden-mobile">
          <Search size={14} style={{ position: "absolute", left: 12, top: 11, color: "rgba(255,255,255,0.3)" }} />
          <input
            placeholder="Шукати по документації..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 32px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              borderRadius: 8,
              fontSize: 12,
              outline: "none"
            }}
          />
        </div>

        {/* Support link & Mobile Menu Trigger */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="https://t.me/atlas_support" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            Підтримка <ExternalLink size={12} />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: "none", background: "none", border: "none", color: "#fff", cursor: "pointer" }}
            className="show-mobile-flex"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── Main Layout with Sidebar and Content ── */}
      <div style={{ display: "flex", flex: 1, maxWidth: "100%", width: "100%" }}>
        
        {/* ── Sidebar Navigation ── */}
        <aside
          style={{
            width: 260,
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding: "24px 16px",
            background: "#050507",
            position: "sticky",
            top: 57,
            height: "calc(100vh - 57px)",
            overflowY: "auto",
            flexShrink: 0
          }}
          className={`${mobileMenuOpen ? "sidebar-mobile-open" : "hidden-mobile"}`}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {menu.map((group, gIdx) => (
              <div key={gIdx} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", padding: "0 8px 6px" }}>
                  {group.group}
                </span>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: activeTab === item.id ? "rgba(0, 229, 255, 0.08)" : "transparent",
                      color: activeTab === item.id ? "#00E5FF" : "rgba(255,255,255,0.65)",
                      fontSize: 13,
                      fontWeight: activeTab === item.id ? 600 : 500,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s"
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── Document Content Area ── */}
        <main style={{ flex: 1, padding: "48px 6% 120px", overflowX: "hidden", minWidth: 0, textAlign: "left" }}>
          
          {/* Breadcrumbs */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            <span>Platform</span>
            <span>/</span>
            <span>Docs</span>
            <span>/</span>
            <span style={{ color: "#00E5FF", fontWeight: 600 }}>
              {activeTab === "intro" ? "Introduction" : activeTab}
            </span>
          </div>

          {/* ── Content Switcher ── */}
          {activeTab === "intro" && (
            <div>
              {/* Hero Banner inside docs */}
              <div style={{ position: "relative", padding: "32px 0 40px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 40 }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 400px 200px at 0px 50px, rgba(0, 122, 255, 0.12), transparent)", pointerEvents: "none" }} />
                <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1 }}>
                  Atlas AI Platform
                </h1>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", maxWidth: 640, margin: 0, lineHeight: 1.6 }}>
                  Когнітивна операційна ШІ-система для автоматизації, семантичної пам'яті та створення автономних інтелектуальних агентів.
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button onClick={() => setActiveTab("quickstart")} className="cta-btn" style={{ padding: "10px 20px", fontSize: 13 }}>
                    Швидкий старт
                  </button>
                  <button onClick={() => setActiveTab("api-chat")} className="ghost-btn" style={{ padding: "10px 20px", fontSize: 13 }}>
                    Специфікація API
                  </button>
                </div>
              </div>

              <h3>Що таке Atlas AI?</h3>
              <p>
                Atlas — це автономний локальний ШІ-інтелект наступного покоління, розроблений для повної автоматизації робочих процесів на пристроях macOS. Завдяки власному гібридному ядру, Atlas поєднує високу швидкість обробки природної мови, складні автономні сценарії розв'язання задач та абсолютну конфіденційність даних.
              </p>

              {/* Pill Cards Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, margin: "32px 0" }}>
                <PillCard
                  icon={<Database size={18} />}
                  title="Persistent Memory"
                  desc="Семантична довгострокова пам'ять на базі векторної бази даних PostgreSQL."
                  badge="Core"
                />
                <PillCard
                  icon={<Cpu size={18} />}
                  title="Multi-Agent System"
                  desc="Каскадна архітектура моделей та автономні агенти дослідники."
                  badge="Advanced"
                />
                <PillCard
                  icon={<Key size={18} />}
                  title="Device Activation"
                  desc="Безпечна система криптографічної активації прив'язана до Mac ID."
                  badge="Secure"
                />
                <PillCard
                  icon={<Zap size={18} />}
                  title="Real-time Voice"
                  desc="Офлайн розпізнавання голосу Vosk та високоточний Edge-TTS синтез."
                  badge="Offline"
                />
              </div>

              <h3>Ключові можливості платформи</h3>
              <ul>
                <li><strong>Контекстний інтелект:</strong> Безперервно навчається на діях користувача та веде хронологію семантичних взаємодій.</li>
                <li><strong>Автономні дослідження:</strong> Фоновий аналіз інтернет-ресурсів та автоматизована синхронізація без блокування інтерфейсу.</li>
                <li><strong>Розширювані вміння:</strong> Можливість динамічного імпорту користувацьких навичок (Skills) через пісочницю.</li>
                <li><strong>Сумісність:</strong> Можливість повної взаємодії з будь-якими фронтенд рішеннями через відкриті API-інтерфейси.</li>
              </ul>
            </div>
          )}

          {activeTab === "architecture" && (
            <div>
              <h2>Архітектура системи</h2>
              <p>
                Atlas AI побудований на гібридному ядрі, де локальне розпізнавання та синтез мови поєднуються зі складними мережевими каскадами великих мовних моделей.
              </p>

              {/* Product Architecture Diagram */}
              <div className="glass" style={{ padding: "32px 20px", borderRadius: 20, margin: "32px 0", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,229,255,0.08)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
                  
                  {/* Step 1 */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ padding: "8px 20px", borderRadius: 10, background: "rgba(0, 122, 255, 0.15)", border: "1px solid #007AFF", fontSize: 13, fontWeight: 600, color: "#fff" }}>
                      Клієнт (macOS App / Web Interface)
                    </div>
                    <div style={{ width: 2, height: 24, background: "linear-gradient(180deg, #007AFF, #9D4CDD)" }} />
                  </div>

                  {/* Step 2 */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ padding: "8px 20px", borderRadius: 10, background: "rgba(157, 76, 221, 0.15)", border: "1px solid #9D4CDD", fontSize: 13, fontWeight: 600, color: "#fff" }}>
                      Atlas API Gateway (FastAPI Server)
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "180px" }}>
                      <div style={{ width: 2, height: 24, background: "linear-gradient(180deg, #9D4CDD, #00E5FF)" }} />
                      <div style={{ width: 2, height: 24, background: "linear-gradient(180deg, #9D4CDD, #FEBC2E)" }} />
                    </div>
                  </div>

                  {/* Parallel Steps 3 & 4 */}
                  <div style={{ display: "flex", gap: 32, justifyContent: "center", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: 200 }}>
                      <div style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(0, 229, 255, 0.15)", border: "1px solid #00E5FF", fontSize: 12, fontWeight: 600, color: "#fff", width: "100%" }}>
                        Memory Engine
                      </div>
                      <div style={{ width: 2, height: 20, background: "#00E5FF" }} />
                      <div style={{ padding: "6px 12px", borderRadius: 8, background: "#0F172A", border: "1px solid rgba(255,255,255,0.08)", fontSize: 11, fontFamily: "monospace" }}>
                        PostgreSQL / JSON
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: 200 }}>
                      <div style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(254, 188, 46, 0.15)", border: "1px solid #FEBC2E", fontSize: 12, fontWeight: 600, color: "#fff", width: "100%" }}>
                        AI Model Cascade
                      </div>
                      <div style={{ width: 2, height: 20, background: "#FEBC2E" }} />
                      <div style={{ padding: "6px 12px", borderRadius: 8, background: "#0F172A", border: "1px solid rgba(255,255,255,0.08)", fontSize: 11, fontFamily: "monospace" }}>
                        Gemini 2.5 & OpenAI
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <h3>Компоненти ядра</h3>
              <ul>
                <li><strong>Координатор API:</strong> Керує чергами запитів та асинхронно передає дані.</li>
                <li><strong>Двигун Пам'яті (Memory Engine):</strong> Зберігає контекст сесії та забезпечує довгострокову персональну асоціативну пам'ять користувача.</li>
                <li><strong>Модельний каскад:</strong> Динамічно розподіляє складні та швидкі завдання між Gemini (SMART/FAST) та локальними алгоритмами аналізу намірів.</li>
              </ul>
            </div>
          )}

          {activeTab === "quickstart" && (
            <div>
              <h2>Швидкий старт з SDK</h2>
              <p>
                Почніть розробку на базі Atlas AI за лічені хвилини. Наше SDK дозволяє керувати сесіями, отримувати відповіді від локальних агентів та відслідковувати статус пристрою.
              </p>

              <h3>1. Встановлення SDK</h3>
              <p>Встановіть офіційний клієнтський пакет за допомогою вашого пакетного менеджера:</p>
              <CodeBlock code="npm install @atlas-ai/sdk --save" lang="bash" />

              <h3>2. Ініціалізація та базовий запит</h3>
              <p>Підключіться до вашого локального або віддаленого інстансу Atlas AI, використовуючи ліцензійний API ключ:</p>
              <CodeBlock code={`import { Atlas } from "@atlas-ai/sdk";

// Ініціалізація клієнта
const atlas = new Atlas({
  apiKey: "ATLAS-XXXX-XXXX-XXXX-XXXX", // Ваш ліцензійний ключ
  endpoint: "http://localhost:8000" // Шлях до вашого API
});

async function main() {
  // Відправка повідомлення до ядра ШІ
  const response = await atlas.chat({
    message: "Привіт, Атласе! Розкажи про статус пам'яті."
  });

  console.log("Відповідь Atlas:", response.text);
  console.log("Активні вміння:", response.skills);
}

main().catch(console.error);`} lang="javascript" />
            </div>
          )}

          {activeTab === "auth" && (
            <div>
              <h2>Налаштування системного середовища</h2>
              <p>
                Для коректної роботи Atlas AI на macOS потрібні певні системні бібліотеки та дозволи.
              </p>
              
              <h3>Системні вимоги</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, margin: "20px 0" }}>
                <div style={{ padding: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#00E5FF" }}>macOS 13+</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Ventura, Sonoma, Sequoia</div>
                </div>
                <div style={{ padding: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#00E5FF" }}>Python 3.10+</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Рекомендовано 3.11</div>
                </div>
                <div style={{ padding: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#00E5FF" }}>Дозволи звуку</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Доступ до мікрофону</div>
                </div>
              </div>

              <h3>Клонування та налаштування оточення</h3>
              <CodeBlock code={`# Клонування репозиторію
git clone https://github.com/Valentynvdo/atlas-57888988976fhvsite.git
cd atlas_ai

# Створення віртуального оточення Python
python3 -m venv .venv
source .venv/bin/activate

# Встановлення залежностей
pip install -r requirements.txt`} lang="bash" />
            </div>
          )}

          {activeTab === "activation" && (
            <div>
              <h2>Система активації та ліцензування</h2>
              <p>
                Atlas AI використовує безпечну систему активації з прив'язкою до ідентифікатора вашого пристрою (`mac_id`). Це гарантує конфіденційність та безпеку використання вашого ліцензійного пакета.
              </p>

              <h3>Етапи активації:</h3>
              <ol style={{ lineHeight: 1.8 }}>
                <li>Придбайте підписку або отримайте безкоштовний промо-код в особистому кабінеті.</li>
                <li>Отримайте унікальний криптографічний ліцензійний ключ формату `ATLAS-XXXX-XXXX-XXXX`.</li>
                <li>Запустіть додаток Atlas на вашому Mac. Він запросить ключ і автоматично зв'яжеться з ліцензійним сервером для верифікації та реєстрації вашого `mac_id`.</li>
              </ol>

              <h3>Перевірка ключа через API</h3>
              <p>Ви можете самостійно перевірити термін дії та статус ключа, використовуючи наш публічний API:</p>
              <CodeBlock code={`curl -X POST https://atlas-site.dev/api/admin/users/action \\
  -H "Content-Type: application/json" \\
  -d '{
    "key": "ATLAS-DEV-MODE-9999",
    "mac_id": "8c:85:90:5b:7f:12"
  }'`} lang="bash" />
            </div>
          )}

          {activeTab === "api-chat" && (
            <div>
              <h2>POST /api/chat</h2>
              <p>
                Основний кінцевий ендпоінт для ведення діалогу з Atlas AI та запуску внутрішніх автономних дій.
              </p>

              <h3>Запит Headers</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 20 }}>
                <thead>
                  <tr style={{ color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                    <th style={{ padding: "8px 12px" }}>Назва</th>
                    <th style={{ padding: "8px 12px" }}>Тип</th>
                    <th style={{ padding: "8px 12px" }}>Опис</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "#00E5FF" }}>Authorization</td>
                    <td style={{ padding: "8px 12px" }}>string</td>
                    <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.6)" }}>Bearer [Ваш ліцензійний ключ]</td>
                  </tr>
                </tbody>
              </table>

              <h3>Запит Body</h3>
              <CodeBlock code={`{
  "message": "Привіт, завантаж останні новини про ШІ",
  "priority": "SMART" // Варіанти: FAST | SMART | EVOLUTION
}`} lang="json" />

              <h3>Відповідь Response</h3>
              <CodeBlock code={`{
  "success": true,
  "response": "Запит оброблено. Я ініціював пошук останніх новин і завантажив основні факти про релізи великих моделей у семантичну пам'ять.",
  "execution_time_ms": 320
}`} lang="json" />
            </div>
          )}

          {activeTab === "api-activate" && (
            <div>
              <h2>POST /api/activate</h2>
              <p>
                Прив'язує ліцензійний ключ до унікального ідентифікатора вашого macOS пристрою (`mac_id`).
              </p>

              <h3>Параметри запиту:</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 20 }}>
                <thead>
                  <tr style={{ color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                    <th style={{ padding: "8px 12px" }}>Параметр</th>
                    <th style={{ padding: "8px 12px" }}>Тип</th>
                    <th style={{ padding: "8px 12px" }}>Обов'язковий</th>
                    <th style={{ padding: "8px 12px" }}>Опис</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "#00E5FF" }}>key</td>
                    <td style={{ padding: "8px 12px" }}>string</td>
                    <td style={{ padding: "8px 12px", color: "#28C840" }}>Так</td>
                    <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.6)" }}>Ваш ліцензійний ключ</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "#00E5FF" }}>mac_id</td>
                    <td style={{ padding: "8px 12px" }}>string</td>
                    <td style={{ padding: "8px 12px", color: "#28C840" }}>Так</td>
                    <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.6)" }}>Хеш або адреса macOS адаптера</td>
                  </tr>
                </tbody>
              </table>

              <h3>Запит Body</h3>
              <CodeBlock code={`{
  "key": "ATLAS-DEV-MODE-9999",
  "mac_id": "8c:85:90:5b:7f:12"
}`} lang="json" />

              <h3>Результат відповіді</h3>
              <CodeBlock code={`{
  "success": true,
  "status": "activated",
  "details": {
    "active": true,
    "expires_at": "2036-05-17T00:00:00Z"
  }
}`} lang="json" />
            </div>
          )}

          {activeTab === "api-tester" && (
            <div>
              <h2>Інтерактивне тестування API</h2>
              <p>
                Випробуйте API-запити в реальному часі за допомогою нашої інтерактивної консолі. Жодних налаштувань не потрібно!
              </p>
              <ApiTester />
            </div>
          )}

          {activeTab === "roadmap" && (
            <div>
              <h2>План розвитку (Roadmap)</h2>
              <p>
                Ми постійно вдосконалюємо Atlas AI. Нижче наведено поточний план розвитку платформи на найближчі місяці.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 24 }}>
                {[
                  { q: "Квартал 2, 2026", status: "Виконано", title: "Реліз стабільної версії 1.0", desc: "Створення надійної системи Speak Lock проти переривань голосу, нормалізатор Vosk, розширені інтерактивні графіки в адмінці.", color: "#28C840" },
                  { q: "Квартал 3, 2026", status: "В розробці", title: "Інтеграція з Mintlify та покращене SDK", desc: "Вихід повноцінних клієнтських пакетів під TypeScript, Python та Go. Повна підтримка та інтеграція нових кастомних віджетів.", color: "#FEBC2E" },
                  { q: "Квартал 4, 2026", status: "Заплановано", title: "Повністю автономна multi-agent система", desc: "Створення мережі ШІ-агентів, які спілкуються між собою, обмінюючись інформацією з векторної бази даних PostgreSQL.", color: "rgba(255,255,255,0.4)" }
                ].map((item, idx) => (
                  <div key={idx} className="glass" style={{ padding: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ padding: "4px 10px", borderRadius: 6, background: item.color === "#28C840" ? "rgba(40,200,64,0.12)" : item.color === "#FEBC2E" ? "rgba(254,188,46,0.12)" : "rgba(255,255,255,0.06)", color: item.color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>
                      {item.status}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{item.q}</div>
                      <h4 style={{ margin: "4px 0 6px", fontSize: 16, fontWeight: 600 }}>{item.title}</h4>
                      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div>
              <h2>Часті запитання (FAQ)</h2>
              <p>Якщо у вас виникли проблеми в роботі з Atlas, ознайомтеся з найпопулярнішими рішеннями.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
                <Accordion q="Який ключ використовувати під час розробки (дев-режимі)?">
                  Для локального тестування та розробки ви можете скористатися глобальним офлайн ключем активації: <code>ATLAS-DEV-MODE-9999</code>. Він надає повний доступ до всіх можливостей на 10 років.
                </Accordion>
                <Accordion q="Чи працює розпізнавання мови Vosk без інтернету?">
                  Так! Atlas використовує завантажену українську модель Vosk (~50 MB) безпосередньо на вашому Mac пристрої. Усі голосові дані обробляються виключно локально і не відправляються до хмари, що гарантує 100% приватність.
                </Accordion>
                <Accordion q="Як перенести сайт та налаштувати автоматичні оновлення?">
                  Проект сайту тепер повністю лежить всередині загальної папки Atlas AI. Будь-які зміни тестуються через вбудований Sandbox і автоматично публікуються автономним ШІ-агентом без потреби підтвердження від користувача.
                </Accordion>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Embedded Mobile styling to keep the layout absolutely perfect */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
          .show-mobile-flex {
            display: flex !important;
          }
          .sidebar-mobile-open {
            position: fixed !important;
            top: 57px !important;
            left: 0 !important;
            width: 100% !important;
            height: calc(100vh - 57px) !important;
            z-index: 99 !important;
            background: #050507 !important;
          }
        }
      `}} />
    </div>
  );
}
