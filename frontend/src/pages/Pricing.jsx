import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Check, ArrowRight } from "lucide-react";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import Navbar from "../components/atlas/Navbar";
import Footer from "../components/atlas/Footer";

/**
 * Pricing page — Apple Dark style.
 * No neon. Graphite cards on solid black background.
 */
export default function Pricing() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const navigate = useLocalizedNavigate();

  const L = (uk, en) => (isEn ? en : uk);

  const plans = [
    {
      id: "monthly",
      name: L("Місячний", "Monthly"),
      price: "$28.99",
      per: L("/ міс.", "/ month"),
      billed: L("Оплата щомісяця", "Billed monthly"),
      popular: false,
      features: [
        L("Повний доступ до Atlas AI на macOS", "Full Atlas AI access on macOS"),
        L("Локальна обробка даних і приватність", "Local data processing & privacy"),
        L("Голосове та текстове керування", "Voice & text control"),
        L("Керування через Telegram-бота", "Telegram bot remote control"),
        L("Оновлення та підтримка", "Updates & support"),
      ],
    },
    {
      id: "quarterly",
      name: L("Квартальний", "Quarterly"),
      price: "$23.33",
      per: L("/ міс.", "/ month"),
      billed: L("Оплата $69.99 / 3 міс.", "Billed $69.99 / 3 mos"),
      popular: true,
      features: [
        L("Усе з місячного плану", "Everything in Monthly"),
        L("Пріоритетна підтримка", "Priority support"),
        L("Ранній доступ до нових скілів", "Early access to new skills"),
        L("Генеративний Sandbox для скілів", "Generative skill Sandbox"),
        L("Знижка 20%", "Save 20%"),
      ],
    },
    {
      id: "yearly",
      name: L("Річний", "Yearly"),
      price: "$19.99",
      per: L("/ міс.", "/ month"),
      billed: L("Оплата $239.99 / рік", "Billed $239.99 / year"),
      popular: false,
      badge: "-30%",
      features: [
        L("Усе з квартального плану", "Everything in Quarterly"),
        L("Пожиттєва знижка для ранніх", "Lifetime early-adopter discount"),
        L("Ексклюзивна спільнота Atlas", "Exclusive Atlas community"),
        L("Доступ до бета-функцій", "Beta features access"),
        L("Максимальна економія 30%", "Maximum savings of 30%"),
      ],
    },
  ];

  return (
    <div data-testid="pricing-page" style={{ minHeight: "100vh", color: "#f5f5f7", background: "#000" }}>
      <Helmet>
        <title>{isEn ? "Pricing — Atlas AI for macOS" : "Ціни — Atlas AI для macOS"}</title>
        <meta
          name="description"
          content={isEn
            ? "Atlas AI pricing plans for macOS. Choose monthly, quarterly or yearly access to your autonomous AI assistant."
            : "Тарифні плани Atlas AI для macOS. Оберіть місячний, квартальний або річний доступ до автономного ШІ-асистента."}
        />
        <link rel="canonical" href={isEn ? "https://atlas-assistant.online/en/pricing" : "https://atlas-assistant.online/pricing"} />
      </Helmet>

      <Navbar onCta={() => navigate("/login")} />

      <main style={{ position: "relative", padding: "140px 5% 80px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p className="apple-eyebrow" style={{ margin: "0 0 14px" }}>{L("Тарифи", "Pricing")}</p>
          <h1
            style={{
              fontFamily: "var(--sf-display, -apple-system, BlinkMacSystemFont, sans-serif)",
              fontSize: "clamp(36px, 5.5vw, 64px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              color: "#f5f5f7",
              margin: 0,
              maxWidth: 860,
              marginInline: "auto"
            }}
          >
            {L("Один асистент. Безмежні можливості.", "One assistant. Limitless possibilities.")}
          </h1>
          <p style={{ color: "rgba(245,245,247,0.6)", fontSize: 18, lineHeight: 1.5, margin: "20px auto 0", maxWidth: 560 }}>
            {L(
              "Оберіть план, який підходить саме вам. Учасники черги отримають пожиттєву знижку.",
              "Pick the plan that fits you. Waitlist members get a lifetime discount."
            )}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            alignItems: "stretch"
          }}
        >
          {plans.map((plan) => (
            <article
              key={plan.id}
              data-testid={`pricing-plan-${plan.id}`}
              style={{
                background: plan.popular ? "#1d1d1f" : "#161617",
                border: plan.popular ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 22,
                padding: "36px 28px",
                display: "flex",
                flexDirection: "column",
                position: "relative"
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "5px 14px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    background: "#f5f5f7",
                    color: "#000",
                    whiteSpace: "nowrap"
                  }}
                >
                  {L("Найпопулярніший", "Most popular")}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em", margin: 0, color: "#f5f5f7" }}>
                  {plan.name}
                </h3>
                {plan.badge && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#0a84ff",
                      background: "rgba(10,132,255,0.12)",
                      padding: "2px 8px",
                      borderRadius: 6
                    }}
                  >
                    {plan.badge}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.03em", color: "#f5f5f7" }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: "rgba(245,245,247,0.5)" }}>{plan.per}</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(245,245,247,0.45)", marginTop: 4, marginBottom: 28 }}>{plan.billed}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28, flex: 1 }}>
                {plan.features.map((f, j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      fontSize: 14,
                      color: "rgba(245,245,247,0.78)",
                      lineHeight: 1.5
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(255,255,255,0.06)",
                        marginTop: 1
                      }}
                    >
                      <Check size={11} color="#f5f5f7" strokeWidth={2.5} />
                    </span>
                    {f}
                  </div>
                ))}
              </div>

              <button
                data-testid={`pricing-cta-${plan.id}`}
                onClick={() => navigate("/login")}
                style={{
                  width: "100%",
                  padding: "12px 22px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  border: "none",
                  background: plan.popular ? "#f5f5f7" : "rgba(255,255,255,0.06)",
                  color: plan.popular ? "#000" : "#f5f5f7",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                  transition: "background 0.2s ease, transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = plan.popular ? "#fff" : "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = plan.popular ? "#f5f5f7" : "rgba(255,255,255,0.06)";
                }}
              >
                {L("Отримати ранній доступ", "Get early access")}
                <ArrowRight size={14} />
              </button>
            </article>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 56, color: "rgba(245,245,247,0.5)", fontSize: 13 }}>
          {L(
            "Усі плани включають 7-денну гарантію повернення коштів. Без прихованих платежів.",
            "All plans include a 7-day money-back guarantee. No hidden fees."
          )}
          <div style={{ marginTop: 8, color: "#2997ff", fontWeight: 400 }}>
            {L("Учасники черги отримають пожиттєву знижку", "Waitlist members receive a lifetime discount")}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
