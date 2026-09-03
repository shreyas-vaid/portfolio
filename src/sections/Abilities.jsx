import { useState } from "react";
import { abilityCategories } from "../data/skills";
import SkillCard from "../components/SkillCard";
import { playHoverSound, playSelectSound } from "../utils/sound";

export default function Abilities() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCategories =
    activeTab === "all"
      ? abilityCategories
      : abilityCategories.filter((cat) => cat.id === activeTab);

  return (
    <section
      id="abilities"
      style={{
        padding: "6rem 2rem",
        maxWidth: "1240px",
        margin: "0 auto",
        position: "relative"
      }}
    >
      {/* Section Header */}
      <div className="section-header-block">
        <div className="section-pretitle">03 // SPECIALIZED MODULES</div>
        <h2 className="section-main-title">ABILITY MATRIX</h2>
        <p className="section-subtitle">
          Modular technical proficiencies, runtime languages, backend frameworks, data pipelines, and developer environments. Hover or tap any module to inspect tactical capabilities.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "2.5rem"
        }}
      >
        <button
          onClick={() => {
            playSelectSound();
            setActiveTab("all");
          }}
          onMouseEnter={playHoverSound}
          data-cursor="FILTER"
          className={activeTab === "all" ? "btn-cyber-primary" : "btn-cyber-secondary"}
          style={{ padding: "8px 16px", fontSize: "0.78rem" }}
        >
          [ ALL_MATRICES ]
        </button>

        {abilityCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              playSelectSound();
              setActiveTab(category.id);
            }}
            onMouseEnter={playHoverSound}
            data-cursor="FILTER"
            className={activeTab === category.id ? "btn-cyber-primary" : "btn-cyber-secondary"}
            style={{ padding: "8px 16px", fontSize: "0.78rem" }}
          >
            [{category.badge} // {category.title.split(" ")[0]}]
          </button>
        ))}
      </div>

      {/* Category Groups */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {filteredCategories.map((category) => (
          <div key={category.id}>
            {/* Category Header */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--border-subtle)",
                paddingBottom: "0.75rem",
                marginBottom: "1.5rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className="cyber-tag">{category.badge}</span>
                <h3 style={{ fontSize: "1.35rem", color: "#ffffff", fontWeight: 700 }}>
                  {category.title}
                </h3>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--text-dim)"
                }}
                className="hide-mobile"
              >
                {category.description}
              </span>
            </div>

            {/* Skills Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "1.25rem"
              }}
            >
              {category.skills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
