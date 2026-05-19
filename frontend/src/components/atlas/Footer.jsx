import { Link } from "react-router-dom";

export default function Footer() {
  const links = [
    { label: "Приватність", path: "/privacy" },
    { label: "Умови", path: "/terms" },
    { label: "Контакти", path: "/contacts" }
  ];

  return (
    <footer
      data-testid="footer"
      className="footer-section"
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        className="footer-container"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/atlas-icon.png"
            alt="Atlas AI"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              boxShadow: "0 0 18px rgba(0,229,255,0.35)",
            }}
          />
          <span style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
            Atlas AI
          </span>
        </div>

        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          © {new Date().getFullYear()} Atlas AI. Створено з турботою для macOS.
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              data-testid={`footer-link-${link.label}`}
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
