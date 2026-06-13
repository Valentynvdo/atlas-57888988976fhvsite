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
    grad: "linear-gradient(135deg, #22D3EE, #6D5DF6)",
    glow: "rgba(34,211,238,0.35)",
    status: "active"
  }, {
    icon: <Zap size={26} />,
    title: t("txt_1020"),
    label: "evolution.py · plan.md",
    desc: t("txt_1021"),
    grad: "linear-gradient(135deg, #F472B6, #A78BFA)",
    glow: "rgba(244,114,182,0.3)",
    status: "active"
  }, {
    icon: <Brain size={26} />,
    title: t("txt_1022"),
    label: "semantic_memory.py",
    desc: t("txt_1023"),
    grad: "linear-gradient(135deg, #7C3AED, #6D5DF6)",
    glow: "rgba(124,58,237,0.35)",
    status: "active"
  }, {
    icon: <Search size={26} />,
    title: t("txt_1024"),
    label: "autonomous_researcher.py",
    desc: t("txt_1025"),
    grad: "linear-gradient(135deg, #22D3EE, #7C3AED)",
    glow: "rgba(34,211,238,0.3)",
    status: "active"
  }, {
    icon: <FileText size={26} />,
    title: t("txt_1026"),
    label: "apple_notes_connector.py · contacts_connector.py",
    desc: t("txt_1027"),
    grad: "linear-gradient(135deg, #67E8F9, #F472B6)",
    glow: "rgba(103,232,249,0.3)",
    status: "active"
  }, {
    icon: <Eye size={26} />,
    title: t("txt_1028"),
    label: "proactive_watcher.py",
    desc: t("txt_1029"),
    grad: "linear-gradient(135deg, #6D5DF6, #22D3EE)",
    glow: "rgba(109,93,246,0.35)",
    status: "active"
  }, {
    icon: <Smile size={26} />,
    title: t("txt_1030"),
    label: "emotion_recognition.py · sarcasm_detector.py",
    desc: t("txt_1031"),
    grad: "linear-gradient(135deg, #A78BFA, #7C3AED)",
    glow: "rgba(167,139,250,0.3)",
    status: "soon"
  }, {
    icon: <Heart size={26} />,
    title: t("txt_1032"),
    label: "eye_strain_reminder.py · sleep_advisor.py",
    desc: t("txt_1033"),
    grad: "linear-gradient(135deg, #F472B6, #22D3EE)",
    glow: "rgba(244,114,182,0.3)",
    status: "soon"
  }, {
    icon: <Camera size={26} />,
    title: t("txt_1034"),
    label: "vision_handler.py",
    desc: t("txt_1035"),
    grad: "linear-gradient(135deg, #7C3AED, #F472B6)",
    glow: "rgba(124,58,237,0.3)",
    status: "active"
  }, {
    icon: <ShieldAlert size={26} />,
    title: t("txt_1036"),
    label: "privacy_guard.py · security_manager.py",
    desc: t("txt_1037"),
    grad: "linear-gradient(135deg, #22D3EE, #67E8F9)",
    glow: "rgba(34,211,238,0.3)",
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
            background: "linear-gradient(120deg, #22D3EE, #7C3AED)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent"
          }}>{t("txt_1040")}</span>
          </h2>
          <p style={{
          marginTop: 20,
          color: "rgba(0, 0, 0,0.65)",
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
          <article key={i} data-card data-testid={`concierge-card-${i}`} className={`group ${isLarge ? 'bento-col-2 bento-row-2' : ''}`} style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            padding: "40px 32px",
            borderRadius: 32,
            background: "radial-gradient(140% 100% at 50% 0%, rgba(0, 0, 0,0.03) 0%, transparent 100%)",
            borderTop: "1px solid rgba(0, 0, 0,0.05)",
            boxShadow: "inset 0 1px 0 rgba(0, 0, 0,0.02)",
            transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}>
            {/* Top ambient glow */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${item.glow}55, transparent)`,
              opacity: 0.5
            }} />

            <div className="concierge-icon" style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          display: "grid",
          placeItems: "center",
          background: `linear-gradient(135deg, ${item.glow}22, ${item.glow}05)`,
          border: `1px solid ${item.glow}33`,
          marginBottom: 24,
          color: "#1d1d1f",
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
          color: "rgba(0, 0, 0,0.5)",
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
          color: "rgba(0, 0, 0,0.65)",
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
          color: item.status === "active" ? "rgba(0, 0, 0,0.95)" : "rgba(0, 0, 0,0.65)",
          fontWeight: 500
        }}>
              <span style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: item.status === "active" ? "#00E676" : "#22D3EE",
            boxShadow: item.status === "active" ? "0 0 10px #00E676" : "0 0 10px #22D3EE"
          }} />
              {item.status === "active" ? t("txt_1042") : t("txt_1043")}
            </div>
          </article>
        )})}
      </div>
    </section>;
}