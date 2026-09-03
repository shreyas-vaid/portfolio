import { Rocket, Database, ShieldAlert, Cpu, Zap, GitBranch, Lock, Check } from "lucide-react";
import { playHoverSound } from "../utils/sound";

const ICON_MAP = {
  Rocket: Rocket,
  Database: Database,
  ShieldAlert: ShieldAlert,
  Cpu: Cpu,
  Zap: Zap,
  GitBranch: GitBranch
};

export default function AchievementCard({ achievement }) {
  const IconComponent = ICON_MAP[achievement.icon] || Zap;
  const isUnlocked = achievement.status === "UNLOCKED";

  return (
    <div
      onMouseEnter={playHoverSound}
      style={{
        background: isUnlocked ? "var(--bg-panel)" : "rgba(18, 18, 18, 0.4)",
        border: `1px solid ${isUnlocked ? "var(--border-subtle)" : "var(--border-subtle)"}`,
        borderLeft: `4px solid ${isUnlocked ? "var(--accent-red)" : "var(--border-mid)"}`,
        padding: "1.5rem",
        position: "relative",
        opacity: isUnlocked ? 1 : 0.65,
        transition: "all var(--transition-fast)"
      }}
      className="chamfer-sm"
      onMouseOver={(e) => {
        if (isUnlocked) {
          e.currentTarget.style.borderColor = "var(--accent-red)";
          e.currentTarget.style.transform = "translateY(-3px)";
        }
      }}
      onMouseOut={(e) => {
        if (isUnlocked) {
          e.currentTarget.style.borderColor = "var(--border-subtle)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem"
        }}
      >
        {/* Icon & Code */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              background: isUnlocked ? "var(--accent-red-subtle)" : "#181818",
              border: `1px solid ${isUnlocked ? "var(--accent-red)" : "var(--border-mid)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isUnlocked ? "var(--accent-red-bright)" : "var(--text-dim)"
            }}
            className="chamfer-sm"
          >
            {isUnlocked ? <IconComponent size={18} /> : <Lock size={16} />}
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                color: isUnlocked ? "var(--accent-red)" : "var(--text-dim)",
                fontWeight: 700
              }}
            >
              {achievement.code} // {achievement.category}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: isUnlocked ? "#00ff66" : "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              {isUnlocked ? <Check size={12} /> : null}
              <span>{achievement.status}</span>
            </div>
          </div>
        </div>

        {/* XP Badge */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: isUnlocked ? "var(--accent-red-bright)" : "var(--text-dim)",
            fontWeight: 700,
            background: isUnlocked ? "rgba(255, 0, 60, 0.08)" : "transparent",
            border: `1px solid ${isUnlocked ? "var(--accent-red-dark)" : "var(--border-subtle)"}`,
            padding: "2px 8px"
          }}
        >
          {achievement.xp}
        </span>
      </div>

      {/* Name */}
      <h3
        style={{
          fontSize: "1.05rem",
          fontWeight: 700,
          color: isUnlocked ? "#ffffff" : "var(--text-muted)",
          marginBottom: "0.5rem",
          lineHeight: 1.2
        }}
      >
        {achievement.name}
      </h3>

      {/* Description */}
      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
        {achievement.description}
      </p>
    </div>
  );
}
