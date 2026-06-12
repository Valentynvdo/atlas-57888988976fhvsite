import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * FinalCTA — Apple Mac modern closing block.
 * Soft animated aurora, rounded card, white pill CTA.
 */
export default function FinalCTA({ onCta }) {
  const { t } = useTranslation();

  return (
    <section
      id="final-cta"
      data-testid="final-cta-section"
      style={{
        padding: "60px 16px 80px",
        maxWidth: 1280,
        margin: "0 auto"
      }}
    >
      <div
        data-testid="final-cta-card"
        className="hero-card"
        style={{
          position: "relative",
          borderRadius: 32,
          background: "linear-gradient(180deg, #0e0e10 0%, #050505 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
          padding: "clamp(72px, 11vw, 140px) clamp(24px, 6vw, 80px)",
          textAlign: "center",
          isolation: "isolate"
        }}
      >
        <div className="hero-aurora" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <p
          className="apple-eyebrow"
          style={{
            margin: "0 0 16px",
            position: "relative",
            zIndex: 2,
            display: "inline-flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <Sparkles size={12} />
          {t("final_cta.soon")}
        </p>

        <h2
          className="hero-title-anim"
          style={{
            position: "relative",
            zIndex: 2,
            fontFamily: "var(--sf-display, -apple-system, BlinkMacSystemFont, sans-serif)",
            fontSize: "clamp(36px, 5.5vw, 64px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            fontWeight: 600,
            margin: 0,
            maxWidth: 820,
            marginInline: "auto"
          }}
        >
          {t("final_cta.title_1")}
        </h2>

        <p
          style={{
            position: "relative",
            zIndex: 2,
            color: "rgba(245,245,247,0.65)",
            fontSize: 18,
            lineHeight: 1.5,
            margin: "20px auto 0",
            maxWidth: 580
          }}
        >
          {t("final_cta.desc")}
        </p>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: 36,
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <button
            data-testid="final-cta-btn"
            onClick={onCta}
            className="cta-btn"
          >
            {t("final_cta.btn")}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
