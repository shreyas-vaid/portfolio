// Lightweight Native Web Audio API Sound Synthesizer
// Zero external audio files required. Completely quiet by default.

let audioCtx = null;
let isSoundEnabled = false;

export const initAudio = () => {
  if (typeof window === "undefined") return;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
};

export const setSoundEnabled = (enabled) => {
  isSoundEnabled = enabled;
  if (enabled) {
    initAudio();
    playBleep(880, 0.05, "sine", 0.03);
  }
};

export const getSoundEnabled = () => isSoundEnabled;

// Subtle UI click / hover tick
export const playHoverSound = () => {
  if (!isSoundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.02);
  } catch {
    // Ignore audio errors gracefully
  }
};

// Subtle UI button select sound
export const playSelectSound = () => {
  if (!isSoundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(540, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(960, audioCtx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.06);
  } catch {
    // Ignore audio errors gracefully
  }
};

// Tactical Confirm / Mission Access sound
export const playConfirmSound = () => {
  if (!isSoundEnabled || !audioCtx) return;
  try {
    playBleep(440, 0.04, "sine", 0.03);
    setTimeout(() => {
      playBleep(880, 0.08, "triangle", 0.04);
    }, 45);
  } catch {
    // Ignore
  }
};

const playBleep = (freq, duration, type = "sine", volume = 0.03) => {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Ignore
  }
};
