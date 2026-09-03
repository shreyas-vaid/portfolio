import { useState } from "react";
import { questProjects } from "../data/projects";
import QuestCard from "../components/QuestCard";
import QuestModal from "../components/QuestModal";

export default function Quests() {
  const [selectedQuest, setSelectedQuest] = useState(null);

  return (
    <section
      id="quests"
      style={{
        padding: "6rem 2rem",
        maxWidth: "1240px",
        margin: "0 auto",
        position: "relative"
      }}
    >
      {/* Section Header */}
      <div className="section-header-block">
        <div className="section-pretitle">04 // MISSION REPOSITORY</div>
        <h2 className="section-main-title">QUEST DATABASE</h2>
        <p className="section-subtitle">
          Interactive engineering missions, digital applications, and analytical pipelines. Click any quest to review detailed architecture dossiers, challenge debriefs, and live links.
        </p>
      </div>

      {/* Quests Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "2rem"
        }}
      >
        {questProjects.map((quest) => (
          <QuestCard key={quest.id} quest={quest} onSelect={(q) => setSelectedQuest(q)} />
        ))}
      </div>

      {/* Detail Modal */}
      {selectedQuest && (
        <QuestModal quest={selectedQuest} onClose={() => setSelectedQuest(null)} />
      )}
    </section>
  );
}
