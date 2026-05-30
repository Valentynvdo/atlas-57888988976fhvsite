import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Check, ArrowRight, Users, Zap, Clock, Star,
  Send, Globe, TrendingUp, MessageCircle
} from "lucide-react";
import api from "../../lib/api";
import { useAuth } from "../../lib/auth";

const PLANS = [
  {
    id: "atlas_monthly",
    icon: "⚡",
    amount: 28.99,
    period_key: "waitlist.plan_monthly",
    per_key: "waitlist.per_month",
    features_key: "waitlist.features_monthly",
    color: "rgba(0, 229, 255, 0.15)",
    borderColor: "rgba(0, 229, 255, 0.3)",
    popular: false,
  },
  {
    id: "atlas_quarterly",
    icon: "🚀",
    amount: 74.99,
    period_key: "waitlist.plan_quarterly",
    per_key: "waitlist.per_quarter",
    features_key: "waitlist.features_quarterly",
    color: "rgba(0, 122, 255, 0.12)",
    borderColor: "rgba(0, 122, 255, 0.45)",
    popular: true,
  },
  {
    id: "atlas_yearly",
    icon: "🏆",
    amount: 249.99,
    period_key: "waitlist.plan_yearly",
    per_key: "waitlist.per_year",
    features_key: "waitlist.features_yearly",
    color: "rgba(157, 76, 221, 0.12)",
    borderColor: "rgba(157, 76, 221, 0.4)",
    popular: false,
    badge_key: "waitlist.save_badge",
  },
];

