import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Check, ArrowRight, Sparkles, Zap, Crown } from "lucide-react";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import Navbar from "../components/atlas/Navbar";
import Footer from "../components/atlas/Footer";

export default function Pricing() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const navigate = useLocalizedNavigate();

  const L = (uk, en) => (isEn ? en : uk);

  const plans = [
    {
      id: "monthly",
      icon: <Zap size={22} color="#22D3EE" />,
      name: L("Місячний", "Monthly"),
      price: "$28.99",
      per: L("/ місяць", "/ month"),
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
      icon: <Sparkles size={22} color="#6D5DF6" />,
      name: L("Квартальний", "Quarterly"),
      price: "$23.33",
      per: L("/ місяць", "/ month"),
      billed: L("Оплата $69.99 / 3 міс.", "Billed $69.99 / 3 mos"),
      popular: true,
      features: [
        L("Усе з місячного плану", "Everything in Monthly"),
        L("Пріоритетна підтримка", "Priority support"),
        L("Ранній доступ до нових скілів", "Early access to new skills"),
        L("Генеративний Sandbox для скілів", "Generative skill Sandbox"),
        L("Знижка 20% порівняно з місячним", "20% cheaper than monthly"),
      ],
    },
    {
      id: "yearly",
      icon: <Crown size={22} color="#A78BFA" />,
      name: L("Річний", "Yearly"),
      price: "$19.99",
      per: L("/ місяць", "/ month"),
      billed: L("Оплата $239.99 / рік", "Billed $239.99 / year"),
      popular: false,
      badge: "-30%",
      features: [
        L("Усе з квартального плану", "Everything in Quarterly"),
        L("Пожиттєва знижка для ранніх користувачів", "Lifetime early-adopter discount"),
        L("Ексклюзивна спільнота Atlas", "Exclusive Atlas community"),
        L("Доступ до бета-функцій", "Beta features access"),
        L("Максимальна економія 30%", "Maximum savings of 30%"),
      ],
    },
  ];

  return (
    <div data-testid="pricing-page" style={{ minHeight: "100vh", color: "#fff", position: "relative", overflow: "hidden" }}>
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

      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: -220, left: "50%", transform: "translateX(-50%)",
        width: 1000, height: 560,
        background: "radial-gradient(ellipse, rgba(109,93,246,0.18), transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      <main style={{ position: "relative", padding: "160px 5% 100px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }} className="fade-up">
          <div className="section-eyebrow">{L("Тарифи", "Pricing")}</div>
          <h1 style={{
            marginTop: 16,
            fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            background: "linear-gradient(120deg, #fff 0%, #d8d2ff 50%, #22D3EE 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            margin: "16px 0 0",
          }}>
            {L("Один асистент. Безмежні можливості.", "One assistant. Limitless possibilities.")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 18, marginTop: 20, maxWidth: 560, margin: "20px auto 0", lineHeight: 1.6 }}>
            {L(
              "Оберіть план, який підходить саме вам. Учасники черги очікування отримають пожиттєву знижку.",
              "Pick the plan that fits you. Waitlist members get a lifetime discount."
            )}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 28, alignItems: "stretch" }}>
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`pricing-card fade-up ${plan.popular ? "popular" : ""}`}
              data-testid={`pricing-plan-${plan.id}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: -14,
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "6px 18px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: "linear-gradient(135deg, #6D5DF6, #7C3AED)",
                  boxShadow: "0 8px 24px rgba(109,93,246,0.45)",
                  whiteSpace: "nowrap",
                }}>
                  {L("Найпопулярніший", "Most popular")}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 14, display: "grid", placeItems: "center",
                  background: "rgba(109,93,246,0.1)", border: "1px solid rgba(109,93,246,0.25)",
                }}>
                  {plan.icon}
                </div>
                <div style={{ fontSize: 18, fontWeight: 650, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
                  {plan.name}
                  {plan.badge && (
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: "#22D3EE",
                      background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)",
                      padding: "2px 10px", borderRadius: 999,
                    }}>{plan.badge}</span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.04em" }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>{plan.per}</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6, marginBottom: 28 }}>{plan.billed}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32, flex: 1 }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 14.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      display: "grid", placeItems: "center",
                      background: plan.popular ? "rgba(109,93,246,0.2)" : "rgba(34,211,238,0.12)",
                    }}>
                      <Check size={12} color={plan.popular ? "#8d7dff" : "#22D3EE"} />
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
                  padding: "15px 24px",
                  borderRadius: 16,
                  fontSize: 15,
                  fontWeight: 650,
                  cursor: "pointer",
                  border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.14)",
                  background: plan.popular
                    ? "linear-gradient(135deg, #6D5DF6, #4F46E5)"
                    : "rgba(255,255,255,0.05)",
                  color: "#fff",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  transition: "transform 0.3s cubic-bezier(0.2,0.7,0.2,1), box-shadow 0.3s ease, background 0.3s ease",
                  boxShadow: plan.popular ? "0 10px 32px rgba(109,93,246,0.35)" : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = plan.popular
                    ? "0 16px 44px rgba(109,93,246,0.5)"
                    : "0 10px 30px rgba(109,93,246,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = plan.popular ? "0 10px 32px rgba(109,93,246,0.35)" : "none";
                }}
              >
                {L("Отримати ранній доступ", "Get early access")}
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 56, color: "rgba(255,255,255,0.45)", fontSize: 14 }} className="fade-up">
          {L(
            "Усі плани включають 7-денну гарантію повернення коштів. Без прихованих платежів.",
            "All plans include a 7-day money-back guarantee. No hidden fees."
          )}
          <div style={{ marginTop: 12, color: "#22D3EE", fontWeight: 500 }}>
            {L("Учасники черги отримають пожиттєву знижку", "Waitlist members receive a lifetime discount")}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
