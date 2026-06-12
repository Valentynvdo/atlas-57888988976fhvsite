import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

/**
 * Footer — Apple Dark, minimal. No glow, no neon.
 */
export default function Footer() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const lp = (p) => (isEn ? `/en${p}` : p);

  const groups = [
    {
      title: isEn ? "Product" : "Продукт",
      links: [
        { label: isEn ? "Pricing" : "Ціни", to: lp("/pricing") },
        { label: t("navbar.docs"), to: lp("/docs") },
        { label: isEn ? "Blog" : "Блог", to: lp("/blog") }
      ]
    },
    {
      title: isEn ? "Company" : "Компанія",
      links: [
        { label: t("atlas_v2.careers.footer_link") || (isEn ? "Careers" : "Кар'єра"), to: lp("/careers") },
        { label: t("footer.investors") || (isEn ? "Investors" : "Інвесторам"), to: lp("/investors") },
        { label: t("footer.contacts"), to: lp("/contacts") }
      ]
    },
    {
      title: isEn ? "Legal" : "Юридичне",
      links: [
        { label: t("footer.privacy"), to: lp("/privacy") },
        { label: t("footer.terms"), to: lp("/terms") }
      ]
    }
  ];

  return (
    <footer
      data-testid="footer"
      className="footer-section"
      style={{
        position: "relative",
        zIndex: 1,
        background: "#0a0a0a",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        marginTop: 80
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "56px 24px 28px",
          display: "grid",
          gridTemplateColumns: "1.4fr repeat(3, 1fr)",
          gap: 40
        }}
        className="footer-grid"
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <img src="/atlas-icon.png" alt="Atlas AI" style={{ width: 24, height: 24, borderRadius: 6 }} />
            <span style={{ fontWeight: 500, letterSpacing: "-0.01em", fontSize: 15, color: "#f5f5f7" }}>
              Atlas AI
            </span>
          </div>
          <p style={{ color: "rgba(245,245,247,0.5)", fontSize: 13, lineHeight: 1.5, margin: 0, maxWidth: 280 }}>
            {isEn
              ? "An autonomous AI assistant for macOS. Private by design."
              : "Автономний ШІ‑асистент для macOS. Приватний за замовчуванням."}
          </p>
        </div>

        {groups.map((g) => (
          <div key={g.title}>
            <div
              style={{
                fontSize: 12,
                color: "rgba(245,245,247,0.45)",
                fontWeight: 500,
                letterSpacing: "0.02em",
                marginBottom: 14
              }}
            >
              {g.title}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {g.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    data-testid={`footer-link-${l.label}`}
                    style={{
                      color: "rgba(245,245,247,0.75)",
                      fontSize: 13,
                      textDecoration: "none",
                      transition: "color 0.2s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,245,247,0.75)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "20px 24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          fontSize: 12,
          color: "rgba(245,245,247,0.4)"
        }}
      >
        <span>© {new Date().getFullYear()} Atlas AI. {t("footer.created_with_care")}</span>
        <span>{isEn ? "Designed for macOS." : "Створено для macOS."}</span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 28px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
