import { Star } from "lucide-react";
import { playHoverSound, playConfirmSound } from "../utils/sound";

export default function QuestCard({ quest, onSelect }) {
  const renderDifficulty = (difficulty) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={13}
        fill={i < difficulty ? "var(--accent-red)" : "none"}
        color={i < difficulty ? "var(--accent-red)" : "var(--border-mid)"}
      />
    ));
  };

  return (
    <div
      onMouseEnter={playHoverSound}
      style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border-subtle)",
        position: "relative",
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all var(--transition-smooth)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.4)"
      }}
      className="chamfer-sm"
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-red)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div className="corner-bracket-tl" />

      <div>
        {/* Card Header: Quest Code & XP */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--accent-red)",
                fontWeight: 700,
                letterSpacing: "0.1em"
              }}
            >
              {quest.questCode}
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontFamily: "var(--font-mono)",
                background: "rgba(255,255,255,0.06)",
                padding: "2px 6px",
                color: "var(--text-muted)"
              }}
            >
              {quest.type}
            </span>
          </div>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "#00ff66",
              fontWeight: 700,
              background: "rgba(0, 255, 102, 0.08)",
              border: "1px solid rgba(0, 255, 102, 0.2)",
              padding: "2px 6px"
            }}
          >
            {quest.xp}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3
          style={{
            fontSize: "1.3rem",
            color: "#ffffff",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "0.4rem"
          }}
        >
          {quest.title}
        </h3>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--accent-red-bright)",
            marginBottom: "0.9rem"
          }}
        >
          // {quest.subtitle}
        </div>

        {/* Summary */}
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            lineHeight: 1.5,
            marginBottom: "1.25rem"
          }}
        >
          {quest.summary}
        </p>

        {/* Meta Grid: Difficulty & Status */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            background: "var(--bg-surface)",
            padding: "0.75rem",
            border: "1px solid var(--border-subtle)",
            marginBottom: "1.25rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem"
          }}
        >
          <div>
            <div style={{ color: "var(--text-dim)", fontSize: "0.62rem" }}>DIFFICULTY</div>
            <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
              {renderDifficulty(quest.difficulty)}
            </div>
          </div>
          <div>
            <div style={{ color: "var(--text-dim)", fontSize: "0.62rem" }}>STATUS</div>
            <div style={{ color: "var(--text-primary)", fontWeight: 700, marginTop: "2px" }}>
              {quest.status}
            </div>
          </div>
        </div>

        {/* Tech Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1.5rem" }}>
          {quest.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                background: "#1c1c1c",
                border: "1px solid var(--border-mid)",
                color: "var(--text-muted)",
                padding: "2px 7px"
              }}
            >
              {tech}
            </span>
          ))}
          {quest.technologies.length > 4 && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-dim)",
                padding: "2px 4px"
              }}
            >
              +{quest.technologies.length - 4} MORE
            </span>
          )}
        </div>
      </div>

      {/* Action CTA Button */}
      <button
        onClick={() => {
          playConfirmSound();
          onSelect(quest);
        }}
        data-cursor="OPEN"
        className="btn-cyber-secondary"
        style={{
          width: "100%",
          padding: "10px 16px",
          fontSize: "0.82rem",
          justifyContent: "space-between"
        }}
      >
        <span>[ ACCESS QUEST ]</span>
        <span style={{ color: "var(--accent-red)", fontWeight: 800 }}>&gt;&gt;</span>
      </button>
    </div>
  );
}
