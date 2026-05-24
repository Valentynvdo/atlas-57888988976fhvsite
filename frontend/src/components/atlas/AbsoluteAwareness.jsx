import { useTranslation } from "react-i18next";
import { ScanFace, MapPin, Users, Heart } from "lucide-react";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AbsoluteAwareness() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered word reveal for the section heading
      const heading = sectionRef.current?.querySelector(".awareness-heading");
      if (heading) {
        const words = heading.textContent.split(" ").filter(Boolean);
        heading.innerHTML = words
          .map(
            (w) =>
              `<span class="awareness-word" style="display:inline-block;opacity:0;transform:translateY(20px)">${w}&nbsp;</span>`,
          )
          .join("");

        gsap.to(".awareness-word", {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="awareness"
      data-testid="awareness-section"
      className="section-container"
      style={{ position: "relative" }}
      ref={sectionRef}
    >
      <div className="bento-container" style={{ gap: 24 }}>
        {/* Text Section (Left on Desktop) */}
        <article
          className="bento-card reveal delay-1"
          style={{
            gridColumn: "span 7",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div className="section-eyebrow" style={{ marginBottom: 0 }}>
              {t("atlas_v2.awareness.eyebrow")}
            </div>
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background: "rgba(0, 229, 255, 0.1)",
                border: "1px solid rgba(0, 229, 255, 0.2)",
                fontSize: 10,
                color: "#00E5FF",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 700,
                fontFamily: "var(--sf-text, -apple-system, sans-serif)",
              }}
            >
              {t("atlas_v2.awareness.badge")}
            </div>
          </div>
          <h2
            className="awareness-heading gradient-text"
            data-testid="awareness-title"
            style={{
              marginTop: 0,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              fontWeight: 700,
              fontFamily: "var(--sf-display, -apple-system, sans-serif)",
            }}
          >
            {t("atlas_v2.awareness.title_1")}
            <br />
            {t("atlas_v2.awareness.title_2")}
          </h2>
          <p
            style={{
              marginTop: 24,
              color: "rgba(255,255,255,0.7)",
              fontSize: 17,
              letterSpacing: "-0.43px",
              fontFamily: "var(--sf-text, -apple-system, sans-serif)",
              lineHeight: 1.55,
              maxWidth: 520,
            }}
          >
            {t("atlas_v2.awareness.desc")}
          </p>

          <div
            style={{
              marginTop: 40,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                icon: <ScanFace size={20} color="#00E5FF" />,
                title: t("atlas_v2.awareness.stat1_title"),
                value: t("atlas_v2.awareness.stat1_val"),
              },
              {
                icon: <MapPin size={20} color="#007AFF" />,
                title: t("atlas_v2.awareness.stat2_title"),
                value: t("atlas_v2.awareness.stat2_val"),
              },
              {
                icon: <Users size={20} color="#9D4CDD" />,
                title: t("atlas_v2.awareness.stat3_title"),
                value: t("atlas_v2.awareness.stat3_val"),
              },
              {
                icon: <Heart size={20} color="#FF6B9A" />,
                title: t("atlas_v2.awareness.stat4_title"),
                value: t("atlas_v2.awareness.stat4_val"),
              },
            ].map((m, i) => (
              <div
                key={i}
                data-testid={`awareness-stat-${i}`}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: 18,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid rgba(255,255,255,0.08)",
                    marginBottom: 10,
                  }}
                >
                  {m.icon}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 600,
                    fontFamily: "var(--sf-text, -apple-system, sans-serif)",
                  }}
                >
                  {m.title}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: "var(--sf-text, -apple-system, sans-serif)",
                  }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Biometric visual (Right on Desktop) */}
        <article
          className="bento-card reveal"
          style={{
            gridColumn: "span 5",
            position: "relative",
            aspectRatio: "1 / 1",
            minHeight: 350,
            maxHeight: 500,
            margin: "auto 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
          data-testid="awareness-visual"
        >
          {/* Accent corner glow inside the right bento card */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(157,76,221,0.22), transparent 70%)`,
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
          <FaceIDOrb />
        </article>
      </div>
    </section>
  );
}

function FaceIDOrb() {
  const { t } = useTranslation();
  return (
    <div
      className="glass"
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 32,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          background:
            "radial-gradient(circle at 50% 50%, rgba(157,76,221,0.25), transparent 60%)",
          filter: "blur(20px)",
        }}
      />

      {/* Center orb */}
      <div
        style={{
          position: "absolute",
          inset: "12% 12%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 30%, #2a2a3a 0%, #0a0a14 60%, #050510 100%)",
          boxShadow:
            "inset 0 0 80px rgba(0,229,255,0.12), 0 0 80px rgba(157,76,221,0.2)",
        }}
      />

      {/* Concentric rings */}
      <svg
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
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
        {[20, 28, 36, 44].map((r, i) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="0.25"
            strokeDasharray="2 3"
            opacity={0.7 - i * 0.12}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 50 50`}
              to={`${i % 2 === 0 ? 360 : -360} 50 50`}
              dur={`${20 + i * 5}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Face dot pattern */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * Math.PI * 2;
          const radius = 16 + (i % 3) * 2;
          const cx = 50 + Math.cos(angle) * radius;
          const cy = 50 + Math.sin(angle) * radius;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="0.6"
              fill="#00E5FF"
              opacity="0.7"
            >
              <animate
                attributeName="opacity"
                values="0.2;1;0.2"
                dur={`${2 + (i % 4)}s`}
                repeatCount="indefinite"
                begin={`${i * 0.05}s`}
              />
            </circle>
          );
        })}

        {/* Center FaceID icon */}
        <g transform="translate(50,50)">
          {/* eyes */}
          <circle cx="-6" cy="-3" r="1.4" fill="#fff" opacity="0.9" />
          <circle cx="6" cy="-3" r="1.4" fill="#fff" opacity="0.9" />
          {/* mouth */}
          <path
            d="M -5 5 Q 0 8 5 5"
            stroke="#fff"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* face frame */}
          <rect
            x="-12"
            y="-12"
            width="24"
            height="24"
            rx="6"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="0.6"
            opacity="0.7"
          />
        </g>
      </svg>

      {/* Bottom badge */}
      <div
        style={{
          position: "absolute",
          left: 24,
          bottom: 24,
          width: 110,
          height: 110,
          padding: 16,
          borderRadius: 24,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "rgba(157,76,221,0.15)",
            border: "1px solid rgba(157,76,221,0.3)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#9D4CDD",
              boxShadow: "0 0 12px #9D4CDD",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 13,
            fontFamily: "var(--sf-text, -apple-system, sans-serif)",
            color: "rgba(255,255,255,0.9)",
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          Recognition
          <br />
          <span
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            is active
          </span>
        </div>
      </div>
    </div>
  );
}
