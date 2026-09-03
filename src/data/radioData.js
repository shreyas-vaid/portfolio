/**
 * SV RADIO FREQUENCY REGISTRY — MINECRAFT / C418 CALM EDITION
 * Peaceful, meditative background music inspired by C418's iconic Minecraft soundtracks.
 * Real-time organic piano, Rhodes, and delay synthesis via Web Audio API.
 */

export const RADIO_FREQUENCIES = [
  {
    id: "freq-01",
    freq: "98.4 MHz",
    code: "FREQ 01",
    name: "SUBWOOFER DREAMS",
    mood: "Soft, nostalgic piano droplets echoing across a quiet blocky valley at dusk.",
    type: "CALM",
    unlocked: true,
    synthParams: {
      baseFreq: 261.63, // Middle C (C4)
      scale: [0, 4, 7, 11, 14], // C major 9 (C, E, G, B, D)
      phraseInterval: 8500,
      patterns: [
        [
          { noteIndex: 0, delayMs: 0, octaveOffset: -1, velocity: 0.6, duration: 6.0 }, // C3 warm bass root
          { noteIndex: 2, delayMs: 750, octaveOffset: 0, velocity: 0.45, duration: 4.5 }, // G4
          { noteIndex: 1, delayMs: 1800, octaveOffset: 0, velocity: 0.4, duration: 4.5 }, // E4
          { noteIndex: 3, delayMs: 3200, octaveOffset: 0, velocity: 0.35, duration: 5.0 }, // B4
          { noteIndex: 4, delayMs: 4400, octaveOffset: 0, velocity: 0.3, duration: 4.0 }  // D5
        ],
        [
          { noteIndex: 1, delayMs: 0, octaveOffset: -1, velocity: 0.55, duration: 6.0 },
          { noteIndex: 3, delayMs: 900, octaveOffset: 0, velocity: 0.4, duration: 4.5 },
          { noteIndex: 2, delayMs: 2200, octaveOffset: 0, velocity: 0.45, duration: 4.5 },
          { noteIndex: 0, delayMs: 3600, octaveOffset: 1, velocity: 0.35, duration: 5.0 }
        ]
      ]
    }
  },
  {
    id: "freq-02",
    freq: "104.2 MHz",
    code: "FREQ 02",
    name: "SWEDEN SUNSET",
    mood: "Warm acoustic piano chords reflecting the sunset over a mountain biome.",
    type: "PEACEFUL",
    unlocked: true,
    synthParams: {
      baseFreq: 293.66, // D4
      scale: [0, 4, 7, 9, 11, 14], // D major 6/9
      phraseInterval: 9200,
      patterns: [
        [
          { noteIndex: 0, delayMs: 0, octaveOffset: -1, velocity: 0.6, duration: 6.5 }, // D3
          { noteIndex: 2, delayMs: 1100, octaveOffset: 0, velocity: 0.45, duration: 4.5 }, // A4
          { noteIndex: 4, delayMs: 2400, octaveOffset: 0, velocity: 0.4, duration: 4.5 }, // C#5
          { noteIndex: 1, delayMs: 3800, octaveOffset: 0, velocity: 0.35, duration: 5.0 }, // F#4
          { noteIndex: 3, delayMs: 5100, octaveOffset: 0, velocity: 0.3, duration: 4.0 }  // B4
        ],
        [
          { noteIndex: 2, delayMs: 0, octaveOffset: -1, velocity: 0.55, duration: 6.0 },
          { noteIndex: 1, delayMs: 1200, octaveOffset: 0, velocity: 0.45, duration: 4.5 },
          { noteIndex: 0, delayMs: 2600, octaveOffset: 0, velocity: 0.4, duration: 4.5 },
          { noteIndex: 4, delayMs: 4200, octaveOffset: 0, velocity: 0.35, duration: 5.0 }
        ]
      ]
    }
  },
  {
    id: "freq-03",
    freq: "88.9 MHz",
    code: "FREQ 03",
    name: "WET HANDS // RAINFALL",
    mood: "Sparse, delicate chime droplets like soft rain falling on leaves outside your wooden shelter.",
    type: "RAINFALL",
    unlocked: true,
    synthParams: {
      baseFreq: 349.23, // F4
      scale: [0, 2, 4, 7, 9, 12], // F major pentatonic
      phraseInterval: 8000,
      patterns: [
        [
          { noteIndex: 0, delayMs: 0, octaveOffset: -1, velocity: 0.55, duration: 6.0 }, // F3
          { noteIndex: 2, delayMs: 800, octaveOffset: 0, velocity: 0.4, duration: 4.0 },  // A4
          { noteIndex: 3, delayMs: 1900, octaveOffset: 0, velocity: 0.45, duration: 4.5 }, // C5
          { noteIndex: 4, delayMs: 3100, octaveOffset: 0, velocity: 0.35, duration: 4.5 }, // D5
          { noteIndex: 1, delayMs: 4400, octaveOffset: 0, velocity: 0.3, duration: 4.0 }  // G4
        ],
        [
          { noteIndex: 3, delayMs: 0, octaveOffset: -1, velocity: 0.5, duration: 5.5 },
          { noteIndex: 4, delayMs: 1400, octaveOffset: 0, velocity: 0.4, duration: 4.5 },
          { noteIndex: 2, delayMs: 2800, octaveOffset: 0, velocity: 0.35, duration: 4.5 }
        ]
      ]
    }
  },
  {
    id: "freq-04",
    freq: "92.1 MHz",
    code: "FREQ 04",
    name: "HAGGSTROM NOSTALGIA",
    mood: "Gentle Rhodes electric piano harmonics carrying memories of early worlds.",
    type: "NOSTALGIA",
    unlocked: true,
    synthParams: {
      baseFreq: 220.0, // A3
      scale: [0, 3, 7, 10, 14], // A minor 9
      phraseInterval: 8800,
      patterns: [
        [
          { noteIndex: 0, delayMs: 0, octaveOffset: -1, velocity: 0.6, duration: 6.0 }, // A2
          { noteIndex: 2, delayMs: 1000, octaveOffset: 0, velocity: 0.45, duration: 4.5 }, // E4
          { noteIndex: 1, delayMs: 2300, octaveOffset: 0, velocity: 0.4, duration: 4.5 }, // C4
          { noteIndex: 3, delayMs: 3700, octaveOffset: 0, velocity: 0.35, duration: 4.5 }, // G4
          { noteIndex: 4, delayMs: 4900, octaveOffset: 0, velocity: 0.3, duration: 4.0 }  // B4
        ]
      ]
    }
  },
  {
    id: "freq-05",
    freq: "107.5 MHz",
    code: "FREQ 05",
    name: "MINECRAFT DAWN",
    mood: "Minimalist solitary notes spaced apart with generous silences as daylight breaks.",
    type: "MEDITATIVE",
    unlocked: true,
    synthParams: {
      baseFreq: 196.0, // G3
      scale: [0, 4, 7, 11, 14], // G major 9
      phraseInterval: 9600,
      patterns: [
        [
          { noteIndex: 0, delayMs: 0, octaveOffset: -1, velocity: 0.55, duration: 7.0 }, // G2
          { noteIndex: 2, delayMs: 1400, octaveOffset: 0, velocity: 0.4, duration: 5.0 }, // D4
          { noteIndex: 1, delayMs: 3100, octaveOffset: 0, velocity: 0.35, duration: 5.0 }, // B3
          { noteIndex: 3, delayMs: 4800, octaveOffset: 0, velocity: 0.3, duration: 4.5 }  // F#4
        ]
      ]
    }
  },
  {
    id: "freq-06",
    freq: "133.7 MHz",
    code: "FREQ 06",
    name: "??? // BIOME HORIZON",
    mood: "Serene, distant ambient echoes floating over violet mountain peaks.",
    type: "SECRET",
    unlocked: false,
    secretHint: "Unlock by discovering the secret theme or tuning into frequency 06.",
    synthParams: {
      baseFreq: 277.18, // C#4
      scale: [0, 4, 7, 11, 14], // C# major 9
      phraseInterval: 10000,
      patterns: [
        [
          { noteIndex: 0, delayMs: 0, octaveOffset: -1, velocity: 0.5, duration: 7.5 },
          { noteIndex: 2, delayMs: 1500, octaveOffset: 0, velocity: 0.4, duration: 5.0 },
          { noteIndex: 4, delayMs: 3300, octaveOffset: 0, velocity: 0.35, duration: 5.0 },
          { noteIndex: 3, delayMs: 5200, octaveOffset: 0, velocity: 0.3, duration: 4.5 }
        ]
      ]
    }
  }
];
