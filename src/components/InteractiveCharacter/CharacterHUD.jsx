export default function CharacterHUD({ viewState = "FRONT" }) {
  return (
    <div className="chibi-hud-badge">
      <span className="chibi-hud-led" />
      <span>COMPANION SV-01</span>
      <span style={{ color: "var(--accent-red-bright)", fontWeight: 700 }}>
        // [{viewState}]
      </span>
    </div>
  );
}
