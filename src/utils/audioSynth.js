/**
 * Distinct Minecraft-Themed Sound Engine for SV Radio
 * Provides 6 completely different instrument personalities:
 * 1. UPRIGHT PIANO (C418 Subwoofer Lullaby - warm wooden piano)
 * 2. GLASS MUSIC BOX (C418 Mice on Venus - delicate crystal music box)
 * 3. RAIN RHODES (C418 Wet Hands - tremolo electric piano with rain warmth)
 * 4. SUNSET STRING SWELL (C418 Sweden - lush analog synth strings & warm pads)
 * 5. PLUCKED KALIMBA (C418 Danny - African wooden thumb piano with percussive plucks)
 * 6. ETHEREAL CRYSTAL SHIMMER (C418 Far - ambient celestial shimmering drone)
 */

class DistinctAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.mainFilter = null;
    this.delayNode = null;
    this.delayFeedback = null;
    this.delayFilter = null;
    this.isPlaying = false;
    this.volume = 0.35;
    this.currentFrequency = null;
    this.noteTimeouts = [];
    this.phraseTimer = null;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.mainFilter = this.ctx.createBiquadFilter();
      this.mainFilter.type = "lowpass";
      this.mainFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      // Vast landscape spatial delay
      this.delayNode = this.ctx.createDelay();
      this.delayNode.delayTime.setValueAtTime(0.42, this.ctx.currentTime);

      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.setValueAtTime(0.3, this.ctx.currentTime);

      this.delayFilter = this.ctx.createBiquadFilter();
      this.delayFilter.type = "lowpass";
      this.delayFilter.frequency.setValueAtTime(850, this.ctx.currentTime);

      this.mainFilter.connect(this.delayNode);
      this.delayNode.connect(this.delayFilter);
      this.delayFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      this.delayNode.connect(this.masterGain);

      this.mainFilter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  // 1. ACOUSTIC UPRIGHT PIANO (Warm, soft hammer, long singing wooden decay)
  playPiano(freq, velocity = 0.5, duration = 4.5) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);

    sub.type = "sine";
    sub.frequency.setValueAtTime(freq * 0.5, now);

    const peak = 0.16 * velocity;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(peak * 0.4, now + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(this.mainFilter);

    osc.start(now);
    sub.start(now);
    osc.stop(now + duration);
    sub.stop(now + duration);
  }

  // 2. GLASS MUSIC BOX (High bell crystal, sparkly celesta, zero sub-bass)
  playMusicBox(freq, velocity = 0.5, duration = 2.4) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // High register
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq * 2, now);

    // Bell overtone at 3.0x for metallic crystal chime
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 6, now);

    const peak = 0.12 * velocity;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.mainFilter);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // 3. RAIN RHODES (Warm vintage electric piano with tremolo vibrato)
  playRainRhodes(freq, velocity = 0.5, duration = 5.0) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const tremolo = this.ctx.createOscillator();
    const tremoloGain = this.ctx.createGain();
    const noteGain = this.ctx.createGain();

    // Detuned warm electric tines
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 1.002, now);

    // Tremolo LFO (4.8 Hz gentle modulation)
    tremolo.type = "sine";
    tremolo.frequency.setValueAtTime(4.8, now);
    tremoloGain.gain.setValueAtTime(0.04, now);

    tremolo.connect(tremoloGain);
    tremoloGain.connect(noteGain.gain);

    const peak = 0.14 * velocity;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(peak, now + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(this.mainFilter);

    tremolo.start(now);
    osc1.start(now);
    osc2.start(now);

    tremolo.stop(now + duration);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // 4. SUNSET STRING SWELL (Lush analog synth string pads with slow 1.8s swell)
  playSunsetStrings(freqList, velocity = 0.5, duration = 6.8) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    freqList.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);

      const peak = (0.09 / freqList.length) * velocity;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 1.8); // Gentle 1.8s slow swell!
      gain.gain.setValueAtTime(peak, now + duration * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // String filter: warmth cuts high buzzing
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(550, now);
      filter.frequency.linearRampToValueAtTime(850, now + 2.0);
      filter.frequency.linearRampToValueAtTime(450, now + duration);

      osc.connect(gain);
      gain.connect(filter);
      filter.connect(this.mainFilter);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  // 5. PLUCKED KALIMBA (Wooden thumb piano with distinct percussive strike)
  playKalimba(freq, velocity = 0.5, duration = 2.0) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const woodThud = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Woody attack click
    woodThud.type = "triangle";
    woodThud.frequency.setValueAtTime(freq * 4.2, now);

    const peak = 0.17 * velocity;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(peak * 0.2, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    woodThud.connect(gain);
    gain.connect(this.mainFilter);

    osc.start(now);
    woodThud.start(now);
    osc.stop(now + duration);
    woodThud.stop(now + 0.08); // Thud only lasts 80ms
  }

  // 6. ETHEREAL CRYSTAL SHIMMER (Deep mystical cosmic drone & pitch shifts)
  playCrystalShimmer(freq, velocity = 0.5, duration = 8.5) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);
    osc1.frequency.linearRampToValueAtTime(freq * 1.015, now + duration * 0.5);
    osc1.frequency.linearRampToValueAtTime(freq, now + duration);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2.004, now);

    const peak = 0.12 * velocity;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.mainFilter);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  playFrequency(freqObj) {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.stop();
    this.currentFrequency = freqObj;
    this.isPlaying = true;

    const instrumentType = freqObj.instrument || "piano";
    const { phrases, phraseInterval } = freqObj.synthParams;

    const schedulePhrase = () => {
      if (!this.isPlaying) return;

      const currentPhrase = phrases[Math.floor(Math.random() * phrases.length)];

      if (instrumentType === "strings") {
        // Sunset Strings Pad triggers chord collections
        currentPhrase.forEach((item) => {
          const timeout = setTimeout(() => {
            if (!this.isPlaying) return;
            this.playSunsetStrings(item.chordFreqs, item.velocity || 0.5, item.duration || 6.5);
          }, item.delayMs);
          this.noteTimeouts.push(timeout);
        });
      } else {
        // Individual notes mapped to distinct instruments
        currentPhrase.forEach((item) => {
          const timeout = setTimeout(() => {
            if (!this.isPlaying) return;

            switch (instrumentType) {
              case "music_box":
                this.playMusicBox(item.freq, item.velocity, item.duration);
                break;
              case "rhodes":
                this.playRainRhodes(item.freq, item.velocity, item.duration);
                break;
              case "kalimba":
                this.playKalimba(item.freq, item.velocity, item.duration);
                break;
              case "shimmer":
                this.playCrystalShimmer(item.freq, item.velocity, item.duration);
                break;
              case "piano":
              default:
                this.playPiano(item.freq, item.velocity, item.duration);
                break;
            }
          }, item.delayMs);

          this.noteTimeouts.push(timeout);
        });
      }

      this.phraseTimer = setTimeout(schedulePhrase, phraseInterval);
    };

    schedulePhrase();
  }

  stop() {
    this.isPlaying = false;
    if (this.phraseTimer) {
      clearTimeout(this.phraseTimer);
      this.phraseTimer = null;
    }
    this.noteTimeouts.forEach((t) => clearTimeout(t));
    this.noteTimeouts = [];
  }
}

export const radioSynth = new DistinctAudioSynthesizer();
