import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Terminal, Code, Cpu, Search, Contact, Eye, Heart, Lock, Zap, BrainCircuit } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function BentoFeatures() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal header
      gsap.fromTo(
        ".bento-heading",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".bento-heading",
            start: "top 80%",
          },
        }
      );

      // Stagger reveal the cards
      gsap.fromTo(
        ".script-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".script-container",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scripts = [
    {
      file: "active_app_applescript_helper.py",
      title: "Керування та AppleScript",
      desc: "Пряме керування macOS: взаємодія з активними вікнами (Finder, Safari, Xcode, Terminal) та автоматизація дій через AppleScript.",
      status: "Працює локально",
      icon: <Terminal size={22} color="#f5f5f7" />,
    },
    {
      file: "evolution.py · plan.md",
      title: "Автономна Само-Еволюція",
      desc: "Унікальний цикл самовдосконалення: асистент аналізує свої помилки, пише нові скіли, проводить тестування та оновлює свій код.",
      status: "Працює локально",
      icon: <Code size={22} color="#f5f5f7" />,
    },
    {
      file: "semantic_memory.py",
      title: "Асоціативна Пам'ять",
      desc: "Зберігає контекст розмов, важливі факти про користувача та вибудовує довготривалу семантичну пам'ять у локальному JSON.",
      status: "Працює локально",
      icon: <BrainCircuit size={22} color="#f5f5f7" />,
    },
    {
      file: "autonomous_researcher.py",
      title: "Автономний Дослідник",
      desc: "Самостійно шукає інформацію в мережі, агрегує джерела, перевіряє факти (fact_checker.py) та готує аналітичні звіти.",
      status: "Працює локально",
      icon: <Search size={22} color="#f5f5f7" />,
    },
    {
      file: "apple_notes_connector.py · contacts_connector.py",
      title: "Нотатки та Контакти",
      desc: "Глибока інтеграція з базою контактів macOS, читання та запис у Apple Notes, а також аналіз історії викликів.",
      status: "Працює локально",
      icon: <Contact size={22} color="#f5f5f7" />,
    },
    {
      file: "proactive_watcher.py",
      title: "Проактивний Наглядач",
      desc: "Стежить за файловою системою, новими файлами та подіями на екрані, щоб вчасно пропонувати автоматизацію рутинних завдань.",
      status: "Працює локально",
      icon: <Eye size={22} color="#f5f5f7" />,
    },
    {
      file: "emotion_recognition.py · sarcasm_detector.py",
      title: "Емоційний Інтелект",
      desc: "Визначає настрій користувача, аналізує рівень стресу, розпізнає сарказм та підлаштовує стиль відповідей.",
      status: "Незабаром",
      icon: <Heart size={22} color="#f5f5f7" />,
    },
    {
      file: "eye_strain_reminder.py · sleep_advisor.py",
      title: "Турбота про Здоров'я",
      desc: "Стежить за часом безперервної роботи, нагадує про перерви для очей та аналізує графік сну відповідно до активності.",
      status: "Незабаром",
      icon: <Heart size={22} color="#f5f5f7" />,
    },
    {
      file: "vision_handler.py",
      title: "Зорове Сприйняття",
      desc: "Аналізує інтерфейс та вміст екрана користувача, розпізнає активні області та розуміє візуальний контекст роботи.",
      status: "Працює локально",
      icon: <Eye size={22} color="#f5f5f7" />,
    },
    {
      file: "privacy_guard.py · security_manager.py",
      title: "Конфіденційність та Безпека",
      desc: "Захищає конфіденційні дані, блокує небезпечні команди, фільтрує витік токенів та паролів, шифрує логи розмов.",
      status: "Працює локально",
      icon: <Lock size={22} color="#f5f5f7" />,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="section-container"
      style={{ padding: "100px 5%", position: "relative", maxWidth: 1200, margin: "0 auto" }}
    >
      {/* Section heading */}
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <p className="section-eyebrow apple-eyebrow" style={{ margin: "0 0 14px" }}>
          Автоматизація macOS
        </p>
        <h2
          className="bento-heading"
          style={{
            fontSize: "clamp(32px, 4.8vw, 56px)",
            fontWeight: 600,
            fontFamily: "var(--sf-display, -apple-system, BlinkMacSystemFont, sans-serif)",
            letterSpacing: "-0.025em",
            lineHeight: 1.08,
            color: "#f5f5f7",
            margin: 0,
            maxWidth: 820,
            marginInline: "auto"
          }}
        >
          Реальні дії у реальному світі.
        </h2>
        <p
          style={{
            marginTop: 20,
            fontSize: 19,
            letterSpacing: "-0.01em",
            lineHeight: 1.5,
            color: "rgba(245,245,247,0.6)",
            maxWidth: 640,
            margin: "20px auto 0",
            fontFamily: "var(--sf-text, -apple-system, BlinkMacSystemFont, sans-serif)",
          }}
        >
          Атлас автоматизує вашу роботу на Mac. Він взаємодіє з операційною системою, керує даними та програмами, забезпечуючи максимальну продуктивність.
        </p>
      </div>

      {/* Features Grid — Apple Dark cards */}
      <div
        className="script-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {scripts.map((script, i) => (
          <article
            key={i}
            data-card
            data-testid={`features-card-${i}`}
            className="script-card"
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              padding: "28px 26px",
              borderRadius: 22,
              background: "#1d1d1f",
              border: "1px solid rgba(255,255,255,0.06)",
              transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease",
            }}
          >
            {/* Header: file name + status */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 10 }}>
              <span
                style={{
                  fontFamily: "var(--mono, monospace)",
                  fontSize: 11,
                  color: "rgba(245,245,247,0.55)",
                  background: "rgba(255,255,255,0.04)",
                  padding: "4px 10px",
                  borderRadius: 6,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "70%"
                }}
              >
                {script.file}
              </span>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: script.status === "Працює локально" ? "rgba(245,245,247,0.45)" : "#0a84ff",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  whiteSpace: "nowrap"
                }}
              >
                {script.status === "Працює локально" && (
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#28c840" }} />
                )}
                {script.status}
              </div>
            </div>

            {/* Icon + Title */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {script.icon}
              </div>
              <h3
                style={{
                  fontSize: 19,
                  fontWeight: 600,
                  margin: 0,
                  color: "#f5f5f7",
                  letterSpacing: "-0.01em",
                  fontFamily: "var(--sf-display, sans-serif)",
                }}
              >
                {script.title}
              </h3>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 14,
                color: "rgba(245,245,247,0.55)",
                lineHeight: 1.55,
                margin: 0,
                fontFamily: "var(--sf-text, sans-serif)",
              }}
            >
              {script.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
