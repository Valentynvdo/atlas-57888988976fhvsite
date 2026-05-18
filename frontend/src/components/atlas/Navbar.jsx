import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";

export default function Navbar({ onCta }) {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      data-testid="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
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
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontSize: 18,
            }}
          >
            Atlas AI
          </span>
        </a>

        <div className="hidden md:flex" style={{ gap: 32 }}>
          {[
            { id: "intelligence", label: "Інтелект" },
            { id: "macos", label: "macOS" },
            { id: "concierge", label: "Concierge" },
            { id: "awareness", label: "Свідомість" },
          ].map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
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

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a
            href="/docs"
            onClick={(e) => {
              e.preventDefault();
              navigate("/docs");
            }}
            data-testid="nav-docs-link"
            style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
          >
            📖 Документація
          </a>
        <button
          data-testid="nav-cta-btn"
          onClick={() => (user ? navigate("/dashboard") : navigate("/login"))}
          className="cta-btn"
          style={{ padding: "0.6rem 1.2rem", fontSize: 14 }}
        >
          {user ? "Кабінет" : "Увійти"}
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
      </div>
    </nav>
  );
}
