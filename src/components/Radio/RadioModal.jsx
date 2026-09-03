import { useState, useEffect } from "react";
import { RADIO_FREQUENCIES } from "../../data/radioData";
import { radioSynth } from "../../utils/audioSynth";
import { gameState } from "../../utils/gameState";
import "./radio.css";

export default function RadioModal({ isOpen, onClose }) {
  const [selectedFreq, setSelectedFreq] = useState(RADIO_FREQUENCIES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [unlockedFreqs, setUnlockedFreqs] = useState(gameState.state.unlockedFrequencies);

  useEffect(() => {
    const unsub = gameState.subscribe((st) => {
      setUnlockedFreqs(st.unlockedFrequencies);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isOpen) {
      gameState.awardXP("open_radio_modal", 10, "SV RADIO TUNED");
      gameState.unlockAchievement("ach-exp-radio", "SUBWAVE AUDIOPHILE");
    }
  }, [isOpen]);

  // Keep player sync
  useEffect(() => {
    return () => {
      // Don't auto stop on close if user wants ambient audio playing
    };
  }, []);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    if (isPlaying) {
      radioSynth.stop();
      setIsPlaying(false);
    } else {
      radioSynth.playFrequency(selectedFreq);
      setIsPlaying(true);
    }
  };

  const handleSelectFrequency = (freq) => {
    setSelectedFreq(freq);
    if (isPlaying) {
      radioSynth.playFrequency(freq);
    }
    // If selecting secret freq 06
    if (freq.id === "freq-06") {
      gameState.unlockFrequency("freq-06");
    }
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    radioSynth.setVolume(v);
  };

  return (
    <div className="radio-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="radio-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="radio-modal-header">
          <div className="radio-title-wrap">
            <span className="radio-live-led" style={{ background: isPlaying ? "#00ff66" : "#f59e0b" }} />
            <h3 className="radio-title">SV RADIO // SUBWAVE BROADCAST</h3>
          </div>
          <button type="button" className="radio-close-btn" onClick={onClose}>
            ✕ CLOSE
          </button>
        </div>

        {/* Radio Body */}
        <div className="radio-modal-body">
          {/* Top Tuner Screen */}
          <div className="radio-tuner-screen">
            <div className="radio-freq-display">
              <span className="radio-freq-num">{selectedFreq.freq}</span>
              <span className="radio-freq-name">{selectedFreq.code} // {selectedFreq.name}</span>
            </div>

            {/* Oscilloscope Waveform */}
            <div className={`radio-waveform-wrap ${isPlaying ? "playing" : ""}`}>
              <div className="wave-bar b1" />
              <div className="wave-bar b2" />
              <div className="wave-bar b3" />
              <div className="wave-bar b4" />
              <div className="wave-bar b5" />
              <div className="wave-bar b6" />
              <div className="wave-bar b7" />
              <div className="wave-bar b8" />
              <div className="wave-bar b9" />
              <div className="wave-bar b10" />
            </div>

            <p className="radio-freq-mood">{selectedFreq.mood}</p>
          </div>

          {/* Player Controls Bar */}
          <div className="radio-controls-bar">
            <button
              type="button"
              className={`radio-play-btn ${isPlaying ? "active" : ""}`}
              onClick={handleTogglePlay}
            >
              {isPlaying ? "⏸ PAUSE SIGNAL" : "▶ BROADCAST SIGNAL"}
            </button>

            <div className="radio-volume-wrap">
              <span className="radio-vol-label">VOL:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="radio-vol-slider"
              />
            </div>
          </div>

          {/* Frequencies Selector Grid */}
          <div className="radio-frequencies-list">
            <span className="radio-list-label">FREQUENCY CHANNELS:</span>
            <div className="radio-channels-grid">
              {RADIO_FREQUENCIES.map((freq) => {
                const isUnlocked = unlockedFreqs.includes(freq.id);
                const isSelected = selectedFreq.id === freq.id;

                return (
                  <button
                    key={freq.id}
                    type="button"
                    className={`radio-channel-btn ${isSelected ? "selected" : ""} ${
                      !isUnlocked ? "locked" : ""
                    }`}
                    onClick={() => handleSelectFrequency(freq)}
                  >
                    <span className="channel-code">{freq.code}</span>
                    <span className="channel-name">{isUnlocked ? freq.name : "??? ENCRYPTED"}</span>
                    <span className="channel-freq">{freq.freq}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
