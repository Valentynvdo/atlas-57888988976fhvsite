import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

/**
 * Hero — Apple Dark with soft animated aurora behind the title.
 * Top: rounded container with title + CTA + animated aurora.
 * Bottom: rounded container showcasing the product image.
 */
export default function Hero({ onCta }) {
  const { t } = useTranslation();
  const [imgOk, setImgOk] = useState(true);

  return (
    <section
      id="hero"
      data-testid="hero-section"
      style={{
        position: "relative",
        padding: "110px 16px 24px",
      }}
    >
      {/* ── TOP rounded hero card ───────────────────────────── */}
      <div
        className="hero-card"
        data-testid="hero-card"
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          borderRadius: 32,
          background: "linear-gradient(180deg, #0e0e10 0%, #050505 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
          padding: "120px 5% 110px",
          textAlign: "center",
          isolation: "isolate"
        }}
      >
        {/* Animated aurora blob — pure CSS, behind the title */}
        <div className="hero-aurora" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <p className="apple-eyebrow" data-testid="hero-eyebrow" style={{ position: "relative", zIndex: 2 }}>
          Atlas AI · macOS
        </p>

        <h1 className="apple-h1 hero-title-anim" data-testid="hero-title" style={{ position: "relative", zIndex: 2, marginInline: "auto" }}>
          Atlas AI.
          <span style={{ display: "block", color: "#a1a1a6", fontWeight: 500 }}>
            {t("hero.title_span")}
          </span>
        </h1>

        <p className="apple-sub" data-testid="hero-subtitle" style={{ position: "relative", zIndex: 2 }}>
          {t("hero.subtitle")}
        </p>

        <div className="apple-cta-row" style={{ position: "relative", zIndex: 2 }}>
          <button
            data-testid="hero-cta-btn"
            onClick={onCta}
            className="cta-btn"
          >
            {t("hero.btn_meet")}
            <ArrowRight size={16} />
          </button>
          <a href="#features" className="apple-link" data-testid="hero-learn-more">
            {t("hero.btn_learn")} ›
          </a>
        </div>
      </div>

      {/* ── BOTTOM rounded showcase card ────────────────────── */}
      {imgOk && (
        <div
          className="hero-showcase"
          data-testid="hero-showcase"
          style={{
            position: "relative",
            maxWidth: 1280,
            margin: "24px auto 0",
            borderRadius: 32,
            background: "linear-gradient(180deg, #161617 0%, #0a0a0b 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
            padding: "56px 5% 0",
            textAlign: "center"
          }}
        >
          <p className="apple-eyebrow" style={{ margin: 0 }}>
            {t("hero.proof_1")}
          </p>
          <h2
            style={{
              fontFamily: "var(--sf-display, -apple-system, BlinkMacSystemFont, sans-serif)",
              fontSize: "clamp(28px, 3.6vw, 44px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#f5f5f7",
              margin: "10px auto 0",
              maxWidth: 720,
              lineHeight: 1.1
            }}
          >
            {t("hero.proof_2")}
          </h2>
          <p
            style={{
              color: "rgba(245,245,247,0.6)",
              fontSize: 17,
              lineHeight: 1.5,
              margin: "16px auto 0",
              maxWidth: 560
            }}
          >
            {t("hero.proof_3")}
          </p>

          <div className="hero-showcase-img-wrap">
            <img
              src="/images/hero-atlas-app.png"
              alt="Atlas AI macOS application interface"
              loading="lazy"
              onError={() => setImgOk(false)}
              className="hero-showcase-img"
            />
          </div>
        </div>
      )}
    </section>
  );
}
