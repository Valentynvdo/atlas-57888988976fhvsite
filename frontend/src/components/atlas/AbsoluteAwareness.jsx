import { useTranslation } from "react-i18next";
import { ScanFace, MapPin, Users, Heart } from "lucide-react";
export default function AbsoluteAwareness() {
  const {
    t
  } = useTranslation();
  return <section id="awareness" data-testid="awareness-section" className="section-container" style={{
    position: "relative"
  }}>
      <div className="two-col">
        {/* Biometric visual */}
        <div className="reveal" style={{
        position: "relative",
        aspectRatio: "1 / 1",
        maxWidth: 560,
        width: "100%",
        justifySelf: "center",
        order: 2
      }} data-testid="awareness-visual">
          <FaceIDOrb />
        </div>

        {/* Text */}
        <div className="reveal delay-1" style={{
        order: 1
      }}>
          <div className="section-eyebrow">{t("txt_1044")}</div>
          <h2 data-testid="awareness-title" style={{
          marginTop: 16,
          fontSize: "clamp(2rem, 4.6vw, 4rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          fontWeight: 600,
          maxWidth: 540
        }}>
            <span className="gradient-text">{t("txt_1045")}</span>
            <br />
            <span style={{
            background: "linear-gradient(120deg, #9D4CDD, #00E5FF)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent"
          }}>{t("txt_1046")}</span>
          </h2>
          <p style={{
          marginTop: 24,
          color: "rgba(255,255,255,0.7)",
          fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
          lineHeight: 1.7,
          maxWidth: 520
        }}>{t("txt_1047")}</p>

          <div style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          maxWidth: 520
        }}>
            {[{
            icon: <ScanFace size={20} color="#00E5FF" />,
            title: t("txt_1048"),
            value: "Face & Voice"
          }, {
            icon: <MapPin size={20} color="#007AFF" />,
            title: t("txt_1049"),
            value: t("txt_1050")
          }, {
            icon: <Users size={20} color="#9D4CDD" />,
            title: t("txt_1051"),
            value: t("txt_1052")
          }, {
            icon: <Heart size={20} color="#FF6B9A" />,
            title: t("txt_1053"),
            value: t("txt_1054")
          }].map((m, i) => <div key={i} className="glass" data-testid={`awareness-stat-${i}`} style={{
            borderRadius: 18,
            padding: 16
          }}>
                <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(255,255,255,0.08)",
              marginBottom: 10
            }}>
                  {m.icon}
                </div>
                <div style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 600
            }}>
                  {m.title}
                </div>
                <div style={{
              marginTop: 4,
              fontSize: 15,
              fontWeight: 600
            }}>
                  {m.value}
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
}
function FaceIDOrb() {
  const { t } = useTranslation();
  return <div className="glass" style={{
    position: "absolute",
    inset: 0,
    borderRadius: 32,
    padding: 0,
    overflow: "hidden"
  }}>
      {/* Ambient glow */}
      <div style={{
      position: "absolute",
      inset: -40,
      background: "radial-gradient(circle at 50% 50%, rgba(157,76,221,0.25), transparent 60%)",
      filter: "blur(20px)"
    }} />

      {/* Center orb */}
      <div style={{
      position: "absolute",
      inset: "12% 12%",
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 30%, #2a2a3a 0%, #0a0a14 60%, #050510 100%)",
      boxShadow: "inset 0 0 80px rgba(0,229,255,0.12), 0 0 80px rgba(157,76,221,0.2)"
    }} />

      {/* Concentric rings */}
      <svg viewBox="0 0 100 100" style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%"
    }}>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#9D4CDD" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="dotGrad">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Animated rings */}
        {[20, 28, 36, 44].map((r, i) => <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="0.25" strokeDasharray="2 3" opacity={0.7 - i * 0.12}>
            <animateTransform attributeName="transform" type="rotate" from={`0 50 50`} to={`${i % 2 === 0 ? 360 : -360} 50 50`} dur={`${20 + i * 5}s`} repeatCount="indefinite" />
          </circle>)}

        {/* Face dot pattern */}
        {Array.from({
        length: 60
      }).map((_, i) => {
        const angle = i / 60 * Math.PI * 2;
        const radius = 16 + i % 3 * 2;
        const cx = 50 + Math.cos(angle) * radius;
        const cy = 50 + Math.sin(angle) * radius;
        return <circle key={i} cx={cx} cy={cy} r="0.6" fill="#00E5FF" opacity="0.7">
              <animate attributeName="opacity" values="0.2;1;0.2" dur={`${2 + i % 4}s`} repeatCount="indefinite" begin={`${i * 0.05}s`} />
            </circle>;
      })}

        {/* Center FaceID icon */}
        <g transform="translate(50,50)">
          {/* eyes */}
          <circle cx="-6" cy="-3" r="1.4" fill="#fff" opacity="0.9" />
          <circle cx="6" cy="-3" r="1.4" fill="#fff" opacity="0.9" />
          {/* mouth */}
          <path d="M -5 5 Q 0 8 5 5" stroke="#fff" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.85" />
          {/* face frame */}
          <rect x="-12" y="-12" width="24" height="24" rx="6" fill="none" stroke="url(#ringGrad)" strokeWidth="0.6" opacity="0.7" />
        </g>
      </svg>

      {/* Scan line */}
      <div className="scan-line" />

      {/* Bottom badge */}
      <div style={{
      position: "absolute",
      left: 24,
      bottom: 24,
      padding: "10px 14px",
      borderRadius: 12,
      background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.1)",
      fontSize: 12,
      color: "rgba(255,255,255,0.8)",
      display: "flex",
      alignItems: "center",
      gap: 8
    }}>
        <span style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "#9D4CDD",
        boxShadow: "0 0 12px #9D4CDD"
      }} />{t("txt_1055")}</div>

      <div style={{
      position: "absolute",
      right: 24,
      top: 24,
      padding: "8px 12px",
      borderRadius: 10,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.08)",
      fontSize: 11,
      color: "rgba(255,255,255,0.65)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontWeight: 600
    }}>
        Atlas Vision
      </div>
    </div>;
}