export default function WaitlistSection({ onCta }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("atlas_quarterly");
  const [totalWaitlist, setTotalWaitlist] = useState(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  // Fetch total waitlist count
  useEffect(() => {
    api.get("/api/billing/waitlist/status")
      .then(r => setTotalWaitlist(r.data.total))
      .catch(() => {});
  }, []);

  const handleJoin = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setJoinLoading(true);
    try {
      await api.post("/api/billing/waitlist/join", { plan: selectedPlan });
      setJoined(true);
      navigate("/dashboard");
    } catch (e) {
      navigate("/dashboard");
    } finally {
      setJoinLoading(false);
    }
  };

  const FEATURES_ALL = [
    t("waitlist.feat_all_1"),
    t("waitlist.feat_all_2"),
    t("waitlist.feat_all_3"),
    t("waitlist.feat_all_4"),
    t("waitlist.feat_all_5"),
  ];

  const FEATURES_EXTRA = {
    atlas_quarterly: [t("waitlist.feat_q_extra")],
    atlas_yearly: [t("waitlist.feat_y_extra_1"), t("waitlist.feat_y_extra_2")],
  };

  return (
    <>
      {/* ── Investor / Launch Campaign Banner ── */}
      <section
        id="launch-campaign"
        data-testid="launch-campaign"
        className="section-container"
        style={{ paddingTop: 40, paddingBottom: 0 }}
      >
        <div
          className="reveal"
          style={{
            borderRadius: 28,
            padding: "clamp(32px, 6vw, 56px) clamp(20px, 5vw, 48px)",
            background: "linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(157,76,221,0.06) 50%, rgba(0,229,255,0.04) 100%)",
            border: "1px solid rgba(0,122,255,0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 30% 50%, rgba(0,122,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(157,76,221,0.1) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: "1 1 320px" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.25)",
                borderRadius: 999, padding: "6px 14px", marginBottom: 20,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00E5FF", boxShadow: "0 0 8px #00E5FF", animation: "pulse-dot 2s infinite" }} />
                <span style={{ color: "#00E5FF", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {t("waitlist.launch_badge")}
                </span>
              </div>

              <h2 style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 700,
                letterSpacing: "-0.03em", lineHeight: 1.2,
                background: "linear-gradient(120deg, #fff 0%, #c4d4ff 60%, #00E5FF 100%)",
                WebkitBackgroundClip: "text", backgroundClip: "text",
                color: "transparent", WebkitTextFillColor: "transparent",
                margin: 0,
              }}>
                {t("waitlist.launch_title")}
              </h2>

              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.6, marginTop: 16, marginBottom: 0, maxWidth: 480 }}>
                {t("waitlist.launch_desc")}
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, flex: "0 0 auto" }}>
              {[
                { icon: <Users size={20} color="#00E5FF" />, value: totalWaitlist !== null ? totalWaitlist : "...", label: t("waitlist.stat_registered") },
                { icon: <Globe size={20} color="#9D4CDD" />, value: "12+", label: t("waitlist.stat_countries") },
                { icon: <TrendingUp size={20} color="#28C840" />, value: "2026", label: t("waitlist.stat_launch") },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20, padding: "20px 24px",
                  textAlign: "center", minWidth: 110,
                }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Telegram CTA */}
          <div style={{
            position: "relative", zIndex: 1, marginTop: 28, paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16,
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                {t("waitlist.tg_community_label")}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                {t("waitlist.tg_community_desc")}
              </div>
            </div>
            <a
              href="https://t.me/AtlasAICommunity"
              target="_blank"
              rel="noreferrer"
              data-testid="tg-community-link"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #0088cc, #00a2ed)",
                border: "none", borderRadius: 14, padding: "12px 24px",
                color: "#fff", fontSize: 14, fontWeight: 600,
                textDecoration: "none", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,136,204,0.3)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,136,204,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,136,204,0.3)"; }}
            >
              <MessageCircle size={16} /> @AtlasAICommunity
            </a>
          </div>
        </div>
      </section>

      {/* ── Pricing & Waitlist ── */}
      <section
        id="pricing"
        data-testid="pricing-section"
        className="section-container"
        style={{ paddingTop: 64, paddingBottom: 64 }}
      >
        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-eyebrow" style={{ justifyContent: "center", display: "inline-block" }}>
            {t("waitlist.section_eyebrow")}
          </div>
          <h2 style={{
            marginTop: 16, fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1,
            background: "linear-gradient(120deg, #fff 0%, #c4d4ff 50%, #00E5FF 100%)",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            color: "transparent", WebkitTextFillColor: "transparent",
          }}>
            {t("waitlist.section_title")}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, marginTop: 16, maxWidth: 560, margin: "16px auto 0", lineHeight: 1.6 }}>
            {t("waitlist.section_desc")}
          </p>
          {totalWaitlist !== null && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginTop: 20, background: "rgba(40,200,64,0.1)",
              border: "1px solid rgba(40,200,64,0.25)", borderRadius: 999,
              padding: "8px 18px",
            }}>
              <Clock size={14} color="#28C840" />
              <span style={{ fontSize: 13, color: "#28C840", fontWeight: 600 }}>
                {t("waitlist.already_joined", { count: totalWaitlist })}
              </span>
            </div>
          )}
        </div>

        {/* Plan Cards */}
        <div className="reveal" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 24, marginBottom: 48,
        }}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const extras = FEATURES_EXTRA[plan.id] || [];
            const monthly = (plan.amount / (plan.id === "atlas_monthly" ? 1 : plan.id === "atlas_quarterly" ? 3 : 12)).toFixed(2);

            return (
              <div
                key={plan.id}
                data-testid={`plan-${plan.id}`}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  borderRadius: 28, padding: "36px 28px",
                  background: isSelected ? plan.color : "rgba(255,255,255,0.02)",
                  border: `2px solid ${isSelected ? plan.borderColor : "rgba(255,255,255,0.06)"}`,
                  position: "relative", cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: isSelected ? `0 0 32px ${plan.borderColor.replace("0.3", "0.15").replace("0.45", "0.2").replace("0.4", "0.15")}` : "none",
                  transform: isSelected ? "translateY(-4px)" : "none",
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(90deg, #007AFF, #00E5FF)",
                    color: "#fff", fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                    padding: "5px 16px", borderRadius: 999, letterSpacing: "0.1em",
                    whiteSpace: "nowrap", boxShadow: "0 0 16px rgba(0,229,255,0.4)",
                  }}>
                    {t("waitlist.popular_badge")}
                  </div>
                )}

                {plan.badge_key && !plan.popular && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(90deg, #28C840, #00E5FF)",
                    color: "#000", fontSize: 11, fontWeight: 800, textTransform: "uppercase",
                    padding: "5px 16px", borderRadius: 999, letterSpacing: "0.1em",
                    whiteSpace: "nowrap",
                  }}>
                    {t(plan.badge_key)}
                  </div>
                )}

                <div style={{ fontSize: 28, marginBottom: 12 }}>{plan.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                  {t(plan.period_key)}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: "#fff" }}>${plan.amount}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{t(plan.per_key)}</span>
                </div>
                {plan.id !== "atlas_monthly" && (
                  <div style={{ fontSize: 12, color: "rgba(0,229,255,0.8)", marginBottom: 24, fontWeight: 500 }}>
                    ≈ ${monthly} {t("waitlist.per_month")}
                  </div>
                )}

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, marginTop: plan.id === "atlas_monthly" ? 24 : 0 }}>
                  {FEATURES_ALL.map((feat, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                      <Check size={14} color="#00E5FF" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{feat}</span>
                    </div>
                  ))}
                  {extras.map((feat, i) => (
                    <div key={`ex-${i}`} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                      <Star size={14} color="#FFD700" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "rgba(255,215,0,0.85)", fontWeight: 500 }}>{feat}</span>
                    </div>
                  ))}
                </div>

                {isSelected && (
                  <div style={{
                    marginTop: 20, padding: "8px 14px", borderRadius: 10,
                    background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.25)",
                    fontSize: 12, color: "#00E5FF", fontWeight: 600, textAlign: "center",
                  }}>
                    ✓ {t("waitlist.plan_selected")}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="reveal" style={{ textAlign: "center" }}>
          <button
            data-testid="waitlist-join-btn"
            onClick={handleJoin}
            disabled={joinLoading}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "18px 44px", borderRadius: 18, fontSize: 17, fontWeight: 700,
              background: "linear-gradient(135deg, #007AFF 0%, #00E5FF 100%)",
              border: "none", color: "#fff", cursor: "pointer",
              boxShadow: "0 0 40px rgba(0,122,255,0.35), 0 8px 32px rgba(0,229,255,0.2)",
              transition: "all 0.3s ease", letterSpacing: "-0.02em",
              opacity: joinLoading ? 0.7 : 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(0,122,255,0.5), 0 12px 40px rgba(0,229,255,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,122,255,0.35), 0 8px 32px rgba(0,229,255,0.2)"; }}
          >
            {joinLoading ? t("waitlist.joining") : t("waitlist.join_btn")}
            <ArrowRight size={18} />
          </button>

          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 16 }}>
            {t("waitlist.cta_note")}
          </p>

          {/* What user gets after joining */}
          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, marginTop: 36,
          }}>
            {[
              { icon: <Zap size={16} />, text: t("waitlist.benefit_1") },
              { icon: <Users size={16} />, text: t("waitlist.benefit_2") },
              { icon: <Send size={16} />, text: t("waitlist.benefit_3") },
            ].map((b, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                color: "rgba(255,255,255,0.55)", fontSize: 13,
              }}>
                <span style={{ color: "#00E5FF" }}>{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #00E5FF; }
          50% { opacity: 0.5; box-shadow: 0 0 4px #00E5FF; }
        }
      `}</style>
    </>
  );
}
