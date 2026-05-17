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
} from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";

export default function Dashboard() {
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

  const loadLicense = useCallback(async () => {
    const r = await api.get("/api/me/license");
    setLicense(r.data);
  }, []);

  useEffect(() => {
    loadLicense();
    api.get("/api/me/download").then((r) => setDownloadInfo(r.data)).catch(() => {});
    api.get("/api/billing/packages").then((r) => setPackages(r.data)).catch(() => {});
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
          toast.success("Оплата пройшла. Підписка активна!");
          await loadLicense();
          navigate("/dashboard", { replace: true });
          return;
        }
        if (r.data.status === "expired") {
          toast.error("Сесія оплати завершилась.");
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
      return { label: "Активна", color: "#28C840", bg: "rgba(40,200,64,0.12)" };
    if (license.status === "expiring_soon")
      return {
        label: `Закінчується через ${license.days_left} дн.`,
        color: "#FEBC2E",
        bg: "rgba(254,188,46,0.12)",
      };
    return { label: "Неактивна", color: "#FF5F57", bg: "rgba(255,95,87,0.1)" };
  }, [license]);

  const startCheckout = async (packageId = "atlas_monthly") => {
    setBusy(true);
    try {
      const r = await api.post("/api/billing/checkout", {
        package_id: packageId,
        origin_url: window.location.origin,
      });
      window.location.href = r.data.url;
    } catch (e) {
      toast.error("Не вдалося розпочати оплату");
      setBusy(false);
    }
  };

  const transferLicense = async () => {
    setBusy(true);
    try {
      await api.post("/api/me/license/transfer");
      await loadLicense();
      toast.success("Ліцензію скинуто. Введи ключ на новому Mac.");
      setConfirmTransfer(false);
    } catch {
      toast.error("Помилка перенесення");
    } finally {
      setBusy(false);
    }
  };

  const cancelRenewal = async () => {
    setBusy(true);
    try {
      await api.post("/api/me/cancel-renewal");
      await loadLicense();
      toast.success("Авто-поновлення вимкнено");
      setConfirmCancel(false);
    } catch {
      toast.error("Помилка скасування");
    } finally {
      setBusy(false);
    }
  };

  const copyKey = async () => {
    if (!license?.key) return;
    await navigator.clipboard.writeText(license.key);
    toast.success("Ключ скопійовано");
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
              navigate("/login", { replace: true });
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
            <LogOut size={14} /> Вийти
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* ----- Block 1: Subscription ----- */}
        <section data-testid="subscription-block" className="glass" style={blockStyle}>
          <SectionHeader title="Підписка" eyebrow="Статус" />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              borderRadius: 999,
              background: status.bg,
              border: `1px solid ${status.color}55`,
              color: status.color,
              fontWeight: 600,
              fontSize: 18,
              marginBottom: 16,
            }}
            data-testid="subscription-status"
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: status.color, boxShadow: `0 0 12px ${status.color}` }} />
            {status.label}
          </div>
          {license.expires_at && (
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, marginBottom: 20 }}>
              Наступне списання: {fmtDate(license.expires_at)}
            </div>
          )}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {license.status !== "active" ? (
              <button
                data-testid="renew-btn"
                onClick={() => startCheckout("atlas_monthly")}
                disabled={busy}
                className="cta-btn"
              >
                {busy ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} />} Поновити підписку
              </button>
            ) : (
              <button
                data-testid="cancel-btn"
                onClick={() => setConfirmCancel(true)}
                className="ghost-btn"
              >
                Скасувати авто-поновлення
              </button>
            )}
          </div>

          {packages.length > 0 && license.status !== "active" && (
            <div style={{ marginTop: 24, display: "grid", gap: 8 }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Тарифи
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {packages.map((p) => (
                  <button
                    key={p.id}
                    data-testid={`package-${p.id}`}
                    onClick={() => startCheckout(p.id)}
                    style={{
                      flex: "1 1 200px",
                      padding: 16,
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor = "rgba(0,229,255,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  >
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{p.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>
                      ${p.amount}
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>/ {p.days} дн.</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ----- Block 2: License Key ----- */}
        <section data-testid="key-block" className="glass" style={blockStyle}>
          <SectionHeader title="Ліцензійний ключ" eyebrow="Активація" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 18,
              borderRadius: 16,
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'Source Code Pro', monospace",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.04em",
              filter: keyHidden ? "blur(7px)" : "none",
              transition: "filter 0.3s ease",
              userSelect: keyHidden ? "none" : "text",
              wordBreak: "break-all",
            }}
            data-testid="license-key-value"
          >
            {license.key}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button data-testid="toggle-key-btn" onClick={() => setKeyHidden((v) => !v)} className="ghost-btn">
              {keyHidden ? <Eye size={14} /> : <EyeOff size={14} />} {keyHidden ? "Показати" : "Сховати"}
            </button>
            <button data-testid="copy-key-btn" onClick={copyKey} className="ghost-btn">
              <Copy size={14} /> Скопіювати
            </button>
            {license.mac_id && (
              <button
                data-testid="transfer-btn"
                onClick={() => setConfirmTransfer(true)}
                className="ghost-btn"
              >
                <ArrowRightLeft size={14} /> Перенести на інший Mac
              </button>
            )}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 14,
              color: license.mac_id ? "rgba(40,200,64,0.9)" : "rgba(255,255,255,0.5)",
            }}
            data-testid="activation-status"
          >
            {license.mac_id
              ? `Активований на: ${license.mac_name || "Mac"} · ${license.mac_id.slice(0, 8)}…`
              : "Ще не активований"}
          </div>
        </section>

        {/* ----- Block 3: Download ----- */}
        <section data-testid="download-block" className="glass" style={blockStyle}>
          <SectionHeader title="Завантаження" eyebrow="Atlas для macOS" />
          <a
            data-testid="download-btn"
            href={downloadInfo?.url || "#"}
            download
            className="cta-btn"
            style={{ textDecoration: "none" }}
          >
            <Download size={16} /> Завантажити Atlas {downloadInfo?.version || "0.9.0"}
          </a>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 16 }}>
            {downloadInfo?.requirements || "macOS 13+ · Apple Silicon / Intel"} · ~{downloadInfo?.size_mb || 84} MB
          </div>

          <ol style={{ marginTop: 24, color: "rgba(255,255,255,0.7)", paddingLeft: 18, lineHeight: 1.7, fontSize: 14 }}>
            <li>Завантаж .dmg і перетягни Atlas у Applications.</li>
            <li>Запусти Atlas з Applications (перший раз — права кліком → Open).</li>
            <li>Введи свій ліцензійний ключ зверху.</li>
            <li>Дозволь доступ до мікрофона і Accessibility — і Atlas готовий.</li>
          </ol>
        </section>

        {/* ----- Block 4: Stats ----- */}
        <section data-testid="stats-block" className="glass" style={blockStyle}>
          <SectionHeader title="Статистика Atlas" eyebrow="Активність" />
          {license.mac_id && license.stats ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
              <Stat label="Версія" value={license.stats.version} />
              <Stat label="Активний" value={`${license.stats.days_active} дн.`} />
              <Stat label="Скілів створено" value={license.stats.skills_count} />
              <Stat label="Запитів оброблено" value={license.stats.requests_count} />
              <Stat label="Остання еволюція" value={license.stats.last_evolution ? fmtDateTime(license.stats.last_evolution) : "—"} />
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
              Встанови Atlas щоб бачити статистику
            </div>
          )}
        </section>

        {/* ----- Block 5: Support ----- */}
        <section data-testid="support-block" className="glass" style={blockStyle}>
          <SectionHeader title="Підтримка" eyebrow="Допомога" />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <a href="https://t.me/atlas_support" className="ghost-btn" target="_blank" rel="noreferrer" data-testid="telegram-link">
              Telegram: @atlas_support
            </a>
            <a href="mailto:support@atlas-ai.com" className="ghost-btn" data-testid="email-link">
              support@atlas-ai.com
            </a>
          </div>
          <FAQ items={FAQ_ITEMS} />
        </section>
      </main>

      {confirmCancel && (
        <Confirm
          title="Впевнений?"
          message={`Atlas перестане працювати після ${fmtDate(license.expires_at)}.`}
          onCancel={() => setConfirmCancel(false)}
          onConfirm={cancelRenewal}
          busy={busy}
          danger
        />
      )}
      {confirmTransfer && (
        <Confirm
          title="Перенести на інший Mac?"
          message="Atlas на поточному Mac зупиниться. Введи цей ключ на новому Mac щоб активувати."
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
            Ні
          </button>
          <button
            data-testid="confirm-ok-btn"
            onClick={onConfirm}
            disabled={busy}
            className="cta-btn"
            style={danger ? { borderColor: "rgba(255,95,87,0.4)" } : undefined}
          >
            {busy ? <Loader2 size={14} className="spin" /> : null} Так
          </button>
        </div>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "Як перенести Atlas на інший Mac?",
    a: "В блоці 'Ліцензійний ключ' натисни 'Перенести на інший Mac'. Поточний Mac зупинить роботу, ти зможеш ввести цей же ключ на новому Mac.",
  },
  {
    q: "Що якщо я забув ключ?",
    a: "Ключ завжди тут, у твоєму кабінеті. Якщо ключ скомпрометовано — звернися в підтримку, ми його регенеруємо.",
  },
  {
    q: "Як скасувати підписку?",
    a: "Натисни 'Скасувати авто-поновлення' в блоці Підписка. Atlas працюватиме до дати закінчення поточного періоду.",
  },
  {
    q: "Atlas не запускається — що робити?",
    a: "Перевір що дозволив Accessibility та Microphone у System Settings → Privacy. Перезапусти Atlas. Якщо не допомагає — пиши в підтримку.",
  },
  {
    q: "Чи працює Atlas без інтернету?",
    a: "Базові команди працюють офлайн. Для еволюції, нових скілів і мовних моделей потрібен інтернет.",
  },
];

function FAQ({ items }) {
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
            {it.q}
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
              {it.a}
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
