import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Mic, Send, MessageCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AtlasInteractions() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animation for cards
      gsap.fromTo(
        ".interaction-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="interactions"
      className="section-container"
      style={{ position: "relative", marginBottom: 120 }}
      ref={sectionRef}
    >
      {/* Section Header */}
      <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
        <div className="section-eyebrow" style={{ marginBottom: 16 }}>
          {t("atlas_v2.interactions.eyebrow")}
        </div>
        <h2
          className="bento-heading gradient-text"
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 700,
            fontFamily: "var(--sf-display, sans-serif)",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          {t("atlas_v2.interactions.title")}
        </h2>
        <p
          style={{
            marginTop: 20,
            fontSize: 17,
            letterSpacing: "-0.43px",
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.6)",
            maxWidth: 520,
            margin: "20px auto 0",
            fontFamily: "var(--sf-text, sans-serif)",
          }}
        >
          {t("atlas_v2.interactions.desc")}
        </p>
      </div>

      <div className="bento-container">
        {/* VOICE CONTROL CARD */}
        <article
          className="bento-card interaction-card"
          style={{
            gridColumn: "span 6",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            minHeight: 460,
          }}
        >
          {/* Glowing Background */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "80%",
              background:
                "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 60%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              padding: "40px",
              position: "relative",
              zIndex: 1,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(34,211,238,0.1)",
                  border: "1px solid rgba(34,211,238,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mic color="#22D3EE" size={20} />
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {t("atlas_v2.interactions.voice_title")}
              </h3>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 15,
                lineHeight: 1.5,
                maxWidth: "80%",
              }}
            >
              {t("atlas_v2.interactions.voice_desc")}
            </p>

            {/* Siri-like Waveform Visualization */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 40,
              }}
            >
              <VoiceWaveform />
            </div>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <VoiceCommandsCycle />
            </div>
          </div>
        </article>

        {/* TELEGRAM BOT CARD */}
        <article
          className="bento-card interaction-card"
          style={{
            gridColumn: "span 6",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            minHeight: 460,
          }}
        >
          {/* Glowing Background */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "80%",
              background:
                "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 60%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              padding: "40px 40px 0 40px",
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageCircle color="#7C3AED" size={20} />
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {t("atlas_v2.interactions.tg_title")}
              </h3>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 15,
                lineHeight: 1.5,
                maxWidth: "80%",
              }}
            >
              {t("atlas_v2.interactions.tg_desc")}
            </p>

            {/* Telegram Chat UI Mockup */}
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                marginTop: 30,
              }}
            >
              <TelegramMockup />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

// Simulated Siri/Apple Intelligence Waveform
function VoiceWaveform() {
  const bars = 24;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, height: 80 }}>
      {Array.from({ length: bars }).map((_, i) => {
        // Create a bell curve shape for the default height
        const distanceFromCenter = Math.abs(bars / 2 - i);
        const maxHeight = 80 - distanceFromCenter * 6;
        const minHeight = Math.max(10, maxHeight * 0.2);

        // Randomize animation durations to make it look organic
        const dur = 0.5 + Math.random() * 0.8;
        const delay = Math.random() * 0.5;

        return (
          <div
            key={i}
            style={{
              width: 4,
              borderRadius: 2,
              background: "linear-gradient(180deg, #22D3EE, #7C3AED)",
              boxShadow: "0 0 10px rgba(34,211,238,0.4)",
              animation: `wave ${dur}s ease-in-out ${delay}s infinite alternate`,
            }}
          >
            <style>{`
              @keyframes wave {
                0% { height: ${minHeight}px; }
                100% { height: ${Math.max(20, maxHeight + (Math.random() * 20 - 10))}px; }
              }
            `}</style>
          </div>
        );
      })}
    </div>
  );
}

