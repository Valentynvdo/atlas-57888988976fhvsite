import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Terminal, Code, Cpu, Search, Contact, Eye, Heart, Lock, Zap, BrainCircuit, X } from "lucide-react";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger);

export default function BentoFeatures() {
  const sectionRef = useRef(null);
  const [activeDemo, setActiveDemo] = useState(null);
  const { t, i18n } = useTranslation();

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

  const scripts = i18n.language === 'en' ? [
    {
      file: "active_app_applescript_helper.py",
      title: "Control & AppleScript",
      desc: "Direct macOS control: interact with active windows (Finder, Safari, Xcode, Terminal) and automate tasks via AppleScript.",
      status: "Works locally",
      icon: <Terminal size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "run active_app_applescript_helper.py" },
        { type: "info", text: "# connecting to Apple Events..." },
        { type: "success", text: "✓ Gained access to Finder and Safari" },
        { type: "cmd", text: "open new browser window" }
      ]
    },
    {
      file: "evolution.py · plan.md",
      title: "Autonomous Self-Evolution",
      desc: "Unique self-improvement cycle: the assistant analyzes its mistakes, writes new skills, runs tests, and updates its own code.",
      status: "Works locally",
      icon: <Code size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "analyzing errors in logs..." },
        { type: "info", text: "# detected suboptimal search loop" },
        { type: "success", text: "✓ Written and tested new algorithm" },
        { type: "cmd", text: "applied patch v1.0.42" }
      ]
    },
    {
      file: "semantic_memory.py",
      title: "Associative Memory",
      desc: "Stores conversation context, important user facts, and builds long-term semantic memory in a local JSON.",
      status: "Works locally",
      icon: <BrainCircuit size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "search mentions: 'favorite framework'" },
        { type: "info", text: "# scanning semantic graph..." },
        { type: "success", text: "✓ Found: React (saved 2 months ago)" },
        { type: "cmd", text: "generating response based on React" }
      ]
    },
    {
      file: "autonomous_researcher.py",
      title: "Autonomous Researcher",
      desc: "Independently searches information on the web, aggregates sources, verifies facts (fact_checker.py), and prepares analytical reports.",
      status: "Works locally",
      icon: <Search size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "research 'Apple Intelligence API'" },
        { type: "info", text: "# analyzing 14 reliable sources..." },
        { type: "success", text: "✓ Facts verified by fact_checker.py" },
        { type: "cmd", text: "exporting report to report.md" }
      ]
    },
    {
      file: "apple_notes_connector.py · contacts_connector.py",
      title: "Notes and Contacts",
      desc: "Deep integration with macOS contacts base, reading and writing to Apple Notes, and analyzing call history.",
      status: "Works locally",
      icon: <Contact size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "find note 'Atlas Ideas'" },
        { type: "info", text: "# connecting to local SQLite database..." },
        { type: "success", text: "✓ Found 3 matches, exporting text" },
        { type: "cmd", text: "received contact 'Max'" }
      ]
    },
    {
      file: "proactive_watcher.py",
      title: "Proactive Watcher",
      desc: "Monitors the file system, new files, and on-screen events to promptly suggest automation for routine tasks.",
      status: "Works locally",
      icon: <Eye size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "monitoring ~/Downloads" },
        { type: "info", text: "# detected 5 new .csv files" },
        { type: "success", text: "✓ Suggestion: 'Merge into general report?'" },
        { type: "cmd", text: "awaiting confirmation..." }
      ]
    },
    {
      file: "emotion_recognition.py · sarcasm_detector.py",
      title: "Emotional Intelligence",
      desc: "Detects the user's mood, analyzes stress levels, recognizes sarcasm, and adjusts the response style accordingly.",
      status: "Coming soon",
      icon: <Heart size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "analyzing text sentiment..." },
        { type: "info", text: "# detected pattern 'sarcasm' (92%)" },
        { type: "success", text: "✓ Adjusting response style (humorous)" },
        { type: "cmd", text: "generating empathetic feedback" }
      ]
    },
    {
      file: "eye_strain_reminder.py · sleep_advisor.py",
      title: "Health Care",
      desc: "Monitors continuous work time, reminds about eye breaks, and analyzes sleep schedule based on activity.",
      status: "Coming soon",
      icon: <Heart size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "activity check: 2 hours without breaks" },
        { type: "info", text: "# calculating eye strain..." },
        { type: "success", text: "✓ Showing notification: 'Time for a stretch'" },
        { type: "cmd", text: "reducing screen brightness by 20%" }
      ]
    },
    {
      file: "vision_handler.py",
      title: "Visual Perception",
      desc: "Analyzes user interface and screen content, recognizes active areas, and understands visual workflow context.",
      status: "Works locally",
      icon: <Eye size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "request screenshot: current window" },
        { type: "info", text: "# analyzing interface structure..." },
        { type: "success", text: "✓ Recognized 'Submit Form' button" },
        { type: "cmd", text: "passing coordinates to AppleScript" }
      ]
    },
    {
      file: "privacy_guard.py · security_manager.py",
      title: "Privacy & Security",
      desc: "Protects sensitive data, blocks dangerous commands, filters token and password leaks, and encrypts conversation logs.",
      status: "Works locally",
      icon: <Lock size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "filtering output data..." },
        { type: "info", text: "# detected API key in text (sk-***)" },
        { type: "success", text: "✓ Key successfully masked" },
        { type: "cmd", text: "log encrypted locally" }
      ]
    }
  ] : [
    {
      file: "active_app_applescript_helper.py",
      title: "Керування та AppleScript",
      desc: "Пряме керування macOS: взаємодія з активними вікнами (Finder, Safari, Xcode, Terminal) та автоматизація дій через AppleScript.",
      status: "Працює локально",
      icon: <Terminal size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "запустити active_app_applescript_helper.py" },
        { type: "info", text: "# підключення до Apple Events..." },
        { type: "success", text: "✓ Отримано доступ до Finder та Safari" },
        { type: "cmd", text: "відкрити нове вікно браузера" }
      ]
    },
    {
      file: "evolution.py · plan.md",
      title: "Автономна Само-Еволюція",
      desc: "Унікальний цикл самовдосконалення: асистент аналізує свої помилки, пише нові скіли, проводить тестування та оновлює свій код.",
      status: "Працює локально",
      icon: <Code size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "аналіз помилок у логах..." },
        { type: "info", text: "# виявлено неоптимальний цикл у пошуку" },
        { type: "success", text: "✓ Написано та протестовано новий алгоритм" },
        { type: "cmd", text: "застосовано патч v1.0.42" }
      ]
    },
    {
      file: "semantic_memory.py",
      title: "Асоціативна Пам'ять",
      desc: "Зберігає контекст розмов, важливі факти про користувача та вибудовує довготривалу семантичну пам'ять у локальному JSON.",
      status: "Працює локально",
      icon: <BrainCircuit size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "пошук згадок: 'улюблений фреймворк'" },
        { type: "info", text: "# сканування семантичного графа..." },
        { type: "success", text: "✓ Знайдено: React (збережено 2 міс. тому)" },
        { type: "cmd", text: "генерую відповідь на основі React" }
      ]
    },
    {
      file: "autonomous_researcher.py",
      title: "Автономний Дослідник",
      desc: "Самостійно шукає інформацію в мережі, агрегує джерела, перевіряє факти (fact_checker.py) та готує аналітичні звіти.",
      status: "Працює локально",
      icon: <Search size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "дослідити 'Apple Intelligence API'" },
        { type: "info", text: "# аналіз 14 надійних джерел..." },
        { type: "success", text: "✓ Факти перевірено fact_checker.py" },
        { type: "cmd", text: "експорт звіту в report.md" }
      ]
    },
    {
      file: "apple_notes_connector.py · contacts_connector.py",
      title: "Нотатки та Контакти",
      desc: "Глибока інтеграція з базою контактів macOS, читання та запис у Apple Notes, а також аналіз історії викликів.",
      status: "Працює локально",
      icon: <Contact size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "знайти нотатку 'Ідеї для Atlas'" },
        { type: "info", text: "# підключення до локальної бази SQLite..." },
        { type: "success", text: "✓ Знайдено 3 збіги, експорт тексту" },
        { type: "cmd", text: "отримано контакт 'Максим'" }
      ]
    },
    {
      file: "proactive_watcher.py",
      title: "Проактивний Наглядач",
      desc: "Стежить за файловою системою, новими файлами та подіями на екрані, щоб вчасно пропонувати автоматизацію рутинних завдань.",
      status: "Працює локально",
      icon: <Eye size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "моніторинг ~/Downloads" },
        { type: "info", text: "# виявлено 5 нових .csv файлів" },
        { type: "success", text: "✓ Пропоную: 'Звести у загальний звіт?'" },
        { type: "cmd", text: "очікую підтвердження..." }
      ]
    },
    {
      file: "emotion_recognition.py · sarcasm_detector.py",
      title: "Емоційний Інтелект",
      desc: "Визначає настрій користувача, аналізує рівень стресу, розпізнає сарказм та підлаштовує стиль відповідей.",
      status: "Незабаром",
      icon: <Heart size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "аналіз тональності тексту..." },
        { type: "info", text: "# виявлено патерн 'сарказм' (92%)" },
        { type: "success", text: "✓ Адаптую стиль відповіді (жартівливий)" },
        { type: "cmd", text: "генерую емпатичний відгук" }
      ]
    },
    {
      file: "eye_strain_reminder.py · sleep_advisor.py",
      title: "Турбота про Здоров'я",
      desc: "Стежить за часом безперервної роботи, нагадує про перерви для очей та аналізує графік сну відповідно до активності.",
      status: "Незабаром",
      icon: <Heart size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "перевірка активності: 2 год без перерв" },
        { type: "info", text: "# розрахунок навантаження на очі..." },
        { type: "success", text: "✓ Вивід сповіщення: 'Час зробити розминку'" },
        { type: "cmd", text: "зниження яскравості екрана на 20%" }
      ]
    },
    {
      file: "vision_handler.py",
      title: "Зорове Сприйняття",
      desc: "Аналізує інтерфейс та вміст екрана користувача, розпізнає активні області та розуміє візуальний контекст роботи.",
      status: "Працює локально",
      icon: <Eye size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "запит скріншоту: поточне вікно" },
        { type: "info", text: "# аналіз структури інтерфейсу..." },
        { type: "success", text: "✓ Розпізнано кнопку 'Submit Form'" },
        { type: "cmd", text: "передача координат до AppleScript" }
      ]
    },
    {
      file: "privacy_guard.py · security_manager.py",
      title: "Конфіденційність та Безпека",
      desc: "Захищає конфіденційні дані, блокує небезпечні команди, фільтрує витік токенів та паролів, шифрує логи розмов.",
      status: "Працює локально",
      icon: <Lock size={22} color="#f5f5f7" />,
      demoLines: [
        { type: "cmd", text: "фільтрація вихідних даних..." },
        { type: "info", text: "# виявлено API ключ у тексті (sk-***)" },
        { type: "success", text: "✓ Ключ успішно замасковано" },
        { type: "cmd", text: "запис зашифровано локально" }
      ]
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="section-container"
      style={{ padding: "100px 5%", position: "relative", maxWidth: 1200, margin: "0 auto" }}
    >
      {/* Section heading */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 64 }}>
        <p className="section-eyebrow apple-eyebrow" style={{ margin: "0 0 14px" }}>
          {i18n.language === 'en' ? "macOS Automation" : "Автоматизація macOS"}
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
          }}
        >
          {i18n.language === 'en' ? "Real actions in the real world." : "Реальні дії у реальному світі."}
        </h2>
        <p
          style={{
            marginTop: 20,
            fontSize: 19,
            letterSpacing: "-0.01em",
            lineHeight: 1.5,
            color: "rgba(245,245,247,0.6)",
            maxWidth: 640,
            fontFamily: "var(--sf-text, -apple-system, BlinkMacSystemFont, sans-serif)",
          }}
        >
          {i18n.language === 'en' ? "Atlas automates your work on Mac. It interacts with the operating system, manages data and applications, ensuring maximum productivity." : "Атлас автоматизує вашу роботу на Mac. Він взаємодіє з операційною системою, керує даними та програмами, забезпечуючи максимальну продуктивність."}
        </p>
      </div>

      {/* Features Grid — Apple Dark cards */}
      <div
        className="script-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {scripts.map((script, i) => (
          <button
            key={i}
            type="button"
            data-card
            data-testid={`features-card-${i}`}
            className="script-card feature-card-btn"
            onClick={() => setActiveDemo(i)}
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              padding: "28px 26px",
              borderRadius: 22,
              background: "#1d1d1f",
              border: "1px solid rgba(255,255,255,0.06)",
              transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease, background 0.3s ease",
              textAlign: "left",
              cursor: "pointer",
              color: "inherit",
              font: "inherit",
              flex: "1 1 300px",
              maxWidth: "380px",
              width: "100%",
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

            {/* "Click for demo" affordance */}
            <span
              style={{
                marginTop: 18,
                fontSize: 12,
                color: "#2997ff",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                letterSpacing: "-0.01em"
              }}
            >
              Подивитись демо ›
            </span>
          </button>
        ))}
      </div>

      {/* Demo modal — Apple-style backdrop */}
      {activeDemo !== null && (
        <FeatureDemoModal
          script={scripts[activeDemo]}
          onClose={() => setActiveDemo(null)}
        />
      )}
    </section>
  );
}

