/**
 * SV RADIO FREQUENCY REGISTRY — DIVERSE MINECRAFT SOUNDSCAPES
 * Each frequency features a completely distinct acoustic/analog instrument:
 * 1. Felt Acoustic Upright Piano (Subwoofer Lullaby)
 * 2. Glass Music Box & Celesta (Mice on Venus)
 * 3. Warm Tremolo Rhodes (Wet Hands)
 * 4. Lush Sunset Synth String Swells (Sweden)
 * 5. Plucked Wooden Kalimba (Danny)
 * 6. Ethereal Cosmic Crystal Shimmer (Far - Secret)
 */

export const RADIO_FREQUENCIES = [
  {
    id: "freq-01",
    freq: "98.4 MHz",
    code: "FREQ 01",
    name: "SUBWOOFER LULLABY // PIANO",
    mood: "Warm wooden upright acoustic piano with soft felt hammers and quiet pauses.",
    type: "ACOUSTIC PIANO",
    instrument: "piano",
    unlocked: true,
    synthParams: {
      phraseInterval: 8000,
      phrases: [
        [
          { freq: 130.81, delayMs: 0, velocity: 0.6, duration: 5.5 }, // C3 deep warm bass
          { freq: 392.00, delayMs: 800, velocity: 0.45, duration: 4.2 }, // G4
          { freq: 329.63, delayMs: 2000, velocity: 0.4, duration: 4.5 }, // E4
          { freq: 493.88, delayMs: 3400, velocity: 0.35, duration: 4.0 }, // B4
          { freq: 587.33, delayMs: 4600, velocity: 0.3, duration: 3.8 }  // D5
        ],
        [
          { freq: 174.61, delayMs: 0, velocity: 0.55, duration: 5.5 }, // F3
          { freq: 440.00, delayMs: 1000, velocity: 0.45, duration: 4.5 }, // A4
          { freq: 523.25, delayMs: 2400, velocity: 0.4, duration: 4.0 }, // C5
          { freq: 392.00, delayMs: 3800, velocity: 0.35, duration: 4.5 } // G4
        ]
      ]
    }
  },
  {
    id: "freq-02",
    freq: "104.2 MHz",
    code: "FREQ 02",
    name: "MICE ON VENUS // MUSIC BOX",
    mood: "Delicate glass music box chimes playing high sparkling melodies like a wind-up toy.",
    type: "MUSIC BOX",
    instrument: "music_box",
    unlocked: true,
    synthParams: {
      phraseInterval: 7500,
      phrases: [
        [
          { freq: 523.25, delayMs: 0, velocity: 0.5, duration: 2.5 }, // C5 chime
          { freq: 659.25, delayMs: 500, velocity: 0.45, duration: 2.5 }, // E5
          { freq: 783.99, delayMs: 1100, velocity: 0.5, duration: 2.5 }, // G5
          { freq: 1046.50, delayMs: 1700, velocity: 0.4, duration: 2.2 }, // C6 high ping
          { freq: 987.77, delayMs: 2700, velocity: 0.35, duration: 2.5 }, // B5
          { freq: 783.99, delayMs: 3800, velocity: 0.35, duration: 2.8 } // G5
        ],
        [
          { freq: 587.33, delayMs: 0, velocity: 0.45, duration: 2.5 }, // D5
          { freq: 739.99, delayMs: 600, velocity: 0.45, duration: 2.5 }, // F#5
          { freq: 880.00, delayMs: 1300, velocity: 0.4, duration: 2.2 }, // A5
          { freq: 1174.66, delayMs: 2100, velocity: 0.35, duration: 2.0 } // D6
        ]
      ]
    }
  },
  {
    id: "freq-03",
    freq: "88.9 MHz",
    code: "FREQ 03",
    name: "WET HANDS // RAIN RHODES",
    mood: "Vintage electric piano with gentle tremolo vibrato echoing like rain falling on a glass roof.",
    type: "ELECTRIC RHODES",
    instrument: "rhodes",
    unlocked: true,
    synthParams: {
      phraseInterval: 8500,
      phrases: [
        [
          { freq: 220.00, delayMs: 0, velocity: 0.55, duration: 6.0 }, // A3 warm fundamental
          { freq: 349.23, delayMs: 900, velocity: 0.45, duration: 5.0 }, // F4
          { freq: 440.00, delayMs: 2200, velocity: 0.4, duration: 4.8 }, // A4
          { freq: 523.25, delayMs: 3600, velocity: 0.35, duration: 4.5 } // C5
        ],
        [
          { freq: 196.00, delayMs: 0, velocity: 0.5, duration: 6.0 }, // G3
          { freq: 329.63, delayMs: 1100, velocity: 0.45, duration: 5.0 }, // E4
          { freq: 392.00, delayMs: 2500, velocity: 0.4, duration: 4.5 }, // G4
          { freq: 587.33, delayMs: 4000, velocity: 0.35, duration: 4.5 } // D5
        ]
      ]
    }
  },
  {
    id: "freq-04",
    freq: "92.1 MHz",
    code: "FREQ 04",
    name: "SWEDEN // SUNSET STRINGS",
    mood: "Lush analog string ensemble with slow, majestic swells watching sunset over the horizon.",
    type: "STRING SWELLS",
    instrument: "strings",
    unlocked: true,
    synthParams: {
      phraseInterval: 10500,
      phrases: [
        [
          // Grand D major 9 string chord
          { chordFreqs: [146.83, 220.00, 293.66, 369.99, 440.00], delayMs: 0, velocity: 0.6, duration: 7.2 },
          // Shifting into B minor 7
          { chordFreqs: [123.47, 185.00, 246.94, 293.66, 369.99], delayMs: 4500, velocity: 0.5, duration: 6.5 }
        ],
        [
          // G major 7 swelling into A major
          { chordFreqs: [98.00, 196.00, 246.94, 293.66, 369.99], delayMs: 0, velocity: 0.55, duration: 7.0 },
          { chordFreqs: [110.00, 220.00, 277.18, 329.63, 440.00], delayMs: 4600, velocity: 0.5, duration: 6.5 }
        ]
      ]
    }
  },
  {
    id: "freq-05",
    freq: "107.5 MHz",
    code: "FREQ 05",
    name: "DANNY // WOODEN KALIMBA",
    mood: "Plucked African thumb piano (kalimba) with percussive wooden clicks and playful earthy resonance.",
    type: "PLUCKED KALIMBA",
    instrument: "kalimba",
    unlocked: true,
    synthParams: {
      phraseInterval: 7000,
      phrases: [
        [
          { freq: 261.63, delayMs: 0, velocity: 0.55, duration: 2.2 }, // C4
          { freq: 329.63, delayMs: 450, velocity: 0.5, duration: 2.0 }, // E4
          { freq: 392.00, delayMs: 900, velocity: 0.45, duration: 2.0 }, // G4
          { freq: 523.25, delayMs: 1400, velocity: 0.5, duration: 1.8 }, // C5 pluck
          { freq: 440.00, delayMs: 2100, velocity: 0.4, duration: 2.0 }, // A4
          { freq: 329.63, delayMs: 2700, velocity: 0.45, duration: 2.2 }, // E4
          { freq: 261.63, delayMs: 3400, velocity: 0.5, duration: 2.5 }  // C4
        ]
      ]
    }
  },
  {
    id: "freq-06",
    freq: "133.7 MHz",
    code: "FREQ 06",
    name: "??? // BIOME HORIZON",
    mood: "Ethereal, pitch-shifting crystal shimmer echoing in deep outer biomes.",
    type: "CRYSTAL SHIMMER",
    instrument: "shimmer",
    unlocked: false,
    secretHint: "Unlock by discovering the secret theme or tuning frequency 06.",
    synthParams: {
      phraseInterval: 11000,
      phrases: [
        [
          { freq: 174.61, delayMs: 0, velocity: 0.45, duration: 8.5 }, // F3
          { freq: 349.23, delayMs: 2500, velocity: 0.4, duration: 7.5 }, // F4
          { freq: 440.00, delayMs: 5000, velocity: 0.35, duration: 6.5 }  // A4
        ]
      ]
    }
  }
];
