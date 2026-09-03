import MissionTimeline from "../components/MissionTimeline";

export default function Experience() {
  return (
    <section
      id="experience"
      style={{
        padding: "6rem 2rem",
        maxWidth: "1240px",
        margin: "0 auto",
        position: "relative"
      }}
    >
      {/* Section Header */}
      <div className="section-header-block">
        <div className="section-pretitle">05 // CHRONOLOGICAL LOG</div>
        <h2 className="section-main-title">MISSION HISTORY</h2>
        <p className="section-subtitle">
          Operational track record across academic computer science curriculums, analytical pipeline projects, and independent full-stack product deployments.
        </p>
      </div>

      <MissionTimeline />
    </section>
  );
}
