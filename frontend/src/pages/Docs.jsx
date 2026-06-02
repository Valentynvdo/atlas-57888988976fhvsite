import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import { useAuth } from "../lib/auth";
import { toast, Toaster } from "sonner";
import api from "../lib/api";
import { ArrowLeft, Copy, Check, ChevronDown, Terminal, Package, Zap, Shield, Cpu, Download, ExternalLink, Code, BookOpen, Activity, Layers, Sparkles, Key, Globe, Settings, HelpCircle, Play, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

// --- Custom Code Block with Copy Button ---
function CodeBlock({
  code,
  lang = "javascript"
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return <div style={{
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    margin: "16px 0",
    border: "1px solid rgba(255,255,255,0.08)"
  }}>
      <div style={{
      background: "rgba(10,10,12,0.85)",
      backdropFilter: "blur(12px)",
      padding: "8px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid rgba(255,255,255,0.06)"
    }}>
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
          <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#ff5f57"
        }}></div>
          <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#febc2e"
        }}></div>
          <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#28c840"
        }}></div>
          <span style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginLeft: 8,
          fontFamily: "monospace"
        }}>{lang}</span>
        </div>
        <button onClick={copy} style={{
        background: "none",
        border: "none",
        color: copied ? "#28C840" : "rgba(255,255,255,0.4)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        padding: "4px 8px",
        borderRadius: 6,
        transition: "all 0.2s"
      }} className="hover:bg-white/5">
          {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? t("txt_1091") : t("txt_1092")}
        </button>
      </div>
      <pre style={{
      margin: 0,
      padding: "20px",
      background: "rgba(5,5,7,0.95)",
      overflowX: "auto",
      fontSize: 13,
      lineHeight: 1.6,
      color: "#a5b4fc",
      fontFamily: "'Fira Code', monospace"
    }}>
        <code>{code}</code>
      </pre>
    </div>;
}
function SectionTitle({
  eyebrow,
  title,
  desc
}) {
  return <div style={{
    marginBottom: 32
  }}>
      <div style={{
      color: "#00E5FF",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 8
    }}>
        <span style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#00E5FF"
      }} />
        {eyebrow}
      </div>
      <h2 style={{
      fontSize: 32,
      fontWeight: 700,
      margin: "0 0 12px",
      letterSpacing: "-0.03em",
      background: "linear-gradient(120deg, #fff, #a5b4fc)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    }}>{title}</h2>
      {desc && <p style={{
      color: "rgba(255,255,255,0.6)",
      fontSize: 15,
      lineHeight: 1.7,
      maxWidth: 800
    }}>{desc}</p>}
    </div>;
}
function Accordion({
  q,
  children
}) {
  const [open, setOpen] = useState(false);
  return <div style={{
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
    background: "rgba(255,255,255,0.01)",
    transition: "all 0.3s"
  }}>
      <button onClick={() => setOpen(!open)} style={{
      width: "100%",
      padding: "18px 24px",
      background: "none",
      border: "none",
      color: "#fff",
      textAlign: "left",
      fontSize: 15,
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      fontFamily: "Inter, sans-serif"
    }}>
        {q}
        <ChevronDown size={18} style={{
        color: "rgba(255,255,255,0.4)",
        transition: "transform 0.3s",
        transform: open ? "rotate(180deg)" : "none",
        flexShrink: 0
      }} />
      </button>
      {open && <div style={{
      padding: "0 24px 20px",
      color: "rgba(255,255,255,0.65)",
      fontSize: 14,
      lineHeight: 1.7,
      borderTop: "1px solid rgba(255,255,255,0.04)"
    }}>{children}</div>}
    </div>;
}
export default function Docs() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useLocalizedNavigate();
  const [activeSection, setActiveSection] = useState("intro");
  const isEn = i18n.language === 'en';
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
    const base = [{
      id: "intro",
      label: t("txt_1093"),
      icon: <BookOpen size={16} />
    }, {
      id: "tech_deep_dive",
      label: t("txt_1094"),
      icon: <Sparkles size={16} />
    }, {
      id: "quickstart",
      label: t("txt_1095"),
      icon: <Zap size={16} />
    }, {
      id: "architecture",
      label: t("txt_1096"),
      icon: <Layers size={16} />
    }, {
      id: "installation",
      label: t("txt_1097"),
      icon: <Package size={16} />
    }, {
      id: "activation",
      label: t("txt_1098"),
      icon: <Key size={16} />
    }, {
      id: "api",
      label: "REST API Reference",
      icon: <Globe size={16} />
    }, {
      id: "roadmap",
      label: t("txt_1099"),
      icon: <Activity size={16} />
    }, {
      id: "faq",
      label: t("txt_1100"),
      icon: <HelpCircle size={16} />
    }];
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
    return [...base, {
      id: "cabinet",
      label: isEn ? "Registration & Cabinet" : "Реєстрація та кабінет",
      icon: <Key size={16} />
    }, {
      id: "applescript",
      label: isEn ? "AppleScript Integration" : "Взаємодія через AppleScript",
      icon: <Code size={16} />
    }, {
      id: "troubleshooting",
      label: isEn ? "Troubleshooting" : "Вирішення проблем",
      icon: <Shield size={16} />
    }, {
      id: "community",
      label: isEn ? "Community & Support" : "Спільнота",
      icon: <HelpCircle size={16} />
    }, ...mappedCustom];
  }, [customDocs, t, isEn]);
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
  const scrollTo = id => {
    const el = sectionsRef.current[id];
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };
  return <div style={{
    minHeight: "100vh",
    background: "#030303",
    color: "#fff",
    fontFamily: "Inter, system-ui, sans-serif"
  }}>
      <Helmet>
        <title>{isEn ? "Atlas AI Documentation — Local AI & macOS Automation Setup" : "Документація Atlas AI — Інструкції з налаштування локального ШІ"}</title>
        <meta name="description" content={isEn ? "Comprehensive user guide for Atlas AI app. Learn how to configure a secure offline AI assistant, set up a local knowledge base, and control macOS via Telegram bot." : "Повний посібник користувача Atlas AI. Інструкції з налаштування локальної бази знань, підключення Telegram-бота, конфігурації голосового керування та автоматизації macOS."} />
        <link rel="canonical" href={isEn ? "https://atlas-assistant.online/en/docs" : "https://atlas-assistant.online/docs"} />
      </Helmet>
      <Toaster theme="dark" position="top-center" />
      <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "100vh",
      background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 122, 255, 0.08), transparent 70%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(157, 76, 221, 0.04), transparent 60%)",
      pointerEvents: "none",
      zIndex: 0
    }} />

      {/* --- Global Sticky Navigation Header --- */}
      <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(3,3,3,0.75)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "16px 5%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12
      }}>
          <button onClick={() => navigate("/")} style={{
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
          padding: 0
        }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.72)"}>
            <ArrowLeft size={14} />{t("txt_1101")}</button>
          <span className="docs-divider" style={{
          color: "rgba(255,255,255,0.3)"
        }}>|</span>
          <span className="docs-version" style={{
          fontSize: 14,
          fontWeight: 700,
          background: "linear-gradient(90deg, #00E5FF, #9D4CDD)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>Atlas Docs v0.9.5</span>
        </div>
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: 16
      }}>
          <button data-testid="nav-cta-btn" onClick={() => user ? navigate("/dashboard") : navigate("/login")} style={{
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
          padding: 0
        }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.72)"}>
            {user ? t("txt_1102") : t("txt_1103")}
            <span style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#00E5FF",
            boxShadow: "0 0 12px #00E5FF"
          }} />
          </button>
        </div>
      </header>

      {/* --- Modern Product Docs Hero Section --- */}
      <section className="docs-hero" style={{
      position: "relative",
      padding: "40px 5% 40px",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      zIndex: 1
    }}>
        <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: "linear-gradient(135deg, #00E5FF, #9D4CDD)",
        display: "grid",
        placeItems: "center",
        marginBottom: 20,
        boxShadow: "0 0 30px rgba(0, 229, 255, 0.2)"
      }}>
          <Terminal size={22} color="#fff" />
        </div>
        <h1 style={{
        fontSize: "clamp(28px, 4vw, 42px)",
        fontWeight: 800,
        margin: "0 0 12px",
        letterSpacing: "-0.03em",
        background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.7))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>{isEn ? "Atlas AI Documentation & Technical Manuals" : "Документація та посібники користувача Atlas AI"}</h1>
        <p style={{
        fontSize: "clamp(14px, 1.5vw, 16px)",
        color: "rgba(255,255,255,0.6)",
        maxWidth: 600,
        margin: 0,
        lineHeight: 1.6
      }}>{isEn ? "Deploy and configure your autonomous ai agent mac app download within minutes. Access complete technical handbooks on maximizing macos productivity, setting up a local knowledge base ai tool offline mac, and managing background workflows." : "Налаштуйте свій автономний штучний інтелект для макбук за лічені хвилини. Тут зібрані всі технічні інструкції, які допоможуть вам автоматизувати рутину на macOS, керувати системою голосом та побудувати безпечне робоче середовище без хмари."}</p>
      </section>

      {/* --- Main Two-Column Layout --- */}
      <div style={{
      display: "flex",
      gap: 40,
      maxWidth: "100%",
      margin: "0 auto",
      padding: "40px 5% 100px",
      position: "relative",
      zIndex: 1
    }} className="docs-layout">
        {/* Left Navigation Sidebar */}
        <aside style={{
        width: 280,
        flexShrink: 0,
        position: "sticky",
        top: 120,
        alignSelf: "flex-start",
        maxHeight: "calc(100vh - 140px)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 16
      }} className="sidebar">
          <div style={{
          padding: "0 8px 8px",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
            <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.15em",
            textTransform: "uppercase"
          }}>{t("txt_1106")}</span>
          </div>
          <nav style={{
          display: "flex",
          flexDirection: "column",
          gap: 6
        }}>
            {SECTIONS.map(sec => {
            const active = activeSection === sec.id;
            return <button key={sec.id} onClick={() => scrollTo(sec.id)} style={{
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
            }} onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.color = "#fff";
              }
            }} onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255,255,255,0.65)";
              }
            }}>
                  <span style={{
                display: "flex",
                color: active ? "#00E5FF" : "rgba(255,255,255,0.4)"
              }}>{sec.icon}</span>
                  {sec.label}
                </button>;
          })}
          </nav>
        </aside>

        {/* Right Content Area */}
        <main style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}>
          {/* 1. Intro Section */}
          <section ref={el => sectionsRef.current.intro = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow={t("txt_1107")} title={t("txt_1108")} desc="Atlas AI — це повнофункціональна когнітивна операційна система, розроблена для глибокої автоматизації вашого Mac, ведення розумного розкладу та автономних досліджень." />
            
            <p style={{
            fontSize: "14.5px",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.75,
            marginBottom: 24
          }}>{t("txt_1109")}</p>

            <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginTop: 30
          }}>
              <div className="glass" style={{
              padding: 24,
              borderRadius: 16,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)"
            }}>
                <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(0, 122, 255, 0.12)",
                color: "#007AFF",
                display: "grid",
                placeItems: "center",
                marginBottom: 14
              }}>
                  <Shield size={18} />
                </div>
                <h3 style={{
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 6
              }}>{t("txt_1110")}</h3>
                <p style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.5
              }}>{t("txt_1111")}</p>
              </div>

              <div className="glass" style={{
              padding: 24,
              borderRadius: 16,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)"
            }}>
                <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(157, 76, 221, 0.12)",
                color: "#9D4CDD",
                display: "grid",
                placeItems: "center",
                marginBottom: 14
              }}>
                  <Cpu size={18} />
                </div>
                <h3 style={{
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 6
              }}>{t("txt_1112")}</h3>
                <p style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.5
              }}>{t("txt_1113")}</p>
              </div>
            </div>
          </section>

          {/* 1.5 Deep Tech Section */}
          <section ref={el => sectionsRef.current.tech_deep_dive = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow={t("txt_1114")} title={t("txt_1115")} desc="Детальний огляд ключових систем, що роблють ATLAS не просто чат-ботом, а повноцінною когнітивною системою." />
            
            <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}>
              <Accordion q="Onboarding (Перший запуск та FaceID)">
                <div>
                  <p>{t("txt_1116")}</p>
                </div>
              </Accordion>
              <Accordion q="Система мікрофонів (VAD)">
                <div>
                  <p>{t("txt_1117")}<strong>WebRTC VAD</strong>{t("txt_1118")}</p>
                </div>
              </Accordion>
              <Accordion q="Архітектура ai_handler та Роутинг">
                <div>
                  <p>{t("txt_1119")}<strong>FAST</strong>{t("txt_1120")}<strong>SMART</strong>{t("txt_1121")}<strong>EVOLUTION</strong>{t("txt_1122")}</p>
                </div>
              </Accordion>
              <Accordion q="Управління гостями (Guest System)">
                <div>
                  <p>{t("txt_1123")}</p>
                </div>
              </Accordion>
              <Accordion q="Локальна семантична пам'ять (semantic_memory.py)">
                <div>
                  <p>{t("txt_1124")}</p>
                </div>
              </Accordion>
              <Accordion q="Telegram-інтеграція (telegram_bridge.py)">
                <div>
                  <p>{t("txt_1125")}</p>
                </div>
              </Accordion>
              <Accordion q="Візуальне розуміння контексту (UI Understanding)">
                <div>
                  <p>{t("txt_1126")}</p>
                </div>
              </Accordion>
              <Accordion q="Автономний дослідник (autonomous_researcher.py)">
                <div>
                  <p>{t("txt_1127")}</p>
                </div>
              </Accordion>
              <Accordion q="Privacy Guard">
                <div>
                  <p>{t("txt_1128")}<strong>privacy_guard.py</strong>{t("txt_1129")}</p>
                </div>
              </Accordion>
              <Accordion q="Комерційна ліцензійна система (license_manager.py)">
                <div>
                  <p>{t("txt_1130")}<strong>license_manager.py</strong>{t("txt_1131")}</p>
                </div>
              </Accordion>
              <Accordion q="Гнучке управління особистістю (persona_manager.py)">
                <div>
                  <p>{t("txt_1132")}<strong>Persona Manager</strong>{t("txt_1133")}</p>
                </div>
              </Accordion>
            </div>
          </section>

          {/* Telegram Setup Section */}
          <section ref={el => sectionsRef.current.telegram_setup = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow={t("docs_telegram_eyebrow")} title={isEn ? "Telegram Bot Routing & System Integration" : "Інтеграція з Telegram та віддалене керування macOS"} desc={t("docs_telegram_desc")} />
            
            <div style={{
            padding: 24,
            borderRadius: 16,
            background: "rgba(0, 229, 255, 0.03)",
            border: "1px solid rgba(0, 229, 255, 0.15)",
            marginBottom: 16
          }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#fff" }}>{t("docs_telegram_step1")}</h3>
              <ul style={{ color: "rgba(255,255,255,0.7)", paddingLeft: 20, lineHeight: 1.6, marginBottom: 16 }}>
                <li dangerouslySetInnerHTML={{ __html: t("docs_telegram_step1_l1") }} />
                <li dangerouslySetInnerHTML={{ __html: t("docs_telegram_step1_l2") }} />
                <li>{t("docs_telegram_step1_l3")}</li>
                <li>{t("docs_telegram_step1_l4")}</li>
              </ul>
              {/* Зображення для Кроку 1 */}
              <div style={{ marginBottom: 32, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src="/assets/docs/bot_step1.jpg" alt="BotFather Step 1" style={{ width: "100%", display: "block" }} onError={(e) => { e.target.style.display='none'; e.target.parentElement.style.display='none'; }} />
              </div>
              
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#fff" }}>{t("docs_telegram_step2")}</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: t("docs_telegram_step2_desc") }} />
              {/* Зображення для Кроку 2 */}
              <div style={{ marginBottom: 32, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src="/assets/docs/bot_step2.jpg" alt="Bot Token" style={{ width: "100%", display: "block" }} onError={(e) => { e.target.style.display='none'; e.target.parentElement.style.display='none'; }} />
              </div>
              
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#fff" }}>{t("docs_telegram_step3")}</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: t("docs_telegram_step3_desc") }} />
              {/* Зображення для Кроку 3 */}
              <div style={{ marginBottom: 16, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src="/assets/docs/bot_step3.jpg" alt="Dashboard Connection" style={{ width: "100%", display: "block" }} onError={(e) => { e.target.style.display='none'; e.target.parentElement.style.display='none'; }} />
              </div>
            </div>
          </section>

          {/* 2. Quick Start SDK Section */}
          <section ref={el => sectionsRef.current.quickstart = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow={t("txt_1134")} title={isEn ? "Quick Start Guide for Apple Silicon" : "Швидкий старт та системні налаштування"} desc="Бажаєте інтегрувати розумні агенти Atlas у свій власний додаток чи сайт? Використовуйте наш офіційний SDK для підключення до локального або хмарного ядра Atlas AI." />
            
            <div style={{
            padding: 24,
            borderRadius: 16,
            background: "rgba(0, 229, 255, 0.03)",
            border: "1px solid rgba(0, 229, 255, 0.15)",
            marginBottom: 16
          }}>
              <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8
            }}>
                <CheckCircle size={16} color="#00E5FF" />
                <span style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#00E5FF"
              }}>{t("txt_1135")}</span>
              </div>
              <p style={{
              fontSize: 13.5,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.5,
              margin: 0
            }}>{t("txt_1136")}</p>
            </div>

            <div style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden"
          }}>
              {/* Blurred container */}
              <div style={{
              filter: "blur(4.5px)",
              pointerEvents: "none",
              opacity: 0.45
            }}>
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
                  <Zap size={24} style={{
                  animation: "pulse 2s infinite"
                }} />
                </div>
                <h4 style={{
                margin: "0 0 8px",
                fontSize: 18,
                fontWeight: 700,
                color: "#fff"
              }}>Atlas Cloud SDK (Coming Soon)</h4>
                <p style={{
                margin: 0,
                fontSize: 13,
                color: "rgba(255, 255, 255, 0.6)",
                maxWidth: 360,
                lineHeight: 1.5
              }}>{t("txt_1137")}</p>
                <button className="cta-btn" style={{
                marginTop: 20,
                padding: "8px 20px",
                fontSize: 12,
                cursor: "pointer"
              }} onClick={() => toast.success(t("txt_1138"))}>{t("txt_1139")}</button>
              </div>
            </div>
          </section>

          {/* 3. Product Architecture Diagram */}
          <section ref={el => sectionsRef.current.architecture = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow={t("txt_1140")} title={t("txt_1141")} desc="Як влаштовані потоки обробки інформації в Atlas AI. Завдяки ізольованості шарів, ваші дані надійно шифруються локально." />
            
            {/* Visual Interactive Flowchart */}
            <div style={{
            background: "rgba(255,255,255,0.01)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 20,
            padding: "32px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            position: "relative",
            overflowX: "auto"
          }}>
              
              <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minWidth: 640,
              padding: "0 20px"
            }}>
                
                {/* Node 1 */}
                <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                  <div style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  width: 140
                }}>
                    <span style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 700
                  }}>{t("txt_1142")}</span>
                    <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff"
                  }}>macOS App / SDK</span>
                  </div>
                </div>

                {/* Arrow */}
                <div style={{
                flex: 0.5,
                height: 1,
                background: "linear-gradient(90deg, #007AFF, #9D4CDD)",
                position: "relative"
              }}>
                  <div style={{
                  position: "absolute",
                  right: 0,
                  top: -4,
                  borderLeft: "5px solid #9D4CDD",
                  borderTop: "5px solid transparent",
                  borderBottom: "5px solid transparent"
                }} />
                </div>

                {/* Node 2 */}
                <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                  <div style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  background: "rgba(157, 76, 221, 0.1)",
                  border: "1px solid rgba(157, 76, 221, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  width: 140
                }}>
                    <span style={{
                    fontSize: 11,
                    color: "#9D4CDD",
                    fontWeight: 700
                  }}>{t("txt_1143")}</span>
                    <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff"
                  }}>Atlas Core API</span>
                  </div>
                </div>

                {/* Arrow */}
                <div style={{
                flex: 0.5,
                height: 1,
                background: "linear-gradient(90deg, #9D4CDD, #00E5FF)",
                position: "relative"
              }}>
                  <div style={{
                  position: "absolute",
                  right: 0,
                  top: -4,
                  borderLeft: "5px solid #00E5FF",
                  borderTop: "5px solid transparent",
                  borderBottom: "5px solid transparent"
                }} />
                </div>

                {/* Node 3 */}
                <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                  <div style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  background: "rgba(0, 229, 255, 0.1)",
                  border: "1px solid rgba(0, 229, 255, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  width: 140
                }}>
                    <span style={{
                    fontSize: 11,
                    color: "#00E5FF",
                    fontWeight: 700
                  }}>{t("txt_1144")}</span>
                    <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff"
                  }}>Semantic Engine</span>
                  </div>
                </div>

                {/* Arrow */}
                <div style={{
                flex: 0.5,
                height: 1,
                background: "linear-gradient(90deg, #00E5FF, #28C840)",
                position: "relative"
              }}>
                  <div style={{
                  position: "absolute",
                  right: 0,
                  top: -4,
                  borderLeft: "5px solid #28C840",
                  borderTop: "5px solid transparent",
                  borderBottom: "5px solid transparent"
                }} />
                </div>

                {/* Node 4 */}
                <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                  <div style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  background: "rgba(40, 200, 64, 0.1)",
                  border: "1px solid rgba(40, 200, 64, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  width: 140
                }}>
                    <span style={{
                    fontSize: 11,
                    color: "#28C840",
                    fontWeight: 700
                  }}>{t("txt_1145")}</span>
                    <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff"
                  }}>AI Models Layer</span>
                  </div>
                </div>

              </div>

              {/* Vertical link to DB */}
              <div style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 8
            }}>
                <div style={{
                width: 1,
                height: 32,
                background: "linear-gradient(180deg, #00E5FF, rgba(0,229,255,0))"
              }} />
              </div>
              <div style={{
              display: "flex",
              justifyContent: "center"
            }}>
                <div style={{
                padding: "10px 20px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: 12.5,
                fontFamily: "monospace",
                display: "inline-flex",
                gap: 8,
                alignItems: "center"
              }}>
                  <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#00E5FF"
                }} />{t("txt_1146")}</div>
              </div>

            </div>
          </section>

          {/* 4. Installation & Local Setup Section */}
          <section ref={el => sectionsRef.current.installation = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow={t("txt_1147")} title={t("txt_1148")} desc={t("docs_install_desc")} />
            
            {/* System Requirements */}
            <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            marginBottom: 32
          }}>
              {[{
              icon: <Cpu size={16} />,
              label: "macOS 13+",
              sub: t("txt_1149")
            }, {
              icon: <Package size={16} />,
              label: "Python 3.10+",
              sub: t("txt_1150")
            }, {
              icon: <Shield size={16} />,
              label: "8 GB RAM",
              sub: t("txt_1151")
            }, {
              icon: <Zap size={16} />,
              label: t("txt_1152"),
              sub: t("txt_1153")
            }].map((item, i) => <div key={i} style={{
              padding: "16px 20px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              gap: 12,
              alignItems: "center"
            }}>
                  <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "rgba(0,229,255,0.08)",
                display: "grid",
                placeItems: "center",
                color: "#00E5FF"
              }}>{item.icon}</div>
                  <div>
                    <div style={{
                  fontWeight: 600,
                  fontSize: 13
                }}>{item.label}</div>
                    <div style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 11.5
                }}>{item.sub}</div>
                  </div>
                </div>)}
            </div>

            {/* The One Command */}
            <div style={{
            padding: 24,
            borderRadius: 16,
            background: "rgba(0,229,255,0.03)",
            border: "1px solid rgba(0,229,255,0.2)",
            marginBottom: 24
          }}>
              <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#00E5FF",
              marginBottom: 8
            }}>{t("txt_1154")}</div>
              <p style={{ color: "#fff", fontSize: 14 }} dangerouslySetInnerHTML={{ __html: t("docs_install_step0") }} />
              <p style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              margin: "8px 0 0",
              lineHeight: 1.5
            }}>{t("txt_1155")}</p>
            </div>

            {/* What install.sh does */}
            <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}>
              {[{
              step: "01",
              title: t("txt_1156"),
              desc: t("txt_1157")
            }, {
              step: "02",
              title: t("txt_1158"),
              desc: t("txt_1159")
            }, {
              step: "03",
              title: t("txt_1160"),
              desc: t("txt_1161")
            }, {
              step: "04",
              title: t("txt_1162"),
              desc: t("txt_1163")
            }, {
              step: "05",
              title: t("txt_1164"),
              desc: t("txt_1165")
            }].map((s, idx) => <div key={idx} style={{
              display: "flex",
              gap: 16,
              padding: "16px 20px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.01)",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
                  <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,122,255,0.1)",
                border: "1px solid rgba(0,122,255,0.2)",
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#00E5FF",
                flexShrink: 0
              }}>{s.step}</div>
                  <div>
                    <div style={{
                  fontSize: 14,
                  fontWeight: 600
                }}>{s.title}</div>
                    <div style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  marginTop: 3
                }}>{s.desc}</div>
                  </div>
                </div>)}
            </div>
          </section>

          {/* 5. Activation & Licensing Section */}
          <section ref={el => sectionsRef.current.activation = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow={t("txt_1166")} title={t("txt_1167")} desc="Кожен екземпляр Atlas AI при запуску перевіряє ліцензійний ключ. Ми прив'язуємо сесію до унікального залізо-ідентифікатора (Mac ID)." />
            
            <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 20,
            marginBottom: 24
          }}>
              <div style={{
              padding: 24,
              borderRadius: 16,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)"
            }}>
                <h4 style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#00E5FF",
                marginBottom: 12
              }}>{t("txt_1168")}</h4>
                <ol style={{
                paddingLeft: 18,
                margin: 0,
                fontSize: 13.5,
                color: "rgba(255,255,255,0.65)",
                display: "flex",
                flexDirection: "column",
                gap: 10
              }}>
                  <li>{t("txt_1169")}</li>
                  <li>{t("txt_1170")}<code style={{
                    fontFamily: "monospace",
                    color: "#FEBC2E"
                  }}>ATLAS-XXXX-...</code>.</li>
                  <li>{t("txt_1171")}</li>
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
          <section ref={el => sectionsRef.current.api = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow="REST API" title={t("txt_1172")} desc="Платформа Atlas AI надає повноцінне API для керування інтелектуальними сесіями, валідацією ліцензій та отриманням потоку думок у реальному часі." />
            
            {/* API Endpoint Grid Layout (Mintlify Style) */}
            <div style={{
            display: "grid",
            gap: 32
          }}>
              
              {/* Endpoint 1 */}
              <div style={{
              gap: 24
            }} className="two-col">
                <div>
                  <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12
                }}>
                    <span style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: "rgba(40,200,64,0.15)",
                    color: "#28C840",
                    fontWeight: 700,
                    fontSize: 11
                  }}>POST</span>
                    <span style={{
                    fontFamily: "monospace",
                    fontSize: 14,
                    fontWeight: 600
                  }}>/api/atlas/validate-key</span>
                  </div>
                  <h4 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 8
                }}>{t("txt_1173")}</h4>
                  <p style={{
                  fontSize: 13.5,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.5
                }}>{t("txt_1174")}</p>
                  <div style={{
                  marginTop: 12,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)"
                }}>
                    <b>{t("txt_1175")}</b>
                    <ul style={{
                    paddingLeft: 16,
                    margin: "6px 0 0"
                  }}>
                      <li><code style={{
                        color: "#00E5FF"
                      }}>key</code>{t("txt_1176")}</li>
                      <li><code style={{
                        color: "#00E5FF"
                      }}>mac_id</code>{t("txt_1177")}</li>
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

              <hr style={{
              border: "none",
              borderBottom: "1px solid rgba(255,255,255,0.05)"
            }} />

              {/* Endpoint 2 */}
              <div style={{
              gap: 24
            }} className="two-col">
                <div>
                  <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12
                }}>
                    <span style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: "rgba(0,122,255,0.15)",
                    color: "#007AFF",
                    fontWeight: 700,
                    fontSize: 11
                  }}>GET</span>
                    <span style={{
                    fontFamily: "monospace",
                    fontSize: 14,
                    fontWeight: 600
                  }}>/api/atlas/thought</span>
                  </div>
                  <h4 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 8
                }}>{t("txt_1178")}</h4>
                  <p style={{
                  fontSize: 13.5,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.5
                }}>{t("txt_1179")}</p>
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
          <section ref={el => sectionsRef.current.roadmap = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow={t("txt_1180")} title={t("txt_1181")} desc="Atlas AI активно розвивається. Попереду багато цікавого!" />
            
            <div style={{
            display: "grid",
            gap: 12
          }}>
              {[{
              version: "v1.0.0-Beta",
              title: t("txt_1182"),
              desc: t("txt_1183"),
              tag: t("txt_1184"),
              color: "#FEBC2E"
            }, {
              version: "v1.1.0",
              title: t("txt_1185"),
              desc: t("txt_1186"),
              tag: t("txt_1187"),
              color: "#007AFF"
            }, {
              version: "v1.2.0",
              title: t("txt_1188"),
              desc: t("txt_1189"),
              tag: "Upcoming",
              color: "#9D4CDD"
            }].map((item, idx) => <div key={idx} style={{
              padding: "20px 24px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.01)",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap"
            }}>
                  <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: item.color,
                background: `${item.color}15`,
                padding: "4px 10px",
                borderRadius: 6
              }}>{item.version}</div>
                  <div style={{
                flex: 1,
                minWidth: 200
              }}>
                    <h4 style={{
                  fontSize: 15,
                  fontWeight: 700,
                  margin: 0
                }}>{item.title}</h4>
                    <p style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  margin: "4px 0 0"
                }}>{item.desc}</p>
                  </div>
                  <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>{item.tag}</span>
                </div>)}
            </div>
          </section>

          {/* 8. Troubleshooting & FAQ */}
          <section ref={el => sectionsRef.current.faq = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow="FAQ" title={t("txt_1190")} desc="Відповіді на найпоширеніші запитання розробників та користувачів." />
            
            <Accordion q="Помилка при встановленні PyAudio на macOS">
              <div>
                <p>{t("txt_1191")}</p>
                <CodeBlock lang="bash" code="brew install portaudio\npip install pyaudio" />
              </div>
            </Accordion>

            <Accordion q="Як працює офлайн розпізнавання Vosk?">
              <div>
                <p>{t("txt_1192")}</p>
              </div>
            </Accordion>

            <Accordion q={t("faq_q6") || "Як налаштувати Telegram бота для віддаленого доступу?"}>
              <div>
                <p>{t("faq_a6")}</p>
              </div>
            </Accordion>
          </section>
          {/* 9. Registration & Cabinet */}
          <section ref={el => sectionsRef.current.cabinet = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow={isEn ? "Account" : "Акаунт"} title={isEn ? "Registration & Personal Cabinet" : "Реєстрація та особистий кабінет"} desc={isEn ? "Manage your Atlas AI instance, connect API keys, and download updates from your dashboard." : "Керуйте своїм інстансом Atlas AI, підключайте API ключі та завантажуйте оновлення з вашого кабінету."} />
            <div style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.65)", lineHeight: 1.75 }}>
                {isEn ? "You can register or log in to your personal cabinet to manage your subscription, generate access tokens, and download the latest build of Atlas AI for macOS." : "Ви можете зареєструватися або увійти до особистого кабінету для керування підпискою, генерації токенів доступу та завантаження останньої версії Atlas AI для macOS."}
              </p>
              <div style={{ marginTop: 16 }}>
                <a href={isEn ? "/en/login" : "/login"} style={{ color: "#00E5FF", textDecoration: "none", fontWeight: 500 }}>
                  {isEn ? "Go to Login / Registration →" : "Перейти до Входу / Реєстрації →"}
                </a>
              </div>
            </div>
          </section>

          {/* 10. AppleScript Integration */}
          <section ref={el => sectionsRef.current.applescript = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow={isEn ? "System Control" : "Управління системою"} title={isEn ? "AppleScript & System Interaction" : "Взаємодія через AppleScript"} desc={isEn ? "Atlas AI uses AppleScript to deeply integrate and interact with native macOS applications securely." : "Atlas AI використовує AppleScript для глибокої інтеграції та безпечної взаємодії з нативними додатками macOS."} />
            <div style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 16 }}>
                {isEn ? "Through AppleScript, Atlas can read your active windows, control playback, fetch notes, and automate routine tasks without requiring kernel extensions. You have complete control over permissions in System Settings > Privacy & Security." : "Завдяки AppleScript, Atlas може читати активні вікна, керувати відтворенням, отримувати нотатки та автоматизувати рутинні завдання без необхідності встановлення розширень ядра. Ви маєте повний контроль над дозволами в розділі Системні параметри > Приватність і безпека."}
              </p>
            </div>
          </section>

          {/* 11. Troubleshooting */}
          <section ref={el => sectionsRef.current.troubleshooting = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow={isEn ? "Help" : "Допомога"} title={isEn ? "Troubleshooting" : "Вирішення проблем"} desc={isEn ? "Steps to take if your local AI or system automations aren't working." : "Кроки, які потрібно зробити, якщо локальний ШІ або системні автоматизації не працюють."} />
            <Accordion q={isEn ? "Atlas cannot control apps or read windows" : "Atlas не може керувати додатками або читати вікна"}>
              <div>
                <p>{isEn ? "Check your privacy settings. The necessary permissions are usually granted automatically via AppleScript prompts, but if something fails, you can verify them:" : "Перевірте налаштування приватності. Необхідні дозволи зазвичай надаються автоматично через запити AppleScript, але якщо щось не працює, ви можете перевірити їх:"}</p>
                <ul style={{ paddingLeft: 20, margin: "10px 0" }}>
                  <li><strong>System Settings {">"} Privacy & Security {">"} Accessibility</strong></li>
                  <li><strong>System Settings {">"} Privacy & Security {">"} Automation</strong></li>
                </ul>
              </div>
            </Accordion>
            <Accordion q={isEn ? "Checking background logs" : "Перевірка фонових логів"}>
              <div>
                <p>{isEn ? "If the agent crashes or does not respond, check the terminal output for the local server:" : "Якщо агент вилітає або не відповідає, перевірте вивід терміналу для локального сервера:"}</p>
                <CodeBlock lang="bash" code="tail -f ~/Library/Logs/AtlasAI/server.log" />
              </div>
            </Accordion>
          </section>

          {/* 12. Community */}
          <section ref={el => sectionsRef.current.community = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }}>
            <SectionTitle eyebrow={isEn ? "Social" : "Соціальні мережі"} title={isEn ? "Community & Telegram Channel" : "Спільнота та Telegram канал"} desc={isEn ? "Join our official Telegram community to ask questions, report bugs, and share custom skills." : "Приєднуйтесь до нашої офіційної спільноти в Telegram, щоб ставити запитання, повідомляти про помилки та ділитися власними навичками."} />
            <div style={{ padding: 24, borderRadius: 16, background: "rgba(0, 122, 255, 0.05)", border: "1px solid rgba(0, 122, 255, 0.15)" }}>
              <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, marginBottom: 16 }}>
                {isEn ? "Our Telegram channel is divided into specific branches to help you find information easily:" : "Наш Telegram канал розділений на спеціальні гілки, щоб вам було легко знаходити потрібну інформацію:"}
              </p>
              <ul style={{ paddingLeft: 20, margin: "10px 0", color: "#fff", lineHeight: 1.8 }}>
                <li><strong>General Lounge</strong> — {isEn ? "General discussions and networking" : "Загальні обговорення та спілкування"}</li>
                <li><strong>Bug Reports</strong> — {isEn ? "Report any issues you encounter" : "Повідомлення про знайдені помилки"}</li>
                <li><strong>Feature Requests</strong> — {isEn ? "Suggest new features for Atlas" : "Пропозиції щодо нового функціоналу"}</li>
                <li><strong>Skills Marketplace</strong> — {isEn ? "Share and find custom automation skills" : "Обмін користувацькими навичками (скілами)"}</li>
                <li><strong>Announcements</strong> — {isEn ? "Official updates from the Atlas team" : "Офіційні новини та оновлення"}</li>
                <li><strong>Start Here</strong> — {isEn ? "Welcome guide for new members" : "Правила та інструкції для новачків"}</li>
              </ul>
              <div style={{ marginTop: 24 }}>
                <a href="https://t.me/atlas_ai_community" target="_blank" rel="noreferrer" style={{ display: "inline-flex", padding: "10px 20px", background: "#00E5FF", color: "#000", fontWeight: 600, borderRadius: 8, textDecoration: "none" }}>
                  {isEn ? "Join Community" : "Приєднатися до спільноти"}
                </a>
              </div>
            </div>
          </section>
          {/* Dynamic Custom Sections from Database (CMS) */}
          {SECTIONS.filter(s => s.isCustom).map(sec => <section key={sec.id} ref={el => sectionsRef.current[sec.id] = el} style={{
          scrollMarginTop: 100,
          marginBottom: 80
        }} className="fade-in">
              <SectionTitle eyebrow={sec.eyebrow} title={sec.label} desc={sec.desc} />
              
              <div style={{
            fontSize: "14.5px",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap"
          }} dangerouslySetInnerHTML={{
            __html: formatMarkdown(sec.content)
          }} />
            </section>)}

          {/* --- Bottom Doc CTA --- */}
          <section style={{
          textAlign: "center",
          padding: "48px 32px",
          borderRadius: 24,
          background: "linear-gradient(135deg, rgba(0,122,255,0.06), rgba(0,229,255,0.02))",
          border: "1px solid rgba(0,122,255,0.15)",
          marginTop: 80
        }}>
            <h3 style={{
            fontSize: 26,
            fontWeight: 700,
            margin: "0 0 8px",
            letterSpacing: "-0.02em"
          }}>{t("txt_1193")}</h3>
            <p style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 14.5,
            marginBottom: 24
          }}>{t("txt_1194")}</p>
            <a href="https://t.me/ATLAS_Support_Hub_bot" target="_blank" rel="noreferrer" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13.5,
            textDecoration: "none"
          }}>
              <ExternalLink size={14} /> Telegram: @ATLAS_Support_Hub_bot
            </a>
          </section>

        </main>
      </div>
    </div>;
}

// Safe URL sanitizer for markdown links to prevent javascript: or other XSS injections
function sanitizeUrl(url) {
  if (!url) return "";
  const cleaned = url.trim();
  // Allow http://, https://, mailto:, tel:, or relative paths (starting with / or ./ or ../)
  if (/^(https?:\/\/|\/|\.\/|\.\.\/|mailto:|tel:)/i.test(cleaned)) {
    return cleaned;
  }
  return "#";
}

// Simple Markdown Formatter for CMS dynamic text content
function formatMarkdown(text) {
  if (!text) return "";

  // Basic HTML Escaping
  let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

  // Format links ([text](url)) with URL sanitization
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    return `<a href="${sanitizeUrl(url)}" target="_blank" rel="noreferrer" style="color: #00E5FF; text-decoration: underline;">${text}</a>`;
  });
  return html;
}