import { useEffect, useState } from "react";

export default function CharacterDialogue({ message, duration = 3800 }) {
  const [visible, setVisible] = useState(false);
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    if (!message) {
      const hideTimer = setTimeout(() => setVisible(false), 0);
      return () => clearTimeout(hideTimer);
    }

    const showTimer = setTimeout(() => {
      setCurrentText(message);
      setVisible(true);
    }, 0);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [message, duration]);

  if (!visible || !currentText) return null;

  return (
    <div className="chibi-speech-bubble" role="status" aria-live="polite">
      <span style={{ color: "var(--accent-red)", fontWeight: 700, marginRight: "4px" }}>
        ▶
      </span>
      {currentText}
    </div>
  );
}
