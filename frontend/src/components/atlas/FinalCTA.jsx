import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

export default function FinalCTA({ onCta }) {
  const { t } = useTranslation();
  return (
    <section
      id="final-cta"
      data-testid="final-cta-section"
      className="section-container"
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <div
        className="glass reveal"
        style={{
          borderRadius: 36,
          padding: "clamp(40px, 8vw, 96px) clamp(24px, 6vw, 64px)",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
        data-testid="final-cta-card"
      >
        {/* Background gradients */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 20% 0%, rgba(109,93,246,0.3), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(124,58,237,0.3), transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.15), transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            className="section-eyebrow"
            style={{ justifyContent: "center", display: "inline-block" }}
          >
            {t("final_cta.soon")}
          </div>
          <h2
            style={{
              marginTop: 16,
              fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              fontWeight: 700,
              fontFamily: "var(--sf-display, -apple-system, BlinkMacSystemFont, sans-serif)",
              maxWidth: 900,
              margin: "16px auto 0",
              background:
                "linear-gradient(120deg, #ffffff 0%, #d8d2ff 50%, #22D3EE 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("final_cta.title_1")}
          </h2>
          <p
            style={{
              marginTop: 20,
              color: "rgba(255,255,255,0.7)",
              fontSize: 17,
              fontFamily: "var(--sf-text, -apple-system, BlinkMacSystemFont, sans-serif)",
              letterSpacing: "-0.43px",
              lineHeight: 1.55,
              maxWidth: 560,
              margin: "20px auto 0",
            }}
          >
            {t("final_cta.desc")}
          </p>

          <div
            style={{
              marginTop: 40,
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              data-testid="final-cta-btn"
              onClick={onCta}
              className="cta-btn"
            >
              {t("final_cta.btn")}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
