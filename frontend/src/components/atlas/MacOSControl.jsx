import { Command, AppWindow, ShieldCheck, Mic, Trash2, Camera } from "lucide-react";

const cards = [
  {
    icon: <Command size={24} />,
    accent: "#007AFF",
    title: "Керування Mac",
    headline: "Одне слово — і система підкоряється.",
    desc: "Голосові команди, гарячі дії та контекстне розуміння того, що вам потрібно прямо зараз.",
    extras: [
      { icon: <Mic size={14} />, label: "Голос" },
      { icon: <Command size={14} />, label: "Команди" },
    ],
  },
  {
    icon: <AppWindow size={24} />,
    accent: "#9D4CDD",
    title: "Робота з програмами",
    headline: "Відкриття, редагування та закриття додатків.",
    desc: "Атлас вільно навігує між застосунками, виконує дії всередині них і повертає вам сфокусований простір.",
    extras: [
      { icon: <AppWindow size={14} />, label: "Multi-app" },
      { icon: <Command size={14} />, label: "Workflow" },
    ],
  },
  {
    icon: <ShieldCheck size={24} />,
    accent: "#00E5FF",
    title: "Безпека та система",
    headline: "Перевірка стану камери, керування файлами, очищення кошика.",
    desc: "Прозорий контроль над пристроєм. Ви завжди знаєте, що відбувається — і що вимкнено.",
    extras: [
      { icon: <Camera size={14} />, label: "Камера" },
      { icon: <Trash2 size={14} />, label: "Файли" },
    ],
  },
];

export default function MacOSControl() {
  return (
    <section
      id="macos"
      data-testid="macos-section"
      className="section-container"
      style={{ position: "relative" }}
    >
      <div className="reveal" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
        <div className="section-eyebrow">Повний контроль над macOS</div>
        <h2
          data-testid="macos-title"
          style={{
            marginTop: 16,
            fontSize: "clamp(2rem, 4.6vw, 4rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            fontWeight: 600,
          }}
        >
          <span className="gradient-text">Глибока інтеграція</span>
          <br />
          <span
            style={{
              color: "rgba(255,255,255,0.55)",
              fontWeight: 500,
            }}
          >
            з вашою системою.
          </span>
        </h2>
        <p
          style={{
            marginTop: 20,
            color: "rgba(255,255,255,0.65)",
            fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
            lineHeight: 1.6,
          }}
        >
          Атлас — не просто чат. Це справжній співпілот для вашого Mac, який
          розуміє контекст і діє точно тоді, коли потрібно.
        </p>
      </div>

      <div
        className="mt-16"
        style={{
          marginTop: 64,
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {cards.map((c, i) => (
          <article
            key={c.title}
            data-testid={`macos-card-${i}`}
            className={`glass reveal delay-${i + 1}`}
            style={{
              borderRadius: 28,
              padding: 28,
              position: "relative",
              overflow: "hidden",
              minHeight: 380,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Accent corner glow */}
            <div
              style={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${c.accent}33, transparent 70%)`,
                filter: "blur(20px)",
                pointerEvents: "none",
              }}
            />

            {/* Mac window mockup top */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 28,
              }}
            >
              <span className="mac-dots">
                <span />
                <span />
                <span />
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Atlas · macOS
              </span>
            </div>

            {/* Icon */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                display: "grid",
                placeItems: "center",
                background: `linear-gradient(135deg, ${c.accent}33, ${c.accent}11)`,
                border: `1px solid ${c.accent}55`,
                color: c.accent,
                boxShadow: `0 0 32px ${c.accent}33`,
                marginBottom: 24,
              }}
            >
              {c.icon}
            </div>

            <h3
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              {c.title}
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.5,
                marginBottom: 12,
                fontWeight: 500,
              }}
            >
              {c.headline}
            </p>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.6,
                flex: 1,
              }}
            >
              {c.desc}
            </p>

            {/* Tags */}
            <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
              {c.extras.map((e, j) => (
                <span
                  key={j}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {e.icon}
                  {e.label}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
