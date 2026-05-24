import { X, Sparkles } from "lucide-react";
import { useEffect } from "react";import { useTranslation } from "react-i18next";

export default function ComingSoonModal({ open, onClose }) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      data-testid="coming-soon-modal"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "grid",
        placeItems: "center",
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        animation: "fadeIn 0.3s ease",
        padding: 24,
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px) }
          to { opacity: 1; transform: scale(1) translateY(0) }
        }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass"
        style={{
          position: "relative",
          width: "min(520px, 92vw)",
          borderRadius: 28,
          padding: 40,
          textAlign: "center",
          animation: "scaleIn 0.4s cubic-bezier(0.2,0.7,0.2,1)",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            inset: -40,
            background:
              "radial-gradient(circle at 50% 0%, rgba(0,229,255,0.3), transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <button
          data-testid="modal-close-btn"
          aria-label="Закрити"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <X size={18} />
        </button>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              margin: "0 auto 24px",
              display: "grid",
              placeItems: "center",
              background:
                "conic-gradient(from 180deg, #007AFF, #9D4CDD, #00E5FF, #007AFF)",
              boxShadow: "0 0 40px rgba(0,229,255,0.4)",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "#0a0a0c",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Sparkles size={26} color="#00E5FF" />
            </div>
          </div>

          <h3
            data-testid="modal-title"
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {t("coming_soon.title")}
          </h3>
          <p
            style={{
              marginTop: 16,
              color: "rgba(255,255,255,0.7)",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            {t("coming_soon.desc")}
          </p>

          <button
            data-testid="modal-ok-btn"
            onClick={onClose}
            className="cta-btn"
            style={{ marginTop: 32 }}
          >
            {t("coming_soon.btn")}
          </button>
        </div>
      </div>
    </div>
  );
}
