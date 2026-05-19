import EnergySphere from "./EnergySphere";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero({ onCta }) {
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
        paddingTop: 100,
        paddingBottom: 60,
      }}
    >
      {/* Background grid */}
      <div
        className="grid-overlay"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Soft ambient color glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 45% at 50% 30%, rgba(0,122,255,0.18), transparent 70%), radial-gradient(ellipse 50% 35% at 50% 60%, rgba(157,76,221,0.12), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Foreground vertical stack: sphere → text */}
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
        {/* Sphere */}
        <div className="hero-sphere-container">
          <div className="hero-sphere-canvas-container">
            <EnergySphere />
          </div>
          <div className="pulse-ring" style={{ width: "100%", height: "100%", zIndex: 2 }} />
          <div
            className="pulse-ring"
            style={{ width: "100%", height: "100%", animationDelay: "1.4s", zIndex: 2 }}
          />
          <div
            className="pulse-ring"
            style={{ width: "100%", height: "100%", animationDelay: "2.8s", zIndex: 2 }}
          />
        </div>

        <div
          data-testid="hero-eyebrow"
          className="reveal in-view"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            fontSize: 13,
            color: "rgba(255,255,255,0.85)",
            marginBottom: 28,
          }}
        >
          <Sparkles size={14} color="#00E5FF" />
          Автономний асистент для macOS
        </div>

        <h1
          data-testid="hero-title"
          className="reveal in-view shimmer-text"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 6rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            fontWeight: 700,
            margin: 0,
            background:
              "linear-gradient(120deg, #ffffff 0%, #d4dcff 35%, #b8f0ff 70%, #ffffff 100%)",
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
                "linear-gradient(120deg, #007AFF 0%, #9D4CDD 50%, #00E5FF 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ваш персональний всесвіт.
          </span>
        </h1>

        <p
          data-testid="hero-subtitle"
          className="reveal in-view delay-1"
          style={{
            marginTop: 24,
            fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
            color: "rgba(255,255,255,0.72)",
            maxWidth: 640,
            lineHeight: 1.55,
            fontWeight: 400,
          }}
        >
          Інтелект, який не просто слухає. Він розуміє, адаптується і діє.
        </p>

        <div
          className="reveal in-view delay-2"
          style={{
            marginTop: 36,
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
            Зустрічайте Атлас
            <ArrowRight size={18} />
          </button>
          <a href="#intelligence" className="ghost-btn" data-testid="hero-learn-more">
            Дізнатися більше
          </a>
        </div>

        {/* Tiny stats / proof row */}
        <div
          className="reveal in-view delay-3"
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
          <span>Створено для macOS</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>Реальні дії. Реальний світ.</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>Приватність за замовчуванням</span>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
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
        Прокрутіть
        <span
          style={{
            width: 1,
            height: 28,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.6), transparent)",
          }}
        />
      </div>
    </section>
  );
}
