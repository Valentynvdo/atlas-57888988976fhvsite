import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import { ArrowLeft, Scale, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";
export default function Terms() {
  const {
    t
  } = useTranslation();
  const navigate = useLocalizedNavigate();
  return <div style={{
    minHeight: "100vh",
    background: "radial-gradient(800px 500px at 50% 0%, rgba(157,76,221,0.12), transparent 60%), #000",
    color: "#fff",
    padding: "80px 24px 60px",
    fontFamily: "Inter, sans-serif"
  }}>
      <button onClick={() => navigate("/")} style={{
      position: "absolute",
      top: 28,
      left: 28,
      background: "transparent",
      border: "none",
      color: "rgba(255,255,255,0.6)",
      padding: "10px 0",
      fontSize: 14,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      zIndex: 10,
      transition: "all 0.2s ease"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = "#fff";
      e.currentTarget.style.transform = "translateX(-4px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
      e.currentTarget.style.transform = "none";
    }}>
        <span style={{ fontSize: 14 }}>←</span> {t("txt_1213").replace("← ", "")}</button>

      <div style={{
      maxWidth: "100%",
      width: "100%",
      margin: "0 auto",
      padding: "40px 5%",
      background: "transparent"
    }}>
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24
      }}>
          <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "rgba(157,76,221,0.15)",
          display: "grid",
          placeItems: "center",
          color: "#9D4CDD"
        }}>
            <Scale size={22} />
          </div>
          <div>
            <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.02em"
          }}>{t("txt_1214")}</h1>
            <span style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.4)"
          }}>{t("txt_1215")}{new Date().toLocaleDateString("uk-UA")}</span>
          </div>
        </div>

        <p style={{
        color: "rgba(255,255,255,0.7)",
        lineHeight: 1.7,
        fontSize: 15,
        marginBottom: 32
      }}>{t("txt_1216")}</p>

        <h2 style={{
        fontSize: 18,
        fontWeight: 600,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: 8,
        marginTop: 24,
        marginBottom: 12
      }}>{t("txt_1217")}</h2>
        <div style={{
        display: "grid",
        gap: 16,
        marginBottom: 24
      }}>
          {[{
          icon: <CheckCircle size={18} />,
          title: t("txt_1218"),
          desc: t("txt_1219")
        }, {
          icon: <AlertTriangle size={18} />,
          title: t("txt_1220"),
          desc: t("txt_1221")
        }, {
          icon: <HelpCircle size={18} />,
          title: t("txt_1222"),
          desc: t("txt_1223")
        }].map((item, i) => <div key={i} style={{
          display: "flex",
          gap: 14,
          background: "transparent",
          padding: "16px 0",
          border: "none"
        }}>
              <div style={{
            color: "#9D4CDD",
            flexShrink: 0,
            marginTop: 2
          }}>{item.icon}</div>
              <div>
                <div style={{
              fontWeight: 600,
              fontSize: 14,
              marginBottom: 4
            }}>{item.title}</div>
                <div style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 13,
              lineHeight: 1.6
            }}>{item.desc}</div>
              </div>
            </div>)}
        </div>

        <h2 style={{
        fontSize: 18,
        fontWeight: 600,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: 8,
        marginTop: 24,
        marginBottom: 12
      }}>{t("txt_1224")}</h2>
        <p style={{
        color: "rgba(255,255,255,0.65)",
        lineHeight: 1.7,
        fontSize: 14,
        marginBottom: 16
      }}>{t("txt_1225")}</p>

        <h2 style={{
        fontSize: 18,
        fontWeight: 600,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: 8,
        marginTop: 24,
        marginBottom: 12
      }}>{t("txt_1226")}</h2>
        <p style={{
        color: "rgba(255,255,255,0.65)",
        lineHeight: 1.7,
        fontSize: 14,
        marginBottom: 16
      }}>{t("txt_1227")}</p>

        <h2 style={{
        fontSize: 18,
        fontWeight: 600,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: 8,
        marginTop: 24,
        marginBottom: 12
      }}>{t("txt_1228")}</h2>
        <p style={{
        color: "rgba(255,255,255,0.65)",
        lineHeight: 1.7,
        fontSize: 14,
        marginBottom: 16
      }}>{t("txt_1229")}</p>
      </div>
    </div>;
}