import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";

export default function AdminPin({ onUnlock }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    // Inject noindex meta on admin pages
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex,nofollow";
    return () => meta.remove();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.post("/api/auth/admin/pin", { pin });
      onUnlock?.();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 429) setError("IP заблоковано на 1 годину");
      else setError("Невірний PIN");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-testid="admin-pin-page"
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "grid",
        placeItems: "center",
        padding: 24,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <form onSubmit={submit} className="glass" style={{ padding: 40, borderRadius: 24, width: "min(380px, 100%)", textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(255,95,87,0.12)",
            border: "1px solid rgba(255,95,87,0.3)",
            margin: "0 auto 20px",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Lock size={24} color="#FF5F57" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Адмін доступ</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "8px 0 24px" }}>
          Введи 6-значний PIN
        </p>
        <input
          data-testid="admin-pin-input"
          autoFocus
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          style={{
            width: "100%",
            padding: "16px 18px",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            color: "#fff",
            fontSize: 22,
            textAlign: "center",
            letterSpacing: "0.4em",
            fontFamily: "'Source Code Pro', monospace",
            outline: "none",
          }}
        />
        {error && (
          <div data-testid="pin-error" style={{ color: "#FF5F57", fontSize: 13, marginTop: 12 }}>
            {error}
          </div>
        )}
        <button
          data-testid="admin-pin-submit"
          type="submit"
          disabled={busy || pin.length !== 6}
          className="cta-btn"
          style={{ marginTop: 24, width: "100%", justifyContent: "center", opacity: busy || pin.length !== 6 ? 0.6 : 1 }}
        >
          {busy ? <Loader2 size={16} className="spin" /> : null} Увійти
        </button>
        <style>{`.spin{animation: spin 0.9s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </form>
    </div>
  );
}
