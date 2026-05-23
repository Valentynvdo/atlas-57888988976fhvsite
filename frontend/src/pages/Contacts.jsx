import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, Globe, Navigation, Send } from "lucide-react";

export default function Contacts() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(800px 500px at 50% 0%, rgba(0,229,255,0.1), transparent 60%), #000",
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
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,229,255,0.12)", display: "grid", placeItems: "center", color: "#00E5FF" }}>
            <Mail size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Контакти</h1>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Зв'яжіться з нашою командою у будь-який час</span>
          </div>
        </div>

        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: 15, marginBottom: 36 }}>
          Маєте запитання щодо ліцензування, партнерства чи потрібна допомога з налаштуванням Atlas AI на вашому Mac? Ми завжди раді відповісти та допомогти вам розібратися!
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
          {[
            { icon: <MessageSquare size={20} />, label: "Telegram Підтримка", value: "@atlas_support", href: "https://t.me/atlas_support" },
            { icon: <Mail size={20} />, label: "Email Адреса", value: "support@atlas-ai.com", href: "mailto:support@atlas-ai.com" },
            { icon: <Navigation size={20} />, label: "Розробка та Офіс", value: "Київ, Україна", href: "#" }
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : "_self"}
              rel="noreferrer"
              style={{
                textDecoration: "none",
                color: "#fff",
                padding: "24px 20px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)";
                e.currentTarget.style.background = "rgba(0,229,255,0.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,229,255,0.08)", display: "grid", placeItems: "center", color: "#00E5FF" }}>
                {item.icon}
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>{item.value}</div>
              </div>
            </a>
          ))}
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginTop: 24, marginBottom: 20 }}>
          Надіслати пряме повідомлення
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Повідомлення успішно відправлено! Ми відповімо вам найближчим часом.");
            e.target.reset();
          }}
          style={{ display: "grid", gap: 16 }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Ім'я</label>
              <input type="text" required placeholder="Ваше ім'я" style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontSize: 14 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Email</label>
              <input type="email" required placeholder="name@domain.com" style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontSize: 14 }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Повідомлення</label>
            <textarea required rows={4} placeholder="Напишіть ваше запитання або пропозицію тут..." style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontSize: 14, resize: "vertical" }} />
          </div>

          <button
            type="submit"
            className="cta-btn"
            style={{
              justifyContent: "center",
              marginTop: 8,
              padding: "12px 24px",
              fontSize: 14,
            }}
          >
            Надіслати <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
