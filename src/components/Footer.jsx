import { ArrowUp } from "lucide-react";
import { socialLinks } from "../data/socials";
import { playHoverSound, playSelectSound } from "../utils/sound";

export default function Footer() {
  const scrollToTop = () => {
    playSelectSound();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "#080808",
        padding: "3.5rem 2rem 2.5rem",
        position: "relative",
        zIndex: 10
      }}
    >
      <div
        className="footer-inner-mobile"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "2rem"
        }}
      >
        {/* Left: Branding & Status */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "#00ff66",
              marginBottom: "0.6rem",
              flexWrap: "wrap"
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff66", flexShrink: 0 }} />
            <span>SYSTEM STATUS: ONLINE // ALL CHANNELS ACTIVE</span>
          </div>

          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.06em"
            }}
          >
            SHREYAS VAID
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              color: "var(--accent-red-bright)",
              letterSpacing: "0.15em",
              marginBottom: "0.75rem"
            }}
          >
            DEVELOPER / ANALYST // FULL STACK & DATA
          </div>

          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-dim)" }}>
            © 2026 SHREYAS VAID. CLASSIFIED DEVELOPER SYSTEM.
          </div>
        </div>

        {/* Right: Quick Links & Back to Top */}
        <div className="footer-right-mobile" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "16px" }}>
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverSound}
                data-cursor="GO"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "color var(--transition-fast)"
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--accent-red-bright)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            onMouseEnter={playHoverSound}
            data-cursor="TOP"
            style={{
              background: "var(--bg-panel)",
              border: "1px solid var(--border-mid)",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              cursor: "pointer",
              transition: "all var(--transition-fast)"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-red)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "var(--border-mid)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
          >
            <ArrowUp size={14} />
            <span>[ RETURN TO TOP ]</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
