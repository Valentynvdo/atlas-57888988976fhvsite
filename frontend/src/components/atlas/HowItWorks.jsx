import { useTranslation } from "react-i18next";

/**
 * HowItWorks — Apple Dark 3-step section.
 * Replaces the LivingIntelligence / MacOSControl / SmartConcierge trio with a
 * single, focused "how it works" block (consolidated content, no duplicates).
 */
export default function HowItWorks() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const tx = (key, fallback) => {
    const v = t(key);
    return v === key ? fallback : v;
  };

  const steps = isEn
    ? [
        {
          title: "Install on your Mac",
          desc: "Lightweight macOS app. Runs locally. No telemetry, no cloud round-trips."
        },
        {
          title: "Speak or type",
          desc: "Atlas understands voice, text, screen context and files. It learns how you work."
        },
        {
          title: "Get things done",
          desc: "Drafts emails, schedules meetings, organises notes and triggers macOS actions for you."
        }
      ]
    : [
        {
          title: "Встановіть на Mac",
          desc: "Легкий macOS-додаток. Працює локально. Без телеметрії та хмарних запитів."
        },
        {
          title: "Говоріть або пишіть",
          desc: "Atlas розуміє голос, текст, контекст екрана і файлів. Він підлаштовується під вас."
        },
        {
          title: "Отримуйте результат",
          desc: "Пише листи, планує зустрічі, впорядковує нотатки та запускає дії в macOS за вас."
        }
      ];

  return (
    <section className="apple-section" id="how-it-works" data-testid="how-it-works-section">
      <p className="apple-eyebrow">{tx("howit.eyebrow", isEn ? "How it works" : "Як це працює")}</p>
      <h2>{tx("howit.title", isEn ? "Three steps to your personal AI." : "Три кроки до персонального ШІ.")}</h2>
      <p className="lead">
        {tx(
          "howit.lead",
          isEn
            ? "Atlas brings together voice, vision and automation into a single assistant — without ever sending your data to the cloud."
            : "Atlas поєднує голос, бачення екрана та автоматизацію в одному асистенті — без відправки даних у хмару."
        )}
      </p>

      <div className="steps-grid">
        {steps.map((s, i) => (
          <article key={i} className="step-card" data-testid={`howit-card-${i}`}>
            <span className="step-num">{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
