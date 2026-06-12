import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const getLocalizedPath = (path) => {
    return isEn ? `/en${path}` : path;
  };

  const links = [
    { label: t("footer.privacy"), path: getLocalizedPath("/privacy") },
    { label: t("footer.terms"), path: getLocalizedPath("/terms") },
    { label: t("footer.contacts"), path: getLocalizedPath("/contacts") },
    { label: t("atlas_v2.careers.footer_link") || "Careers", path: getLocalizedPath("/careers") },
    { label: t("footer.investors") || "Investors", path: getLocalizedPath("/investors") },
    { label: t("footer.blog") || "Blog / Блог", path: getLocalizedPath("/blog") },
    { label: isEn ? "Pricing" : "Ціни", path: getLocalizedPath("/pricing") },
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
      {/* Decorative ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-180px",
          transform: "translateX(-50%)",
          width: 700,
          height: 320,
          background: "radial-gradient(ellipse, rgba(109,93,246,0.14), transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 28,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/atlas-icon.png"
            alt="Atlas AI"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              boxShadow: "0 0 22px rgba(109,93,246,0.5)",
            }}
          />
          <span style={{ fontWeight: 700, letterSpacing: "-0.02em", fontSize: 17 }}>
            Atlas AI
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px 8px" }}>
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              data-testid={`footer-link-${link.label}`}
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                transition: "color 0.3s ease, background 0.3s ease, border-color 0.3s ease",
                whiteSpace: "nowrap",
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "rgba(109,93,246,0.1)";
                e.currentTarget.style.borderColor = "rgba(109,93,246,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 520,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
          }}
        />

        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          © {new Date().getFullYear()} Atlas AI. {t("footer.created_with_care")}
        </div>
      </div>
    </footer>
  );
}
