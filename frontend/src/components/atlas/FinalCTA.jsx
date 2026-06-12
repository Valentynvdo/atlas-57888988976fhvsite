import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * FinalCTA — Apple Mac modern, no boxed container.
 * Plain text on the page with a subtle aurora glow behind it.
 */
export default function FinalCTA({ onCta }) {
  const { t } = useTranslation();

  return (
    <section
      id="final-cta"
      data-testid="final-cta-section"
      style={{
        position: "relative",
        padding: "clamp(100px, 14vw, 180px) 24px clamp(80px, 12vw, 160px)",
        maxWidth: 1100,
        margin: "0 auto",
        textAlign: "center",
        isolation: "isolate"
      }}
    >
      {/* Soft aurora behind the text */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "10% 5%",
          background:
            "radial-gradient(45% 60% at 50% 50%, rgba(80,95,255,0.18), transparent 70%), radial-gradient(35% 50% at 65% 40%, rgba(186,100,255,0.12), transparent 70%)",
          filter: "blur(60px)",
          opacity: 0.85,
          zIndex: 0,
          pointerEvents: "none"
        }}
      />

      <p
        className="apple-eyebrow"
        style={{
          position: "relative",
          zIndex: 1,
          margin: "0 0 18px",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          justifyContent: "center"
        }}
      >
        <Sparkles size={12} />
        {t("final_cta.soon")}
      </p>

      <h2
        className="hero-title-anim"
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: "var(--sf-display, -apple-system, BlinkMacSystemFont, sans-serif)",
          fontSize: "clamp(40px, 6vw, 72px)",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          fontWeight: 600,
          margin: 0,
          maxWidth: 860,
          marginInline: "auto"
        }}
      >
        {t("final_cta.title_1")}
      </h2>

      <p
        style={{
          position: "relative",
          zIndex: 1,
          color: "rgba(245,245,247,0.65)",
          fontSize: 19,
          lineHeight: 1.5,
          margin: "22px auto 0",
          maxWidth: 600
        }}
      >
        {t("final_cta.desc")}
      </p>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: 40,
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
    </section>
  );
}
