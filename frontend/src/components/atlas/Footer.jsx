export default function Footer() {
  return (
    <footer
      data-testid="footer"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "48px 0 32px",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(12px)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
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
          {["Приватність", "Умови", "Контакти"].map((l) => (
            <a
              key={l}
              href="#"
              data-testid={`footer-link-${l}`}
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
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
