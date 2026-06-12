import { useTranslation } from "react-i18next";
import { Command, AppWindow, ShieldCheck, Mic, Trash2, Camera } from "lucide-react";
export default function MacOSControl() {
  const {
    t
  } = useTranslation();
  
  const cards = [{
    icon: <Command size={24} />,
    accent: "#6D5DF6",
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
    accent: "#7C3AED",
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
    accent: "#22D3EE",
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
        {cards.map((c, i) => <article key={i} data-testid={`macos-card-${i}`} className={`group reveal delay-${i + 1}`} style={{
            position: "relative",
            minHeight: 380,
            display: "flex",
            flexDirection: "column",
            padding: "40px 32px",
            borderRadius: 32,
            background: "radial-gradient(140% 100% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 100%)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
            transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}>
            {/* Top ambient glow */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${c.accent}55, transparent)`,
              opacity: 0.5
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
          borderRadius: 14,
          display: "grid",
          placeItems: "center",
          background: `linear-gradient(135deg, ${c.accent}22, ${c.accent}05)`,
          border: `1px solid ${c.accent}33`,
          color: c.accent,
          marginBottom: 24,
          position: "relative",
          zIndex: 1
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
        
        {/* PRIVACY HIGHLIGHT BLOCK (Full width) */}
        <article data-testid={`macos-privacy-card`} className={`group reveal delay-4 bento-col-3`} style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "40px 32px",
            borderRadius: 32,
            background: "radial-gradient(100% 100% at 50% 0%, rgba(34,211,238,0.05) 0%, transparent 100%)",
            borderTop: "1px solid rgba(34,211,238,0.2)",
            border: "1px solid rgba(34,211,238,0.1)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
            transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
            marginTop: 8
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: 1,
              background: `linear-gradient(90deg, transparent, #22D3EE, transparent)`,
              opacity: 0.8
            }} />
            
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                background: `linear-gradient(135deg, rgba(34,211,238,0.15), rgba(34,211,238,0.05))`,
                border: `1px solid rgba(34,211,238,0.3)`,
                color: "#22D3EE",
                flexShrink: 0
              }}>
                <ShieldCheck size={28} />
              </div>
              
              <div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(34,211,238,0.1)",
                  border: "1px solid rgba(34,211,238,0.2)",
                  fontSize: 11,
                  color: "#22D3EE",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                  marginBottom: 12
                }}>
                  {t("macos_privacy_badge")}
                </div>
                
                <h3 style={{
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  marginBottom: 12,
                  color: "#fff"
                }}>
                  {t("macos_privacy_title")}
                </h3>
                
                <p style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.6,
                  marginBottom: 16,
                  fontWeight: 400
                }} dangerouslySetInnerHTML={{ __html: t("macos_privacy_p1") }} />
                
                <p style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.6
                }}>
                  {t("macos_privacy_p2")}
                </p>
              </div>
            </div>
          </article>

      </div>
    </section>;
}