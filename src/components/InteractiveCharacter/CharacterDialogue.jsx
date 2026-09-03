import { useEffect, useState } from "react";

export default function CharacterDialogue({ message, duration = 3800 }) {
  const [visible, setVisible] = useState(false);
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setCurrentText(message);
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
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
