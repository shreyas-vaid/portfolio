import { ArrowDown, FileText, ChevronRight, Terminal } from "lucide-react";
import CharacterStats from "../components/CharacterStats";
import { profileData } from "../data/profile";
import { resumeConfig } from "../data/socials";
import { playHoverSound, playSelectSound } from "../utils/sound";

export default function Hero() {
  const scrollToIdentity = () => {
    playSelectSound();
    const el = document.getElementById("identity");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleResumeClick = () => {
    playSelectSound();
    // Open resume or fallback mailto if file not uploaded yet
    window.open(resumeConfig.fileUrl, "_blank");
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "8rem 2rem 5rem",
        position: "relative",
        maxWidth: "1240px",
        margin: "0 auto"
      }}
    >
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "3.5rem",
          alignItems: "center"
        }}
      >
        {/* Left: Character Dossier & Intro */}
        <div>
          {/* Top Status Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "1.25rem",
              flexWrap: "wrap"
            }}
          >
            <span className="cyber-tag">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff003c" }} />
              LEVEL {profileData.level}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "#00ff66",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              ● STATUS: {profileData.status}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-dim)"
              }}
            >
              ID: {profileData.profileId}
            </span>
          </div>

          {/* Character Name — Large Futuristic Display */}
          <h1
            style={{
              fontSize: "clamp(2.8rem, 6.5vw, 4.8rem)",
              fontWeight: 800,
              lineHeight: 1.02,
              color: "#ffffff",
              letterSpacing: "0.03em",
              marginBottom: "0.5rem"
            }}
          >
            {profileData.name}
          </h1>

          {/* Title & Role */}
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              fontWeight: 600,
              color: "var(--accent-red-bright)",
              letterSpacing: "0.15em",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <span>{profileData.title}</span>
            <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>// {profileData.role}</span>
          </div>

          {/* Professional Introduction */}
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-muted)",
              lineHeight: 1.7,
              maxWidth: "540px",
              marginBottom: "2.25rem"
            }}
          >
            {profileData.summary}
          </p>

          {/* Primary Action CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "center" }}>
            <button
              onClick={scrollToIdentity}
              onMouseEnter={playHoverSound}
              data-cursor="EXPLORE"
              className="btn-cyber-primary"
            >
              <span>[ EXPLORE PROFILE ]</span>
              <ChevronRight size={18} />
            </button>

            <button
              onClick={handleResumeClick}
              onMouseEnter={playHoverSound}
              data-cursor="RESUME"
              className="btn-cyber-secondary"
            >
              <FileText size={16} />
              <span>[ VIEW RESUME ]</span>
            </button>
          </div>

          {/* Subsystem Telemetry Badge */}
          <div
            style={{
              marginTop: "3rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              gap: "24px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--text-dim)"
            }}
          >
            <div>
              <span style={{ color: "var(--text-muted)" }}>CLASS:</span> {profileData.classType}
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>LOCATION:</span> {profileData.location}
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>SYS_BUILD:</span> {profileData.buildVersion}
            </div>
          </div>
        </div>

        {/* Right: Character RPG Stat Spectrum */}
        <div>
          <CharacterStats />
        </div>
      </div>
    </section>
  );
}
