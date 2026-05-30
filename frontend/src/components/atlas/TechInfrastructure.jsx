import { useTranslation } from "react-i18next";
import { Server, Cloud, Cpu, Sparkles } from "lucide-react";

export default function TechInfrastructure() {
  const { t } = useTranslation();

  const techStack = [
    {
      name: "Render",
      icon: <Server size={20} />,
      color: "#46E3B7"
    },
    {
      name: "Spaceship",
      icon: <Cloud size={20} />,
      color: "#00E5FF"
    },
    {
      name: "OpenAI",
      icon: <Sparkles size={20} />,
      color: "#9D4CDD"
    },
    {
      name: "Neural Engine",
      icon: <Cpu size={20} />,
      color: "#007AFF"
    }
  ];

  return (
    <section 
      style={{
        width: "100%",
        padding: "40px 5%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 10
      }}
    >
      <div 
        className="reveal"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: 24,
          padding: "32px 48px",
          maxWidth: 900,
          width: "100%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
        }}
      >
        <h3 
          style={{
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.5)",
            fontWeight: 600,
            margin: 0
          }}
        >
          {t("tech_infra.powered_by")}
        </h3>

        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(24px, 5vw, 64px)",
            flexWrap: "wrap"
          }}
        >
          {techStack.map((tech, idx) => (
            <div 
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: 0.8,
                transition: "opacity 0.3s ease, transform 0.3s ease",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.8";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div 
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${tech.color}22, ${tech.color}05)`,
                  border: `1px solid ${tech.color}44`,
                  color: tech.color
                }}
              >
                {tech.icon}
              </div>
              <span 
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "rgba(255,255,255,0.9)"
                }}
              >
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
