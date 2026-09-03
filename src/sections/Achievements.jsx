import { achievementsData } from "../data/achievements";
import AchievementCard from "../components/AchievementCard";

export default function Achievements() {
  const totalXp = achievementsData
    .filter((a) => a.status === "UNLOCKED")
    .reduce((acc, a) => acc + parseInt(a.xp.replace(/[^0-9]/g, "") || 0, 10), 0);

  return (
    <section
      id="achievements"
      style={{
        padding: "6rem 2rem",
        maxWidth: "1240px",
        margin: "0 auto",
        position: "relative"
      }}
    >
      {/* Section Header */}
      <div className="section-header-block">
        <div className="section-pretitle">06 // UNLOCKED REWARDS</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 className="section-main-title">ACHIEVEMENT DATABASE</h2>
            <p className="section-subtitle">
              Milestones unlocked across engineering deployments, data modeling operations, and developer collaboration.
            </p>
          </div>

          {/* Aggregate XP Badge */}
          <div
            style={{
              background: "var(--bg-panel)",
              border: "1px solid var(--accent-red)",
              padding: "8px 16px",
              fontFamily: "var(--font-mono)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            className="chamfer-sm"
          >
            <span style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>TOTAL XP ACCUMULATED:</span>
            <span style={{ color: "#00ff66", fontWeight: 700, fontSize: "0.95rem" }}>+{totalXp} XP</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem"
        }}
      >
        {achievementsData.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </section>
  );
}
