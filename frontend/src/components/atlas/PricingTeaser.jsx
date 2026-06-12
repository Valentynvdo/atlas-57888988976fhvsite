import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

/**
 * PricingTeaser — Apple-style horizontal card linking to /pricing.
 * Keeps the landing slim: no inline plans table.
 */
export default function PricingTeaser() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const path = isEn ? "/en/pricing" : "/pricing";

  const tx = (key, fallback) => {
    const v = t(key);
    return v === key ? fallback : v;
  };

  return (
    <section className="pricing-teaser" id="pricing" data-testid="pricing-teaser-section">
      <div className="pricing-teaser-card">
        <div>
          <p className="apple-eyebrow" style={{ margin: "0 0 14px" }}>
            {tx("pricing_teaser.eyebrow", isEn ? "Pricing" : "Ціни")}
          </p>
          <h3>
            {tx(
              "pricing_teaser.title",
              isEn ? "Built for individuals. Priced honestly." : "Створено для людей. Чесна ціна."
            )}
          </h3>
          <p>
            {tx(
              "pricing_teaser.desc",
              isEn
                ? "Start free. Upgrade when you need advanced automation, longer memory and priority models. No hidden fees."
                : "Почніть безкоштовно. Перейдіть на Pro, коли знадобиться розширена автоматизація, довша пам'ять та пріоритетні моделі. Без прихованих платежів."
            )}
          </p>
        </div>
        <Link
          to={path}
          className="cta-btn"
          data-testid="pricing-teaser-cta"
          style={{ textDecoration: "none" }}
        >
          {tx("pricing_teaser.cta", isEn ? "See pricing" : "Переглянути ціни")}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
