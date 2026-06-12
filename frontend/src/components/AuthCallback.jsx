import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../lib/auth";

/**
 * Handles the post-OAuth redirect from Emergent.
 * Reads #session_id=... from URL fragment, exchanges with backend, then navigates to /dashboard.
 */
import { useTranslation } from "react-i18next";

export default function AuthCallback() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash || "";
    const m = hash.match(/session_id=([^&]+)/);
    if (!m) {
      navigate("/login", { replace: true });
      return;
    }
    const sessionId = decodeURIComponent(m[1]);

    (async () => {
      try {
        await api.post("/api/auth/google/session", null, {
          headers: { "X-Session-ID": sessionId },
        });
        // Clean URL fragment
        window.history.replaceState(null, "", window.location.pathname);
        await refresh();
        navigate("/dashboard", { replace: true });
      } catch (e) {
        console.error("Session exchange failed", e);
        navigate("/login?error=auth", { replace: true });
      }
    })();
  }, [navigate, refresh]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#000",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.1)",
            borderTopColor: "#22D3EE",
            margin: "0 auto 16px",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div style={{ color: "rgba(255,255,255,0.7)" }}>{t("auth.logging_in")}</div>
      </div>
    </div>
  );
}
