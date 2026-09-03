import { profileData } from "../data/profile";
import { GraduationCap, Compass, Target, Sparkles } from "lucide-react";
import { playHoverSound } from "../utils/sound";

export default function Identity() {
  const { identityDetails } = profileData;

  return (
    <section
      id="identity"
      style={{
        padding: "6rem 2rem",
        maxWidth: "1240px",
        margin: "0 auto",
        position: "relative"
      }}
    >
      {/* Section Header */}
      <div className="section-header-block">
        <div className="section-pretitle">02 // CLASSIFIED DATABASE</div>
        <h2 className="section-main-title">IDENTITY DOSSIER</h2>
        <p className="section-subtitle">
          Verified character intelligence, technical specialization, academic background, and development objectives.
        </p>
      </div>

      {/* Two-Column Layout */}
      <div
        className="cyber-grid-auto-fit"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "2.5rem",
          alignItems: "start"
        }}
      >
        {/* Left Column: Tactical Identity Card */}
        <div
          style={{
            background: "var(--bg-panel)",
            border: "1px solid var(--border-subtle)",
            padding: "2rem",
            position: "relative"
          }}
          className="chamfer-sm"
          onMouseEnter={playHoverSound}
        >
          <div className="corner-bracket-tl" />
          <div className="corner-bracket-br" />

          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--accent-red)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              marginBottom: "1rem"
            }}
          >
            // RECORD_REF: SV_IDENT_V2
          </div>

          <h3
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#ffffff",
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: "0.75rem",
              marginBottom: "1.25rem"
            }}
          >
            CHARACTER PROFILE ATTRIBUTES
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontFamily: "var(--font-mono)" }}>
            <div>
              <span style={{ color: "var(--text-dim)", fontSize: "0.72rem" }}>NAME:</span>
              <div style={{ fontSize: "1rem", color: "#ffffff", fontWeight: 700 }}>{profileData.name}</div>
            </div>

            <div>
              <span style={{ color: "var(--text-dim)", fontSize: "0.72rem" }}>CLASS:</span>
              <div style={{ fontSize: "0.92rem", color: "var(--accent-red-bright)", fontWeight: 700 }}>
                {profileData.classType}
              </div>
            </div>

            <div>
              <span style={{ color: "var(--text-dim)", fontSize: "0.72rem" }}>ROLE:</span>
              <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{profileData.role}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <span style={{ color: "var(--text-dim)", fontSize: "0.72rem" }}>STATUS:</span>
                <div style={{ fontSize: "0.85rem", color: "#00ff66", fontWeight: 700 }}>{profileData.status}</div>
              </div>
              <div>
                <span style={{ color: "var(--text-dim)", fontSize: "0.72rem" }}>LOCATION:</span>
                <div style={{ fontSize: "0.85rem", color: "#ffffff" }}>{profileData.location}</div>
              </div>
            </div>

            <div>
              <span style={{ color: "var(--text-dim)", fontSize: "0.72rem" }}>SECURITY CLEARANCE:</span>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                TIER-1 ARCHITECT // VERIFIED RECRUITER ACCESS
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio, Education & Goals */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Biography */}
          <div
            style={{
              background: "var(--bg-panel)",
              border: "1px solid var(--border-subtle)",
              padding: "1.75rem"
            }}
            className="chamfer-sm"
          >
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.05rem",
                color: "#ffffff",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Sparkles size={16} color="var(--accent-red)" />
              BIOGRAPHICAL OVERVIEW
            </h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.7 }}>
              I exist at the intersection of logic and imagination — part engineer, part analyst, part digital architect. 
              I don&apos;t just write code; I craft systems that breathe. I don&apos;t just query data; I interrogate it 
              until it confesses its secrets. From engineering pixel-perfect reactive interfaces to wrangling 
              multi-variate datasets into sharp, actionable intelligence, my work lives where precision meets creative 
              audacity. Every line of code is intentional. Every dataset is a story waiting to be decoded.
            </p>
          </div>

          {/* Education & Current Focus Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {/* Education */}
            <div
              style={{
                background: "var(--bg-panel)",
                border: "1px solid var(--border-subtle)",
                padding: "1.5rem"
              }}
              className="chamfer-sm"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--accent-red)",
                  fontWeight: 700,
                  marginBottom: "0.5rem"
                }}
              >
                <GraduationCap size={16} />
                <span>EDUCATION</span>
              </div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>
                {identityDetails.education.degree}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {identityDetails.education.institution}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "4px" }}>
                {identityDetails.education.year} // {identityDetails.education.status}
              </div>
            </div>

            {/* Current Focus */}
            <div
              style={{
                background: "var(--bg-panel)",
                border: "1px solid var(--border-subtle)",
                padding: "1.5rem"
              }}
              className="chamfer-sm"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--accent-red)",
                  fontWeight: 700,
                  marginBottom: "0.5rem"
                }}
              >
                <Compass size={16} />
                <span>CURRENT FOCUS</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                {identityDetails.currentFocus}
              </p>
            </div>
          </div>

          {/* Career Goal Banner */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-mid)",
              borderLeft: "4px solid var(--accent-red)",
              padding: "1.25rem 1.5rem"
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--accent-red)",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "0.4rem"
              }}
            >
              <Target size={14} />
              <span>PRIMARY MISSION OBJECTIVE</span>
            </div>
            <p style={{ fontSize: "0.88rem", color: "#ffffff", lineHeight: 1.5 }}>
              {identityDetails.careerGoals}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
