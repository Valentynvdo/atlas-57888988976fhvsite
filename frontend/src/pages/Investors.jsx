import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Target, TrendingUp, PieChart, Users, Mail, Sparkles, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Investors() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simple reveal animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".investor-reveal",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out"
        }
      );
      
      // Progress bar animation
      gsap.to(".progress-fill", {
        width: "5%", // Visual representation, e.g. 5% filled
        duration: 1.5,
        delay: 0.5,
        ease: "power3.out"
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      className="dashboard-wrapper" 
      style={{ 
        minHeight: "100vh", 
        background: "#05050A",
        backgroundImage: "radial-gradient(1200px 600px at 50% 10%, rgba(157, 76, 221, 0.08), transparent 60%), radial-gradient(800px 500px at 10% 70%, rgba(0, 229, 255, 0.07), transparent 60%)",
        color: "#fff",
        fontFamily: "var(--sf-text)",
        position: "relative",
        overflowX: "hidden"
      }}
    >
      <Helmet>
        <title>{t("investors_page.title")} | Atlas AI</title>
        <meta name="description" content={t("investors_page.subtitle")} />
      </Helmet>

      {/* Header */}
      <header 
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(5, 5, 10, 0.6)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "16px 5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <button 
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.7)",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 500
          }}
          className="hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Atlas
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/atlas-icon.png" alt="Atlas" style={{ width: 24, height: 24, borderRadius: 6 }} />
          <span style={{ fontWeight: 600, fontSize: 16 }}>Atlas AI</span>
        </div>
      </header>

      <main style={{ padding: "80px 5% 120px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Hero Section */}
        <div className="investor-reveal" style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 80px" }}>
          <div 
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(157, 76, 221, 0.1)",
              border: "1px solid rgba(157, 76, 221, 0.3)",
              color: "#E5B3FF",
              padding: "6px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 24
            }}
          >
            <Sparkles size={14} />
            Pre-Seed / Seed Round
          </div>
          <h1 
            style={{ 
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)", 
              fontWeight: 700, 
              lineHeight: 1.1, 
              letterSpacing: "-0.04em",
              marginBottom: 24
            }}
          >
            {t("investors_page.title")}
          </h1>
          <p 
            style={{ 
              fontSize: "clamp(1.1rem, 2vw, 1.3rem)", 
              color: "rgba(255,255,255,0.6)", 
              lineHeight: 1.6 
            }}
          >
            {t("investors_page.subtitle")}
          </p>
        </div>

        {/* Goal Card */}
        <div 
          className="investor-reveal"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 32,
            padding: "48px",
            marginBottom: 32,
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Decorative glow */}
          <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, background: "radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(0,229,255,0.1)", display: "grid", placeItems: "center", color: "#00E5FF" }}>
                  <Target size={24} />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 600 }}>{t("investors_page.goal_title")}</h2>
              </div>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 16 }}>
                {t("investors_page.goal_desc")}
              </p>
              
              <div style={{ padding: "12px 16px", background: "rgba(255,60,60,0.1)", border: "1px solid rgba(255,60,60,0.2)", borderRadius: 12, color: "#ff8080", fontSize: 14, marginBottom: 32, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: "#ff4d4d", boxShadow: "0 0 10px #ff4d4d" }} />
                {t("investors_page.fomo_hard_cap")}
              </div>
              
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 16, padding: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{t("investors_page.progress_label")}</span>
                  <span style={{ color: "#00E5FF", fontSize: 14, fontWeight: 600 }}>{t("investors_page.progress_status")}</span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                  <div className="progress-fill" style={{ width: "0%", height: "100%", background: "linear-gradient(90deg, #007AFF, #00E5FF)", borderRadius: 4 }} />
                </div>
                <div style={{ textAlign: "right", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  {t("investors_page.fomo_filled")}
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 700, letterSpacing: "-0.04em", background: "linear-gradient(135deg, #fff, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t("investors_page.goal_amount")}
              </div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
                Target Seed Capital
              </div>
            </div>
          </div>
        </div>

        {/* FOMO Valuation Tranches Card */}
        <div 
          className="investor-reveal"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 32,
            padding: "40px",
            marginBottom: 32,
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ position: "absolute", top: -50, left: -50, width: 200, height: 200, background: "radial-gradient(circle, rgba(157,76,221,0.1) 0%, transparent 70%)", filter: "blur(30px)" }} />
          
          <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative", zIndex: 1 }}>
            <h3 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Valuation Tranches</h3>
            
            {/* Tranche 1 (Active) */}
            <div style={{ background: "rgba(0, 229, 255, 0.05)", border: "1px solid rgba(0, 229, 255, 0.2)", borderRadius: 20, padding: "24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(0,229,255,0.2) 0%, transparent 70%)", filter: "blur(20px)" }} />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0, 229, 255, 0.1)", color: "#00E5FF", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                    <span style={{ display: "block", width: 6, height: 6, borderRadius: "50%", background: "#00E5FF", boxShadow: "0 0 8px #00E5FF" }} />
                    Active Now
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{t("investors_page.fomo_tranche_1")}</div>
                  <div style={{ color: "#E5B3FF", fontSize: 14, fontWeight: 500 }}>
                    {t("investors_page.fomo_remaining")}
                  </div>
                </div>
              </div>
            </div>

            {/* Tranche 2 (Upcoming) */}
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px dashed rgba(255, 255, 255, 0.1)", borderRadius: 20, padding: "24px", opacity: 0.6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, color: "rgba(255,255,255,0.8)" }}>{t("investors_page.fomo_tranche_2")}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                    Opens after Tranche 1 is filled
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Col Bento */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, marginBottom: 32 }}>
          {/* Equity Offering */}
          <div 
            className="investor-reveal"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 32,
              padding: "40px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", bottom: -50, left: -50, width: 200, height: 200, background: "radial-gradient(circle, rgba(157,76,221,0.15) 0%, transparent 70%)", filter: "blur(30px)" }} />
            
            <TrendingUp size={32} color="#9D4CDD" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>{t("investors_page.what_we_offer_title")}</h3>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              {t("investors_page.what_we_offer_desc")}
            </p>
          </div>

          {/* Allocation */}
          <div 
            className="investor-reveal"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 32,
              padding: "40px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "radial-gradient(circle, rgba(0,122,255,0.15) 0%, transparent 70%)", filter: "blur(30px)" }} />

            <PieChart size={32} color="#007AFF" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24 }}>{t("investors_page.allocation_title")}</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: t("investors_page.alloc_dev"), color: "#00E5FF", percent: "50%" },
                { label: t("investors_page.alloc_mkt"), color: "#9D4CDD", percent: "30%" },
                { label: t("investors_page.alloc_infra"), color: "#007AFF", percent: "20%" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
                  <span style={{ flex: 1, fontSize: 15, color: "rgba(255,255,255,0.8)" }}>{item.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: item.color }}>{item.percent}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div 
          className="investor-reveal"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 32,
            padding: "64px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at center, rgba(0,229,255,0.05) 0%, transparent 60%)" }} />
          
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 24, position: "relative", zIndex: 1 }}>
            Ready to shape the future?
          </h2>
          <a 
            href="mailto:contact@atlas-assistant.online"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 32px",
              background: "#fff",
              color: "#000",
              textDecoration: "none",
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 16,
              position: "relative",
              zIndex: 1,
              transition: "transform 0.3s ease, boxShadow 0.3s ease",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <Mail size={18} />
            {t("investors_page.contact_btn")}
          </a>
        </div>
      </main>
    </div>
  );
}