// Cycling text for voice commands
function VoiceCommandsCycle() {
  const { t } = useTranslation();
  const commands = [
    t("atlas_v2.mockups.commands.0"),
    t("atlas_v2.mockups.commands.1"),
    t("atlas_v2.mockups.commands.2"),
    t("atlas_v2.mockups.commands.3"),
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % commands.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, [commands.length]);

  return (
    <div
      style={{
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {commands.map((cmd, i) => (
        <span
          key={i}
          style={{
            position: i === index ? "relative" : "absolute",
            opacity: i === index ? 1 : 0,
            transform: i === index ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {cmd}
        </span>
      ))}
    </div>
  );
}

// Simulated Telegram Chat with cycling scenarios
function TelegramMockup() {
  const { t } = useTranslation();

  const telegramScenarios = [
    {
      req: t("atlas_v2.mockups.telegram.0.req"),
      res: t("atlas_v2.mockups.telegram.0.res"),
    },
    {
      req: t("atlas_v2.mockups.telegram.1.req"),
      res: t("atlas_v2.mockups.telegram.1.res"),
    },
    {
      req: t("atlas_v2.mockups.telegram.2.req"),
      res: t("atlas_v2.mockups.telegram.2.res"),
    },
  ];

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeoutId;
    let typingTimeoutId;

    const playScenario = () => {
      const current = telegramScenarios[scenarioIndex];
      // Start with user message
      setMessages([
        { id: Date.now(), sender: "user", text: current.req, time: "14:23" },
      ]);
      setIsTyping(true);

      // Wait for typing, then show bot response
      typingTimeoutId = setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: current.res,
            time: "14:23",
          },
        ]);
      }, 1800); // 1.8 seconds typing

      // Schedule next scenario
      timeoutId = setTimeout(() => {
        setScenarioIndex((prev) => (prev + 1) % telegramScenarios.length);
      }, 5500); // 5.5 seconds per scenario
    };

    playScenario();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(typingTimeoutId);
    };
  }, [scenarioIndex]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 340,
        background: "rgba(10, 15, 25, 0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderBottom: "none",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0 -10px 40px rgba(0,0,0,0.3)",
      }}
    >
      {/* Telegram Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingBottom: 16,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #22D3EE, #7C3AED)",
            padding: 2,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "#0a0f19",
              display: "grid",
              placeItems: "center",
            }}
          >
            <span style={{ fontSize: 16 }}>🪐</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
            Atlas AI Hub
          </div>
          <div style={{ fontSize: 12, color: "#22D3EE" }}>
            {isTyping ? "typing..." : t("atlas_v2.mockups.telegram_ui.bot")}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minHeight: 140,
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
              background:
                m.sender === "user" ? "#6D5DF6" : "rgba(255,255,255,0.08)",
              padding: "10px 14px",
              borderRadius: 18,
              borderBottomRightRadius: m.sender === "user" ? 4 : 18,
              borderBottomLeftRadius: m.sender === "bot" ? 4 : 18,
              maxWidth: "85%",
              color: "#fff",
              fontSize: 14,
              lineHeight: 1.4,
              position: "relative",
              animation:
                "msg-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
            }}
          >
            {m.text}
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.5)",
                textAlign: "right",
                marginTop: 4,
              }}
            >
              {m.time}
            </div>
          </div>
        ))}
        {isTyping && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "rgba(255,255,255,0.08)",
              padding: "12px 16px",
              borderRadius: 18,
              borderBottomLeftRadius: 4,
              animation: "msg-pop 0.3s forwards",
            }}
          >
            <div style={{ display: "flex", gap: 4 }}>
              <div
                className="typing-dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.5)",
                  animation: "type 1.4s infinite 0s",
                }}
              />
              <div
                className="typing-dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.5)",
                  animation: "type 1.4s infinite 0.2s",
                }}
              />
              <div
                className="typing-dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.5)",
                  animation: "type 1.4s infinite 0.4s",
                }}
              />
            </div>
            <style>{`
              @keyframes msg-pop {
                0% { opacity: 0; transform: scale(0.9) translateY(10px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
              }
              @keyframes type {
                0%, 100% { transform: translateY(0); opacity: 0.5; }
                50% { transform: translateY(-4px); opacity: 1; }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Input area mockup */}
      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
        <div
          style={{
            flex: 1,
            height: 36,
            borderRadius: 18,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            {t("atlas_v2.mockups.telegram_ui.message")}
          </span>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#6D5DF6",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Send size={16} color="#fff" style={{ marginLeft: -2 }} />
        </div>
      </div>
    </div>
  );
}
