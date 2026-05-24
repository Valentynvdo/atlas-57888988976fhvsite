import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Sparkles, Activity, Cpu, ShieldCheck, Zap, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function BentoFeatures() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate individual bento cards on scroll
      gsap.utils.toArray(".bento-reveal").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Staggered word reveal for the section heading
      const heading = sectionRef.current?.querySelector(".bento-heading");
      if (heading) {
        const words = heading.textContent.split(" ").filter(Boolean);
        heading.innerHTML = words
          .map((w) => `<span class="bento-word" style="display:inline-block;opacity:0;transform:translateY(20px)">${w}&nbsp;</span>`)
          .join("");

        gsap.to(".bento-word", {
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

  const cards = [
    {
      icon: <Cpu className="w-8 h-8 text-blue-400" />,
      accent: "#007AFF",
      tier: "8 / 12",
      title: "Точність Neural Engine",
      desc: "Відчуйте неперевершену швидкість завдяки нашій передовій архітектурі. Створено для виконання складних операцій без втрати жодного кадру.",
      colSpan: "span 8",
      rowSpan: "span 2",
      large: true,
    },
    {
      icon: <Activity className="w-7 h-7 text-purple-400" />,
      accent: "#9D4CDD",
      tier: "4 / 12",
      title: "Телеметрія в реальному часі",
      desc: "Кожна метрика системи фіксується та візуалізується миттєво, у реальному часі.",
      colSpan: "span 4",
      rowSpan: "span 2",
      large: false,
    },
    {
      icon: <Sparkles className="w-7 h-7 text-cyan-300" />,
      accent: "#00E5FF",
      tier: "6 / 12",
      title: "120 Гц",
      subtitle: "Підтримка ProMotion",
      colSpan: "span 6",
      rowSpan: "span 1",
      metric: true,
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-green-300" />,
      accent: "#28C840",
      tier: "6 / 12",
      title: "99.9%",
      subtitle: "Гарантія безвідмовної роботи",
      colSpan: "span 6",
      rowSpan: "span 1",
      metric: true,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-container"
      style={{ padding: "120px 5%" }}
    >
      {/* Section heading */}
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div className="section-eyebrow" style={{ marginBottom: 16 }}>
          Створено інакше
        </div>
        <h2
          className="bento-heading gradient-text"
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 700,
            fontFamily: "var(--sf-display, -apple-system, BlinkMacSystemFont, sans-serif)",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Спроектовано для досконалості
        </h2>
        <p
          style={{
            marginTop: 20,
            fontSize: 17,
            letterSpacing: "-0.43px",
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.6)",
            maxWidth: 520,
            margin: "20px auto 0",
            fontFamily: "var(--sf-text, -apple-system, BlinkMacSystemFont, sans-serif)",
          }}
        >
          Кожен компонент спроектовано для бездоганної роботи — система, що думає зі швидкістю думки.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="bento-container">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bento-card bento-reveal"
            style={{
              gridColumn: card.colSpan,
              gridRow: card.rowSpan,
              display: "flex",
              flexDirection: "column",
              justifyContent: card.metric ? "center" : "space-between",
              minHeight: card.large ? 340 : card.metric ? 140 : 260,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Accent glow */}
            <div
              style={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${card.accent}22, transparent 70%)`,
                filter: "blur(20px)",
                pointerEvents: "none",
              }}
            />

            {card.metric ? (
              /* Metric card layout */
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    display: "grid",
                    placeItems: "center",
                    background: `linear-gradient(135deg, ${card.accent}22, ${card.accent}08)`,
                    border: `1px solid ${card.accent}44`,
                    flexShrink: 0,
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--sf-display, -apple-system, sans-serif)",
                      fontSize: 28,
                      fontWeight: 700,
                      letterSpacing: "-0.8px",
                      lineHeight: 1.2,
                    }}
                  >
                    {card.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.12px",
                      color: "rgba(255,255,255,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      marginTop: 4,
                    }}
                  >
                    {card.subtitle}
                  </div>
                </div>
              </div>
            ) : (
              /* Feature card layout */
              <>
                <div>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      display: "grid",
                      placeItems: "center",
                      background: `linear-gradient(135deg, ${card.accent}22, ${card.accent}08)`,
                      border: `1px solid ${card.accent}44`,
                      marginBottom: 20,
                    }}
                  >
                    {card.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--sf-display, -apple-system, sans-serif)",
                      fontSize: card.large ? 28 : 22,
                      fontWeight: 700,
                      letterSpacing: card.large ? "-0.8px" : "-0.7px",
                      lineHeight: 1.2,
                      marginBottom: 12,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--sf-text, -apple-system, sans-serif)",
                      fontSize: 15,
                      letterSpacing: "0px",
                      lineHeight: 1.55,
                      color: "rgba(255,255,255,0.6)",
                      maxWidth: card.large ? 480 : "100%",
                    }}
                  >
                    {card.desc}
                  </p>
                </div>

                {/* Bottom visual */}
                {card.large && (
                  <div
                    style={{
                      marginTop: 28,
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      height: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                      transition: "transform 0.5s cubic-bezier(0.25,1,0.5,1)",
                    }}
                    className="hover:[transform:scale(1.02)]"
                  >
                    {[35, 55, 70, 45, 80, 60, 50, 75].map((h, j) => (
                      <div
                        key={j}
                        style={{
                          width: 4,
                          height: h,
                          borderRadius: 4,
                          background: `linear-gradient(180deg, ${card.accent}, ${card.accent}44)`,
                          opacity: 0.7 + (j % 3) * 0.1,
                          animation: `barPulse ${1.5 + j * 0.2}s ease-in-out infinite alternate`,
                        }}
                      />
                    ))}
                    <style>{`
                      @keyframes barPulse {
                        0% { transform: scaleY(0.7); opacity: 0.5; }
                        100% { transform: scaleY(1); opacity: 1; }
                      }
                    `}</style>
                  </div>
                )}

                {!card.large && (
                  <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[75, 52, 88].map((w, j) => (
                      <div
                        key={j}
                        style={{
                          height: 4,
                          borderRadius: 4,
                          background: "rgba(255,255,255,0.08)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${w}%`,
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${card.accent}, ${card.accent}88)`,
                            transition: "width 1.5s ease",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
