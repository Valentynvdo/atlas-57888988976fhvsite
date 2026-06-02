import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  ArrowLeft, Target, TrendingUp, Mail, Shield, Terminal, Cpu, CheckCircle2, EyeOff, Activity, LineChart, ServerOff, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Investors() {
  const { t } = useTranslation();
  const navigate = useLocalizedNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-reveal",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
      );

      gsap.utils.toArray(".investor-reveal").forEach((elem) => {
        gsap.fromTo(
          elem,
          { opacity: 0, y: 40 },
          {
            scrollTrigger: {
              trigger: elem,
              start: "top 85%",
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
          }
        );
      });
      
      gsap.to(".progress-fill", {
        scrollTrigger: {
          trigger: ".progress-fill",
          start: "top 90%"
        },
        width: "5%", 
        duration: 1.5,
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
        color: "#fff",
        fontFamily: "var(--sf-text)",
        position: "relative",
        overflowX: "hidden"
      }}
    >
      <Helmet>
        <title>{t("investors_page.title")}</title>
        <meta name="description" content={t("investors_page.subtitle")} />
        <link rel="canonical" href={i18n.language === 'en' ? "https://atlas-assistant.online/en/investors" : "https://atlas-assistant.online/investors"} />
      </Helmet>

      {/* Background Gradients */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "80vh", background: "radial-gradient(ellipse at center, rgba(157, 76, 221, 0.05) 0%, transparent 60%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "50vw", height: "50vh", background: "radial-gradient(circle, rgba(0, 229, 255, 0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

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
          <span style={{ fontWeight: 600, fontSize: 16 }}>Atlas AI Deck</span>
        </div>
      </header>

      <main style={{ padding: "100px 3vw 120px", maxWidth: "100%", margin: "0 auto", position: "relative", zIndex: 1, overflowX: "hidden" }}>
        
        {/* HERO SECTION (H1) */}
        <div className="hero-reveal" style={{ textAlign: "center", maxWidth: 1000, margin: "0 auto 80px" }}>
          <div style={{ display: "inline-flex", gap: 16, marginBottom: 32, flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ color: "#00E5FF", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}><ServerOff size={14} />{t("investors_page.hero_tag_1")}</span>
            <span style={{ color: "#E5B3FF", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}><Shield size={14} />{t("investors_page.hero_tag_2")}</span>
            <span style={{ color: "#007AFF", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}><Cpu size={14} />{t("investors_page.hero_tag_3")}</span>
          </div>
          <h1 style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 32, background: "linear-gradient(180deg, #FFFFFF 0%, #A5B4FC 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {t("investors_page.h1_title")}
          </h1>
          <p style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", color: "rgba(255,255,255,0.7)", lineHeight: 1.4, maxWidth: 800, margin: "0 auto" }}>
            {t("investors_page.h1_desc")}
          </p>
        </div>

        {/* SEO H2 SECTION */}
        <div className="investor-reveal" style={{ textAlign: "center", maxWidth: 1000, margin: "0 auto 120px" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, marginBottom: 32, background: "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.6) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {t("investors_page.h2_title")}
          </h2>
          <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, maxWidth: 800, margin: "0 auto" }}>
            {t("investors_page.h2_desc")}
          </p>
          <a href="mailto:ceo@atlas-assistant.online" style={{ display: "inline-block", marginTop: 40, padding: "16px 36px", fontSize: 18, fontWeight: 600, background: "linear-gradient(135deg, #00E5FF 0%, #007AFF 100%)", color: "#fff", borderRadius: 12, cursor: "pointer", textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
            {t("investors_page.get_pitch_deck")}
          </a>
        </div>

        {/* PROBLEM VS SOLUTION */}
        <div className="investor-reveal" style={{ marginBottom: 120 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 64 }}>
            {/* The Problem */}
            <div style={{ padding: "0 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, color: "#ff4d4d" }}>
                <Activity size={32} />
                <h3 style={{ fontSize: 28, fontWeight: 600, color: "#fff" }}>{t("investors_page.problem_title")}</h3>
              </div>
              <div style={{ marginBottom: 40 }}>
                <h4 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#ff8080" }}>{t("investors_page.problem_1_title")}</h4>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{t("investors_page.problem_1_desc")}</p>
              </div>
              <div>
                <h4 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#ff8080" }}>{t("investors_page.problem_2_title")}</h4>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{t("investors_page.problem_2_desc")}</p>
              </div>
            </div>

            {/* The Solution */}
            <div style={{ padding: "0 24px", position: "relative" }}>
              <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />
              
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, color: "#00E5FF", position: "relative", zIndex: 1 }}>
                <CheckCircle2 size={32} />
                <h3 style={{ fontSize: 28, fontWeight: 600, color: "#fff" }}>{t("investors_page.solution_title")}</h3>
              </div>
              <p style={{ fontSize: 20, color: "rgba(255,255,255,0.9)", lineHeight: 1.5, marginBottom: 40, position: "relative", zIndex: 1 }}>
                {t("investors_page.solution_desc")}
              </p>
              
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 24, position: "relative", zIndex: 1 }}>
                {[1, 2, 3, 4].map((num) => (
                  <li key={num} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 18, color: "rgba(255,255,255,0.8)" }}>
                    <Zap size={20} color="#00E5FF" />
                    {t(`investors_page.solution_${num}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", marginBottom: 120 }} />

        {/* TECHNOLOGY ARCHITECTURE */}
        <div className="investor-reveal" style={{ marginBottom: 120 }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, marginBottom: 64, textAlign: "center" }}>{t("investors_page.tech_title")}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 64 }}>
            <div style={{ padding: "0 24px" }}>
              <Terminal size={40} color="#007AFF" style={{ marginBottom: 32 }} />
              <h3 style={{ fontSize: 26, fontWeight: 600, marginBottom: 20 }}>{t("investors_page.tech_evolution")}</h3>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{t("investors_page.tech_evolution_desc")}</p>
            </div>
            <div style={{ padding: "0 24px" }}>
              <EyeOff size={40} color="#9D4CDD" style={{ marginBottom: 32 }} />
              <h3 style={{ fontSize: 26, fontWeight: 600, marginBottom: 20 }}>{t("investors_page.tech_vision")}</h3>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{t("investors_page.tech_vision_desc")}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", marginBottom: 120 }} />

        {/* MARKET & TRACTION & ECONOMICS */}
        <div className="investor-reveal" style={{ marginBottom: 120 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 80 }}>
            
            {/* Market */}
            <div style={{ padding: "0 24px" }}>
              <h3 style={{ fontSize: 28, fontWeight: 600, marginBottom: 48, color: "rgba(255,255,255,0.5)" }}>{t("investors_page.market_title")}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 48 }}>
                <div>
                  <div style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "#fff", marginBottom: 12, letterSpacing: "-0.03em" }}>{t("investors_page.market_tam")}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>{t("investors_page.market_tam_desc")}</div>
                </div>
                <div>
                  <div style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "#00E5FF", marginBottom: 12, letterSpacing: "-0.03em", textShadow: "0 0 40px rgba(0,229,255,0.3)" }}>{t("investors_page.market_sam")}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>{t("investors_page.market_sam_desc")}</div>
                </div>
                <div>
                  <div style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "#9D4CDD", marginBottom: 12, letterSpacing: "-0.03em", textShadow: "0 0 40px rgba(157,76,221,0.3)" }}>{t("investors_page.market_som")}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>{t("investors_page.market_som_desc")}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 64, padding: "0 24px" }}>
              {/* Traction */}
              <div>
                <TrendingUp size={36} color="#E5B3FF" style={{ marginBottom: 32 }} />
                <h3 style={{ fontSize: 26, fontWeight: 600, marginBottom: 40 }}>{t("investors_page.traction_title")}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                  <div>
                    <div style={{ fontSize: 48, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{t("investors_page.traction_waitlist")}</div>
                    <div style={{ color: "rgba(255,255,255,0.6)", marginTop: 12, fontSize: 18 }}>{t("investors_page.traction_waitlist_desc")}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 48, fontWeight: 700, color: "#00E5FF", lineHeight: 1 }}>{t("investors_page.traction_revenue")}</div>
                    <div style={{ color: "rgba(255,255,255,0.6)", marginTop: 12, fontSize: 18 }}>{t("investors_page.traction_revenue_desc")}</div>
                  </div>
                </div>
              </div>

              {/* Unit Economics */}
              <div>
                <LineChart size={36} color="#00E5FF" style={{ marginBottom: 32 }} />
                <h3 style={{ fontSize: 26, fontWeight: 600, marginBottom: 32 }}>{t("investors_page.economics_title")}</h3>
                <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
                  <div style={{ color: "#00E5FF", fontWeight: 600, fontSize: 24 }}>{t("investors_page.economics_ltv")}</div>
                  <div style={{ color: "#E5B3FF", fontWeight: 600, fontSize: 24 }}>{t("investors_page.economics_margin")}</div>
                </div>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{t("investors_page.economics_desc")}</p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", marginBottom: 120 }} />

        {/* TEAM */}
        <div className="investor-reveal" style={{ marginBottom: 120, padding: "0 24px" }}>
          <h3 style={{ fontSize: 28, fontWeight: 600, marginBottom: 48, color: "rgba(255,255,255,0.5)" }}>{t("investors_page.team_title")}</h3>
          <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 140, height: 140, borderRadius: "50%", background: "linear-gradient(135deg, #007AFF, #9D4CDD)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 700 }}>VV</div>
            <div style={{ flex: 1, minWidth: 300 }}>
              <h4 style={{ fontSize: 32, fontWeight: 600, margin: "0 0 12px 0" }}>{t("investors_page.team_name")}</h4>
              <div style={{ color: "#00E5FF", fontWeight: 500, marginBottom: 24, fontSize: 18 }}>{t("investors_page.team_role")}</div>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0, maxWidth: 800 }}>
                {t("investors_page.team_desc")}
              </p>
            </div>
          </div>
        </div>

        {/* THE ASK & FOMO (Funding Goal) */}
        {/* We keep the container here because it's a specific "Card" meant to be interacted with / grabbed attention to */}
        <div className="investor-reveal">
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, marginBottom: 64, textAlign: "center" }}>{t("investors_page.goal_title")}</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 32 }}>
            
            {/* Goal Card */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 32, padding: "48px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, background: "radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Seed Target</h3>
                  <div style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.04em", background: "linear-gradient(135deg, #fff, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
                    {t("investors_page.goal_amount")}
                  </div>
                </div>
                <Target size={48} color="#00E5FF" opacity={0.5} />
              </div>

              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 24 }}>
                {t("investors_page.goal_desc")}
              </p>
              
              <div style={{ padding: "16px 20px", background: "rgba(255,60,60,0.1)", borderRadius: 16, color: "#ff8080", fontSize: 15, marginBottom: 40, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: "#ff4d4d", boxShadow: "0 0 10px #ff4d4d" }} />
                {t("investors_page.fomo_hard_cap")}
              </div>
              
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 16, padding: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>{t("investors_page.progress_label")}</span>
                  <span style={{ color: "#00E5FF", fontSize: 15, fontWeight: 600 }}>{t("investors_page.progress_status")}</span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
                  <div className="progress-fill" style={{ width: "0%", height: "100%", background: "linear-gradient(90deg, #007AFF, #00E5FF)", borderRadius: 4 }} />
                </div>
                <div style={{ textAlign: "right", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                  {t("investors_page.fomo_filled")}
                </div>
              </div>
            </div>

            {/* Tranches & Allocation */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 32, padding: "40px", position: "relative", overflow: "hidden" }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Valuation Tranches</h3>
                <div style={{ background: "rgba(0, 229, 255, 0.05)", border: "1px solid rgba(0, 229, 255, 0.2)", borderRadius: 20, padding: "24px", marginBottom: 16 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0, 229, 255, 0.1)", color: "#00E5FF", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>
                    <span style={{ display: "block", width: 6, height: 6, borderRadius: "50%", background: "#00E5FF", boxShadow: "0 0 8px #00E5FF" }} />
                    Active Now
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{t("investors_page.fomo_tranche_1")}</div>
                  <div style={{ color: "#E5B3FF", fontSize: 15, fontWeight: 500 }}>{t("investors_page.fomo_remaining")}</div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px dashed rgba(255, 255, 255, 0.1)", borderRadius: 20, padding: "24px", opacity: 0.6 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{t("investors_page.fomo_tranche_2")}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 15 }}>Opens after Tranche 1 is filled</div>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 32, padding: "40px" }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Capital Allocation</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { label: t("investors_page.alloc_dev"), color: "#00E5FF" },
                    { label: t("investors_page.alloc_mkt"), color: "#9D4CDD" },
                    { label: t("investors_page.alloc_infra"), color: "#007AFF" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
                      <span style={{ flex: 1, fontSize: 16, color: "rgba(255,255,255,0.8)" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* CTA */}
        <div 
          className="investor-reveal"
          style={{
            padding: "120px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at center, rgba(0,229,255,0.05) 0%, transparent 60%)" }} />
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 48, position: "relative", zIndex: 1 }}>
            Ready to secure your allocation?
          </h2>
          <a 
            href="mailto:support@atlas-assistant.online"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "20px 48px",
              background: "#fff",
              color: "#000",
              textDecoration: "none",
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 18,
              position: "relative",
              zIndex: 1,
              transition: "transform 0.3s ease, boxShadow 0.3s ease",
              boxShadow: "0 10px 40px rgba(255,255,255,0.2)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <Mail size={20} />
            {t("investors_page.contact_btn")}
          </a>
        </div>

      </main>
    </div>
  );
}
