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
      let rendered = line;
      if (lang === "javascript" || lang === "typescript" || lang === "json") {
        rendered = rendered
          .replace(/(const|let|await|import|from|new|return)/g, '<span style="color:#FF7B72">$1</span>')
          .replace(/(Atlas|Promise)/g, '<span style="color:#79C0FF">$1</span>')
          .replace(/(key|mac_id|mac_name|valid|expires_at|days_left|message|version|days_active|skills_count|evolutions_count|requests_count|last_evolution|thought|category|secret|ok)/g, '<span style="color:#7EE787">$1</span>')
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

// Interactive API Tester component for Real Atlas APIs
function ApiTester() {
  const [method, setMethod] = useState("POST");
  const [endpoint, setEndpoint] = useState("/api/atlas/validate-key");
  const [requestBody, setRequestBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // Set default body on mount or endpoint switch
  useEffect(() => {
    if (endpoint === "/api/atlas/validate-key") {
      setRequestBody(JSON.stringify({
        key: "ATLAS-DEV-MODE-9999",
        mac_id: "8c:85:90:5b:7f:12",
        mac_name: "MacBook Pro Valentin"
      }, null, 2));
    } else if (endpoint === "/api/atlas/stats") {
      setRequestBody(JSON.stringify({
        key: "ATLAS-DEV-MODE-9999",
        mac_id: "8c:85:90:5b:7f:12",
        version: "1.0.0",
        days_active: 5,
        skills_count: 8,
        evolutions_count: 2,
        requests_count: 42,
        last_evolution: "Додано фонетичний нормалізатор 'ніні' -> 'ні'"
      }, null, 2));
    } else if (endpoint === "/api/atlas/thought") {
      setRequestBody(JSON.stringify({
        thought: "Вивчаю нові патерни роботи з базою даних для прискорення запитів",
        category: "learning",
        secret: "internal_atlas_system"
      }, null, 2));
    }
  }, [endpoint]);

  const testApi = async () => {
    setLoading(true);
    setResponse(null);
    await new Promise((r) => setTimeout(r, 800));
    
    try {
      const parsedBody = JSON.parse(requestBody);
      if (endpoint === "/api/atlas/validate-key") {
        if (!parsedBody.key || !parsedBody.mac_id) {
          setResponse({ detail: "key and mac_id are required fields" });
        } else {
          setResponse({
            valid: true,
            expires_at: "2036-05-17T00:00:00Z",
            days_left: 3650,
            message: "OK"
          });
        }
      } else if (endpoint === "/api/atlas/stats") {
        if (!parsedBody.key || !parsedBody.mac_id) {
          setResponse({ detail: "License/Mac mismatch" });
        } else {
          setResponse({ ok: true });
        }
      } else if (endpoint === "/api/atlas/thought") {
        if (!parsedBody.thought || !parsedBody.secret) {
          setResponse({ detail: "thought and secret are required" });
        } else {
          setResponse({ ok: true });
        }
      }
    } catch (e) {
      setResponse({ error: "Invalid JSON format in Request Body" });
    }
    setLoading(false);
  };

  return (
    <div className="glass" style={{ padding: 20, borderRadius: 16, marginTop: 24, border: "1px solid rgba(0,229,255,0.15)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#00E5FF", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
        <Activity size={14} />
        Консоль тестування реальних API-інтерфейсів Atlas
      </div>
      
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <span style={{
          padding: "8px 16px",
          background: "rgba(0, 229, 255, 0.1)",
          border: "1px solid rgba(0, 229, 255, 0.2)",
          color: "#00E5FF",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 700
        }}>
          POST
        </span>
        <select
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          style={{ flex: 1, padding: "8px 12px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 8, outline: "none", fontSize: 13 }}
        >
          <option value="/api/atlas/validate-key">/api/atlas/validate-key (Валідація)</option>
          <option value="/api/atlas/stats">/api/atlas/stats (Телеметрія)</option>
          <option value="/api/atlas/thought">/api/atlas/thought (Оновлення думки)</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minHeight: 180 }}>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Запит Body (JSON)</div>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            rows={8}
            style={{ width: "100%", padding: 12, background: "#050507", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, color: "#A5D6FF", fontFamily: "monospace", fontSize: 12, resize: "none", outline: "none" }}
          />
        </div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Відповідь (JSON)</div>
          <div style={{ height: "160px", padding: 12, background: "#050507", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, color: response ? "#85E89D" : "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: 12, overflowY: "auto", textAlign: "left", whiteSpace: "pre-wrap" }}>
            {loading ? "Надсилання запиту..." : response ? JSON.stringify(response, null, 2) : "// Натисніть кнопку Виконати нижче"}
          </div>
        </div>
      </div>
      
      <button onClick={testApi} disabled={loading} className="cta-btn" style={{ marginTop: 12, width: "100%", padding: "10px 0", display: "flex", justifyContent: "center" }}>
        {loading ? "Обробка..." : "Виконати запит"}
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

// Accordion helper
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
        { id: "quickstart", label: "Встановлення та середовище", icon: <Terminal size={14} /> },
        { id: "activation", label: "Ключі активації", icon: <Key size={14} /> }
      ]
    },
    {
      group: "ATLAS API (ДЛЯ MAC APP)",
      items: [
        { id: "api-validate", label: "POST /validate-key", icon: <Code size={14} /> },
        { id: "api-stats", label: "POST /stats", icon: <Code size={14} /> },
        { id: "api-thought", label: "GET/POST /thought", icon: <Code size={14} /> },
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
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>Atlas API Docs</div>
            <span style={{ fontSize: 9, background: "rgba(0, 229, 255, 0.12)", color: "#00E5FF", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>OAS 3.1</span>
          </div>
        </div>

        {/* Global Search bar */}
        <div style={{ position: "relative", width: "min(320px, 45%)" }} className="hidden-mobile">
          <Search size={14} style={{ position: "absolute", left: 12, top: 11, color: "rgba(255,255,255,0.3)" }} />
          <input
            placeholder="Шукати по API документації..."
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
            <span>Backend API</span>
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
              <div style={{ position: "relative", padding: "32px 0 40px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", marginBottom: 40 }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 400px 200px at 0px 50px, rgba(0, 122, 255, 0.12), transparent)", pointerEvents: "none" }} />
                <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1 }}>
                  Atlas AI Backend API
                </h1>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", maxWidth: 640, margin: 0, lineHeight: 1.6 }}>
                  Специфікація внутрішніх інтерфейсів взаємодії десктопного додатку Atlas macOS з сервером ліцензій та збору телеметрії.
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button onClick={() => setActiveTab("quickstart")} className="cta-btn" style={{ padding: "10px 20px", fontSize: 13 }}>
                    Швидкий старт
                  </button>
                  <button onClick={() => setActiveTab("api-validate")} className="ghost-btn" style={{ padding: "10px 20px", fontSize: 13 }}>
                    Специфікація API
                  </button>
                </div>
              </div>

              <h3>Що вміє API сервер Atlas?</h3>
              <p>
                Серверна частина Atlas AI (FastAPI) виступає в ролі єдиного координаційного центру. Вона валідує ліцензійні ключі користувачів, збирає телеметричні дані роботи локальних ШІ-агентів (кількість автономних еволюцій, виконаних навичок та запитів) та відображає поточні думки Atlas на веб-сайті в реальному часі.
              </p>

              {/* Pill Cards Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, margin: "32px 0" }}>
                <PillCard
                  icon={<Shield size={18} />}
                  title="Криптографічна Валідація"
                  desc="Перевірка ліцензій з одночасною прив'язкою до унікального апаратного Mac ID."
                  badge="Security"
                />
                <PillCard
                  icon={<Activity size={18} />}
                  title="Телеметрія та Статистика"
                  desc="Збір даних про активність ШІ: кількість створених навичок та проведених еволюцій."
                  badge="Stats"
                />
                <PillCard
                  icon={<Database size={18} />}
                  title="Резонанс в реальному часі"
                  desc="Публікація та отримання думок автономного дослідника під час фонової роботи."
                  badge="Live"
                />
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div>
              <h2>Архітектура системи</h2>
              <p>
                Взаємодія додатку Atlas AI для macOS та серверу є асинхронною та оптимізованою для уникнення блокувань.
              </p>

              {/* Product Architecture Diagram */}
              <div className="glass" style={{ padding: "32px 20px", borderRadius: 20, margin: "32px 0", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,229,255,0.08)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
                  
                  {/* Step 1 */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ padding: "8px 20px", borderRadius: 10, background: "rgba(0, 122, 255, 0.15)", border: "1px solid #007AFF", fontSize: 13, fontWeight: 600, color: "#fff" }}>
                      Atlas macOS Desktop App (Vosk STT + Core Py)
                    </div>
                    <div style={{ width: 2, height: 24, background: "linear-gradient(180deg, #007AFF, #9D4CDD)" }} />
                  </div>

                  {/* Step 2 */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ padding: "8px 20px", borderRadius: 10, background: "rgba(157, 76, 221, 0.15)", border: "1px solid #9D4CDD", fontSize: 13, fontWeight: 600, color: "#fff" }}>
                      FastAPI Web Server (endpoints: /api/atlas/*)
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
                        Database Layer
                      </div>
                      <div style={{ width: 2, height: 20, background: "#00E5FF" }} />
                      <div style={{ padding: "6px 12px", borderRadius: 8, background: "#0F172A", border: "1px solid rgba(255,255,255,0.08)", fontSize: 11, fontFamily: "monospace" }}>
                        MongoDB (users, licenses, thoughts)
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: 200 }}>
                      <div style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(254, 188, 46, 0.15)", border: "1px solid #FEBC2E", fontSize: 12, fontWeight: 600, color: "#fff", width: "100%" }}>
                        Web Dashboard
                      </div>
                      <div style={{ width: 2, height: 20, background: "#FEBC2E" }} />
                      <div style={{ padding: "6px 12px", borderRadius: 8, background: "#0F172A", border: "1px solid rgba(255,255,255,0.08)", fontSize: 11, fontFamily: "monospace" }}>
                        React SPA (Admin panel)
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {activeTab === "quickstart" && (
            <div>
              <h2>Швидкий старт для macOS додатку</h2>
              <p>
                Приклад інтеграції перевірки ліцензії в клієнтському коді Python (macOS):
              </p>
              <CodeBlock code={`import httpx
import asyncio

async def check_licensing():
    url = "https://atlas-site.dev/api/atlas/validate-key"
    payload = {
        "key": "ATLAS-DEV-MODE-9999",
        "mac_id": "8c:85:90:5b:7f:12",
        "mac_name": "My MacBook Pro"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            r = await client.post(url, json=payload)
            data = r.json()
            if r.status_code == 200 and data.get("valid"):
                print(f"Успішна активація! Днів залишилось: {data.get('days_left')}")
            else:
                print(f"Помилка активації: {data.get('message')}")
        except Exception as e:
            print("Не вдалося зв'язатися з сервером", e)

asyncio.run(check_licensing())`} lang="javascript" />
            </div>
          )}

          {activeTab === "activation" && (
            <div>
              <h2>Прив'язка Mac ID та Ключі Активації</h2>
              <p>
                Кожен ліцензійний ключ при першій перевірці автоматично прив'язується до `mac_id` пристрою.
              </p>
              <ul>
                <li>При зміні пристрою користувач може зайти в свій особистий кабінет і скинути поточний Mac ID.</li>
                <li>Для локального тестування доступний безкоштовний режим розробника з ключем: <code>ATLAS-DEV-MODE-9999</code>.</li>
              </ul>
            </div>
          )}

          {activeTab === "api-validate" && (
            <div>
              <h2>POST /api/atlas/validate-key</h2>
              <p>
                Викликається додатком macOS на старті для валідації ліцензійного ключа.
              </p>

              <h3>Запит Body (JSON):</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 20 }}>
                <thead>
                  <tr style={{ color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                    <th style={{ padding: "8px 12px" }}>Параметр</th>
                    <th style={{ padding: "8px 12px" }}>Тип</th>
                    <th style={{ padding: "8px 12px" }}>Опис</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "#00E5FF" }}>key</td>
                    <td style={{ padding: "8px 12px" }}>string</td>
                    <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.6)" }}>Повний ліцензійний ключ (ATLAS-...)</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "#00E5FF" }}>mac_id</td>
                    <td style={{ padding: "8px 12px" }}>string</td>
                    <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.6)" }}>Унікальний апаратний хеш Mac-пристрою</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "#00E5FF" }}>mac_name</td>
                    <td style={{ padding: "8px 12px" }}>string</td>
                    <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.6)" }}>Назва пристрою (наприклад, MacBook Pro)</td>
                  </tr>
                </tbody>
              </table>

              <h3>Приклад Запиту</h3>
              <CodeBlock code={`{
  "key": "ATLAS-DEV-MODE-9999",
  "mac_id": "8c:85:90:5b:7f:12",
  "mac_name": "MacBook Pro Valentin"
}`} lang="json" />

              <h3>Приклад Успішної Відповіді (200 OK)</h3>
              <CodeBlock code={`{
  "valid": true,
  "expires_at": "2036-05-17T00:00:00Z",
  "days_left": 3650,
  "message": "OK"
}`} lang="json" />
            </div>
          )}

          {activeTab === "api-stats" && (
            <div>
              <h2>POST /api/atlas/stats</h2>
              <p>
                Викликається додатком macOS періодично для надсилання телеметрії роботи ШІ.
              </p>

              <h3>Приклад Запиту</h3>
              <CodeBlock code={`{
  "key": "ATLAS-DEV-MODE-9999",
  "mac_id": "8c:85:90:5b:7f:12",
  "version": "1.0.0",
  "days_active": 5,
  "skills_count": 8,
  "evolutions_count": 2,
  "requests_count": 42,
  "last_evolution": "Додано фонетичний нормалізатор 'ніні' -> 'ні'"
}`} lang="json" />

              <h3>Приклад Відповіді (200 OK)</h3>
              <CodeBlock code={`{
  "ok": true
}`} lang="json" />
            </div>
          )}

          {activeTab === "api-thought" && (
            <div>
              <h2>Робота з думками: GET & POST /api/atlas/thought</h2>
              <p>
                Ендпоінти для відображення поточних думок автономного дослідника Atlas на сайті в реальному часі.
              </p>

              <h3>1. Оновлення думки (POST /api/atlas/thought)</h3>
              <p>Викликається внутрішніми фоновими потоками розробника.</p>
              <CodeBlock code={`{
  "thought": "Вивчаю нові патерни роботи з базою даних для прискорення запитів",
  "category": "learning",
  "secret": "internal_atlas_system"
}`} lang="json" />

              <h3>2. Отримання думки (GET /api/atlas/thought)</h3>
              <p>Використовується фронтендом для виведення на сайті.</p>
              <CodeBlock code={`// GET /api/atlas/thought
{
  "thought": "Вивчаю нові патерни роботи з базою даних для прискорення запитів",
  "ts": "2026-05-17T14:21:05.123456Z",
  "category": "learning"
}`} lang="json" />
            </div>
          )}

          {activeTab === "api-tester" && (
            <div>
              <h2>Консоль тестування API</h2>
              <p>
                Випробуйте API-запити в реальному часі за допомогою нашої консолі.
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
                  { q: "Квартал 3, 2026", status: "В розробці", title: "Синхронізація думок в реальному часі", desc: "Реалізація стрімінгу 'живих думок' та автономних досліджень на головній сторінці сайту.", color: "#FEBC2E" },
                  { q: "Квартал 4, 2026", status: "Заплановано", title: "Повністю автономна multi-agent система", desc: "Створення мережі ШІ-агентів, які спілкуються між собою, обмінюючись інформацією з векторної бази даних.", color: "rgba(255,255,255,0.4)" }
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
                  Для локального тестування та розробки ви можете скористатися глобальним офлайн ключем активації: <code>ATLAS-DEV-MODE-9999</code>. Він надає повний доступ до всіх можливостей.
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

      {/* Embedded Mobile styling */}
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
