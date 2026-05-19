import { useRef } from "react";
import {
  Brain,
  Terminal,
  FileText,
  Code,
  Calendar,
  Music,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const items = [
  {
    icon: <Brain size={26} />,
    title: "Конспектування та Пам'ять",
    label: "Локальний контекст",
    desc: "Конспектує ваші зустрічі, запам'ятовує контекст розмов та вибудовує довготривалу асоціативну пам'ять.",
    grad: "linear-gradient(135deg, #00E5FF, #007AFF)",
    glow: "rgba(0,229,255,0.35)",
  },
  {
    icon: <Terminal size={26} />,
    title: "Керування macOS",
    label: "Системні скрипти",
    desc: "Виконує AppleScript, запускає та налаштовує програми, керує вікнами та оптимізує робоче середовище.",
    grad: "linear-gradient(135deg, #FF6B6B, #FF9A3C)",
    glow: "rgba(255,107,107,0.3)",
  },
  {
    icon: <FileText size={26} />,
    title: "Аналіз документів",
    label: "Локальна обробка",
    desc: "Аналізує локальні PDF, CSV та бази даних без відправки конфіденційної інформації у хмару.",
    grad: "linear-gradient(135deg, #9D4CDD, #007AFF)",
    glow: "rgba(157,76,221,0.35)",
  },
  {
    icon: <Code size={26} />,
    title: "Автоматизація коду",
    label: "Створення скілів",
    desc: "Пише та виконує Python-скрипти в безпечній пісочниці, самостійно розширюючи свої можливості.",
    grad: "linear-gradient(135deg, #00E5FF, #9D4CDD)",
    glow: "rgba(0,229,255,0.3)",
  },
  {
    icon: <Calendar size={26} />,
    title: "Організація розкладу",
    label: "Розумне планування",
    desc: "Узгоджує зустрічі, створює нагадування, впорядковує списки завдань та стежить за дедлайнами.",
    grad: "linear-gradient(135deg, #FFD56B, #FF6B6B)",
    glow: "rgba(255,213,107,0.3)",
  },
  {
    icon: <Music size={26} />,
    title: "Медіа-контроль",
    label: "Аудіо & Відео",
    desc: "Інтегрується зі Spotify чи Apple Music, керує відтворенням відповідно до вашого настрою та поточного контексту.",
    grad: "linear-gradient(135deg, #007AFF, #00E5FF)",
    glow: "rgba(0,122,255,0.35)",
  },
];

export default function SmartConcierge() {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-card]");
    const step = card ? card.getBoundingClientRect().width + 20 : 320;
    track.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section
      id="concierge"
      data-testid="concierge-section"
      className="section-container"
      style={{ position: "relative" }}
    >
      <div
        className="reveal"
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
          marginBottom: 56,
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div className="section-eyebrow">Автоматизація macOS</div>
          <h2
            data-testid="concierge-title"
            style={{
              marginTop: 16,
              fontSize: "clamp(2rem, 4.6vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontWeight: 600,
            }}
          >
            <span className="gradient-text">Реальні дії</span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(120deg, #00E5FF, #9D4CDD)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              у реальному світі.
            </span>
          </h2>
          <p
            style={{
              marginTop: 20,
              color: "rgba(255,255,255,0.65)",
              fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            Атлас автоматизує вашу роботу на Mac. Він взаємодіє з операційною системою, керує даними та програмами, забезпечуючи максимальну продуктивність.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            data-testid="concierge-prev-btn"
            onClick={() => scroll(-1)}
            aria-label="Попередня"
            className="glass"
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            data-testid="concierge-next-btn"
            onClick={() => scroll(1)}
            aria-label="Наступна"
            className="glass"
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: 24,
          marginLeft: -24,
          marginRight: -24,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {items.map((item, i) => (
          <article
            key={item.title}
            data-card
            data-testid={`concierge-card-${i}`}
            className="glass concierge-card"
            style={{
              flex: "0 0 320px",
              maxWidth: 360,
              borderRadius: 28,
              padding: 28,
              scrollSnapAlign: "start",
              position: "relative",
              overflow: "hidden",
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Color halo */}
            <div
              style={{
                position: "absolute",
                top: -60,
                left: -60,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: item.grad,
                filter: "blur(60px)",
                opacity: 0.35,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                display: "grid",
                placeItems: "center",
                background: item.grad,
                color: "#fff",
                boxShadow: `0 12px 32px ${item.glow}`,
                position: "relative",
                zIndex: 1,
              }}
            >
              {item.icon}
            </div>

            <div
              style={{
                marginTop: 24,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                fontWeight: 600,
              }}
            >
              {item.label}
            </div>
            <h3
              style={{
                marginTop: 8,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                marginTop: 12,
                fontSize: 14,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.6,
                flex: 1,
              }}
            >
              {item.desc}
            </p>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "rgba(255,255,255,0.85)",
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#00E5FF",
                  boxShadow: "0 0 10px #00E5FF",
                }}
              />
              Скоро доступно
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
