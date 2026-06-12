import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

/**
 * FinalCTA — Apple Dark closing block. No neon, solid card.
 */
export default function FinalCTA({ onCta }) {
  const { t } = useTranslation();
  return (
    <section
      id="final-cta"
      data-testid="final-cta-section"
      style={{
        padding: "80px 5%",
        maxWidth: 1200,
        margin: "0 auto"
      }}
    >
      <div
        data-testid="final-cta-card"
        style={{
          background: "#1d1d1f",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 28,
          padding: "clamp(48px, 8vw, 96px) clamp(24px, 6vw, 64px)",
          textAlign: "center"
        }}
      >
        <p className="apple-eyebrow" style={{ margin: "0 0 14px" }}>
          {t("final_cta.soon")}
        </p>
        <h2
          style={{
            fontFamily: "var(--sf-display, -apple-system, BlinkMacSystemFont, sans-serif)",
            fontSize: "clamp(32px, 5vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: "#f5f5f7",
            fontWeight: 600,
            margin: 0,
            maxWidth: 760,
            marginInline: "auto"
          }}
        >
          {t("final_cta.title_1")}
        </h2>
        <p
          style={{
            color: "rgba(245,245,247,0.65)",
            fontSize: 18,
            lineHeight: 1.5,
            margin: "20px auto 0",
            maxWidth: 560
          }}
        >
          {t("final_cta.desc")}
        </p>

        <div
          style={{
            marginTop: 36,
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap"
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
