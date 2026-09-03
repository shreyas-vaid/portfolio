import { useState, useEffect } from "react";
import { gameState } from "../../utils/gameState";
import "./toast.css";

export default function XPToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = gameState.subscribeToasts((toast) => {
      setToasts((prev) => [...prev.slice(-3), toast]); // Keep max 4 on screen

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3400);
    });

    return unsub;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="xp-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="xp-toast-card">
          <div className="xp-toast-indicator" />
          <div className="xp-toast-content">
            <span className="xp-toast-label">SYSTEM // EXP LOG</span>
            <span className="xp-toast-message">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
