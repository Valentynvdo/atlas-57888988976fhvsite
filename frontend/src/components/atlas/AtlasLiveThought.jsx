import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BrainCircuit } from "lucide-react";
import api from "../../lib/api";

export default function AtlasLiveThought() {
  const { t } = useTranslation();
  const [thought, setThought] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchThought = async () => {
    try {
      const res = await api.get("/api/atlas/thought");
      setThought(res.data);
    } catch (e) {
      console.error("Failed to fetch thought", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThought();
    const interval = setInterval(fetchThought, 30000); // Оновлюємо кожні 30 секунд
    return () => clearInterval(interval);
  }, []);

  if (loading || !thought) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "0 20px",
        marginTop: "-20px",
        marginBottom: "40px",
        position: "relative",
        zIndex: 5,
      }}
    >
      <div
        className="glass"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 24px",
          borderRadius: 999,
          background: "rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(0, 229, 255, 0.15)",
          boxShadow: "0 0 30px rgba(0, 229, 255, 0.1)",
          backdropFilter: "blur(12px)",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(0, 229, 255, 0.1)",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          <BrainCircuit size={18} color="#00E5FF" />
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(0.95); }
            }
          `}</style>
        </div>
        
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2, fontWeight: 600 }}>
            {t("live_thought.studying")}
          </div>
          <div style={{ fontSize: 15, color: "#fff", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {thought.thought}
          </div>
        </div>
        
        <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.3)", whiteSpace: "nowrap" }}>
          Live
        </div>
      </div>
    </div>
  );
}
