import { useEffect } from "react";
import "./theme.css";

export default function SecretThemeBanner({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="secret-theme-overlay" role="alertdialog" aria-modal="true">
      <div className="secret-theme-panel">
        <div className="secret-theme-glitch-badge">SYSTEM OVERRIDE DETECTED</div>
        <h2 className="secret-theme-title">NIGHT // VIOLET UNLOCKED</h2>
        <p className="secret-theme-sub">
          Classified cryptographic subroutines acknowledged. The entire operating system interface has been recoded into the legendary Cyberpunk Violet spectrum.
        </p>
        <button type="button" className="secret-theme-btn" onClick={onClose}>
          [ ACKNOWLEDGE PROTOCOL ]
        </button>
      </div>
    </div>
  );
}
