import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../lib/auth";
import { Menu, X, Globe } from "lucide-react";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

/**
 * Navbar — Apple-style translucent top bar.
 * No neon. Flat. Pill CTA white-on-dark.
 */
export default function Navbar({ onCta }) {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useLocalizedNavigate();
  const isHomePage = window.location.pathname === "/" || window.location.pathname === "/en";
  const isEn = i18n.language === "en";

  // Resolve translation key with fallback when i18n returns the raw key
  const tx = (key, fallback) => {
    const v = t(key);
    return v === key ? fallback : v;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { id: "features", label: tx("navbar.nav_features", isEn ? "Features" : "Можливості") },
    { id: "how-it-works", label: tx("navbar.nav_how", isEn ? "How it works" : "Як це працює") },
    { id: "comparison", label: tx("navbar.nav_compare", isEn ? "Compare" : "Порівняння") },
    { id: "pricing", label: isEn ? "Pricing" : "Ціни" }
  ];

  const switchLang = () => {
    const currentPath = window.location.pathname;
    const isEnPath = currentPath.startsWith("/en");
    let newPath = currentPath;
    if (isEnPath) {
      newPath = currentPath.replace(/^\/en/, "") || "/";
    } else {
      newPath = `/en${currentPath === "/" ? "" : currentPath}`;
    }
    window.location.href = newPath + window.location.search + window.location.hash;
  };

  return (
    <>
      <nav
        data-testid="navbar"
        className="apple-nav"
      >
        <div className="apple-nav-inner" style={{ background: scrolled ? "rgba(22, 22, 23, 0.85)" : "rgba(22, 22, 23, 0.7)" }}>
          <a
            href={isEn ? "/en" : "/"}
            onClick={(e) => { e.preventDefault(); navigate("/"); }}
            data-testid="nav-logo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "#f5f5f7",
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: "-0.01em"
            }}
          >
            <img
              src="/atlas-icon.png"
              alt="Atlas AI"
              style={{ width: 22, height: 22, borderRadius: 5 }}
            />
            Atlas AI
          </a>

          <div className="nav-links" style={{ display: "flex", gap: 22, alignItems: "center" }}>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={isHomePage ? `#${link.id}` : `${isEn ? "/en" : ""}/#${link.id}`}
                data-testid={`nav-link-${link.id}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="navbar-actions" style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <a
              href={isEn ? "/en/docs" : "/docs"}
              onClick={(e) => { e.preventDefault(); navigate("/docs"); }}
              data-testid="nav-docs-link"
            >
              {t("navbar.docs")}
            </a>
            <button
              onClick={switchLang}
              data-testid="nav-lang-toggle"
              style={{
                background: "none",
                border: "none",
                color: "rgba(245,245,247,0.85)",
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: 0
              }}
            >
              <Globe size={14} />
              {isEn ? "UA" : "EN"}
            </button>
            <a
              href={user ? (isEn ? "/en/dashboard" : "/dashboard") : (isEn ? "/en/login" : "/login")}
              data-testid="nav-cta-btn"
              onClick={(e) => {
                e.preventDefault();
                user ? navigate("/dashboard") : navigate("/login");
              }}
              style={{
                textDecoration: "none",
                background: "#f5f5f7",
                color: "#000",
                fontSize: 13,
                fontWeight: 500,
                padding: "7px 14px",
                borderRadius: 999,
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f5f5f7")}
            >
              {user ? t("navbar.cabinet") : t("navbar.login")}
            </a>
          </div>

          <button
            className="burger-btn"
            aria-label="Toggle mobile menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "#f5f5f7",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            padding: 40
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={isHomePage ? `#${link.id}` : `${isEn ? "/en" : ""}/#${link.id}`}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: "#f5f5f7",
                fontSize: 22,
                textDecoration: "none",
                fontWeight: 500,
                letterSpacing: "-0.02em"
              }}
            >
              {link.label}
            </a>
          ))}

          <a
            href={isEn ? "/en/docs" : "/docs"}
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              navigate("/docs");
            }}
            style={{ color: "rgba(245,245,247,0.7)", fontSize: 18, textDecoration: "none" }}
          >
            {t("navbar.docs")}
          </a>

          <button
            onClick={() => { setIsMobileMenuOpen(false); switchLang(); }}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              color: "#fff",
              fontSize: 15,
              padding: "8px 16px",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer"
            }}
          >
            <Globe size={16} />
            {isEn ? "Switch to Ukrainian" : "Switch to English"}
          </button>

          <a
            href={user ? (isEn ? "/en/dashboard" : "/dashboard") : (isEn ? "/en/login" : "/login")}
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              user ? navigate("/dashboard") : navigate("/login");
            }}
            style={{
              textDecoration: "none",
              background: "#f5f5f7",
              color: "#000",
              fontSize: 16,
              fontWeight: 500,
              padding: "10px 22px",
              borderRadius: 999
            }}
          >
            {user ? t("navbar.cabinet") : t("navbar.login")}
          </a>
        </div>
      )}
    </>
  );
}
