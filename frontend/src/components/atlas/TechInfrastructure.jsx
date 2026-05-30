import { useTranslation } from "react-i18next";
import { Server, Cloud, Cpu, Sparkles } from "lucide-react";

export default function TechInfrastructure() {
  const { t } = useTranslation();

  const techStack = [
    {
      name: "Render",
      icon: <Server size={24} />,
      color: "#46E3B7"
    },
    {
      name: "Spaceship",
      icon: <Cloud size={24} />,
      color: "#00E5FF"
    },
    {
      name: "OpenAI",
      icon: <Sparkles size={24} />,
      color: "#9D4CDD"
    },
    {
      name: "Neural Engine",
      icon: <Cpu size={24} />,
      color: "#007AFF"
    }
  ];

  // Дублюємо масив кілька разів, щоб скрол був нескінченним і безшовним
  const duplicatedStack = [...techStack, ...techStack, ...techStack, ...techStack];

  return (
    <section 
      style={{
        width: "100%",
        padding: "60px 0",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderTop: "1px solid rgba(255,255,255,0.02)",
        borderBottom: "1px solid rgba(255,255,255,0.02)",
        background: "rgba(0,0,0,0.2)"
      }}
    >
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .marquee-container {
            display: flex;
            width: fit-content;
            animation: marquee 30s linear infinite;
          }
          .marquee-container:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <h3 
        style={{
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.4)",
          fontWeight: 600,
          margin: "0 0 40px 0",
          textAlign: "center"
        }}
      >
        {t("tech_infra.powered_by")}
      </h3>

      <div style={{ display: "flex", width: "100%", overflow: "hidden", position: "relative" }}>
        {/* Градієнти по краях екрану для плавного зникнення/появи тексту */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "15vw", background: "linear-gradient(to right, #05050A, transparent)", zIndex: 2 }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "15vw", background: "linear-gradient(to left, #05050A, transparent)", zIndex: 2 }} />
        
        <div className="marquee-container">
          {duplicatedStack.map((tech, idx) => (
            <div 
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "0 60px", /* Відступи між логотипами */
                opacity: 0.5,
                transition: "opacity 0.3s ease",
                cursor: "default"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
            >
              <div style={{ color: tech.color, display: "flex", alignItems: "center" }}>
                {tech.icon}
              </div>
              <span 
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "rgba(255,255,255,0.8)",
                  whiteSpace: "nowrap"
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
