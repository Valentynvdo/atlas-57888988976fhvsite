import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { Cpu, Zap, Brain, Search, FileText, Eye, Smile, Heart, Camera, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
export default function SmartConcierge() {
  const {
    t
  } = useTranslation();
  const items = [{
    icon: <Cpu size={26} />,
    title: t("txt_1018"),
    label: "active_app_applescript_helper.py",
    desc: t("txt_1019"),
    grad: "linear-gradient(135deg, #00E5FF, #007AFF)",
    glow: "rgba(0,229,255,0.35)",
    status: "active"
  }, {
    icon: <Zap size={26} />,
    title: t("txt_1020"),
    label: "evolution.py · plan.md",
    desc: t("txt_1021"),
    grad: "linear-gradient(135deg, #FF6B6B, #FF9A3C)",
    glow: "rgba(255,107,107,0.3)",
    status: "active"
  }, {
    icon: <Brain size={26} />,
    title: t("txt_1022"),
    label: "semantic_memory.py",
    desc: t("txt_1023"),
    grad: "linear-gradient(135deg, #9D4CDD, #007AFF)",
    glow: "rgba(157,76,221,0.35)",
    status: "active"
  }, {
    icon: <Search size={26} />,
    title: t("txt_1024"),
    label: "autonomous_researcher.py",
    desc: t("txt_1025"),
    grad: "linear-gradient(135deg, #00E5FF, #9D4CDD)",
    glow: "rgba(0,229,255,0.3)",
    status: "active"
  }, {
    icon: <FileText size={26} />,
    title: t("txt_1026"),
    label: "apple_notes_connector.py · contacts_connector.py",
    desc: t("txt_1027"),
    grad: "linear-gradient(135deg, #FFD56B, #FF6B6B)",
    glow: "rgba(255,213,107,0.3)",
    status: "active"
  }, {
    icon: <Eye size={26} />,
    title: t("txt_1028"),
    label: "proactive_watcher.py",
    desc: t("txt_1029"),
    grad: "linear-gradient(135deg, #007AFF, #00E5FF)",
    glow: "rgba(0,122,255,0.35)",
    status: "active"
  }, {
    icon: <Smile size={26} />,
    title: t("txt_1030"),
    label: "emotion_recognition.py · sarcasm_detector.py",
    desc: t("txt_1031"),
    grad: "linear-gradient(135deg, #FF9A3C, #9D4CDD)",
    glow: "rgba(255,154,60,0.3)",
    status: "soon"
  }, {
    icon: <Heart size={26} />,
    title: t("txt_1032"),
    label: "eye_strain_reminder.py · sleep_advisor.py",
    desc: t("txt_1033"),
    grad: "linear-gradient(135deg, #FF6B6B, #00E5FF)",
    glow: "rgba(255,107,107,0.3)",
    status: "soon"
  }, {
    icon: <Camera size={26} />,
    title: t("txt_1034"),
    label: "vision_handler.py",
    desc: t("txt_1035"),
    grad: "linear-gradient(135deg, #9D4CDD, #FF6B6B)",
    glow: "rgba(157,76,221,0.3)",
    status: "active"
  }, {
    icon: <ShieldAlert size={26} />,
    title: t("txt_1036"),
    label: "privacy_guard.py · security_manager.py",
    desc: t("txt_1037"),
    grad: "linear-gradient(135deg, #00E5FF, #FFD56B)",
    glow: "rgba(0,229,255,0.3)",
    status: "active"
  }];
  const gridRef = useRef(null);

  return <section id="concierge" data-testid="concierge-section" className="section-container" style={{
    position: "relative"
  }}>
      <div className="reveal" style={{
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 24,
      flexWrap: "wrap",
      marginBottom: 56
    }}>
        <div style={{
        maxWidth: 640
      }}>
          <div className="section-eyebrow">{t("txt_1038")}</div>
          <h2 data-testid="concierge-title" style={{
          marginTop: 16,
          fontSize: "clamp(2rem, 4.6vw, 4rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          fontWeight: 600
        }}>
            <span className="gradient-text">{t("txt_1039")}</span>
            <br />
            <span style={{
            background: "linear-gradient(120deg, #00E5FF, #9D4CDD)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent"
          }}>{t("txt_1040")}</span>
          </h2>
          <p style={{
          marginTop: 20,
          color: "rgba(255,255,255,0.65)",
          fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
          lineHeight: 1.6,
          maxWidth: 560
        }}>{t("txt_1041")}</p>
        </div>
      </div>

      <div ref={gridRef} className="bento-grid">
        {items.map((item, i) => {
          // Make the first card span 2 rows/cols for bento effect on desktop
          const isLarge = i === 0;
          return (
          <article key={item.title} data-card data-testid={`concierge-card-${i}`} className={`bento-card ${isLarge ? 'bento-col-2 bento-row-2' : ''}`} style={{
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: item.grad,
          filter: "blur(60px)",
          opacity: 0.35,
          pointerEvents: "none"
        }} />

            <div className="concierge-icon" style={{
          width: 60,
          height: 60,
          borderRadius: 18,
          display: "grid",
          placeItems: "center",
          background: item.grad,
          color: "#fff",
          boxShadow: `0 12px 32px ${item.glow}`,
          position: "relative",
          zIndex: 1
        }}>
              {item.icon}
            </div>

            <div style={{
          marginTop: 24,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          fontWeight: 600
        }}>
              {item.label}
            </div>
            <h3 className="concierge-card-title" style={{
          marginTop: 8,
          fontSize: isLarge ? 28 : 22,
          fontWeight: 600,
          letterSpacing: "-0.02em"
        }}>
              {item.title}
            </h3>
            <p className="concierge-card-desc" style={{
          marginTop: 12,
          fontSize: isLarge ? 16 : 14,
          color: "rgba(255,255,255,0.65)",
          lineHeight: 1.6,
          flex: 1
        }}>
              {item.desc}
            </p>

            <div style={{
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: item.status === "active" ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)",
          fontWeight: 500
        }}>
              <span style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: item.status === "active" ? "#00E676" : "#00E5FF",
            boxShadow: item.status === "active" ? "0 0 10px #00E676" : "0 0 10px #00E5FF"
          }} />
              {item.status === "active" ? t("txt_1042") : t("txt_1043")}
            </div>
          </article>
        )})}
      </div>
    </section>;
}