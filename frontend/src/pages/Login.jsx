import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import api from "../lib/api";

export default function Login() {
  const { user, loading, refresh } = useAuth();
  const navigate = useNavigate();

  // Tab: 'login' | 'register'
  const [tab, setTab] = useState("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate(user.is_admin ? "/x7k9m-admin" : "/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFormLoading(true);

    try {
      if (tab === "login") {
        await api.post("/api/auth/login", { email, password });
      } else {
        await api.post("/api/auth/register", { email, password, name });
        setSuccess("🎉 Ви успішно зареєстровані! Налаштування особистого кабінету...");
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      // Refresh Auth State
      await refresh();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        "Сталася помилка при авторизації. Перевірте з'єднання."
      );
    } finally {
      setFormLoading(false);
    }
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
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "40px 5%",
          borderRadius: 28,
          textAlign: "center",
          position: "relative",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <img
          src="/atlas-icon.png"
          alt="Atlas AI"
          style={{
            width: 64, height: 64, borderRadius: 16,
            margin: "0 auto 20px", display: "block",
            boxShadow: "0 0 35px rgba(0,229,255,0.4)",
          }}
        />
        <h1
          data-testid="login-title"
          style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}
        >
          Atlas AI
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 8, marginBottom: 28, fontSize: 14 }}>
          Особистий кабінет клієнта та система управління ліцензіями
        </p>

        {/* Beautiful Tabs */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.05)",
          padding: 4,
          borderRadius: 12,
          marginBottom: 24,
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <button
            onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
            style={{
              flex: 1,
              padding: "10px 0",
              background: tab === "login" ? "rgba(0,122,255,0.85)" : "transparent",
              color: tab === "login" ? "#fff" : "rgba(255,255,255,0.6)",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Увійти
          </button>
          <button
            onClick={() => { setTab("register"); setError(""); setSuccess(""); }}
            style={{
              flex: 1,
              padding: "10px 0",
              background: tab === "register" ? "rgba(0,122,255,0.85)" : "transparent",
              color: tab === "register" ? "#fff" : "rgba(255,255,255,0.6)",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Реєстрація
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: "rgba(255,69,58,0.15)",
            border: "1px solid rgba(255,69,58,0.3)",
            color: "#ff453a",
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 20,
            fontSize: 13,
            textAlign: "left",
            lineHeight: 1.4
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div style={{
            background: "rgba(40,200,64,0.15)",
            border: "1px solid rgba(40,200,64,0.3)",
            color: "#30d158",
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 20,
            fontSize: 13,
            textAlign: "left",
            lineHeight: 1.4
          }}>
            ✅ {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          {tab === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Ім'я
              </label>
              <input
                type="text"
                placeholder="Іван Франко"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 14,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(0,122,255,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Електронна пошта
            </label>
            <input
              type="email"
              required
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "#fff",
                fontSize: 14,
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(0,122,255,0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          <div style={{ marginBottom: 20, position: "relative" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Пароль
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder={tab === "register" ? "Мінімум 6 символів" : "••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 48px 12px 16px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 14,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(0,122,255,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: 4,
                }}
              >
                {showPassword ? "Приховати" : "Показати"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            style={{
              width: "100%",
              padding: "14px 20px",
              background: "linear-gradient(135deg, #007aff, #00c6ff)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: formLoading ? "not-allowed" : "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              boxShadow: "0 4px 20px rgba(0,122,255,0.3)",
              opacity: formLoading ? 0.75 : 1
            }}
            onMouseEnter={(e) => { if (!formLoading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,122,255,0.4)"; } }}
            onMouseLeave={(e) => { if (!formLoading) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,122,255,0.3)"; } }}
          >
            {formLoading ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                Завантаження...
              </span>
            ) : tab === "login" ? "Увійти в кабінет" : "Зареєструватися"}
          </button>
        </form>

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

        <p style={{ marginTop: 24, color: "rgba(255,255,255,0.35)", fontSize: 11, lineHeight: 1.5 }}>
          Вся інформація шифрується та передається через захищене з'єднання.
        </p>
      </div>
    </div>
  );
}
