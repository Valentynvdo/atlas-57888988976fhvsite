import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

/**
 * Hero — Apple Dark.
 * Full-bleed top card with aurora + bottom seamless image showcase (no duplicate copy).
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
        padding: 0,
      }}
    >
      {/* ── TOP hero — full bleed, aurora behind title, fade-out at bottom ─ */}
      <div
        className="hero-card hero-card-full"
        data-testid="hero-card"
      >
        <div className="hero-aurora" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-fade-bottom" aria-hidden="true" />

        {/* Floating chat bubbles around the title — "ask Atlas → response → thinking" */}
        <div className="hero-chat-bubbles" aria-hidden="true">
          <div className="hb hb-left hb-ask">
            <span className="hb-label">Ви</span>
            Підсумуй сьогоднішні листи.
          </div>
          <div className="hb hb-right hb-reply">
            <span className="hb-label">Atlas</span>
            7 нових. 3 важливі — готую відповідь.
          </div>
          <div className="hb hb-bottom-left hb-ask">
            <span className="hb-label">Ви</span>
            Заплануй дзвінок завтра.
          </div>
          <div className="hb hb-bottom-right hb-thinking">
            <span className="hb-label">Atlas думає</span>
            <span className="hb-dots"><i /><i /><i /></span>
          </div>
        </div>

        <div className="hero-card-inner">
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

          {/* Clean product image — no duplicate copy */}
          {imgOk && (
            <div
              className="hero-showcase-img-wrap"
              data-testid="hero-showcase"
              style={{ position: "relative", zIndex: 2 }}
            >
              <img
                src="/images/hero-atlas-app.png"
                alt="Atlas AI macOS application interface"
                loading="lazy"
                onError={() => setImgOk(false)}
                className="hero-showcase-img"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
