import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ScanFace, MapPin, Users, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AbsoluteAwareness() {
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
      style={{ position: "relative", padding: "120px 5%" }}
      ref={sectionRef}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 80, alignItems: "center", maxWidth: 1400, margin: "0 auto" }}>
        {/* Text Section */}
        <article
          className="reveal delay-1"
          style={{
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
              Абсолютна Свідомість
            </div>
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background: "rgba(157, 76, 221, 0.1)",
                border: "1px solid rgba(157, 76, 221, 0.2)",
                fontSize: 10,
                color: "#E5B3FF",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 700,
                fontFamily: "var(--sf-text, -apple-system, sans-serif)",
              }}
            >
              Atlas Vision
            </div>
          </div>
          <h2
            className="awareness-heading gradient-text"
            data-testid="awareness-title"
            style={{
              marginTop: 0,
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              fontWeight: 700,
              fontFamily: "var(--sf-display, -apple-system, sans-serif)",
            }}
          >
            Пам'ятає те,
            <br />
            що важливо для вас
          </h2>
          <p
            style={{
              marginTop: 24,
              color: "rgba(255,255,255,0.7)",
              fontSize: 18,
              letterSpacing: "-0.43px",
              fontFamily: "var(--sf-text, -apple-system, sans-serif)",
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            Атлас впізнає вас в обличчя, пам'ятає ваші адреси, вподобання та імена ваших гостей, забезпечуючи абсолютно персоналізований досвід — без зайвих запитань.
          </p>

          <div
            style={{
              marginTop: 48,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 40,
            }}
          >
            {[
              {
                icon: <ScanFace size={24} color="#00E5FF" />,
                title: "Розпізнавання",
                value: "Обличчя та Голос",
              },
              {
                icon: <MapPin size={24} color="#007AFF" />,
                title: "Адреси",
                value: "Дім · Робота",
              },
              {
                icon: <Users size={24} color="#9D4CDD" />,
                title: "Контакти",
                value: "Сім'я · Друзі",
              },
              {
                icon: <Heart size={24} color="#FF6B9A" />,
                title: "Вподобання",
                value: "Завжди під рукою",
              },
            ].map((m, i) => (
              <div
                key={i}
                data-testid={`awareness-stat-${i}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12
                }}
              >
                {m.icon}
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 600,
                      marginBottom: 4
                    }}
                  >
                    {m.title}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#fff"
                    }}
                  >
                    {m.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Biometric visual */}
        <article
          className="reveal"
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            minHeight: 400,
            maxHeight: 600,
            margin: "auto 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          data-testid="awareness-visual"
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "120%",
              height: "120%",
              background: `radial-gradient(circle, rgba(157,76,221,0.15), transparent 60%)`,
              filter: "blur(40px)",
              pointerEvents: "none",
              zIndex: 0
            }}
          />
          <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
            <FaceIDOrb />
          </div>
        </article>
      </div>
    </section>
  );
}

function FaceIDOrb() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: 0,
      }}
    >
      {/* Center orb */}
      <div
        style={{
          position: "absolute",
          inset: "15% 15%",
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

      {/* Floating badge */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          bottom: "10%",
          padding: "16px 24px",
          borderRadius: 24,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 16
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#9D4CDD",
            boxShadow: "0 0 12px #9D4CDD",
          }}
        />
        <div
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.9)",
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          Розпізнавання
          <br />
          <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>активоване</span>
        </div>
      </div>
    </div>
  );
}
