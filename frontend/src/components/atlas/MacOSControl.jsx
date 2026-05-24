import { useTranslation } from "react-i18next";
import { Command, AppWindow, ShieldCheck, Mic, Trash2, Camera } from "lucide-react";
export default function MacOSControl() {
  const {
    t
  } = useTranslation();
  
  const cards = [{
    icon: <Command size={24} />,
    accent: "#007AFF",
    title: t("txt_1001"),
    headline: t("txt_1002"),
    desc: t("txt_1003"),
    extras: [{
      icon: <Mic size={14} />,
      label: t("txt_1004")
    }, {
      icon: <Command size={14} />,
      label: t("txt_1005")
    }]
  }, {
    icon: <AppWindow size={24} />,
    accent: "#9D4CDD",
    title: t("txt_1006"),
    headline: t("txt_1007"),
    desc: t("txt_1008"),
    extras: [{
      icon: <AppWindow size={14} />,
      label: "Multi-app"
    }, {
      icon: <Command size={14} />,
      label: "Workflow"
    }]
  }, {
    icon: <ShieldCheck size={24} />,
    accent: "#00E5FF",
    title: t("txt_1009"),
    headline: t("txt_1010"),
    desc: t("txt_1011"),
    extras: [{
      icon: <Camera size={14} />,
      label: t("txt_1012")
    }, {
      icon: <Trash2 size={14} />,
      label: t("txt_1013")
    }]
  }];
  return <section id="macos" data-testid="macos-section" className="section-container" style={{
    position: "relative"
  }}>
      <div className="reveal" style={{
      textAlign: "center",
      maxWidth: 760,
      margin: "0 auto"
    }}>
        <div className="section-eyebrow">{t("txt_1014")}</div>
        <h2 data-testid="macos-title" style={{
        marginTop: 16,
        fontSize: "clamp(2rem, 4.6vw, 4rem)",
        lineHeight: 1.05,
        letterSpacing: "-0.03em",
        fontWeight: 600
      }}>
          <span className="gradient-text">{t("txt_1015")}</span>
          <br />
          <span style={{
          color: "rgba(255,255,255,0.55)",
          fontWeight: 500
        }}>{t("txt_1016")}</span>
        </h2>
        <p style={{
        marginTop: 20,
        color: "rgba(255,255,255,0.65)",
        fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
        lineHeight: 1.6
      }}>{t("txt_1017")}</p>
      </div>

      <div className="bento-grid" style={{ marginTop: 64 }}>
        {cards.map((c, i) => <article key={i} data-testid={`macos-card-${i}`} className={`bento-card reveal delay-${i + 1}`} style={{
        position: "relative",
        overflow: "hidden",
        minHeight: 380,
        display: "flex",
        flexDirection: "column"
      }}>
            {/* Accent corner glow */}
            <div style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c.accent}33, transparent 70%)`,
          filter: "blur(20px)",
          pointerEvents: "none"
        }} />

            {/* Mac window mockup top */}
            <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28
        }}>
              <span className="mac-dots">
                <span />
                <span />
                <span />
              </span>
              <span style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}>
                Atlas · macOS
              </span>
            </div>

            {/* Icon */}
            <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          display: "grid",
          placeItems: "center",
          background: `linear-gradient(135deg, ${c.accent}33, ${c.accent}11)`,
          border: `1px solid ${c.accent}55`,
          color: c.accent,
          boxShadow: `0 0 32px ${c.accent}33`,
          marginBottom: 24
        }}>
              {c.icon}
            </div>

            <h3 style={{
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          marginBottom: 12
        }}>
              {c.title}
            </h3>
            <p style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.9)",
          lineHeight: 1.5,
          marginBottom: 12,
          fontWeight: 500
        }}>
              {c.headline}
            </p>
            <p style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.6,
          flex: 1
        }}>
              {c.desc}
            </p>

            {/* Tags */}
            <div style={{
          display: "flex",
          gap: 8,
          marginTop: 20,
          flexWrap: "wrap"
        }}>
              {c.extras.map((e, j) => <span key={j} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: 12,
            color: "rgba(255,255,255,0.7)"
          }}>
                  {e.icon}
                  {e.label}
                </span>)}
            </div>
          </article>)}
      </div>
    </section>;
}