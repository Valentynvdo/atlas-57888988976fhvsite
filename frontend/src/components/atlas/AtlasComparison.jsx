import { useTranslation } from "react-i18next";
import React from "react";
import { Zap, Bot, Brain, Server, Fingerprint, Network } from "lucide-react";
export default function AtlasComparison() {
  const {
    t
  } = useTranslation();
  return <section id="comparison" className="section-container" style={{
    position: "relative",
    perspective: 1000,
    overflow: "hidden"
  }}>
      {/* Background Cinematic Glows */}
      <div style={{
      position: "absolute",
      top: "20%",
      right: "10%",
      width: "600px",
      height: "600px",
      background: "radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 60%)",
      filter: "blur(80px)",
      mixBlendMode: "screen",
      pointerEvents: "none",
      zIndex: 0
    }} className="float" />
      <div style={{
      position: "absolute",
      bottom: "10%",
      left: "5%",
      width: "500px",
      height: "500px",
      background: "radial-gradient(circle, rgba(157,76,221,0.1) 0%, transparent 60%)",
      filter: "blur(80px)",
      mixBlendMode: "screen",
      pointerEvents: "none",
      zIndex: 0,
      animationDelay: "-3s"
    }} className="float" />

      <div style={{
      width: "100%",
      maxWidth: 1000,
      margin: "0 auto",
      position: "relative",
      zIndex: 2
    }}>
        
        {/* Big Statement Header */}
        <div className="reveal" style={{
        textAlign: "center",
        marginBottom: 60
      }}>
          <h2 style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: "#fff",
          margin: 0,
          lineHeight: 1.1
        }}>{t("txt_1056")}</h2>
          <p className="shimmer-text" style={{
          fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
          fontWeight: 500,
          marginTop: 16,
          background: "linear-gradient(90deg, #00E5FF 0%, #9D4CDD 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent"
        }}>{t("txt_1057")}</p>
        </div>

        {/* Hero Numbers */}
        <div className="reveal delay-1" style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "clamp(20px, 4vw, 40px)",
        marginBottom: 100
      }}>
          {[{
          v: t("txt_1058"),
          l: t("txt_1059")
        }, {
          v: "24/7",
          l: t("txt_1060")
        }, {
          v: t("txt_1061"),
          l: t("txt_1062")
        }, {
          v: t("txt_1063"),
          l: t("txt_1064")
        }].map((stat, i) => <div key={i} style={{
          textAlign: "center"
        }}>
              <div style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            fontWeight: 700,
            color: "#fff"
          }}>{stat.v}</div>
              <div style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginTop: 4
          }}>{stat.l}</div>
            </div>)}
        </div>

        {/* Categories Grid */}
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 60
      }}>
          <ComparisonCategory title={t("txt_1065")} icon={<Fingerprint size={24} color="#00E5FF" />} delay="delay-1" normalBullets={[t("txt_1066"), t("txt_1067"), t("txt_1068")]} atlasBullets={[t("txt_1069"), t("txt_1070"), t("txt_1071"), t("txt_1072")]} visualType="radar" />

          <ComparisonCategory title={t("txt_1073")} icon={<Brain size={24} color="#00E5FF" />} delay="delay-2" normalBullets={[t("txt_1074"), t("txt_1075"), t("txt_1076")]} atlasBullets={[t("txt_1077"), t("txt_1078"), t("txt_1079"), t("txt_1080")]} visualType="code" />

          <ComparisonCategory title={t("txt_1081")} icon={<Server size={24} color="#00E5FF" />} delay="delay-3" normalBullets={[t("txt_1082"), t("txt_1083"), t("txt_1084")]} atlasBullets={[t("txt_1085"), t("txt_1086"), t("txt_1087"), t("txt_1088")]} visualType="network" />
        </div>
      </div>
      
      <style>{`
        .comp-cat-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .comp-cat-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .animated-border-box {
          position: relative;
          border-radius: 20px;
          background: rgba(10,10,10,0.8);
          background-clip: padding-box;
          border: 1px solid transparent;
        }
        .animated-border-box::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(145deg, rgba(0,229,255,0.5), rgba(157,76,221,0.2), transparent 50%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        
        .mini-visual {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(0,229,255,0.2);
          display: grid;
          place-items: center;
          position: relative;
          overflow: hidden;
        }
        
        @keyframes radar-spin {
          to { transform: rotate(360deg); }
        }
        .radar-sweep {
          position: absolute;
          width: 50%;
          height: 50%;
          bottom: 50%;
          right: 50%;
          background: linear-gradient(45deg, rgba(0,229,255,1) 0%, transparent 70%);
          transform-origin: bottom right;
          animation: radar-spin 2s linear infinite;
        }
        
        @keyframes code-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        
        @keyframes pulse-node {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </section>;
}
function ComparisonCategory({
  title,
  icon,
  normalBullets,
  atlasBullets,
  delay,
  visualType
}) {
  const { t } = useTranslation();
  return <div className={`reveal ${delay}`} style={{
    display: "flex",
    flexDirection: "column",
    gap: 16
  }}>
      <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 8
    }}>
        {icon}
        <h3 style={{
        margin: 0,
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "#fff"
      }}>{title}</h3>
      </div>
      
      <div className="comp-cat-grid">
        {/* Left: Normal AI (Dim, boring) */}
        <div style={{
        padding: "24px",
        background: "rgba(15,15,15,0.4)",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.03)",
        display: "flex",
        flexDirection: "column"
      }}>
          <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "rgba(255,255,255,0.3)",
          fontWeight: 600,
          marginBottom: 20,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.1em"
        }}>
            <Bot size={14} />{t("txt_1089")}</div>
          <ul style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
            {normalBullets.map((b, i) => <li key={i} style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.9rem",
            display: "flex",
            gap: 12,
            alignItems: "flex-start"
          }}>
                <span style={{
              color: "rgba(255,255,255,0.1)",
              marginTop: 2
            }}>—</span>
                {b}
              </li>)}
          </ul>
        </div>
        
        {/* Right: ATLAS (Premium, glowing) */}
        <div className="animated-border-box" style={{
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(20px)"
      }}>
          {/* Inner subtle glow */}
          <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, rgba(0,229,255,0.05) 0%, transparent 100%)",
          pointerEvents: "none"
        }} />
          
          <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          position: "relative",
          zIndex: 1
        }}>
            <div>
              <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#00E5FF",
              fontWeight: 700,
              marginBottom: 20,
              textTransform: "uppercase",
              fontSize: "0.8rem",
              letterSpacing: "0.1em"
            }}>
                <Zap size={14} fill="#00E5FF" />{t("txt_1090")}</div>
              
              <ul style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}>
                {atlasBullets.map((b, i) => <li key={i} style={{
                color: "#fff",
                fontSize: "1rem",
                fontWeight: 500,
                display: "flex",
                gap: 12,
                alignItems: "center"
              }}>
                    <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#00E5FF",
                  boxShadow: "0 0 8px #00E5FF"
                }} />
                    {b}
                  </li>)}
              </ul>
            </div>
            
            {/* Mini Visual Widget */}
            <div className="mini-visual">
              {visualType === "radar" && <>
                  <div style={{
                width: "100%",
                height: "100%",
                border: "1px solid rgba(0,229,255,0.2)",
                borderRadius: "50%",
                position: "absolute"
              }} />
                  <div style={{
                width: "50%",
                height: "50%",
                border: "1px solid rgba(0,229,255,0.3)",
                borderRadius: "50%",
                position: "absolute"
              }} />
                  <div className="radar-sweep" />
                  <div style={{
                width: 4,
                height: 4,
                background: "#fff",
                borderRadius: "50%",
                position: "absolute",
                top: "30%",
                left: "60%",
                boxShadow: "0 0 5px #fff",
                animation: "pulse-node 2s infinite"
              }} />
                </>}
              {visualType === "code" && <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              width: "100%",
              padding: 8,
              overflow: "hidden"
            }}>
                  <div style={{
                animation: "code-scroll 4s linear infinite",
                display: "flex",
                flexDirection: "column",
                gap: 4
              }}>
                    <div style={{
                  height: 3,
                  width: "80%",
                  background: "rgba(0,229,255,0.5)",
                  borderRadius: 2
                }} />
                    <div style={{
                  height: 3,
                  width: "60%",
                  background: "rgba(157,76,221,0.5)",
                  borderRadius: 2
                }} />
                    <div style={{
                  height: 3,
                  width: "90%",
                  background: "rgba(0,229,255,0.3)",
                  borderRadius: 2
                }} />
                    <div style={{
                  height: 3,
                  width: "40%",
                  background: "rgba(0,229,255,0.8)",
                  borderRadius: 2
                }} />
                    <div style={{
                  height: 3,
                  width: "70%",
                  background: "rgba(157,76,221,0.4)",
                  borderRadius: 2
                }} />
                    {/* Duplicate for seamless scroll */}
                    <div style={{
                  height: 3,
                  width: "80%",
                  background: "rgba(0,229,255,0.5)",
                  borderRadius: 2
                }} />
                    <div style={{
                  height: 3,
                  width: "60%",
                  background: "rgba(157,76,221,0.5)",
                  borderRadius: 2
                }} />
                    <div style={{
                  height: 3,
                  width: "90%",
                  background: "rgba(0,229,255,0.3)",
                  borderRadius: 2
                }} />
                  </div>
                </div>}
              {visualType === "network" && <div style={{
              position: "relative",
              width: "100%",
              height: "100%"
            }}>
                  <Network size={20} color="rgba(0,229,255,0.4)" style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }} />
                  <div style={{
                position: "absolute",
                top: "20%",
                left: "20%",
                width: 6,
                height: 6,
                background: "#00E5FF",
                borderRadius: "50%",
                animation: "pulse-node 1.5s infinite 0.2s"
              }} />
                  <div style={{
                position: "absolute",
                top: "70%",
                left: "30%",
                width: 4,
                height: 4,
                background: "#9D4CDD",
                borderRadius: "50%",
                animation: "pulse-node 2s infinite 0.5s"
              }} />
                  <div style={{
                position: "absolute",
                top: "40%",
                left: "80%",
                width: 5,
                height: 5,
                background: "#00E5FF",
                borderRadius: "50%",
                animation: "pulse-node 1.8s infinite 0.8s"
              }} />
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
}