/**
 * SV RADIO FREQUENCY REGISTRY
 * In-universe Cyberpunk radio broadcaster.
 * Audio is synthesized in real-time via Web Audio API (zero external MP3 dependencies).
 */

export const RADIO_FREQUENCIES = [
  {
    id: "freq-01",
    freq: "98.4 MHz",
    code: "FREQ 01",
    name: "DEEP FOCUS",
    mood: "Warm ambient pads and meditative sub-bass for long coding streaks.",
    type: "FOCUS",
    unlocked: true,
    synthParams: { root: 110, chord: [0, 3, 7, 10], speed: 1.8, filter: 750, wave: "sine" }
  },
  {
    id: "freq-02",
    freq: "104.2 MHz",
    code: "FREQ 02",
    name: "CYBER CHAOS",
    mood: "Fast arpeggiated digital synths and pulsing cyberpunk harmonics.",
    type: "CHAOS",
    unlocked: true,
    synthParams: { root: 130.81, chord: [0, 4, 7, 11], speed: 0.8, filter: 1400, wave: "sawtooth" }
  },
  {
    id: "freq-03",
    freq: "88.9 MHz",
    code: "FREQ 03",
    name: "NIGHT DRIVE",
    mood: "Mid-tempo retro synthwave harmonics echoing across neon highways.",
    type: "NIGHT DRIVE",
    unlocked: true,
    synthParams: { root: 98.0, chord: [0, 7, 12, 14], speed: 2.2, filter: 950, wave: "triangle" }
  },
  {
    id: "freq-04",
    freq: "92.1 MHz",
    code: "FREQ 04",
    name: "OLD FILES",
    mood: "Nostalgic analog tape warmth, vinyl drift, and retro console hums.",
    type: "OLD FILES",
    unlocked: true,
    synthParams: { root: 123.47, chord: [0, 5, 7, 12], speed: 2.8, filter: 650, wave: "sine" }
  },
  {
    id: "freq-05",
    freq: "107.5 MHz",
    code: "FREQ 05",
    name: "ALGORITHMIC CHILL",
    mood: "Generative ambient chords shifting across random harmonic intervals.",
    type: "RANDOM",
    unlocked: true,
    synthParams: { root: 146.83, chord: [0, 2, 7, 9], speed: 1.5, filter: 1100, wave: "triangle" }
  },
  {
    id: "freq-06",
    freq: "133.7 MHz",
    code: "FREQ 06",
    name: "??? // ENCRYPTED SUBWAVE",
    mood: "A mysterious classified transmission broadcasting the Violet Protocol signature.",
    type: "SECRET",
    unlocked: false,
    secretHint: "Unlock by discovering the secret theme or entering `radio 6` in terminal.",
    synthParams: { root: 87.31, chord: [0, 6, 7, 13], speed: 3.5, filter: 1800, wave: "sawtooth" }
  }
];
