import { useState } from "react";
import { Send, CheckCircle, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "./SocialIcons";
import { socialLinks } from "../data/socials";
import { playConfirmSound, playHoverSound } from "../utils/sound";

export default function ConnectionTerminal() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [transmitting, setTransmitting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [transmitted, setTransmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "IDENTIFIER / NAME REQUIRED";
    if (!formData.email.trim()) {
      errs.email = "COMMS FREQUENCY / EMAIL REQUIRED";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "INVALID PROTOCOL / EMAIL FORMAT";
    }
    if (!formData.message.trim()) errs.message = "PAYLOAD / MESSAGE CANNOT BE EMPTY";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setTransmitting(true);
    playConfirmSound();

    const sequence = [
      "> INITIATING HANDSHAKE PROTOCOL...",
      "> ESTABLISHING ENCRYPTED CONNECTION...",
      "> APPLYING AES-256 PAYLOAD CIPHER...",
      "> TRANSMISSION DISPATCHED TO SHREYAS VAID",
      "> STATUS: 200 OK // TRANSMISSION COMPLETE"
    ];

    sequence.forEach((line, index) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, line]);
        if (index === sequence.length - 1) {
          setTransmitting(false);
          setTransmitted(true);

          // Direct mailto fallback dispatch so the message is never lost
          const subject = encodeURIComponent(`Portfolio Transmission from ${formData.name}`);
          const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
          );
          window.open(`mailto:shreyaskaidkrishnav2.0@gmail.com?subject=${subject}&body=${body}`, "_blank");
        }
      }, (index + 1) * 350);
    });
  };

  const getSocialIcon = (iconName) => {
    switch (iconName) {
      case "Github":
        return <GithubIcon size={18} />;
      case "Linkedin":
        return <LinkedinIcon size={18} />;
      case "Mail":
        return <Mail size={18} />;
      case "Instagram":
        return <InstagramIcon size={18} />;
      default:
        return <Mail size={18} />;
    }
  };

  return (
    <div
      className="cyber-grid-auto-fit connection-grid-container"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
        gap: "2rem",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box"
      }}
    >
      {/* Left: Terminal Meta & Available Comms Channels */}
      <div
        className="chamfer-sm connection-card"
        style={{
          background: "var(--bg-panel)",
          border: "1px solid var(--border-subtle)",
          padding: "clamp(1.2rem, 4vw, 2rem)",
          position: "relative",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          minWidth: 0,
          overflow: "hidden"
        }}
      >
        <div className="corner-bracket-tl" />

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--accent-red)",
            fontWeight: 700,
            marginBottom: "0.5rem"
          }}
        >
          // COMMS_HUB // PROTOCOL_07
        </div>

        <h3
          style={{
            fontSize: "clamp(1.2rem, 5vw, 1.6rem)",
            color: "#ffffff",
            fontWeight: 700,
            marginBottom: "0.5rem",
            wordBreak: "break-word"
          }}
        >
          TRANSMISSION TARGET
        </h3>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: "1.75rem",
            wordBreak: "break-word"
          }}
        >
          <div>TARGET: <strong style={{ color: "#ffffff" }}>SHREYAS VAID</strong></div>
          <div>ROLE: <strong style={{ color: "var(--accent-red-bright)" }}>DEVELOPER / CREATOR</strong></div>
          <div>LOCATION: INDIA // ASIA-PACIFIC NODE</div>
          <div>STATUS: <span style={{ color: "#00ff66" }}>ACCEPTING NEW MISSIONS</span></div>
        </div>

        {/* Available Direct Channels */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--text-dim)",
            letterSpacing: "0.1em",
            marginBottom: "1rem"
          }}
        >
          DIRECT COMMUNICATION FREQUENCIES:
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
          {socialLinks.map((channel) => (
            <a
              key={channel.id}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHoverSound}
              data-cursor="CONNECT"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                textDecoration: "none",
                transition: "all var(--transition-fast)",
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                overflow: "hidden"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-red)";
                e.currentTarget.style.transform = "translateX(2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1, overflow: "hidden" }}>
                <span style={{ color: "var(--accent-red)", flexShrink: 0 }}>{getSocialIcon(channel.icon)}</span>
                <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {channel.name}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {channel.handle}
                  </div>
                </div>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-dim)", flexShrink: 0, marginLeft: "8px" }}>
                [ACCESS]
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Right: Message Dispatch Terminal Form */}
      <div
        className="chamfer-sm connection-card"
        style={{
          background: "var(--bg-panel)",
          border: "1px solid var(--border-subtle)",
          padding: "clamp(1.2rem, 4vw, 2rem)",
          position: "relative",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          minWidth: 0,
          overflow: "hidden"
        }}
      >
        <div className="corner-bracket-br" />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "0.75rem",
            marginBottom: "1.5rem",
            gap: "8px",
            minWidth: 0,
            width: "100%",
            maxWidth: "100%"
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(0.85rem, 4vw, 0.95rem)",
              fontWeight: 700,
              color: "#ffffff",
              whiteSpace: "nowrap"
            }}
          >
            DISPATCH PAYLOAD
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              color: "var(--accent-red-bright)",
              background: "var(--accent-red-subtle)",
              border: "1px solid var(--accent-red)",
              padding: "2px 8px",
              flexShrink: 0
            }}
          >
            AES-256
          </span>
        </div>

        {transmitted ? (
          <div style={{ padding: "1.5rem 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#00ff66",
                marginBottom: "1rem"
              }}
            >
              <CheckCircle size={24} />
              <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>
                TRANSMISSION DISPATCHED
              </strong>
            </div>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Your encrypted transmission was dispatched. If your local mail client didn&apos;t automatically launch, you can directly email Shreyas at{" "}
              <a href="mailto:shreyaskaidkrishnav2.0@gmail.com" style={{ color: "var(--accent-red)" }}>
                shreyaskaidkrishnav2.0@gmail.com
              </a>.
            </p>

            <button
              onClick={() => {
                setTransmitted(false);
                setTerminalLogs([]);
                setFormData({ name: "", email: "", message: "" });
              }}
              className="btn-cyber-secondary"
            >
              [ NEW TRANSMISSION ]
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
            {/* Name Field */}
            <div style={{ width: "100%", maxWidth: "100%" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: errors.name ? "var(--accent-red)" : "var(--text-muted)",
                  marginBottom: "4px"
                }}
              >
                IDENTIFIER / NAME {errors.name && `* [${errors.name}]`}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Agent / Recruiter / Collaborator"
                disabled={transmitting}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  background: "var(--bg-surface)",
                  border: `1px solid ${errors.name ? "var(--accent-red)" : "var(--border-mid)"}`,
                  color: "#ffffff",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-red)")}
                onBlur={(e) => (e.target.style.borderColor = errors.name ? "var(--accent-red)" : "var(--border-mid)")}
              />
            </div>

            {/* Email Field */}
            <div style={{ width: "100%", maxWidth: "100%" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: errors.email ? "var(--accent-red)" : "var(--text-muted)",
                  marginBottom: "4px"
                }}
              >
                RETURN FREQUENCY / EMAIL {errors.email && `* [${errors.email}]`}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@domain.com"
                disabled={transmitting}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  background: "var(--bg-surface)",
                  border: `1px solid ${errors.email ? "var(--accent-red)" : "var(--border-mid)"}`,
                  color: "#ffffff",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-red)")}
                onBlur={(e) => (e.target.style.borderColor = errors.email ? "var(--accent-red)" : "var(--border-mid)")}
              />
            </div>

            {/* Message Field */}
            <div style={{ width: "100%", maxWidth: "100%" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: errors.message ? "var(--accent-red)" : "var(--text-muted)",
                  marginBottom: "4px"
                }}
              >
                PAYLOAD / MESSAGE {errors.message && `* [${errors.message}]`}
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type your message, opportunity, or collaboration details..."
                disabled={transmitting}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  background: "var(--bg-surface)",
                  border: `1px solid ${errors.message ? "var(--accent-red)" : "var(--border-mid)"}`,
                  color: "#ffffff",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  outline: "none",
                  resize: "vertical"
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-red)")}
                onBlur={(e) => (e.target.style.borderColor = errors.message ? "var(--accent-red)" : "var(--border-mid)")}
              />
            </div>

            {/* Live Sequence Terminal Logs */}
            {terminalLogs.length > 0 && (
              <div
                style={{
                  background: "#080808",
                  border: "1px solid #222",
                  padding: "10px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "#ff2a55",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  wordBreak: "break-all"
                }}
              >
                {terminalLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={transmitting}
              onMouseEnter={playHoverSound}
              data-cursor="TRANSMIT"
              className="btn-cyber-primary"
              style={{
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                marginTop: "0.5rem",
                fontSize: "clamp(0.82rem, 3.5vw, 0.95rem)"
              }}
            >
              <Send size={16} />
              <span>{transmitting ? "ENCRYPTING & TRANSMITTING..." : "[ TRANSMIT MESSAGE ]"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
