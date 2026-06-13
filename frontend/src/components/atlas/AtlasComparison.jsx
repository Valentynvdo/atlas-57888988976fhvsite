import { useTranslation } from "react-i18next";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Typewriter effect component - optimized to start immediately
const Typewriter = ({ text, delay = 0, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay, speed]);

  return <span>{displayedText}</span>;
};

export default function AtlasComparison() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef(null);
  
  // Key used to force remount of animations so they loop indefinitely
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoopKey(prev => prev + 1);
    }, 4000); // Repeat every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const isEn = i18n.language === 'en';

  const sequence = [
    { type: "normal", text: isEn ? "Every chat is a blank slate." : "Кожен чат — чистий аркуш." },
    { 
      type: "atlas", 
      text: isEn ? "Builds deep semantic memory." : "Формує глибоку семантичну пам'ять.",
      animation: (
        <div key={`mem-${loopKey}`} style={{ fontFamily: "monospace", color: "#28c840", fontSize: "clamp(12px, 1.5vw, 16px)", marginTop: "24px", opacity: 0.8, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div><span style={{ color: "rgba(255,255,255,0.3)" }}>&gt;</span> <Typewriter text="[INDEXING MEMORY_BANK_04]" delay={0} /></div>
          <div><span style={{ color: "rgba(255,255,255,0.3)" }}>&gt;</span> <Typewriter text="Saving context map... [OK]" delay={300} /></div>
          <div><span style={{ color: "rgba(255,255,255,0.3)" }}>&gt;</span> <Typewriter text="Semantic graph updated." delay={600} /></div>
        </div>
      )
    },
    
    { type: "normal", text: isEn ? "Limited by hardcoded skills." : "Обмежений зашитими навичками." },
    { 
      type: "atlas", 
      text: isEn ? "Writes code to improve itself." : "Самостійно пише код для розвитку.",
      animation: (
        <div key={`code-${loopKey}`} style={{ fontFamily: "monospace", color: "#2997ff", fontSize: "clamp(12px, 1.5vw, 16px)", marginTop: "24px", textAlign: "left", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", borderLeft: "2px solid #2997ff", display: "inline-block" }}>
          <Typewriter text="def optimize_subsystem():" delay={0} speed={10} /><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<Typewriter text="model.compile(loss='auto')" delay={200} speed={10} /><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<Typewriter text="return 'Execution enhanced'" delay={400} speed={10} />
          <span className="cursor-blink" style={{ marginLeft: "4px" }}>█</span>
        </div>
      )
    },
    
    { type: "normal", text: isEn ? "Always waits for your command." : "Завжди чекає на вашу команду." },
    { 
      type: "atlas", 
      text: isEn ? "Acts autonomously without prompts." : "Діє автономно без очікування команд.",
      animation: (
        <div style={{ fontFamily: "monospace", color: "#ff9f0a", fontSize: "clamp(14px, 2vw, 20px)", marginTop: "24px", display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", textTransform: "uppercase", letterSpacing: "2px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff9f0a", boxShadow: "0 0 10px #ff9f0a" }} />
          SYSTEM ACTIVE <span className="cursor-blink">_</span>
        </div>
      )
    },
    
    { type: "normal", text: isEn ? "Blind to your environment." : "Не бачить вашого екрану." },
    { 
      type: "atlas", 
      text: isEn ? "Analyzes screen and controls macOS." : "Аналізує екран та керує macOS.",
      animation: (
        <div style={{ position: "relative", width: "100%", maxWidth: "300px", height: "100px", marginTop: "32px", border: "1px solid rgba(40, 200, 64, 0.3)", display: "flex", justifyContent: "center", alignItems: "center", margin: "32px auto 0 auto" }}>
          <div style={{ position: "absolute", top: -5, left: -5, width: 10, height: 10, borderTop: "2px solid #28c840", borderLeft: "2px solid #28c840" }} />
          <div style={{ position: "absolute", top: -5, right: -5, width: 10, height: 10, borderTop: "2px solid #28c840", borderRight: "2px solid #28c840" }} />
          <div style={{ position: "absolute", bottom: -5, left: -5, width: 10, height: 10, borderBottom: "2px solid #28c840", borderLeft: "2px solid #28c840" }} />
          <div style={{ position: "absolute", bottom: -5, right: -5, width: 10, height: 10, borderBottom: "2px solid #28c840", borderRight: "2px solid #28c840" }} />
          <div style={{ color: "#28c840", fontFamily: "monospace", fontSize: "12px", letterSpacing: "1px" }}>
            [ TARGET ACQUIRED ]
          </div>
          <div className="scanner-line" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "2px", background: "#28c840", boxShadow: "0 0 10px #28c840" }} />
        </div>
      )
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=800%", 
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // Initially setup text blocks
      gsap.set(".comp-text", { opacity: 0, y: 100, filter: "blur(20px)" });
      gsap.set(".text-0", { opacity: 1, y: 0, filter: "blur(0px)" });

      for (let i = 0; i < sequence.length - 1; i++) {
        const stepTime = i * 2;
        
        // Fade out current
        tl.to(`.text-${i}`, {
          opacity: 0,
          y: -100,
          filter: "blur(20px)",
          duration: 1.5,
          ease: "power2.inOut"
        }, stepTime);

        // Fade in next
        tl.to(`.text-${i+1}`, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power2.out"
        }, stepTime + 1.0); // Smooth overlap
      }

      tl.to({}, { duration: 1 });

    }, sectionRef);

    return () => ctx.revert();
  }, [sequence.length]);

  return (
    <section 
      id="comparison"
      ref={sectionRef} 
      style={{ 
        width: "100%", 
        height: "100vh", 
        background: "#000", 
        position: "relative", 
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .scanner-line {
          animation: scan 3s linear infinite;
        }
        @media (max-width: 768px) {
          .responsive-text {
            white-space: normal !important;
          }
          .responsive-text-container > div:first-child {
            white-space: normal !important;
            word-break: break-word;
          }
          .responsive-code {
            white-space: pre-wrap !important;
            word-break: break-word;
          }
        }
      `}</style>

      {/* Deep Space Background */}
      <div 
        style={{ 
          position: "absolute", 
          inset: 0, 
          background: "radial-gradient(circle at center, rgba(30,30,35,0.4) 0%, #000 70%)", 
          zIndex: 0
        }} 
      />

      {/* Main Title - Static at top */}
      <div style={{ position: "absolute", top: 80, zIndex: 1, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 className="responsive-text" style={{ fontSize: "clamp(24px, 4vw, 48px)", color: "rgba(255,255,255,0.3)", margin: 0, fontWeight: 500, letterSpacing: "-0.02em", fontFamily: "var(--sf-display, sans-serif)", whiteSpace: "nowrap" }}>
          {isEn ? "Not just a chatbot." : "Це не просто чат-бот."}
        </h2>
      </div>

      {/* The Central Stage for Typography */}
      <div style={{ position: "relative", width: "100%", maxWidth: 1200, height: "100%", zIndex: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
        
        {sequence.map((item, idx) => {
          const isAtlas = item.type === "atlas";
          
          return (
            <div 
              key={idx}
              className={`comp-text text-${idx} responsive-text-container`}
              style={{
                position: "absolute",
                width: "100%",
                padding: "0 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Everything centered now
                textAlign: "center",
              }}
            >
              {/* Label indicating Standard AI vs ATLAS */}
              <div style={{
                marginBottom: 16,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "var(--mono, monospace)",
                color: isAtlas ? "#2997ff" : "rgba(255,255,255,0.4)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: isAtlas ? "rgba(41, 151, 255, 0.1)" : "rgba(255,255,255,0.05)",
                padding: "6px 14px",
                borderRadius: 20,
                border: isAtlas ? "1px solid rgba(41, 151, 255, 0.2)" : "1px solid rgba(255,255,255,0.1)"
              }}>
                {isAtlas ? (
                  <>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2997ff", boxShadow: "0 0 8px #2997ff" }} />
                    ATLAS
                  </>
                ) : (
                  <>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                    {isEn ? "Standard AI" : "Звичайний ШІ"}
                  </>
                )}
              </div>
              <div style={{ 
                color: isAtlas ? "#fff" : "rgba(255,255,255,0.3)", 
                fontSize: isAtlas ? "clamp(40px, 6vw, 84px)" : "clamp(24px, 4vw, 64px)", 
                fontWeight: isAtlas ? 700 : 400, 
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                fontFamily: "var(--sf-display, sans-serif)",
                textShadow: isAtlas ? "0 10px 40px rgba(255,255,255,0.1)" : "none",
                whiteSpace: "nowrap" // Never wrap to next line
              }}>
                {item.text}
              </div>

              {/* Render dynamic animations unconditionally so they show up immediately */}
              {isAtlas && (
                <div style={{ width: "100%", maxWidth: 600, display: "flex", justifyContent: "center" }}>
                  {item.animation}
                </div>
              )}
            </div>
          );
        })}

      </div>

      {/* Progress Indicator */}
      <div style={{ position: "absolute", bottom: 60, zIndex: 1, display: "flex", gap: 12 }}>
        {sequence.map((_, i) => (
          <div key={i} className={`dot-${i}`} style={{ width: 40, height: 2, background: "rgba(255,255,255,0.1)" }} />
        ))}
      </div>
      <style>{`
        ${sequence.map((_, i) => `
          .text-${i} ~ .dot-${i} {
            background: #fff !important;
            box-shadow: 0 0 10px rgba(255,255,255,0.5);
          }
        `).join('')}
      `}</style>

    </section>
  );
}
