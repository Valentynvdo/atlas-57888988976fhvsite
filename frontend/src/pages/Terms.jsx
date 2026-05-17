import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scale, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(800px 500px at 50% 0%, rgba(157,76,221,0.12), transparent 60%), #000",
        color: "#fff",
        padding: "80px 24px 60px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.6)",
          borderRadius: 999,
          padding: "8px 16px",
          fontSize: 13,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          zIndex: 10,
        }}
      >
        <ArrowLeft size={14} /> На головну
      </button>

      <div
        className="glass"
        style={{
          maxWidth: "100%",
          width: "100%",
          margin: "0 auto",
          padding: "40px 5%",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(157,76,221,0.15)", display: "grid", placeItems: "center", color: "#9D4CDD" }}>
            <Scale size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Умови використання</h1>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Останнє оновлення: {new Date().toLocaleDateString("uk-UA")}</span>
          </div>
        </div>

        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: 15, marginBottom: 32 }}>
          Ласкаво просимо до Atlas AI. Будь ласка, уважно ознайомтеся з Умовами використання перед початком використання нашого програмного забезпечення та послуг ліцензування.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginTop: 24, marginBottom: 12 }}>
          1. Ліцензування та Активація
        </h2>
        <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
          {[
            { icon: <CheckCircle size={18} />, title: "Особисте використання", desc: "Ліцензійний ключ надає право на некомерційне індивідуальне використання додатка Atlas AI на тій кількості комп'ютерів Mac, яка передбачена вашим тарифним планом." },
            { icon: <AlertTriangle size={18} />, title: "Заборона передачі", desc: "Суворо заборонено копіювати, перепродавати, орендувати або розповсюджувати ліцензійні ключі третім особам. При виявленні підозрілої активності ліцензія блокується автоматично без права на повернення коштів." },
            { icon: <HelpCircle size={18} />, title: "Автономний доступ", desc: "У разі зміни вашого Mac ID ви можете самостійно відв'язати ключ від старого пристрою в особистому кабінеті користувача та прив'язати його до нового комп'ютера." }
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 14, border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ color: "#9D4CDD", flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginTop: 24, marginBottom: 12 }}>
          2. Оновлення та підписка
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: 14, marginBottom: 16 }}>
          Ми регулярно випускаємо оновлення безпеки, нові версії моделей мовлення та додаткові модулі (Skills). Довічні ліцензійні ключі отримують усі майбутні оновлення безкоштовно. Періодичні підписки діють протягом оплаченого розрахункового періоду.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginTop: 24, marginBottom: 12 }}>
          3. Повернення коштів
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: 14, marginBottom: 16 }}>
          Ми впевнені в якості Atlas AI і пропонуємо користувачам скористатися безкоштовним пробним ключем або демонстраційним режимом. Запит на повернення коштів може бути здійснений протягом 14 календарних днів з моменту придбання платної ліцензії, якщо програмне забезпечення не сумісне з конфігурацією вашої системи.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginTop: 24, marginBottom: 12 }}>
          4. Відмова від відповідальності
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: 14, marginBottom: 16 }}>
          Atlas AI надається за принципом «як є» (as is). Ми не несемо відповідальності за прямі чи непрямі збитки, втрату даних або працездатність сторонніх сервісів API (Gemini/OpenAI/Telegram), інтегрованих користувачем у свій локальний додаток.
        </p>
      </div>
    </div>
  );
}
