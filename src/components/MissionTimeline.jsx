import { missionHistory } from "../data/experience";
import { playHoverSound } from "../utils/sound";

export default function MissionTimeline() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", position: "relative" }}>
      {/* Vertical Spine Line */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          bottom: "1.5rem",
          left: "19px",
          width: "2px",
          background: "linear-gradient(to bottom, var(--accent-red), #222)",
          zIndex: 0
        }}
        className="hide-mobile"
      />

      {missionHistory.map((mission) => (
        <div
          key={mission.id}
          onMouseEnter={playHoverSound}
          style={{
            display: "flex",
            gap: "1.75rem",
            position: "relative",
            zIndex: 1
          }}
        >
          {/* Timeline Node Icon (Desktop) */}
          <div
            className="hide-mobile"
            style={{
              flexShrink: 0,
              width: "40px",
              height: "40px",
              background: mission.status === "ACTIVE" ? "var(--accent-red)" : "var(--bg-panel)",
              border: `2px solid ${mission.status === "ACTIVE" ? "var(--accent-red-bright)" : "var(--border-mid)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: mission.status === "ACTIVE" ? "0 0 15px var(--accent-red-glow)" : "none"
            }}
            className="chamfer-sm"
          >
            <div
              style={{
                width: 8,
                height: 8,
                background: mission.status === "ACTIVE" ? "#ffffff" : "var(--text-dim)"
              }}
            />
          </div>

          {/* Mission Card Body */}
          <div
            style={{
              flex: 1,
              background: "var(--bg-panel)",
              border: `1px solid ${mission.status === "ACTIVE" ? "var(--accent-red)" : "var(--border-subtle)"}`,
              padding: "1.75rem",
              position: "relative",
              transition: "all var(--transition-fast)"
            }}
            className="chamfer-sm"
            onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--accent-red)")}
            onMouseOut={(e) =>
              (e.currentTarget.style.borderColor =
                mission.status === "ACTIVE" ? "var(--accent-red)" : "var(--border-subtle)")
            }
          >
            <div className="corner-bracket-tl" />

            {/* Header: Code & Date */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--border-subtle)",
                paddingBottom: "0.75rem",
                marginBottom: "1rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--accent-red-bright)",
                    fontWeight: 700
                  }}
                >
                  {mission.missionCode}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    color: mission.status === "ACTIVE" ? "#00ff66" : "var(--text-muted)",
                    background: mission.status === "ACTIVE" ? "rgba(0, 255, 102, 0.08)" : "transparent",
                    border: `1px solid ${mission.status === "ACTIVE" ? "rgba(0, 255, 102, 0.3)" : "var(--border-subtle)"}`,
                    padding: "2px 6px"
                  }}
                >
                  STATUS: {mission.status}
                </span>
              </div>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--text-dim)"
                }}
              >
                {mission.period}
              </span>
            </div>

            {/* Role & Org */}
            <h3 style={{ fontSize: "1.25rem", color: "#ffffff", fontWeight: 700, marginBottom: "0.25rem" }}>
              {mission.role}
            </h3>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "var(--accent-red)",
                marginBottom: "1rem"
              }}
            >
              // {mission.organization}
            </div>

            {/* Description */}
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              {mission.description}
            </p>

            {/* Skills Acquired */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  color: "var(--text-dim)",
                  letterSpacing: "0.1em",
                  marginBottom: "0.5rem"
                }}
              >
                SKILLS ACQUIRED
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {mission.skillsAcquired.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid var(--border-mid)",
                      color: "var(--text-primary)",
                      padding: "2px 8px"
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
