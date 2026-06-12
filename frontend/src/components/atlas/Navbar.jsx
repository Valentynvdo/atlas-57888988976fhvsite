import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../lib/auth";
import { Menu, X, Globe } from "lucide-react";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

export default function Navbar({ onCta }) {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useLocalizedNavigate();
  const isHomePage = window.location.pathname === "/" || window.location.pathname === "/en";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        data-testid="navbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 101,
          transition: "padding 0.4s ease",
          padding: scrolled ? "10px 0" : "18px 0",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: scrolled ? "10px 22px" : "12px 26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 999,
            background: scrolled ? "rgba(13,13,18,0.65)" : "rgba(13,13,18,0.25)",
            backdropFilter: "blur(20px) saturate(150%)",
            WebkitBackdropFilter: "blur(20px) saturate(150%)",
            border: scrolled
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(255,255,255,0.05)",
            boxShadow: scrolled
              ? "0 12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "none",
            transition: "all 0.4s ease",
            marginLeft: "4%",
            marginRight: "4%",
            pointerEvents: "auto",
          }}
        >
          <a
            href={i18n.language === "en" ? "/en" : "/"}
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            data-testid="nav-logo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "#fff",
              position: "relative",
              zIndex: 51,
            }}
          >
            <img
              src="/atlas-icon.png"
              alt="Atlas AI"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                boxShadow: "0 0 24px rgba(109,93,246,0.45)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--sf-display, -apple-system, BlinkMacSystemFont, sans-serif)",
                fontWeight: 700,
                letterSpacing: "-0.43px",
                fontSize: 17,
              }}
            >
              Atlas AI
            </span>
          </a>

          <div className="nav-links">
            {[
              { id: "intelligence", label: t("navbar.nav_intelligence") },
              { id: "macos", label: t("navbar.nav_macos") },
              { id: "concierge", label: t("navbar.nav_concierge") },
              { id: "awareness", label: t("navbar.nav_awareness") },
            ].map((link) => (
              <a
                key={link.id}
                href={isHomePage ? `#${link.id}` : `${i18n.language === 'en' ? '/en' : ''}/#${link.id}`}
                data-testid={`nav-link-${link.id}`}
                style={{
                  color: "rgba(255,255,255,0.72)",
                  fontSize: 14,
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.72)")
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="navbar-actions">
            <button
              onClick={() => {
                const currentPath = window.location.pathname;
                const isEn = currentPath.startsWith('/en');
                let newPath = currentPath;
                if (isEn) {
                  newPath = currentPath.replace(/^\/en/, '') || '/';
                } else {
                  newPath = `/en${currentPath === '/' ? '' : currentPath}`;
                }
                const searchAndHash = window.location.search + window.location.hash;
                window.location.href = newPath + searchAndHash;
              }}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.72)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "color 0.2s ease, background 0.2s ease",
                padding: "4px 8px",
                borderRadius: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.72)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Globe size={16} />
              {i18n.language === 'uk' ? 'EN' : 'UA'}
            </button>

            <a
              href={i18n.language === 'en' ? "/en/docs" : "/docs"}
              onClick={(e) => {
                e.preventDefault();
                navigate("/docs");
              }}
              data-testid="nav-docs-link"
              style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              {t("navbar.docs")}
            </a>
            <a
              href={user ? (i18n.language === 'en' ? "/en/dashboard" : "/dashboard") : (i18n.language === 'en' ? "/en/login" : "/login")}
              data-testid="nav-cta-btn"
              onClick={(e) => {
                e.preventDefault();
                user ? navigate("/dashboard") : navigate("/login");
              }}
              style={{
                textDecoration: "none",
                background: "linear-gradient(135deg, rgba(109,93,246,0.18), rgba(79,70,229,0.18))",
                border: "1px solid rgba(109,93,246,0.4)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.3s ease",
                padding: "8px 18px",
                borderRadius: 999,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(109,93,246,0.35), rgba(79,70,229,0.35))";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(109,93,246,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(109,93,246,0.18), rgba(79,70,229,0.18))";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {user ? t("navbar.cabinet") : t("navbar.login")}
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22D3EE",
                  boxShadow: "0 0 12px #22D3EE",
                }}
              />
            </a>
          </div>

          <button
            className="burger-btn"
            aria-label="Toggle mobile menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 101,
            }}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(9, 9, 11, 0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
            padding: "40px",
          }}
        >
          {[
            { id: "intelligence", label: t("navbar.nav_intelligence") },
            { id: "macos", label: t("navbar.nav_macos") },
            { id: "concierge", label: t("navbar.nav_concierge") },
            { id: "awareness", label: t("navbar.nav_awareness") },
          ].map((link) => (
            <a
              key={link.id}
              href={isHomePage ? `#${link.id}` : `${i18n.language === 'en' ? '/en' : ''}/#${link.id}`}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: "#fff",
                fontSize: 24,
                textDecoration: "none",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {link.label}
            </a>
          ))}


          <a
            href={i18n.language === 'en' ? "/en/docs" : "/docs"}
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              navigate(i18n.language === 'en' ? "/en/docs" : "/docs");
            }}
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: 20,
              textDecoration: "none",
              fontWeight: 500,
              marginTop: 12,
            }}
          >
            {t("navbar.docs")}
          </a>

          <button
            onClick={() => {
              const currentPath = window.location.pathname;
              const isEn = currentPath.startsWith('/en');
              let newPath = currentPath;
              if (isEn) {
                newPath = currentPath.replace(/^\/en/, '') || '/';
              } else {
                newPath = `/en${currentPath === '/' ? '' : currentPath}`;
              }
              const searchAndHash = window.location.search + window.location.hash;
              navigate(newPath + searchAndHash);
              setIsMobileMenuOpen(false);
            }}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              fontSize: 16,
              fontWeight: 500,
              marginTop: 12,
              cursor: "pointer",
              padding: "8px 16px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <Globe size={18} />
            {i18n.language === 'uk' ? 'Switch to English' : 'Перейти на Українську'}
          </button>

          <a
            href={user ? (i18n.language === 'en' ? "/en/dashboard" : "/dashboard") : (i18n.language === 'en' ? "/en/login" : "/login")}
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              user ? navigate("/dashboard") : navigate("/login");
            }}
            style={{
              textDecoration: "none",
              background: "none",
              border: "none",
              color: "#22D3EE",
              fontSize: 20,
              fontWeight: 600,
              marginTop: 12,
              cursor: "pointer",
            }}
          >
            {user ? t("navbar.cabinet") : t("navbar.login")}
          </a>
        </div>
      )}
    </>
  );
}
