import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import api from "../lib/api";

export default function Login() {
  const { user, loading, refresh } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate(user.is_admin ? "/x7k9m-admin" : "/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth — backend handles the full flow
    const backendUrl = api.defaults.baseURL || window.location.origin;
    window.location.href = `${backendUrl}/api/auth/google/login`;
  };

  const handleDevLogin = async (role) => {
    try {
      await api.post("/api/auth/dev-login", { role });
      await refresh();
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  return (
    <div
      data-testid="login-page"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(800px 500px at 50% 0%, rgba(0,122,255,0.18), transparent 60%), radial-gradient(700px 500px at 50% 100%, rgba(157,76,221,0.14), transparent 60%), #000",
        color: "#fff",
        display: "grid",
        placeItems: "center",
        padding: 24,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        className="glass"
        style={{
          width: "min(420px, 100%)",
          padding: 40,
          borderRadius: 28,
          textAlign: "center",
          position: "relative",
        }}
      >
        <img
          src="/atlas-icon.png"
          alt="Atlas AI"
          style={{
            width: 72, height: 72, borderRadius: 18,
            margin: "0 auto 24px", display: "block",
            boxShadow: "0 0 40px rgba(0,229,255,0.35)",
          }}
        />
        <h1
          data-testid="login-title"
          style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}
        >
          Atlas AI
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 12, marginBottom: 32, fontSize: 15, lineHeight: 1.5 }}>
          Увійди щоб керувати підпискою та ліцензійним ключем
        </p>

        {/* Google OAuth Button */}
        <button
          data-testid="google-login-btn"
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "14px 20px",
            background: "#fff",
            color: "#1a1a1a",
            border: "none",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            marginBottom: 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.35)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.4)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.35)"; }}
        >
          {/* Google Icon */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Увійти через Google
        </button>

        {/* Dev-login buttons (only in development) */}
        {isDev && (
          <div style={{ marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              DEV режим
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                data-testid="dev-user-btn"
                onClick={() => handleDevLogin("user")}
                style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, cursor: "pointer" }}
              >
                User
              </button>
              <button
                data-testid="dev-admin-btn"
                onClick={() => handleDevLogin("admin")}
                style={{ flex: 1, padding: "8px 12px", background: "rgba(255,95,87,0.08)", color: "rgba(255,95,87,0.8)", border: "1px solid rgba(255,95,87,0.2)", borderRadius: 8, fontSize: 12, cursor: "pointer" }}
              >
                Admin
              </button>
            </div>
          </div>
        )}

        <p style={{ marginTop: 24, color: "rgba(255,255,255,0.35)", fontSize: 12, lineHeight: 1.5 }}>
          Натискаючи кнопку, ти погоджуєшся з умовами та політикою приватності.
        </p>
      </div>
    </div>
  );
}
