import { useEffect, useRef, useState } from "react";
import EnergySphere from "./EnergySphere";
import { ArrowRight, Mic, ShieldCheck, Cpu, Send, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Hero({ onCta }) {
  const { t } = useTranslation();
  const mockupRef = useRef(null);
  const sphereWrapRef = useRef(null);
  const [imgOk, setImgOk] = useState(true);

  // Parallax on scroll (mockup tilt + sphere drift)
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (mockupRef.current) {
          const rect = mockupRef.current.getBoundingClientRect();
          const vh = window.innerHeight;
          // 0 when card center is at bottom of viewport, 1 when at center
          const progress = Math.min(Math.max((vh - rect.top) / (vh * 0.9), 0), 1);
          const tilt = 14 * (1 - progress);
          const lift = 30 * (1 - progress);
          mockupRef.current.style.transform = `rotateX(${tilt}deg) translateY(${lift}px) scale(${0.96 + progress * 0.04})`;
        }
        if (sphereWrapRef.current) {
          sphereWrapRef.current.style.transform = `translateY(${y * 0.18}px)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="hero"
      data-testid="hero-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: 120,
        paddingBottom: 80,
      }}
    >
      {/* Background grid */}
      <div
        className="grid-overlay"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />

      {/* Soft ambient color glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 45% at 50% 28%, rgba(109,93,246,0.2), transparent 70%), radial-gradient(ellipse 50% 35% at 50% 62%, rgba(124,58,237,0.12), transparent 70%), radial-gradient(ellipse 40% 30% at 80% 20%, rgba(34,211,238,0.08), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Foreground vertical stack: sphere → text → mockup */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: "100%",
          width: "100%",
          padding: "0 5%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Sphere with floating decorative glass chips */}
        <div className="hero-sphere-container" ref={sphereWrapRef} style={{ willChange: "transform" }}>
          <div className="hero-sphere-canvas-container">
            <EnergySphere />
          </div>
          <div className="hero-chip float-soft" style={{ top: "8%", left: "-26%", "--tilt": "-6deg", animationDelay: "0s" }} aria-hidden="true">
            <Mic size={22} color="#22D3EE" />
          </div>
          <div className="hero-chip float-soft" style={{ top: "16%", right: "-30%", "--tilt": "5deg", animationDelay: "1.4s" }} aria-hidden="true">
            <ShieldCheck size={22} color="#6D5DF6" />
          </div>
          <div className="hero-chip float-soft" style={{ bottom: "16%", left: "-34%", "--tilt": "4deg", animationDelay: "2.6s" }} aria-hidden="true">
            <Cpu size={22} color="#A78BFA" />
          </div>
          <div className="hero-chip float-soft" style={{ bottom: "8%", right: "-24%", "--tilt": "-5deg", animationDelay: "3.4s" }} aria-hidden="true">
            <Send size={22} color="#22D3EE" />
          </div>
        </div>

        <h1
          data-testid="hero-title"
          className="reveal in-view shimmer-text"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 6rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            fontWeight: 700,
            fontFamily: "var(--sf-display, -apple-system, BlinkMacSystemFont, sans-serif)",
            margin: 0,
            background:
              "linear-gradient(120deg, #ffffff 0%, #d8d2ff 35%, #c3ecfa 70%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% 200%",
          }}
        >
          Atlas AI.
          <br />
          <span
            style={{
              background:
                "linear-gradient(120deg, #6D5DF6 0%, #7C3AED 50%, #22D3EE 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("hero.title_span")}
          </span>
        </h1>

        <p
          data-testid="hero-subtitle"
          className="reveal in-view delay-1"
          style={{
            marginTop: 28,
            fontSize: 18,
            fontFamily: "var(--sf-text, -apple-system, BlinkMacSystemFont, sans-serif)",
            letterSpacing: "-0.43px",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.72)",
            maxWidth: 620,
            fontWeight: 400,
          }}
        >
          {t("hero.subtitle")}
        </p>

        <div
          className="reveal in-view delay-2"
          style={{
            marginTop: 40,
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            data-testid="hero-cta-btn"
            onClick={onCta}
            className="cta-btn"
          >
            {t("hero.btn_meet")}
            <ArrowRight size={18} />
          </button>
          <a href="#intelligence" className="ghost-btn" data-testid="hero-learn-more">
            {t("hero.btn_learn")}
          </a>
        </div>

        {/* Tiny stats / proof row */}
        <div
          className="reveal in-view delay-3 hero-proof-row"
          style={{
            marginTop: 56,
            display: "flex",
            gap: 32,
            justifyContent: "center",
            flexWrap: "wrap",
            color: "rgba(255,255,255,0.45)",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span>{t("hero.proof_1")}</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>{t("hero.proof_2")}</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>{t("hero.proof_3")}</span>
        </div>

        {/* AI-generated app mockup with parallax */}
        {imgOk && (
          <div className="hero-mockup-wrap reveal in-view delay-4">
            <div
              className="hero-mockup"
              ref={mockupRef}
              data-testid="hero-mockup"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="hero-mockup-bar">
                <span className="mac-dots">
                  <span />
                  <span />
                  <span />
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Sparkles size={12} color="#6D5DF6" /> Atlas AI · macOS
                </span>
              </div>
              <img
                src="/images/hero-atlas-app.png"
                alt="Atlas AI macOS application interface"
                loading="lazy"
                onError={() => setImgOk(false)}
              />
            </div>
          </div>
        )}

        {/* Scroll hint */}
        <div
          className="hero-scroll-hint"
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 1,
              height: 28,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.6), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