function FeatureDemoModal({ script, onClose }) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      data-testid="feature-demo-modal"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "modal-bg-in 0.3s var(--ease-out)"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(680px, 100%)",
          background: "linear-gradient(180deg, #1d1d1f 0%, #141416 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: "32px 32px 28px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          animation: "modal-card-in 0.45s var(--ease-out)",
          position: "relative",
        }}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          data-testid="feature-demo-close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "none",
            color: "#f5f5f7",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {script.icon}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 22, color: "#f5f5f7", letterSpacing: "-0.01em", fontWeight: 600 }}>
              {script.title}
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(245,245,247,0.5)", fontFamily: "var(--mono, monospace)" }}>
              {script.file}
            </p>
          </div>
        </div>

        <p style={{ color: "rgba(245,245,247,0.7)", fontSize: 15, lineHeight: 1.55, margin: "0 0 24px" }}>
          {script.desc}
        </p>

        {/* Animated terminal-like demo block */}
        <div
          style={{
            background: "#0a0a0b",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            padding: "16px 18px",
            fontFamily: "var(--mono, monospace)",
            fontSize: 13,
            lineHeight: 1.7,
            color: "rgba(245,245,247,0.85)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          </div>
          {script.demoLines?.map((line, idx) => (
            <div key={idx} className={`demo-line demo-line-${idx + 1}`}>
              {line.type === "cmd" && (
                <>
                  <span style={{ color: "#2997ff" }}>atlas &gt;</span> {line.text}
                  {idx === script.demoLines.length - 1 && <span className="demo-cursor">▎</span>}
                </>
              )}
              {line.type === "info" && (
                <span style={{ color: "rgba(245,245,247,0.45)" }}>{line.text}</span>
              )}
              {line.type === "success" && (
                <>
                  <span style={{ color: "#28c840" }}>{line.text.split(" ")[0]}</span> {line.text.substring(line.text.indexOf(" ") + 1)}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
