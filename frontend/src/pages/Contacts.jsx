import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import { ArrowLeft, Mail, MessageSquare, Globe, Navigation, Send } from "lucide-react";
export default function Contacts() {
  const {
    t
  } = useTranslation();
  const navigate = useLocalizedNavigate();
  return <div style={{
    minHeight: "100vh",
    background: "radial-gradient(800px 500px at 50% 0%, rgba(0,229,255,0.1), transparent 60%), #000",
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
        <span style={{ fontSize: 14 }}>←</span> {t("txt_1230").replace("← ", "")}</button>

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
          background: "rgba(0,229,255,0.12)",
          display: "grid",
          placeItems: "center",
          color: "#00E5FF"
        }}>
            <Mail size={22} />
          </div>
          <div>
            <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.02em"
          }}>{t("txt_1231")}</h1>
            <span style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.4)"
          }}>{t("txt_1232")}</span>
          </div>
        </div>

        <p style={{
        color: "rgba(255,255,255,0.7)",
        lineHeight: 1.7,
        fontSize: 15,
        marginBottom: 36
      }}>{t("txt_1233")}</p>

        <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20,
        marginBottom: 40
      }}>
          {[{
          icon: <MessageSquare size={20} />,
          label: t("txt_1234"),
          value: "@ATLAS_Support_Hub_bot",
          href: "https://t.me/ATLAS_Support_Hub_bot"
        }, {
          icon: <Mail size={20} />,
          label: t("txt_1235"),
          value: "support@atlas-assistant.online",
          href: "mailto:support@atlas-assistant.online"
        }, {
          icon: <Navigation size={20} />,
          label: t("txt_1236"),
          value: t("txt_1237"),
          href: "#"
        }].map((item, i) => <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : "_self"} rel="noreferrer" style={{
          textDecoration: "none",
          color: "#fff",
          padding: "24px 0",
          background: "transparent",
          border: "none",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          transition: "all 0.3s ease"
        }} onMouseEnter={e => {
          e.currentTarget.style.transform = "translateX(8px)";
          e.currentTarget.style.borderBottomColor = "rgba(0,229,255,0.6)";
          e.currentTarget.style.background = "transparent";
        }} onMouseLeave={e => {
          e.currentTarget.style.transform = "translateX(0)";
          e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.background = "transparent";
        }}>
              <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "rgba(0,229,255,0.08)",
            display: "grid",
            placeItems: "center",
            color: "#00E5FF"
          }}>
                {item.icon}
              </div>
              <div>
                <div style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 12,
              marginBottom: 2
            }}>{item.label}</div>
                <div style={{
              fontWeight: 600,
              fontSize: 15,
              color: "#fff"
            }}>{item.value}</div>
              </div>
            </a>)}
        </div>

        <h2 style={{
        fontSize: 18,
        fontWeight: 600,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: 8,
        marginTop: 24,
        marginBottom: 20
      }}>{t("txt_1238")}</h2>

        <form onSubmit={e => {
        e.preventDefault();
        alert(t("txt_1239"));
        e.target.reset();
      }} style={{
        display: "grid",
        gap: 16
      }}>
          <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16
        }}>
            <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 8
          }}>
              <label style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.5)"
            }}>{t("txt_1240")}</label>
              <input type="text" required placeholder={t("txt_1241")} style={{
              padding: "12px 16px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              outline: "none",
              fontSize: 14
            }} />
            </div>
            <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 8
          }}>
              <label style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.5)"
            }}>Email</label>
              <input type="email" required placeholder="name@domain.com" style={{
              padding: "12px 16px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              outline: "none",
              fontSize: 14
            }} />
            </div>
          </div>

          <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 8
        }}>
            <label style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.5)"
          }}>{t("txt_1242")}</label>
            <textarea required rows={4} placeholder={t("txt_1243")} style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            outline: "none",
            fontSize: 14,
            resize: "vertical"
          }} />
          </div>

          <button type="submit" className="cta-btn" style={{
          justifyContent: "center",
          marginTop: 8,
          padding: "12px 24px",
          fontSize: 14
        }}>{t("txt_1244")}<Send size={15} />
          </button>
        </form>
      </div>
    </div>;
}