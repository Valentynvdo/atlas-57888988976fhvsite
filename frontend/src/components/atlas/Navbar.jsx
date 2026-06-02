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
          transition: "all 0.4s ease",
          padding: scrolled ? "12px 0" : "20px 0",
          background: scrolled ? "rgba(0,0,0,0.55)" : "transparent",
          backdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            padding: "0 5%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="#hero"
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
                boxShadow: "0 0 24px rgba(0,229,255,0.35)",
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
                // Use standard window location change for language switch to ensure hard reload if needed or just standard react-router navigate 
                // We use standard navigate but bypassing localized logic by manually formatting:
                // Actually navigate(newPath) here would trigger the localized hook which might add/remove EN.
                // So for the language switcher, it's better to force a hard redirect or use window.location
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
                transition: "color 0.2s ease",
                padding: "4px 8px",
                borderRadius: "6px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
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
              href={i18n.language === 'en' ? "/en/blog" : "/blog"}
              onClick={(e) => {
                e.preventDefault();
                navigate("/blog");
              }}
              style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              {t("footer.blog") || "Blog"}
            </a>
            <a
              href={i18n.language === 'en' ? "/en/team" : "/team"}
              onClick={(e) => {
                e.preventDefault();
                navigate("/team");
              }}
              style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              {t("atlas_v2.careers.footer_link") || "Team"}
            </a>
            <a
              href={i18n.language === 'en' ? "/en/investors" : "/investors"}
              onClick={(e) => {
                e.preventDefault();
                navigate("/investors");
              }}
              style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              {t("footer.investors") || "Investors"}
            </a>
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
            <button
              data-testid="nav-cta-btn"
              onClick={() => (user ? navigate("/dashboard") : navigate("/login"))}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.72)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "color 0.3s ease",
                padding: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.72)")
              }
            >
              {user ? t("navbar.cabinet") : t("navbar.login")}
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#00E5FF",
                  boxShadow: "0 0 12px #00E5FF",
                }}
              />
            </button>
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
            background: "rgba(0, 0, 0, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
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
            href={i18n.language === 'en' ? "/en/blog" : "/blog"}
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              navigate(i18n.language === 'en' ? "/en/blog" : "/blog");
            }}
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: 20,
              textDecoration: "none",
              fontWeight: 500,
              marginTop: 12,
            }}
          >
            {t("footer.blog") || "Blog"}
          </a>
          <a
            href={i18n.language === 'en' ? "/en/team" : "/team"}
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              navigate(i18n.language === 'en' ? "/en/team" : "/team");
            }}
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: 20,
              textDecoration: "none",
              fontWeight: 500,
              marginTop: 12,
            }}
          >
            {t("atlas_v2.careers.footer_link") || "Team"}
          </a>
          <a
            href={i18n.language === 'en' ? "/en/investors" : "/investors"}
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              navigate(i18n.language === 'en' ? "/en/investors" : "/investors");
            }}
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: 20,
              textDecoration: "none",
              fontWeight: 500,
              marginTop: 12,
            }}
          >
            {t("footer.investors") || "Investors"}
          </a>
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

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              user ? navigate("/dashboard") : navigate("/login");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#00E5FF",
              fontSize: 20,
              fontWeight: 600,
              marginTop: 12,
              cursor: "pointer",
            }}
          >
            {user ? t("navbar.cabinet") : t("navbar.login")}
          </button>
        </div>
      )}
    </>
  );
}
