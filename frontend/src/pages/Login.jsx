import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import { useTranslation, Trans } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../lib/auth";
import api from "../lib/api";

export default function Login() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const { user, loading, refresh } = useAuth();
  const navigate = useLocalizedNavigate();

  // Tab: 'login' | 'register' | 'forgot_password'
  const [tab, setTab] = useState("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [inviteCodeInput, setInviteCodeInput] = useState(localStorage.getItem("atlas_invite_code") || "");
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
      if (tab === "forgot_password") {
        await api.post("/api/auth/forgot-password", { email });
        setSuccess(t("login.success_reset"));
        setTab("reset_password");
      } else if (tab === "reset_password") {
        await api.post("/api/auth/reset-password", { email, code, new_password: password });
        setSuccess(t("login.success_changed"));
        setTab("login");
        setPassword("");
      } else if (tab === "login") {
        await api.post("/api/auth/login", { email, password });
        await refresh();
      } else {
        const payload = { email, password, name };
        if (inviteCodeInput.trim()) payload.invite_code = inviteCodeInput.trim();

        await api.post("/api/auth/register", payload);
        localStorage.removeItem("atlas_invite_code");
        
        setSuccess(t("login.success_registered"));
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await refresh();
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        t("login.error_generic")
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
        background: "#000",
        color: "#f5f5f7",
        display: "grid",
        placeItems: "center",
        padding: 24,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Inter, sans-serif",
        position: "relative",
      }}
    >
      <Helmet>
        <title>{isEn ? "Sign In to Account | Atlas AI" : "Вхід до особистого кабінету | Atlas AI"}</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={isEn ? "https://atlas-assistant.online/en/login" : "https://atlas-assistant.online"} />
      </Helmet>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "transparent",
          border: "none",
          padding: "10px 0",
          color: "#2997ff",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          transition: "all 0.2s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.transform = "translateX(-4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#2997ff";
          e.currentTarget.style.transform = "none";
        }}
      >
        <ChevronLeft size={16} /> {t("login.back_home").replace("← ", "")}
      </button>

      <div
        style={{
          width: "min(440px, 90%)",
          padding: "40px 32px",
          borderRadius: 24,
          textAlign: "center",
          position: "relative",
          background: "#1d1d1f",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        }}
      >
        <img
          src="/atlas-icon.png"
          alt="Atlas AI"
          style={{
            width: 56, height: 56, borderRadius: 14,
            margin: "0 auto 18px", display: "block",
          }}
        />
        <h1
          data-testid="login-title"
          style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.04em", margin: 0, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
        >
          Atlas AI
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 8, marginBottom: 28, fontSize: 14 }}>
          {t("login.subtitle")}
        </p>

        {/* Beautiful Tabs */}
        {(tab === "login" || tab === "register") && (
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.05)",
            padding: 4,
            borderRadius: 14,
            marginBottom: 24,
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <button
              onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
              style={{
                flex: 1,
                padding: "8px 0",
                background: tab === "login" ? "rgba(255,255,255,0.15)" : "transparent",
                color: tab === "login" ? "#fff" : "rgba(255,255,255,0.6)",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: tab === "login" ? "0 2px 8px rgba(0,0,0,0.2)" : "none"
              }}
            >
              {t("login.tab_login")}
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); setSuccess(""); }}
              style={{
                flex: 1,
                padding: "8px 0",
                background: tab === "register" ? "rgba(255,255,255,0.15)" : "transparent",
                color: tab === "register" ? "#fff" : "rgba(255,255,255,0.6)",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: tab === "register" ? "0 2px 8px rgba(0,0,0,0.2)" : "none"
              }}
            >
              {t("login.tab_register")}
            </button>
          </div>
        )}

        {tab === "forgot_password" && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0, marginBottom: 8 }}>{t("login.recover_title")}</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0 }}>
              {t("login.recover_desc")}
            </p>
          </div>
        )}

        {tab === "reset_password" && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0, marginBottom: 8 }}>{t("login.enter_code_title")}</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0 }}>
              <Trans i18nKey="login.enter_code_desc" values={{ email }}>
                Перевірте пошту <b>{email}</b> та введіть 6-значний код і новий пароль.
              </Trans>
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            background: "radial-gradient(140% 100% at 50% 0%, rgba(255,69,58,0.08) 0%, transparent 100%)",
            border: "1px solid rgba(255,69,58,0.15)",
            borderTop: "1px solid rgba(255,69,58,0.3)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            color: "#ff453a",
            padding: "16px 20px",
            borderRadius: 16,
            marginBottom: 24,
            fontSize: 14,
            fontWeight: 500,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backdropFilter: "blur(12px)"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div style={{
            background: "radial-gradient(140% 100% at 50% 0%, rgba(48,209,88,0.08) 0%, transparent 100%)",
            border: "1px solid rgba(48,209,88,0.15)",
            borderTop: "1px solid rgba(48,209,88,0.3)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            color: "#30d158",
            padding: "16px 20px",
            borderRadius: 16,
            marginBottom: 24,
            fontSize: 14,
            fontWeight: 500,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backdropFilter: "blur(12px)"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {success.replace(/✅|📩/g, "").trim()}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          {tab === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
                {t("login.name_label")}
              </label>
              <input
                type="text"
                placeholder={t("login.name_placeholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 15,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.background = "rgba(255,255,255,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
              {t("login.email_label")}
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={tab === "reset_password"}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                color: tab === "reset_password" ? "rgba(255,255,255,0.4)" : "#fff",
                fontSize: 15,
                boxSizing: "border-box",
                outline: "none",
                transition: "all 0.2s"
              }}
              onFocus={(e) => { if(tab !== "reset_password") { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.background = "rgba(255,255,255,0.08)"; } }}
              onBlur={(e) => { if(tab !== "reset_password") { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; } }}
            />
          </div>

          {tab === "reset_password" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
                {t("login.code_label")}
              </label>
              <input
                type="text"
                required
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 15,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "all 0.2s",
                  letterSpacing: "0.2em",
                  fontFamily: "monospace"
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.background = "rgba(255,255,255,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
              />
            </div>
          )}

          {(tab === "login" || tab === "register" || tab === "reset_password") && (
            <div style={{ marginBottom: 8, position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                  {tab === "reset_password" ? t("login.new_password_label") : t("login.password_label")}
                </label>
                {tab === "login" && (
                  <button
                    type="button"
                    onClick={() => { setTab("forgot_password"); setError(""); setSuccess(""); }}
                    style={{ background: "none", border: "none", color: "#2997ff", fontSize: 13, cursor: "pointer", padding: 0 }}
                  >
                    {t("login.forgot_password")}
                  </button>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={tab === "register" ? t("login.pass_placeholder_reg") : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 48px 14px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 15,
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.background = "rgba(255,255,255,0.08)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
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
                    color: "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    padding: 6,
                  }}
                >
                  {showPassword ? t("login.hide") : t("login.show")}
                </button>
              </div>
            </div>
          )}

          {tab === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
                Referral Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. a1b2c3d4"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 15,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.background = "rgba(255,255,255,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
              />
            </div>
          )}
          
          <div style={{ marginTop: 24 }}>
            <button
              type="submit"
              disabled={formLoading}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: "#fff",
                color: "#000",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: formLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                opacity: formLoading ? 0.75 : 1
              }}
              onMouseEnter={(e) => { if (!formLoading) { e.currentTarget.style.transform = "scale(0.98)"; } }}
              onMouseLeave={(e) => { if (!formLoading) { e.currentTarget.style.transform = "none"; } }}
            >
              {formLoading ? (
                <span>{t("login.btn_loading")}</span>
              ) : tab === "login" ? t("login.tab_login") : tab === "forgot_password" ? t("login.btn_get_code") : tab === "reset_password" ? t("login.btn_save_pass") : t("login.btn_create")}
            </button>
          </div>
          
          {(tab === "forgot_password" || tab === "reset_password") && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                type="button"
                onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer", padding: "4px 8px" }}
              >
                {t("login.back_to_login")}
              </button>
            </div>
          )}
        </form>

        {/* Dev-login buttons (only in development) */}
        {isDev && (
          <div style={{ marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {t("login.dev_mode")}
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
          {t("login.encryption_info")}
        </p>
      </div>
    </div>
  );
}
