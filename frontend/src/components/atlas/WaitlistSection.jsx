import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";
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
  const navigate = useLocalizedNavigate();
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
      await api.post("/api/billing/waitlist/join", { plan: "early_access" });
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
            position: "relative",
            overflow: "hidden",
            background: "transparent"
          }}
        >
          {/* Background glow removed to keep it floating */}

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

        {/* Plan Cards removed by user request (just waitlist queue) */}

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

          {/* Projected Pricing */}
          <div style={{ marginTop: 64, textAlign: "center" }}>
            <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
              {t("waitlist.projected_pricing", "Прогнозована ціна")}
            </div>
            
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              flexWrap: "wrap", 
              gap: 40 
            }}>
              {/* Monthly */}
              <div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>{t("waitlist.plan_monthly", "Місячний")}</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
                  $28.99 <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: "0" }}>{t("waitlist.per_month", "/ місяць")}</span>
                </div>
              </div>
              
              {/* Divider (visible on desktop) */}
              <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)", display: "none" }} className="pricing-divider"></div>

              {/* Quarterly */}
              <div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>{t("waitlist.plan_quarterly", "Квартальний")}</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
                  $23.33 <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: "0" }}>{t("waitlist.per_month", "/ місяць")}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Billed $69.99 / 3 mos</div>
              </div>

              {/* Divider (visible on desktop) */}
              <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)", display: "none" }} className="pricing-divider"></div>

              {/* Yearly */}
              <div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                  {t("waitlist.plan_yearly", "Річний")} <span style={{ color: "#00E5FF", marginLeft: 6 }}>(-30%)</span>
                </div>
                <div style={{ fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
                  $19.99 <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: "0" }}>{t("waitlist.per_month", "/ місяць")}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Billed $239.99 / year</div>
              </div>
            </div>

            <div style={{ marginTop: 24, fontSize: 14, color: "#00E5FF", fontWeight: 500 }}>
              {t("waitlist.discount_notice", "Учасники черги отримають пожиттєву знижку")}
            </div>
          </div>

        </div>
      </section>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #00E5FF; }
          50% { opacity: 0.5; box-shadow: 0 0 4px #00E5FF; }
        }
        @media (min-width: 768px) {
          .pricing-divider {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
