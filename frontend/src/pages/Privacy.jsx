import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, Key } from "lucide-react";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(800px 500px at 50% 0%, rgba(0,122,255,0.15), transparent 60%), #000",
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
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,229,255,0.1)", display: "grid", placeItems: "center", color: "#00E5FF" }}>
            <Shield size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Політика конфіденційності</h1>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Останнє оновлення: {new Date().toLocaleDateString("uk-UA")}</span>
          </div>
        </div>

        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: 15, marginBottom: 32 }}>
          Ми в Atlas AI ставимо вашу приватність на перше місце. Ця Політика конфіденційності описує, як наші додатки та сервіси взаємодіють з вашими даними. Наш фундаментальний принцип: **ваші дані належать тільки вам**.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginTop: 24, marginBottom: 12 }}>
          1. Які дані ми збираємо
        </h2>
        <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
          {[
            { icon: <Lock size={18} />, title: "Акаунт та ліцензія", desc: "Ми зберігаємо вашу електронну пошту, ім'я та пароль (у зашифрованому вигляді через SHA-256) виключно для керування вашим акаунтом та активації ліцензійного ключа." },
            { icon: <Eye size={18} />, title: "Локальна обробка на Mac", desc: "Усі аудіозаписи (розпізнавання голосу через модель Vosk) та аналіз екрану обробляються локально на вашому комп'ютері. Ми ніколи не передаємо ваші голосові записи на наші сервери." },
            { icon: <Key size={18} />, title: "Діагностика ліцензій", desc: "Під час перевірки ліцензії система передає унікальний ідентифікатор комп'ютера (Mac ID) та ім'я пристрою для обмеження використання ключа на кількох Mac одночасно." }
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 14, border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ color: "#00E5FF", flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginTop: 24, marginBottom: 12 }}>
          2. Використання ШІ (Gemini & OpenAI)
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: 14, marginBottom: 16 }}>
          Додаток Atlas AI взаємодіє з сервісами штучного інтелекту Google Gemini та OpenAI для обробки текстових запитів користувача. Ці запити надсилаються безпосередньо через вказані вами в налаштуваннях особисті API-ключі або через захищений проксі ліцензійного сервера.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginTop: 24, marginBottom: 12 }}>
          3. Безпека даних
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: 14, marginBottom: 16 }}>
          Всі дані передаються за допомогою зашифрованого протоколу HTTPS. Збереження паролів в базі даних здійснюється із використанням одностороннього криптографічного хешування SHA-256 та випадкової солі (salt). Доступ до особистого кабінету захищений httpOnly-куками сесії.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginTop: 24, marginBottom: 12 }}>
          4. Ваші права
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: 14, marginBottom: 16 }}>
          Ви маєте повне право в будь-який момент запросити видалення вашого акаунту та всіх пов'язаних з ним ліцензійних ключів з нашої бази даних. Для цього зверніться до нашого бота підтримки в Telegram (<a href="https://t.me/ATLAS_Support_Hub_bot" target="_blank" rel="noreferrer" style={{ color: "#00E5FF" }}>@ATLAS_Support_Hub_bot</a>) або надішліть запит на пошту, вказану в контактах.
        </p>
      </div>
    </div>
  );
}
