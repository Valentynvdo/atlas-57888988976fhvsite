import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import {
  LogOut,
  Copy,
  Eye,
  EyeOff,
  ChevronDown,
  Loader2,
  AlertTriangle,
  Settings,
  Check,
  Clock,
  Users,
  Sparkles,
  ArrowRightLeft,
  MessageSquare,
  Lock,
} from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import { useTranslation, Trans } from "react-i18next";
import "./DashboardBento.css";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const [license, setLicense] = useState(null);
  const [downloadInfo, setDownloadInfo] = useState(null);
  const [packages, setPackages] = useState([]);
  const [keyHidden, setKeyHidden] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  const [busy, setBusy] = useState(false);
  // Waitlist state
  const [waitlist, setWaitlist] = useState(null);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistPlan, setWaitlistPlan] = useState("atlas_quarterly");
  const [waitlistReason, setWaitlistReason] = useState("");

  const loadLicense = useCallback(async () => {
    try {
      const r = await api.get("/api/me/license");
      setLicense(r.data);
    } catch (err) {
      console.error("Failed to load license", err);
    }
  }, []);

  const loadWaitlist = useCallback(async () => {
    try {
      const r = await api.get("/api/billing/waitlist/status");
      setWaitlist(r.data);
    } catch (err) {
      console.error("Failed to load waitlist", err);
    }
  }, []);

  useEffect(() => {
    if (user?.is_admin) {
      navigate("/x7k9m-admin", { replace: true });
      return;
    }
    loadLicense();
    loadWaitlist();
    api.get("/api/me/download").then((r) => setDownloadInfo(r.data)).catch(() => {});
    api.get("/api/billing/packages").then((r) => setPackages(r.data)).catch(() => {});
    // Polling every 15 seconds for real-time updates
    const intervalId = setInterval(loadLicense, 15000);
    return () => clearInterval(intervalId);
  }, [loadLicense, loadWaitlist]);


  // Handle Stripe redirect (?session_id=…) — poll for status
  useEffect(() => {
    const sid = search.get("session_id");
    if (!sid) return;
    let attempts = 0;
    const tick = async () => {
      attempts += 1;
      if (attempts > 6) return;
      try {
        const r = await api.get(`/api/billing/checkout/status/${sid}`);
        if (r.data.payment_status === "paid") {
          toast.success(t("dashboard.payment_success"));
          await loadLicense();
          navigate("/dashboard", { replace: true });
          return;
        }
        if (r.data.status === "expired") {
          toast.error(t("dashboard.payment_session_expired"));
          navigate("/dashboard", { replace: true });
          return;
        }
        setTimeout(tick, 2000);
      } catch (e) {
        // unknown session — clear url
        navigate("/dashboard", { replace: true });
      }
    };
    tick();
  }, [search, navigate, loadLicense]);

  const status = useMemo(() => {
    if (!license) return null;
    if (license.status === "active")
      return { label: t("dashboard.status_active"), color: "#28C840", bg: "rgba(40,200,64,0.12)" };
    if (license.status === "expiring_soon")
      return {
        label: t("dashboard.status_expiring_soon", { days: license.days_left }),
        color: "#FEBC2E",
        bg: "rgba(254,188,46,0.12)",
      };
    return { label: t("dashboard.status_inactive"), color: "#FF5F57", bg: "rgba(255,95,87,0.1)" };
  }, [license]);

  const joinWaitlist = async () => {
    setWaitlistLoading(true);
    try {
      const r = await api.post("/api/billing/waitlist/join", {
        plan: waitlistPlan,
        reason: waitlistReason,
        name: user?.name || "",
      });
      setWaitlist({ in_waitlist: true, position: r.data.position, status: r.data.status, plan: waitlistPlan });
      toast.success(t("dashboard.waitlist_joined"));
    } catch (e) {
      toast.error(e?.response?.data?.detail || t("dashboard.waitlist_error"));
    } finally {
      setWaitlistLoading(false);
    }
  };

  const transferLicense = async () => {
    setBusy(true);
    try {
      await api.post("/api/me/license/transfer");
      await loadLicense();
      toast.success(t("dashboard.license_reset"));
      setConfirmTransfer(false);
    } catch {
      toast.error(t("dashboard.transfer_error"));
    } finally {
      setBusy(false);
    }
  };

  const cancelRenewal = async () => {
    setBusy(true);
    try {
      await api.post("/api/me/cancel-renewal");
      await loadLicense();
      toast.success(t("dashboard.autorenew_disabled"));
      setConfirmCancel(false);
    } catch {
      toast.error(t("dashboard.cancel_error"));
    } finally {
      setBusy(false);
    }
  };

  const copyKey = async () => {
    if (!license?.key) return;
    await navigator.clipboard.writeText(license.key);
    toast.success(t("dashboard.key_copied"));
  };

  if (!license) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "grid", placeItems: "center" }}>
        <Loader2 size={28} color="#00E5FF" className="spin" />
        <style>{`.spin{animation: spin 0.9s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div data-testid="dashboard-page" className="dashboard-wrapper">
      <Toaster theme="dark" position="top-center" />

      {/* Header */}
      <header
        className="dashboard-header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/atlas-icon.png" alt="Atlas" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <div style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>Atlas AI</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {user?.is_admin && (
            <button
              data-testid="admin-link-btn"
              onClick={() => navigate("/x7k9m-admin")}
              title="Admin"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                borderRadius: 999,
                padding: "8px 14px",
                fontSize: 13,
                cursor: "pointer",
                display: "inline-flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              <Settings size={14} /> Admin
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                style={{ width: 32, height: 32, borderRadius: "50%" }}
              />
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #007AFF, #9D4CDD)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {(user?.name || user?.email || "?").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div style={{ fontSize: 14 }} data-testid="user-name">
              {user?.name}
            </div>
          </div>
          <button
            data-testid="logout-btn"
            onClick={async () => {
              await logout();
              navigate("/", { replace: true });
            }}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.8)",
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 13,
              cursor: "pointer",
              display: "inline-flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <LogOut size={14} /> {t("dashboard.logout_btn")}
          </button>
        </div>
      </header>

      <main className="dashboard-main bento-grid">
        {/* ----- Block 1: License Key ----- */}
        <section data-testid="key-block" className="bento-item col-span-8" style={{ borderColor: "rgba(0, 229, 255, 0.2)" }}>
          <SectionHeader title={t("dashboard.license_block_title")} eyebrow={t("dashboard.license_block_eyebrow")} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 24,
              borderRadius: 16,
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(0, 229, 255, 0.2)",
              fontFamily: "'Source Code Pro', monospace",
              fontSize: 22,
              fontWeight: 700,
              color: "#00E5FF",
              letterSpacing: "0.06em",
              filter: keyHidden ? "blur(8px)" : "none",
              transition: "filter 0.3s ease",
              userSelect: keyHidden ? "none" : "text",
              wordBreak: "break-all",
              boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)"
            }}
            data-testid="license-key-value"
          >
            {license.key}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            <button data-testid="toggle-key-btn" onClick={() => setKeyHidden((v) => !v)} className="cta-btn" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              {keyHidden ? <Eye size={16} /> : <EyeOff size={16} />} {keyHidden ? t("dashboard.show_key") : t("dashboard.hide_key")}
            </button>
            <button data-testid="copy-key-btn" onClick={copyKey} className="cta-btn" style={{ background: "rgba(0, 229, 255, 0.15)", border: "1px solid rgba(0, 229, 255, 0.3)", color: "#00E5FF" }}>
              <Copy size={16} /> {t("dashboard.copy_btn")}
            </button>
            {license.mac_id && (
              <button
                data-testid="transfer-btn"
                onClick={() => setConfirmTransfer(true)}
                className="ghost-btn"
                style={{ fontSize: 14 }}
              >
                <ArrowRightLeft size={16} /> {t("dashboard.transfer_btn")}
              </button>
            )}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 14,
              fontWeight: 500,
              color: license.mac_id ? "#28C840" : "rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
            data-testid="activation-status"
          >
            {license.mac_id ? <Check size={16} /> : <AlertTriangle size={16} />}
            {license.mac_id
              ? `${t("dashboard.activated_on")} ${license.mac_name || "Mac"} · ${license.mac_id.slice(0, 8)}…`
              : t("dashboard.not_activated")}
          </div>
        </section>

        {/* ----- Block 2: Telegram Bot ----- */}
        <section data-testid="telegram-block" className="bento-item col-span-4" style={{ background: "linear-gradient(135deg, rgba(0, 136, 204, 0.08) 0%, rgba(0, 0, 0, 0.2) 100%)", borderColor: "rgba(0, 136, 204, 0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <SectionHeader title={t("dashboard.tg_block_title")} eyebrow={t("dashboard.tg_block_eyebrow")} />
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #0088cc 0%, #00a2ed 100%)", display: "grid", placeItems: "center", color: "#fff", boxShadow: "0 4px 15px rgba(0, 136, 204, 0.4)" }}>
              <MessageSquare size={24} />
            </div>
          </div>
          
          <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            {t("dashboard.tg_desc")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0, 136, 204, 0.15)", border: "1px solid rgba(0, 136, 204, 0.3)", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, color: "#00E5FF", flexShrink: 0 }}>1</div>
              <div style={{ fontSize: 14.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
                <Trans i18nKey="dashboard.tg_step_1">Натисніть кнопку <strong>«Підключити Telegram-бота»</strong> нижче для переходу до <span style={{ color: "#00E5FF", fontWeight: 600 }}>@Atlas_aimac_bot</span>.</Trans>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0, 136, 204, 0.15)", border: "1px solid rgba(0, 136, 204, 0.3)", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, color: "#00E5FF", flexShrink: 0 }}>2</div>
              <div style={{ fontSize: 14.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
                <Trans i18nKey="dashboard.tg_step_2">Натисніть <strong>«Запустити» (Start)</strong> в Telegram. Бот автоматично зчитає ваш унікальний код активації.</Trans>
              </div>
            </div>
          </div>

          <a
            href={`https://t.me/Atlas_aimac_bot?start=ACT_${encodeURIComponent(license.key)}`}
            target="_blank"
            rel="noreferrer"
            className="cta-btn"
            style={{
              textDecoration: "none",
              background: "linear-gradient(135deg, #0088cc 0%, #00a2ed 100%)",
              border: "none",
              boxShadow: "0 6px 20px rgba(0, 136, 204, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "16px 32px",
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 600,
              width: "100%",
              maxWidth: 340,
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            <MessageSquare size={18} /> {t("dashboard.tg_btn")}
          </a>
        </section>

        {/* ----- Block 3: Download (Blurred) ----- */}
        <section data-testid="download-block" className="bento-item col-span-6" style={{ position: "relative" }}>
          <SectionHeader title={t("dashboard.download_title")} eyebrow={t("dashboard.download_eyebrow")} />
          {/* Blurred content */}
          <div style={{ filter: "blur(6px)", pointerEvents: "none", userSelect: "none", opacity: 0.5 }}>
            <div style={{ marginTop: 16, padding: "16px", borderRadius: "12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 8 }}>{t("dashboard.download_desc")}</div>
              <code style={{ display: "block", color: "#00E5FF", fontFamily: "monospace", fontSize: 14 }}>
                curl -fsSL https://atlas-assistant.online/install | bash
              </code>
            </div>
            <ol style={{ marginTop: 24, color: "rgba(255,255,255,0.8)", paddingLeft: 20, lineHeight: 1.8, fontSize: 14.5 }}>
              <li style={{ marginBottom: 8 }}>{t("dashboard.download_step1")}</li>
              <li style={{ marginBottom: 8 }}>{t("dashboard.download_step2")}</li>
              <li style={{ marginBottom: 8 }}>{t("dashboard.download_step3")}</li>
              <li>{t("dashboard.download_step4")}</li>
            </ol>
          </div>
          {/* Overlay */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: 28,
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: 32, textAlign: "center",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.25)",
              display: "grid", placeItems: "center", marginBottom: 16,
            }}>
              <Lock size={24} color="#00E5FF" />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
              {t("dashboard.download_locked_title")}
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 280 }}>
              {t("dashboard.download_locked_desc")}
            </div>
          </div>
        </section>


        {/* ----- Block 4: Waitlist ----- */}
        <section data-testid="waitlist-block" className="bento-item col-span-6">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <SectionHeader title={t("dashboard.waitlist_title")} eyebrow={t("dashboard.waitlist_eyebrow")} />
            <div className="mac-dots"><span></span><span></span><span></span></div>
          </div>

          {waitlist?.in_waitlist ? (
            // Already in waitlist — show status
            <>
              {/* Status card */}
              <div style={{
                padding: 24, borderRadius: 20, marginBottom: 24,
                background: waitlist.status === "approved" ? "rgba(40,200,64,0.06)" : "rgba(0,229,255,0.05)",
                border: `1px solid ${waitlist.status === "approved" ? "rgba(40,200,64,0.25)" : "rgba(0,229,255,0.2)"}`,
              }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                  {t("dashboard.waitlist_your_status")}
                </div>
                {waitlist.status === "approved" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 28 }}>🎉</span>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#28C840" }}>{t("dashboard.waitlist_approved")}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{t("dashboard.waitlist_approved_desc")}</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 40, fontWeight: 800, color: "#00E5FF" }}>#{waitlist.position}</span>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{t("dashboard.waitlist_in_queue")}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Clock size={14} color="rgba(255,255,255,0.4)" />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                        {t("dashboard.waitlist_total_queue", { total: waitlist.total || "..." })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Plan badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "12px 16px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Sparkles size={16} color="#00E5FF" />
                <div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>{t("dashboard.waitlist_selected_plan")}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                    {waitlist.plan === "atlas_monthly" ? t("waitlist.plan_monthly") : waitlist.plan === "atlas_quarterly" ? t("waitlist.plan_quarterly") : t("waitlist.plan_yearly")}
                  </div>
                </div>
              </div>

              {/* Telegram community */}
              <a
                href="https://t.me/AtlasAICommunity"
                target="_blank" rel="noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "14px 20px", borderRadius: 14, textDecoration: "none",
                  background: "linear-gradient(135deg, rgba(0,136,204,0.15), rgba(0,162,237,0.1))",
                  border: "1px solid rgba(0,136,204,0.3)",
                  color: "#fff", fontSize: 14, fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
              >
                <MessageSquare size={16} color="#00a2ed" />
                {t("dashboard.waitlist_tg_community")}
              </a>
            </>
          ) : (
            // Not yet in waitlist — show join form
            <>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                {t("dashboard.waitlist_desc")}
              </p>

              {/* Plan selector */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 10, fontWeight: 500 }}>{t("dashboard.waitlist_choose_plan")}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                  {[
                    { id: "atlas_monthly", label: t("waitlist.plan_monthly"), price: "$28.99" },
                    { id: "atlas_quarterly", label: t("waitlist.plan_quarterly"), price: "$74.99" },
                    { id: "atlas_yearly", label: t("waitlist.plan_yearly"), price: "$249.99" },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setWaitlistPlan(p.id)}
                      style={{
                        padding: "12px 8px", borderRadius: 12, cursor: "pointer",
                        background: waitlistPlan === p.id ? "rgba(0,122,255,0.15)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${waitlistPlan === p.id ? "rgba(0,122,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: "#fff", fontSize: 12, fontWeight: 500, textAlign: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{p.label}</div>
                      <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{p.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason textarea */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                  {t("dashboard.waitlist_reason_label")}
                </div>
                <textarea
                  value={waitlistReason}
                  onChange={e => setWaitlistReason(e.target.value)}
                  placeholder={t("dashboard.waitlist_reason_placeholder")}
                  rows={3}
                  style={{
                    width: "100%", borderRadius: 12, padding: "12px 16px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff", fontSize: 14, resize: "vertical", fontFamily: "inherit",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                data-testid="join-waitlist-btn"
                onClick={joinWaitlist}
                disabled={waitlistLoading}
                className="cta-btn"
                style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15, borderRadius: 14 }}
              >
                {waitlistLoading ? <Loader2 size={16} className="spin" /> : <><Users size={16} /> {t("dashboard.waitlist_join_btn")}</>}
              </button>
            </>
          )}
        </section>

        {/* ----- Block 5: Stats ----- */}
        <section data-testid="stats-block" className="bento-item col-span-6">
          <SectionHeader title={t("dashboard.stats_title")} eyebrow={t("dashboard.stats_eyebrow")} />
          {license.mac_id && license.stats ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
              <Stat label={t("dashboard.stat_version")} value={license.stats.version} />
              <Stat label={t("dashboard.stat_active")} value={`${license.stats.days_active} дн.`} />
              <Stat label={t("dashboard.stat_skills")} value={license.stats.skills_count} />
              <Stat label={t("dashboard.stat_requests")} value={license.stats.requests_count} />
              <Stat label={t("dashboard.stat_evolution")} value={license.stats.last_evolution ? fmtDateTime(license.stats.last_evolution) : "—"} />
            </div>
          ) : (
            <div
              style={{
                padding: 32,
                borderRadius: 16,
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.45)",
                textAlign: "center",
                fontSize: 14,
              }}
              data-testid="stats-placeholder"
            >
              {t("dashboard.stats_empty")}
            </div>
          )}
        </section>

        <section data-testid="support-block" className="bento-item col-span-12" style={{ background: "linear-gradient(135deg, rgba(0,136,204,0.06) 0%, rgba(0,0,0,0.2) 100%)", borderColor: "rgba(0, 136, 204, 0.3)" }}>
          <SectionHeader title={t("dashboard.support_title")} eyebrow={t("dashboard.support_eyebrow")} />
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14.5, lineHeight: 1.6, marginBottom: 24 }}>
            {t("dashboard.support_desc")}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <a
              href="https://t.me/ATLAS_Support_Hub_bot"
              className="cta-btn"
              target="_blank"
              rel="noreferrer"
              data-testid="telegram-support-link"
              style={{
                textDecoration: "none",
                background: "linear-gradient(135deg, #0088cc 0%, #00a2ed 100%)",
                border: "none",
                boxShadow: "0 6px 20px rgba(0,136,204,0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              💬 {t("dashboard.open_chat")}
            </a>
          </div>
          <FAQ t={t} />
        </section>
      </main>

      {confirmCancel && (
        <Confirm
          title={t("dashboard.confirm_sure")}
          message={t("dashboard.confirm_cancel_msg", { date: fmtDate(license.expires_at) })}
          onCancel={() => setConfirmCancel(false)}
          onConfirm={cancelRenewal}
          busy={busy}
          danger
        />
      )}
      {confirmTransfer && (
        <Confirm
          title={t("dashboard.confirm_transfer_title")}
          message={t("dashboard.confirm_transfer_msg")}
          onCancel={() => setConfirmTransfer(false)}
          onConfirm={transferLicense}
          busy={busy}
        />
      )}
    </div>
  );
}

const blockStyle = {
  borderRadius: 24,
  padding: 28,
  marginBottom: 20,
};

function SectionHeader({ title, eyebrow }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div className="section-eyebrow">
        {eyebrow}
      </div>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 14,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 600, marginTop: 6 }}>{value}</div>
    </div>
  );
}

