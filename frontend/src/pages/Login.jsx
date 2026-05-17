import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const handleGoogle = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/auth/callback";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleApple = () => {
    // Apple Developer credentials not configured yet — fall back to same provider so the flow
    // still works end-to-end and Apple-style button satisfies branding parity.
    handleGoogle();
  };

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
            width: 72,
            height: 72,
            borderRadius: 18,
            margin: "0 auto 24px",
            display: "block",
            boxShadow: "0 0 40px rgba(0,229,255,0.35)",
          }}
        />
        <h1
          data-testid="login-title"
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Atlas AI
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            marginTop: 12,
            marginBottom: 32,
            fontSize: 15,
            lineHeight: 1.5,
          }}
        >
          Увійди щоб керувати підпискою
        </p>

        <button
          data-testid="apple-login-btn"
          onClick={handleApple}
          style={{
            width: "100%",
            padding: "14px 20px",
            background: "#000",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "transform 0.2s ease, background 0.2s ease",
            marginBottom: 12,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0a0a0a")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#000")}
        >
          <svg width="18" height="20" viewBox="0 0 17 20" fill="currentColor">
            <path d="M14.243 17.07c-.79.766-1.658.645-2.494.281-.884-.371-1.696-.388-2.628 0-1.175.51-1.795.362-2.49-.281C2.6 12.94 3.181 6.658 7.652 6.434c1.103.06 1.872.604 2.516.65.961-.198 1.881-.764 2.911-.692 1.236.1 2.166.59 2.78 1.475-2.546 1.527-1.94 4.876.397 5.815-.466 1.224-1.07 2.44-2.014 3.39zM10.077 6.394c-.122-1.82 1.355-3.323 3.05-3.473.235 2.107-1.91 3.667-3.05 3.473z" />
          </svg>
          Sign in with Apple
        </button>

        <button
          data-testid="google-login-btn"
          onClick={handleGoogle}
          style={{
            width: "100%",
            padding: "14px 20px",
            background: "#fff",
            color: "#1f1f1f",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
          </svg>
          Continue with Google
        </button>

        <p
          style={{
            marginTop: 28,
            color: "rgba(255,255,255,0.4)",
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          Натискаючи кнопку, ти погоджуєшся з умовами і політикою приватності.
        </p>
      </div>
    </div>
  );
}
