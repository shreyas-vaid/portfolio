export default function CharacterHUD({ viewState = "FRONT", isWalking = false }) {
  return (
    <div className="chibi-hud-badge">
      <span className={`chibi-hud-led ${isWalking ? "walking" : ""}`} />
      <span>MINI SHREYAS</span>
      <span style={{ color: "var(--accent-red-bright)", fontWeight: 700 }}>
        // [{isWalking ? "STROLLING" : viewState}]
      </span>
    </div>
  );
}