function Confirm({ title, message, onCancel, onConfirm, busy, danger }) {
  const { t } = useTranslation();
  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
      data-testid="confirm-modal"
    >
      <div
        className="glass"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(440px, 100%)", padding: 32, borderRadius: 24, textAlign: "center" }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: danger ? "rgba(255,95,87,0.12)" : "rgba(0,229,255,0.12)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 16px",
          }}
        >
          <AlertTriangle size={26} color={danger ? "#FF5F57" : "#00E5FF"} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>{title}</h3>
        <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 12, marginBottom: 24, fontSize: 14, lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button data-testid="confirm-cancel-btn" onClick={onCancel} className="ghost-btn">
            {t("dashboard.confirm_no")}
          </button>
          <button
            data-testid="confirm-ok-btn"
            onClick={onConfirm}
            disabled={busy}
            className="cta-btn"
            style={danger ? { borderColor: "rgba(255,95,87,0.4)" } : undefined}
          >
            {busy ? <Loader2 size={14} className="spin" /> : null} {t("dashboard.confirm_yes")}
          </button>
        </div>
      </div>
    </div>
  );
}

function FAQ({ t }) {
  const FAQ_ITEMS = [
    {
      q: t("dashboard.faq_q1"),
      a: t("dashboard.faq_a1"),
    },
    {
      q: t("dashboard.faq_q2"),
      a: t("dashboard.faq_a2"),
    },
    {
      q: t("dashboard.faq_q3"),
      a: t("dashboard.faq_a3"),
    },
    {
      q: t("dashboard.faq_q4"),
      a: t("dashboard.faq_a4"),
    },
    {
      q: t("dashboard.faq_q5"),
      a: t("dashboard.faq_a5"),
    },
  ];
  const [open, setOpen] = useState(null);
  return (
    <div data-testid="faq-list" style={{ display: "grid", gap: 8 }}>
      {FAQ_ITEMS.map((it, i) => (
        <div
          key={i}
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            overflow: "hidden",
            background: "rgba(255,255,255,0.02)",
          }}
          data-testid={`faq-item-${i}`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              padding: "14px 18px",
              background: "transparent",
              border: 0,
              color: "#fff",
              textAlign: "left",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            {t(it.q)}
            <ChevronDown
              size={18}
              style={{
                color: "rgba(255,255,255,0.5)",
                transition: "transform 0.3s ease",
                transform: open === i ? "rotate(180deg)" : "none",
              }}
            />
          </button>
          {open === i && (
            <div style={{ padding: "0 18px 16px", color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6 }}>
              {t(it.a)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
}
function fmtDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("uk-UA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
