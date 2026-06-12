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
      icon: <Terminal size={24} color="#22D3EE" />,
      accent: "#22D3EE",
    },
    {
      file: "evolution.py · plan.md",
      title: "Автономна Само-Еволюція",
      desc: "Унікальний цикл самовдосконалення: асистент аналізує свої помилки, пише нові скіли, проводить тестування та оновлює свій код.",
      status: "Працює локально",
      icon: <Code size={24} color="#7C3AED" />,
      accent: "#7C3AED",
    },
    {
      file: "semantic_memory.py",
      title: "Асоціативна Пам'ять",
      desc: "Зберігає контекст розмов, важливі факти про користувача та вибудовує довготривалу семантичну пам'ять у локальному JSON.",
      status: "Працює локально",
      icon: <BrainCircuit size={24} color="#6D5DF6" />,
      accent: "#6D5DF6",
    },
    {
      file: "autonomous_researcher.py",
      title: "Автономний Дослідник",
      desc: "Самостійно шукає інформацію в мережі, агрегує джерела, перевіряє факти (fact_checker.py) та готує аналітичні звіти.",
      status: "Працює локально",
      icon: <Search size={24} color="#22D3EE" />,
      accent: "#22D3EE",
    },
    {
      file: "apple_notes_connector.py · contacts_connector.py",
      title: "Нотатки та Контакти",
      desc: "Глибока інтеграція з базою контактів macOS, читання та запис у Apple Notes, а також аналіз історії викликів.",
      status: "Працює локально",
      icon: <Contact size={24} color="#7C3AED" />,
      accent: "#7C3AED",
    },
    {
      file: "proactive_watcher.py",
      title: "Проактивний Наглядач",
      desc: "Стежить за файловою системою, новими файлами та подіями на екрані, щоб вчасно пропонувати автоматизацію рутинних завдань.",
      status: "Працює локально",
      icon: <Eye size={24} color="#6D5DF6" />,
      accent: "#6D5DF6",
    },
    {
      file: "emotion_recognition.py · sarcasm_detector.py",
      title: "Емоційний Інтелект",
      desc: "Визначає настрій користувача, аналізує рівень стресу, розпізнає сарказм та підлаштовує стиль відповідей.",
      status: "Незабаром",
      icon: <Heart size={24} color="#F472B6" />,
      accent: "#F472B6",
    },
    {
      file: "eye_strain_reminder.py · sleep_advisor.py",
      title: "Турбота про Здоров'я",
      desc: "Стежить за часом безперервної роботи, нагадує про перерви для очей та аналізує графік сну відповідно до активності.",
      status: "Незабаром",
      icon: <Heart size={24} color="#F472B6" />,
      accent: "#F472B6",
    },
    {
      file: "vision_handler.py",
      title: "Зорове Сприйняття",
      desc: "Аналізує інтерфейс та вміст екрана користувача, розпізнає активні області та розуміє візуальний контекст роботи.",
      status: "Працює локально",
      icon: <Eye size={24} color="#22D3EE" />,
      accent: "#22D3EE",
    },
    {
      file: "privacy_guard.py · security_manager.py",
      title: "Конфіденційність та Безпека",
      desc: "Захищає конфіденційні дані, блокує небезпечні команди, фільтрує витік токенів та паролів, шифрує логи розмов.",
      status: "Працює локально",
      icon: <Lock size={24} color="#28C840" />,
      accent: "#28C840",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-container"
      style={{ padding: "120px 5%", position: "relative" }}
    >
      {/* Section heading */}
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <div className="section-eyebrow" style={{ marginBottom: 16 }}>
          Автоматизація macOS
        </div>
        <h2
          className="bento-heading gradient-text"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 700,
            fontFamily: "var(--sf-display, -apple-system, BlinkMacSystemFont, sans-serif)",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Реальні дії
          <br />
          у реальному світі.
        </h2>
        <p
          style={{
            marginTop: 24,
            fontSize: 20,
            letterSpacing: "-0.43px",
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 680,
            margin: "24px auto 0",
            fontFamily: "var(--sf-text, -apple-system, BlinkMacSystemFont, sans-serif)",
          }}
        >
          Атлас автоматизує вашу роботу на Mac. Він взаємодіє з операційною системою, керує даними та програмами, забезпечуючи максимальну продуктивність.
        </p>
      </div>

      {/* Floating Scripts Grid */}
      <div 
        className="script-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 32,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {scripts.map((script, i) => (
          <article
            key={i}
            data-card 
            data-testid={`features-card-${i}`}
            className="script-card group"
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              padding: "40px 32px",
              borderRadius: 32,
              background: "radial-gradient(140% 100% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 100%)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
              transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            {/* Top ambient glow */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${script.accent}55, transparent)`,
              opacity: 0.5
            }} />

            {/* Header: Status & Script Name */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ 
                  fontFamily: "var(--sf-text, monospace)", 
                  fontSize: 12, 
                  color: script.accent,
                  background: `linear-gradient(90deg, ${script.accent}15, transparent)`,
                  padding: "6px 14px",
                  borderRadius: 8,
                  borderLeft: `2px solid ${script.accent}`,
                  letterSpacing: "0.02em"
                }}>
                  {script.file}
                </span>
              </div>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: script.status === "Працює локально" ? "rgba(255,255,255,0.4)" : script.accent,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
                {script.status === "Працює локально" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.3 }} />}
                {script.status}
              </div>
            </div>

            {/* Title & Icon */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                background: `linear-gradient(135deg, ${script.accent}22, ${script.accent}05)`,
                border: `1px solid ${script.accent}33`,
              }}>
                {script.icon}
              </div>
              <h3 style={{
                fontSize: 22,
                fontWeight: 600,
                margin: 0,
                color: "#fff",
                letterSpacing: "-0.02em",
                fontFamily: "var(--sf-display, sans-serif)"
              }}>
                {script.title}
              </h3>
            </div>

            {/* Description */}
            <p style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6,
              margin: 0,
              fontFamily: "var(--sf-text, sans-serif)",
            }}>
              {script.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
