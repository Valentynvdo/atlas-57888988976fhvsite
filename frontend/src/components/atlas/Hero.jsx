import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

/**
 * Hero — Apple Dark.
 * Full-bleed top card with aurora + bottom seamless image showcase (no duplicate copy).
 */
export default function Hero({ onCta }) {
  const { t, i18n } = useTranslation();
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

        {/* Floating chat bubbles — beautiful parallax effect */}
        <div className="hero-chat-bubbles" aria-hidden="true">
          {(i18n.language === 'en' ? [
            { role: "user", text: "Summarize today's emails.", left: 5, delay: 0, duration: 32, scale: 0.7, blur: 3 },
            { role: "atlas", text: "7 new. 3 important — drafting reply.", left: 12, delay: 2, duration: 20, scale: 1.1, blur: 0 },
            { role: "user", text: "What's in the Apple contract?", left: 2, delay: 6, duration: 28, scale: 0.85, blur: 1.5 },
            { role: "atlas", text: "Clause 3.4 updated. No risks found.", left: 18, delay: 9, duration: 24, scale: 0.95, blur: 0.5 },
            { role: "user", text: "Extract data from financial report.", left: 8, delay: 14, duration: 35, scale: 0.6, blur: 4 },
            { role: "atlas", text: "Revenue increased by 14%.", left: 15, delay: 17, duration: 19, scale: 1.15, blur: 0 },
            { role: "user", text: "Schedule a team call.", left: 4, delay: 21, duration: 27, scale: 0.9, blur: 1 },
            { role: "atlas", text: "Everyone is free at 3 PM. Invites sent.", left: 10, delay: 24, duration: 23, scale: 1, blur: 0 },
            { role: "user", text: "Translate the contract to English.", left: 6, delay: 28, duration: 31, scale: 0.75, blur: 2.5 },
            { role: "atlas", text: "Translation ready. Saved.", left: 14, delay: 31, duration: 21, scale: 1.05, blur: 0 },
            { role: "user", text: "How many active users do we have?", left: 2, delay: 35, duration: 29, scale: 0.8, blur: 2 },
            { role: "atlas", text: "Over 25,000. Up +5% this week.", left: 11, delay: 38, duration: 25, scale: 0.95, blur: 0.5 },
            
            { role: "user", text: "Find the May presentation.", left: 75, delay: 1, duration: 26, scale: 0.9, blur: 1 },
            { role: "atlas", text: "Found 'Q2_May.key'. Open it?", left: 85, delay: 4, duration: 18, scale: 1.2, blur: 0 },
            { role: "user", text: "Prepare the sales report.", left: 70, delay: 8, duration: 34, scale: 0.65, blur: 3.5 },
            { role: "atlas", text: "Report ready. Send to director?", left: 82, delay: 11, duration: 22, scale: 1, blur: 0 },
            { role: "user", text: "Write the parsing code.", left: 88, delay: 16, duration: 30, scale: 0.75, blur: 2.5 },
            { role: "atlas", text: "Here is the Python script. Run it?", left: 72, delay: 19, duration: 20, scale: 1.1, blur: 0 },
            { role: "user", text: "Check server security.", left: 80, delay: 23, duration: 25, scale: 0.95, blur: 0.5 },
            { role: "atlas", text: "Found 2 vulnerabilities. Patching.", left: 86, delay: 26, duration: 24, scale: 1, blur: 0 },
            { role: "user", text: "What are my plans for tomorrow?", left: 74, delay: 30, duration: 32, scale: 0.7, blur: 3 },
            { role: "atlas", text: "3 meetings, 1 deadline. Check calendar.", left: 81, delay: 33, duration: 21, scale: 1.05, blur: 0 },
            { role: "user", text: "Optimize the database.", left: 78, delay: 37, duration: 28, scale: 0.85, blur: 1.5 },
            { role: "atlas", text: "Indexes updated. Speed +40%.", left: 84, delay: 40, duration: 19, scale: 1.15, blur: 0 }
          ] : [
            { role: "user", text: "Підсумуй сьогоднішні листи.", left: 5, delay: 0, duration: 32, scale: 0.7, blur: 3 },
            { role: "atlas", text: "7 нових. 3 важливі — готую відповідь.", left: 12, delay: 2, duration: 20, scale: 1.1, blur: 0 },
            { role: "user", text: "Що в контракті від Apple?", left: 2, delay: 6, duration: 28, scale: 0.85, blur: 1.5 },
            { role: "atlas", text: "Пункт 3.4 оновлено. Ризиків не знайдено.", left: 18, delay: 9, duration: 24, scale: 0.95, blur: 0.5 },
            { role: "user", text: "Зроби витяг з фінансового звіту.", left: 8, delay: 14, duration: 35, scale: 0.6, blur: 4 },
            { role: "atlas", text: "Дохід зріс на 14%.", left: 15, delay: 17, duration: 19, scale: 1.15, blur: 0 },
            { role: "user", text: "Заплануй дзвінок з командою.", left: 4, delay: 21, duration: 27, scale: 0.9, blur: 1 },
            { role: "atlas", text: "Всі вільні о 15:00. Запрошення надіслано.", left: 10, delay: 24, duration: 23, scale: 1, blur: 0 },
            { role: "user", text: "Переклади договір на англійську.", left: 6, delay: 28, duration: 31, scale: 0.75, blur: 2.5 },
            { role: "atlas", text: "Переклад готовий. Збережено.", left: 14, delay: 31, duration: 21, scale: 1.05, blur: 0 },
            { role: "user", text: "Скільки в нас активних юзерів?", left: 2, delay: 35, duration: 29, scale: 0.8, blur: 2 },
            { role: "atlas", text: "Понад 25,000. Зростання +5% за тиждень.", left: 11, delay: 38, duration: 25, scale: 0.95, blur: 0.5 },
            
            { role: "user", text: "Знайди презентацію за травень.", left: 75, delay: 1, duration: 26, scale: 0.9, blur: 1 },
            { role: "atlas", text: "Знайдено 'Q2_May.key'. Відкрити?", left: 85, delay: 4, duration: 18, scale: 1.2, blur: 0 },
            { role: "user", text: "Підготуй звіт про продажі.", left: 70, delay: 8, duration: 34, scale: 0.65, blur: 3.5 },
            { role: "atlas", text: "Звіт готовий. Відправити директору?", left: 82, delay: 11, duration: 22, scale: 1, blur: 0 },
            { role: "user", text: "Напиши код для парсингу.", left: 88, delay: 16, duration: 30, scale: 0.75, blur: 2.5 },
            { role: "atlas", text: "Ось скрипт на Python. Запускаю?", left: 72, delay: 19, duration: 20, scale: 1.1, blur: 0 },
            { role: "user", text: "Перевір безпеку сервера.", left: 80, delay: 23, duration: 25, scale: 0.95, blur: 0.5 },
            { role: "atlas", text: "Знайдено 2 вразливості. Застосовую патч.", left: 86, delay: 26, duration: 24, scale: 1, blur: 0 },
            { role: "user", text: "Які плани на завтра?", left: 74, delay: 30, duration: 32, scale: 0.7, blur: 3 },
            { role: "atlas", text: "3 зустрічі, 1 дедлайн. Деталі в календарі.", left: 81, delay: 33, duration: 21, scale: 1.05, blur: 0 },
            { role: "user", text: "Оптимізуй базу даних.", left: 78, delay: 37, duration: 28, scale: 0.85, blur: 1.5 },
            { role: "atlas", text: "Індекси оновлено. Швидкість зросла на 40%.", left: 84, delay: 40, duration: 19, scale: 1.15, blur: 0 }
          ]).map((msg, i) => (
            <div 
              key={`parallax-${i}`} 
              className={`hb parallax-bubble ${msg.role === "user" ? "hb-ask" : "hb-reply"}`}
              style={{
                left: `${msg.left}%`,
                animationDuration: `${msg.duration}s`,
                animationDelay: `-${msg.delay}s`,
                transform: `scale(${msg.scale})`,
                filter: `blur(${msg.blur}px)`,
                zIndex: Math.round(msg.scale * 10)
              }}
            >
              <span className="hb-label">{msg.role === "user" ? (i18n.language === 'en' ? "You" : "Ви") : "Atlas"}</span>
              {msg.text}
            </div>
          ))}
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

          {/* Clean product image — removed by request */}
        </div>
      </div>
    </section>
  );
}
