import { useTranslation } from "react-i18next";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import {
  Bot,
  Zap,
  Cpu,
  Server,
  Fingerprint,
  BrainCircuit,
  ScanFace,
  Activity,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const getComparisonData = (t) => [
  {
    id: "intelligence",
    label: t("atlas_v2.comparison.tabs.intelligence"),
    icon: <BrainCircuit size={16} />,
    normal: [
      { i: <Cpu />, t: t("atlas_v2.comparison.items.intelligence_n1") },
      {
        i: <BrainCircuit />,
        t: t("atlas_v2.comparison.items.intelligence_n2"),
      },
      { i: <Bot />, t: t("atlas_v2.comparison.items.intelligence_n3") },
    ],
    atlas: [
      { i: <Cpu />, t: t("atlas_v2.comparison.items.intelligence_a1") },
      { i: <Fingerprint />, t: t("atlas_v2.comparison.items.intelligence_a2") },
      { i: <Zap />, t: t("atlas_v2.comparison.items.intelligence_a3") },
    ],
  },
  {
    id: "vision",
    label: t("atlas_v2.comparison.tabs.vision"),
    icon: <ScanFace size={16} />,
    normal: [
      { i: <Server />, t: t("atlas_v2.comparison.items.vision_n1") },
      { i: <ScanFace />, t: t("atlas_v2.comparison.items.vision_n2") },
      { i: <BrainCircuit />, t: t("atlas_v2.comparison.items.vision_n3") },
    ],
    atlas: [
      { i: <Server />, t: t("atlas_v2.comparison.items.vision_a1") },
      { i: <ScanFace />, t: t("atlas_v2.comparison.items.vision_a2") },
      { i: <BrainCircuit />, t: t("atlas_v2.comparison.items.vision_a3") },
    ],
  },
  {
    id: "infrastructure",
    label: t("atlas_v2.comparison.tabs.infrastructure"),
    icon: <Activity size={16} />,
    normal: [
      {
        i: <Fingerprint />,
        t: t("atlas_v2.comparison.items.infrastructure_n1"),
      },
      { i: <Activity />, t: t("atlas_v2.comparison.items.infrastructure_n2") },
      { i: <Server />, t: t("atlas_v2.comparison.items.infrastructure_n3") },
    ],
    atlas: [
      {
        i: <Fingerprint />,
        t: t("atlas_v2.comparison.items.infrastructure_a1"),
      },
      { i: <Activity />, t: t("atlas_v2.comparison.items.infrastructure_a2") },
      { i: <Server />, t: t("atlas_v2.comparison.items.infrastructure_a3") },
    ],
  },
];

export default function AtlasComparison() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Initial reveal animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".vs-divider",
        { height: 0, opacity: 0 },
        {
          height: "100%",
          opacity: 1,
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".vs-container", start: "top 75%" },
        },
      );

      gsap.fromTo(
        ".comp-card-left",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".vs-container", start: "top 75%" },
        },
      );

      gsap.fromTo(
        ".comp-card-right",
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".vs-container", start: "top 75%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Card replacement effect
  const handleTabChange = (index) => {
    if (index === activeIndex) return;

    // Animate out
    gsap.to(".comp-list-item", {
      y: -20,
      opacity: 0,
      stagger: 0.05,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setActiveIndex(index);
        // Animate in
        gsap.fromTo(
          ".comp-list-item",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            ease: "power3.out",
          },
        );
      },
    });
  };

  const comparisonData = getComparisonData(t);
  const activeData = comparisonData[activeIndex];

  return (
    <section
      id="comparison"
      className="section-container"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
      ref={sectionRef}
    >
      {/* Background glows */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "5%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(157,76,221,0.15) 0%, transparent 60%)",
          filter: "blur(80px)",
          mixBlendMode: "screen",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 60%)",
          filter: "blur(80px)",
          mixBlendMode: "screen",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Large Statement */}
        <div
          className="reveal"
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              fontFamily: "var(--sf-display, -apple-system, sans-serif)",
              color: "#fff",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {t("atlas_v2.comparison.title")}
          </h2>
          <p
            className="gradient-text"
            style={{
              fontSize: "clamp(1.2rem, 2.5vw, 2.5rem)",
              fontWeight: 600,
              marginTop: 16,
              fontFamily: "var(--sf-display, -apple-system, sans-serif)",
              letterSpacing: "-0.02em",
            }}
          >
            {t("atlas_v2.comparison.subtitle")}
          </p>
        </div>

        {/* Premium Tabs */}
        <div
          className="reveal delay-1"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginBottom: 40,
            flexWrap: "wrap",
          }}
        >
          {comparisonData.map((tab, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(idx)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 24px",
                  borderRadius: 30,
                  background: isActive
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.03)",
                  border: isActive
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid rgba(255,255,255,0.05)",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontFamily: "var(--sf-text, sans-serif)",
                  fontWeight: 600,
                  fontSize: 15,
                  boxShadow: isActive ? "0 4px 20px rgba(0,0,0,0.2)" : "none",
                }}
              >
                <div style={{ color: isActive ? "#00E5FF" : "inherit" }}>
                  {tab.icon}
                </div>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* The Beautiful Visual Comparison */}
        <div
          className="vs-container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "clamp(20px, 4vw, 40px)",
            alignItems: "stretch",
            position: "relative",
          }}
        >
          {/* LEFT: Normal AI */}
          <div
            className="comp-card-left bento-card"
            style={{
              padding: "clamp(30px, 4vw, 50px)",
              display: "flex",
              flexDirection: "column",
              background: "transparent",
              border: "none",
              filter: "grayscale(30%) opacity(0.8)",
              transition: "all 0.5s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 40,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <Bot size={28} />
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  margin: 0,
                  letterSpacing: "-0.02em",
                  fontFamily: "var(--sf-display, sans-serif)",
                }}
              >
                {t("atlas_v2.comparison.normal_ai")}
              </h3>
            </div>

            <div
              className="comp-list"
              style={{ display: "flex", flexDirection: "column", gap: 32 }}
            >
              {activeData.normal.map((item, i) => (
                <CompItem
                  key={`norm-${activeIndex}-${i}`}
                  icon={item.i}
                  text={item.t}
                  dim
                />
              ))}
            </div>
          </div>

          {/* CENTER DIVIDER */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              className="vs-divider"
              style={{
                width: 1,
                background:
                  "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#000",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "10px 16px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              VS
            </div>
          </div>

          {/* RIGHT: ATLAS */}
          <div
            className="comp-card-right bento-card"
            style={{
              padding: "clamp(30px, 4vw, 50px)",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Inner Glow */}
            <div
              style={{
                position: "absolute",
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                background:
                  "radial-gradient(circle, rgba(0,229,255,0.2), transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 40,
                color: "#00E5FF",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Zap size={28} fill="#00E5FF" />
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "-0.02em",
                  fontFamily: "var(--sf-display, sans-serif)",
                }}
              >
                ATLAS
              </h3>
            </div>

            <div
              className="comp-list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 32,
                position: "relative",
                zIndex: 1,
              }}
            >
              {activeData.atlas.map((item, i) => (
                <CompItem
                  key={`atlas-${activeIndex}-${i}`}
                  icon={item.i}
                  text={item.t}
                  active
                />
              ))}
            </div>

            {/* Micro visual at the bottom */}
            <div
              style={{
                marginTop: "auto",
                paddingTop: 50,
                display: "flex",
                alignItems: "center",
                gap: 12,
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 2,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "30%",
                    background:
                      "linear-gradient(90deg, transparent, #00E5FF, transparent)",
                    animation: "sweep 2s infinite",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: "#00E5FF",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {t("atlas_v2.comparison.system_active")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @media (max-width: 900px) {
          .vs-container {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .vs-divider {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

function CompItem({ icon, text, active, dim }) {
  return (
    <div
      className="comp-list-item"
      style={{ display: "flex", alignItems: "center", gap: 16 }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          flexShrink: 0,
          borderRadius: 12,
          background: active
            ? "rgba(0, 229, 255, 0.05)"
            : "rgba(255, 255, 255, 0.02)",
          border: active
            ? "1px solid rgba(0, 229, 255, 0.15)"
            : "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: active ? "#00E5FF" : dim ? "rgba(255,255,255,0.3)" : "#fff",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: "1.05rem",
          fontWeight: active ? 600 : 500,
          color: dim ? "rgba(255,255,255,0.4)" : "#fff",
          fontFamily: "var(--sf-text, sans-serif)",
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </div>
  );
}
