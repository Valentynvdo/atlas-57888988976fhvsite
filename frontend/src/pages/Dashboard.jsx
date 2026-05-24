import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import {
  LogOut,
  Copy,
  Eye,
  EyeOff,
  Download,
  ChevronDown,
  ArrowRightLeft,
  Sparkles,
  Loader2,
  AlertTriangle,
  Settings,
  Check,
  Wallet,
  Zap,
  MessageSquare,
} from "lucide-react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import { useTranslation, Trans } from "react-i18next";

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
  const [tonPrices, setTonPrices] = useState(null);
  const [tonBusy, setTonBusy] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const tonWallet = useTonWallet();

  const loadLicense = useCallback(async () => {
    try {
      const r = await api.get("/api/me/license");
      setLicense(r.data);
    } catch (err) {
      console.error("Failed to load license", err);
    }
  }, []);

  useEffect(() => {
    loadLicense();
    api.get("/api/me/download").then((r) => setDownloadInfo(r.data)).catch(() => {});
    api.get("/api/billing/packages").then((r) => setPackages(r.data)).catch(() => {});
    // Load live TON prices
    api.get("/api/billing/ton-price").then((r) => setTonPrices(r.data)).catch(() => {});

    // Polling every 15 seconds for real-time updates
    const intervalId = setInterval(loadLicense, 15000);
    return () => clearInterval(intervalId);
  }, [loadLicense]);

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

  const payWithTon = async (packageId = "atlas_monthly") => {
    if (!tonWallet) {
      // Connect wallet first
      tonConnectUI.openModal();
      return;
    }
    if (!tonPrices) {
      toast.error(t("dashboard.loading_prices"));
      return;
    }
    const pkg = tonPrices.packages.find((p) => p.id === packageId);
    if (!pkg) return;

    setTonBusy(true);
    try {
      // Send TON transaction
      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 min
        messages: [{
          address: pkg.receiver,
          amount: pkg.ton_nano, // in nanotons
        }],
      });

      // Get wallet address
      const walletAddress = tonWallet.account?.address || "";

      // Verify on backend
      toast.loading(t("dashboard.verifying_tx"), { id: "ton-verify" });
      const verify = await api.post("/api/billing/ton-verify", {
        wallet_address: walletAddress,
        ton_amount: pkg.ton_amount,
        package_id: packageId,
        tx_hash: result?.boc || "",
      });

      toast.dismiss("ton-verify");
      toast.success(`✅ ${verify.data.message}`);
      await loadLicense();
      // Refresh TON prices
      api.get("/api/billing/ton-price").then((r) => setTonPrices(r.data)).catch(() => {});
    } catch (e) {
      toast.dismiss("ton-verify");
      if (e?.message?.includes("User rejecte")) {
        toast.error(t("dashboard.tx_cancelled"));
      } else {
        const msg = e?.response?.data?.detail || t("dashboard.payment_error");
        toast.error(msg);
      }
    } finally {
      setTonBusy(false);
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
    <div data-testid="dashboard-page" style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Inter, sans-serif" }}>
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

      <main className="dashboard-main" style={{ maxWidth: "100%", padding: "40px 5% 80px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* ----- Block 1: License Key ----- */}
        <section data-testid="key-block" className="glass" style={{ ...blockStyle, padding: "36px 40px", border: "1px solid rgba(0, 229, 255, 0.2)", boxShadow: "0 8px 32px rgba(0, 229, 255, 0.08)" }}>
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
        <section data-testid="telegram-block" className="glass" style={{ ...blockStyle, padding: "36px 40px", background: "linear-gradient(135deg, rgba(0, 136, 204, 0.08) 0%, rgba(0, 0, 0, 0.2) 100%)", border: "1px solid rgba(0, 136, 204, 0.3)", boxShadow: "0 8px 32px rgba(0, 136, 204, 0.1)" }}>
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

        {/* ----- Block 3: Download ----- */}
        <section data-testid="download-block" className="glass" style={{ ...blockStyle, padding: "36px 40px" }}>
          <SectionHeader title={t("dashboard.download_title")} eyebrow={t("dashboard.download_eyebrow")} />
          <div style={{ marginTop: 16, padding: "16px", borderRadius: "12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 8 }}>{t("dashboard.download_desc")}</div>
            <code style={{ display: "block", color: "#00E5FF", fontFamily: "'Source Code Pro', monospace", fontSize: 14, wordBreak: "break-all" }}>
              curl -fsSL https://atlas-site-2p2d.onrender.com/install | bash
            </code>
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 16 }}>
            {t("dashboard.download_reqs")}
          </div>

          <ol style={{ marginTop: 24, color: "rgba(255,255,255,0.8)", paddingLeft: 20, lineHeight: 1.8, fontSize: 14.5 }}>
            <li style={{ marginBottom: 8 }}>{t("dashboard.download_step1")}</li>
            <li style={{ marginBottom: 8 }}>{t("dashboard.download_step2")}</li>
            <li style={{ marginBottom: 8 }}>{t("dashboard.download_step3")}</li>
            <li>{t("dashboard.download_step4")}</li>
          </ol>
        </section>

        {/* ----- Block 4: Subscription ----- */}
        <section data-testid="subscription-block" className="glass" style={{ ...blockStyle, padding: "36px 40px" }}>
          {/* Header with macOS Dots */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <SectionHeader title={t("dashboard.sub_title")} eyebrow={t("dashboard.sub_eyebrow")} />
            <div className="mac-dots">
              <span></span><span></span><span></span>
            </div>
          </div>

          {/* Current Plan Summary Card */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 20,
            padding: 24,
            marginBottom: 40,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20
          }}>
            <div>
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                {t("dashboard.current_status")}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: status.bg,
                  border: `1px solid ${status.color}33`,
                  color: status.color,
                  fontWeight: 600,
                  fontSize: 15,
                }} data-testid="subscription-status">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: status.color, boxShadow: `0 0 10px ${status.color}` }} />
                  {status.label}
                </div>
                {license.days_left !== undefined && (
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500 }}>
                    {t("dashboard.days_left", { days: license.days_left })}
                  </span>
                )}
              </div>
              {license.expires_at && (
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 8 }}>
                  {t("dashboard.expires_at", { date: fmtDate(license.expires_at) })}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {license.status === "active" && (
                <button
                  data-testid="cancel-btn"
                  onClick={() => setConfirmCancel(true)}
                  className="ghost-btn"
                  style={{ padding: "10px 20px", fontSize: 13 }}
                >
                  {t("dashboard.cancel_autorenew")}
                </button>
              )}
            </div>
          </div>

          {/* TON Wallet Status */}
          <div style={{ marginBottom: 24, padding: "14px 18px", borderRadius: 14, background: tonWallet ? "rgba(40,200,64,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${tonWallet ? "rgba(40,200,64,0.2)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Wallet size={18} color={tonWallet ? "#28C840" : "rgba(255,255,255,0.4)"} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: tonWallet ? "#28C840" : "rgba(255,255,255,0.6)" }}>
                  {tonWallet ? t("dashboard.wallet_connected") : t("dashboard.wallet_not_connected")}
                </div>
                {tonWallet?.account?.address && (
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                    {tonWallet.account.address.slice(0, 12)}...{tonWallet.account.address.slice(-8)}
                  </div>
                )}
                {tonPrices && (
                  <div style={{ fontSize: 11, color: "rgba(0,229,255,0.7)", marginTop: 2 }}>
                    {t("dashboard.ton_live_price", { price: tonPrices.ton_usd_price.toFixed(3) })}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => tonConnectUI.openModal()}
              style={{ padding: "8px 16px", borderRadius: 999, background: tonWallet ? "rgba(255,255,255,0.05)" : "rgba(0,122,255,0.15)", border: `1px solid ${tonWallet ? "rgba(255,255,255,0.1)" : "rgba(0,122,255,0.4)"}`, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <Wallet size={13} /> {tonWallet ? t("dashboard.change_wallet") : t("dashboard.connect_wallet")}
            </button>
          </div>

          {/* Pricing Section Grid */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={18} color="#00E5FF" /> {t("dashboard.choose_plan")}
            </h3>

            <div className="three-col">
              {(packages.length > 0 ? packages : [
                { id: "atlas_monthly", amount: 28.99, days: 30, label: "Atlas AI · Місяць" },
                { id: "atlas_quarterly", amount: 74.99, days: 90, label: "Atlas AI · 3 місяці" },
                { id: "atlas_yearly", amount: 249.99, days: 365, label: "Atlas AI · Рік" }
              ]).map((p) => {
                const isPopular = p.id === "atlas_quarterly";
                const isYearly = p.id === "atlas_yearly";
                
                // Calculate monthly cost equivalent
                const monthlyCost = (p.amount / (p.days / 30)).toFixed(2);
                
                // Features based on plan
                const features = {
                                    atlas_monthly: [
                    t("dashboard.feature_1"),
                    t("dashboard.feature_2"),
                    t("dashboard.feature_3"),
                    t("dashboard.feature_4"),
                    t("dashboard.feature_5")
                  ],
                                    atlas_quarterly: [
                    t("dashboard.feature_q1"),
                    t("dashboard.feature_q2"),
                    t("dashboard.feature_q3"),
                    t("dashboard.feature_q4"),
                    t("dashboard.feature_q5")
                  ],
                                    atlas_yearly: [
                    t("dashboard.feature_y1"),
                    t("dashboard.feature_y2"),
                    t("dashboard.feature_y3"),
                    t("dashboard.feature_y4"),
                    t("dashboard.feature_y5")
                  ]
                }[p.id] || [];

                return (
                  <div
                    key={p.id}
                    data-testid={`package-${p.id}`}
                    style={{
                      borderRadius: 24,
                      padding: 32,
                      background: isPopular 
                        ? "linear-gradient(180deg, rgba(0, 122, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)" 
                        : "rgba(255, 255, 255, 0.02)",
                      border: isPopular 
                        ? "1px solid rgba(0, 122, 255, 0.4)" 
                        : "1px solid rgba(255, 255, 255, 0.06)",
                      boxShadow: isPopular ? "0 0 30px rgba(0, 122, 255, 0.15)" : "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.borderColor = isPopular ? "rgba(0, 229, 255, 0.6)" : "rgba(255,255,255,0.18)";
                      e.currentTarget.style.boxShadow = isPopular 
                        ? "0 20px 40px rgba(0, 122, 255, 0.25)" 
                        : "0 12px 30px rgba(0, 229, 255, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = isPopular ? "rgba(0, 122, 255, 0.4)" : "rgba(255, 255, 255, 0.06)";
                      e.currentTarget.style.boxShadow = isPopular ? "0 0 30px rgba(0, 122, 255, 0.15)" : "none";
                    }}
                  >
                    {/* Badge */}
                    {isPopular && (
                      <span style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(90deg, #007AFF, #00E5FF)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "4px 12px",
                        borderRadius: 99,
                        letterSpacing: "0.08em",
                        boxShadow: "0 0 15px rgba(0, 229, 255, 0.4)"
                      }}>
                        {t("dashboard.popular_choice")}
                      </span>
                    )}

                    {isYearly && (
                      <span style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(90deg, #28C840, #00E5FF)",
                        color: "#000",
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        padding: "4px 12px",
                        borderRadius: 99,
                        letterSpacing: "0.08em",
                        boxShadow: "0 0 15px rgba(40, 200, 64, 0.4)"
                      }}>
                        {t("dashboard.save_30")}
                      </span>
                    )}

                    <div>
                      {/* Plan Header */}
                      <div style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 8 }}>
                        {p.id === "atlas_monthly" ? t("dashboard.plan_monthly") : p.id === "atlas_quarterly" ? t("dashboard.plan_quarterly") : t("dashboard.plan_yearly")}
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
                        {p.id === "atlas_monthly" ? t("dashboard.plan_desc_monthly") : p.id === "atlas_quarterly" ? t("dashboard.plan_desc_quarterly") : t("dashboard.plan_desc_yearly")}
                      </div>

                      {/* Plan Price */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 28 }}>
                        <span style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>${p.amount}</span>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                          / {p.days === 30 ? t("dashboard.per_month") : p.days === 90 ? t("dashboard.per_quarter") : t("dashboard.per_year")}
                        </span>
                      </div>

                      {p.days > 30 && (
                        <div style={{ fontSize: 12, color: "rgba(0, 229, 255, 0.85)", fontWeight: 500, marginTop: -20, marginBottom: 24 }}>
                          {t("dashboard.equiv_monthly", { cost: monthlyCost })}
                        </div>
                      )}

                      {/* Features List */}
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, marginBottom: 32 }}>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
                          {features.map((feat, idx) => (
                            <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                              <Check size={14} color="#00E5FF" style={{ marginTop: 2, flexShrink: 0 }} />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Button */}
                    {/* TON price display */}
                    {tonPrices && (() => {
                      const tp = tonPrices.packages.find(x => x.id === p.id);
                      return tp ? (
                        <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{t("dashboard.ton_price")}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#00E5FF" }}>{tp.ton_amount} TON</span>
                        </div>
                      ) : null;
                    })()}
                    <button
                      onClick={() => payWithTon(p.id)}
                      disabled={tonBusy}
                      className="cta-btn"
                      style={{
                        width: "100%",
                        padding: "12px 20px",
                        fontSize: 14,
                        justifyContent: "center",
                        borderRadius: 14,
                        background: isPopular ? "rgba(0, 122, 255, 0.15)" : "rgba(255,255,255,0.04)",
                        border: isPopular ? "1px solid rgba(0, 122, 255, 0.4)" : "1px solid rgba(255,255,255,0.12)"
                      }}
                    >
                      {tonBusy ? <Loader2 size={16} className="spin" /> : (
                        <>{!tonWallet ? <><Wallet size={14} /> {t("dashboard.connect_wallet")}</> : <><Zap size={14} /> {t("dashboard.pay_ton")}</>}</>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ----- Block 5: Stats ----- */}
        <section data-testid="stats-block" className="glass" style={{ ...blockStyle, padding: "36px 40px" }}>
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

        <section data-testid="support-block" className="glass" style={{ ...blockStyle, padding: "36px 40px", background: "linear-gradient(135deg, rgba(0,136,204,0.06) 0%, rgba(0,0,0,0.2) 100%)", border: "1px solid rgba(0,136,204,0.2)" }}>
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
          <FAQ items={FAQ_ITEMS} t={t} />
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
      <div style={{ color: "#00E5FF", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 6, letterSpacing: "-0.01em" }}>{title}</h2>
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

function FAQ({ items, t }) {
  const [open, setOpen] = useState(null);
  return (
    <div data-testid="faq-list" style={{ display: "grid", gap: 8 }}>
      {items.map((it, i) => (
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
