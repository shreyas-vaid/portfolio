/**
 * Minecraft / C418-Inspired Ambient Piano & Rhodes Synthesizer for SV Radio
 * Generates peaceful, organic, contemplative piano droplets with gentle acoustic delay
 * and warm wooden resonance — just like "Subwoofer Lullaby", "Sweden", and "Wet Hands".
 */

class MinecraftAudioSynthesizer {
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

      // Master output gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // Warm acoustic low-pass filter (cuts harsh digital frequencies)
      this.mainFilter = this.ctx.createBiquadFilter();
      this.mainFilter.type = "lowpass";
      this.mainFilter.frequency.setValueAtTime(1150, this.ctx.currentTime);
      this.mainFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      // Acoustic biome space delay (creates the vast, peaceful Minecraft landscape atmosphere)
      this.delayNode = this.ctx.createDelay();
      this.delayNode.delayTime.setValueAtTime(0.48, this.ctx.currentTime);

      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.setValueAtTime(0.32, this.ctx.currentTime);

      this.delayFilter = this.ctx.createBiquadFilter();
      this.delayFilter.type = "lowpass";
      this.delayFilter.frequency.setValueAtTime(800, this.ctx.currentTime);

      // Wire up spatial delay feedback loop
      this.mainFilter.connect(this.delayNode);
      this.delayNode.connect(this.delayFilter);
      this.delayFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      this.delayNode.connect(this.masterGain);

      // Direct signal to master
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

  /**
   * Synthesize a single organic soft piano / Rhodes note
   * Uses three harmonic layers: Fundamental (triangle), Bell/Tine (sine overtone), and Warm Body (sub-sine)
   */
  playPianoNote(freq, velocity = 0.5, noteDuration = 4.2) {
    if (!this.ctx || !this.isPlaying) return;

    const now = this.ctx.currentTime;

    // Layer 1: Warm fundamental piano tone (Triangle wave with gentle felt attack)
    const oscFund = this.ctx.createOscillator();
    const gainFund = this.ctx.createGain();
    oscFund.type = "triangle";
    oscFund.frequency.setValueAtTime(freq, now);

    // Layer 2: Delicate bell / electric piano tine chime (Sine wave at 2x octave overtone)
    const oscTine = this.ctx.createOscillator();
    const gainTine = this.ctx.createGain();
    oscTine.type = "sine";
    oscTine.frequency.setValueAtTime(freq * 2, now);

    // Layer 3: Deep wooden piano body warmth (Sub-octave)
    const oscBody = this.ctx.createOscillator();
    const gainBody = this.ctx.createGain();
    oscBody.type = "sine";
    oscBody.frequency.setValueAtTime(freq * 0.5, now);

    // Envelopes: Soft hammer hit (0.015s attack) followed by long, singing organic acoustic decay
    const peakGain = 0.18 * velocity;

    // Fundamental Envelope
    gainFund.gain.setValueAtTime(0.0001, now);
    gainFund.gain.linearRampToValueAtTime(peakGain, now + 0.02);
    gainFund.gain.exponentialRampToValueAtTime(peakGain * 0.45, now + 0.8);
    gainFund.gain.exponentialRampToValueAtTime(0.0001, now + noteDuration);

    // Tine Envelope (decays faster to give initial soft chime)
    gainTine.gain.setValueAtTime(0.0001, now);
    gainTine.gain.linearRampToValueAtTime(peakGain * 0.35, now + 0.015);
    gainTine.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    // Body Envelope (warm foundation)
    gainBody.gain.setValueAtTime(0.0001, now);
    gainBody.gain.linearRampToValueAtTime(peakGain * 0.25, now + 0.04);
    gainBody.gain.exponentialRampToValueAtTime(0.0001, now + noteDuration * 0.85);

    // Connect layers to acoustic filter
    oscFund.connect(gainFund);
    gainFund.connect(this.mainFilter);

    oscTine.connect(gainTine);
    gainTine.connect(this.mainFilter);

    oscBody.connect(gainBody);
    gainBody.connect(this.mainFilter);

    // Start & stop oscillators cleanly
    oscFund.start(now);
    oscTine.start(now);
    oscBody.start(now);

    oscFund.stop(now + noteDuration);
    oscTine.stop(now + 1.5);
    oscBody.stop(now + noteDuration);
  }

  /**
   * Play a Minecraft-style peaceful generative phrase
   */
  playFrequency(freqObj) {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.stop();
    this.currentFrequency = freqObj;
    this.isPlaying = true;

    const { scale, patterns, phraseInterval } = freqObj.synthParams;

    // Schedule a calm, sparse musical motif
    const scheduleNextPhrase = () => {
      if (!this.isPlaying) return;

      // Pick a melodic phrase pattern
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];

      pattern.forEach((noteDef) => {
        const timeout = setTimeout(() => {
          if (!this.isPlaying) return;

          // Calculate note frequency from semitone
          const semitone = scale[noteDef.noteIndex % scale.length] + (noteDef.octaveOffset || 0) * 12;
          const noteFreq = freqObj.synthParams.baseFreq * Math.pow(2, semitone / 12);

          this.playPianoNote(noteFreq, noteDef.velocity || 0.45, noteDef.duration || 4.5);
        }, noteDef.delayMs);

        this.noteTimeouts.push(timeout);
      });

      // Schedule the next phrase after peaceful contemplative breathing space
      this.phraseTimer = setTimeout(scheduleNextPhrase, phraseInterval);
    };

    // Begin first phrase immediately
    scheduleNextPhrase();
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

export const radioSynth = new MinecraftAudioSynthesizer();
