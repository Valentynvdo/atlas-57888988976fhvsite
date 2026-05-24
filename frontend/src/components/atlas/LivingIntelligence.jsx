import { useTranslation } from "react-i18next";
import { Brain, Infinity as InfinityIcon, Activity } from "lucide-react";

/**
 * Living Intelligence — abstract neural-connection visual + copy.
 * Pure SVG so it stays crisp and animated.
 */
export default function LivingIntelligence() {
  const { t } = useTranslation();
  return (
    <section
      id="intelligence"
      data-testid="intelligence-section"
      className="section-container"
      style={{ position: "relative" }}
    >
      <div
        className="two-col"
      >
        <div className="reveal">
          <div className="section-eyebrow">{t("living_intel.eyebrow")}</div>
          <h2
            data-testid="intelligence-title"
            style={{
              marginTop: 16,
              fontSize: "clamp(2rem, 4.6vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontWeight: 600,
              maxWidth: 560,
            }}
          >
            <span className="gradient-text">{t("living_intel.title_1")}</span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(120deg, #007AFF, #9D4CDD, #00E5FF)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("living_intel.title_2")}
            </span>
          </h2>
          <p
            className="reveal delay-1"
            style={{
              marginTop: 24,
              color: "rgba(255,255,255,0.7)",
              fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
              lineHeight: 1.7,
              maxWidth: 520,
            }}
          >
            {t("living_intel.desc")}
          </p>

          <div
            className="reveal delay-2"
            style={{
              marginTop: 40,
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 16,
              maxWidth: 520,
            }}
          >
            {[
              {
                icon: <Brain size={20} color="#00E5FF" />,
                title: t("living_intel.f1_title"),
                desc: t("living_intel.f1_desc"),
              },
              {
                icon: <InfinityIcon size={20} color="#9D4CDD" />,
                title: t("living_intel.f2_title"),
                desc: t("living_intel.f2_desc"),
              },
              {
                icon: <Activity size={20} color="#007AFF" />,
                title: t("living_intel.f3_title"),
                desc: t("living_intel.f3_desc"),
              },
            ].map((f, i) => (
              <div
                key={i}
                className="glass"
                style={{
                  padding: "16px 18px",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
                data-testid={`intelligence-feature-${i}`}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    background:
                      "linear-gradient(135deg, rgba(0,229,255,0.08), rgba(157,76,221,0.08))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>
                    {f.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      marginTop: 2,
                    }}
                  >
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Neural visual */}
        <div
          className="reveal delay-1"
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            maxWidth: 560,
            width: "100%",
            justifySelf: "center",
          }}
          data-testid="intelligence-visual"
        >
          <NeuralWeb />
        </div>
      </div>
    </section>
  );
}

function NeuralWeb() {
  const { t } = useTranslation();
  const nodes = [
    { x: 50, y: 50, r: 6 },
    { x: 20, y: 25, r: 3 },
    { x: 80, y: 22, r: 4 },
    { x: 15, y: 70, r: 3 },
    { x: 85, y: 75, r: 4 },
    { x: 50, y: 12, r: 3 },
    { x: 50, y: 88, r: 3 },
    { x: 30, y: 50, r: 2.5 },
    { x: 70, y: 50, r: 2.5 },
    { x: 35, y: 80, r: 2.5 },
    { x: 65, y: 80, r: 2.5 },
    { x: 35, y: 20, r: 2.5 },
    { x: 65, y: 20, r: 2.5 },
  ];

  const edges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [0, 7],
    [0, 8],
    [1, 5],
    [2, 5],
    [3, 6],
    [4, 6],
    [1, 11],
    [2, 12],
    [3, 9],
    [4, 10],
    [7, 1],
    [7, 3],
    [8, 2],
    [8, 4],
    [7, 9],
    [8, 10],
    [11, 12],
    [9, 10],
  ];

  return (
    <div
      className="glass float"
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 32,
        padding: 24,
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,229,255,0.18), transparent 60%)",
          filter: "blur(20px)",
        }}
      />

      <svg
        viewBox="0 0 100 100"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#007AFF" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#9D4CDD" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.7" />
          </linearGradient>
          <radialGradient id="nodeGrad">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="1" />
            <stop offset="60%" stopColor="#9D4CDD" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#9D4CDD" stopOpacity="0" />
          </radialGradient>
        </defs>

        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="url(#lineGrad)"
            strokeWidth="0.25"
            strokeOpacity="0.55"
            className="neural-line"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}

        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r * 2} fill="url(#nodeGrad)" opacity="0.5">
              <animate
                attributeName="r"
                values={`${n.r * 1.6};${n.r * 2.4};${n.r * 1.6}`}
                dur={`${3 + (i % 4)}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={n.x} cy={n.y} r={n.r * 0.5} fill="#ffffff" />
          </g>
        ))}
      </svg>

      {/* Floating text badge */}
      <div
        style={{
          position: "absolute",
          left: 24,
          bottom: 24,
          padding: "10px 14px",
          borderRadius: 12,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: 12,
          color: "rgba(255,255,255,0.8)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#00E5FF",
            boxShadow: "0 0 12px #00E5FF",
          }}
        />
        {t("living_intel.live_badge")}
      </div>
    </div>
  );
}
