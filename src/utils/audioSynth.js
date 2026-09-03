/**
 * Web Audio API Generative Synthesizer for SV Radio
 * Creates rich, warm, ambient cyberpunk chords and basslines in real-time.
 * 100% reliable, zero network requests, zero MP3 404s.
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.filter = null;
    this.isPlaying = false;
    this.volume = 0.4;
    this.activeOscillators = [];
    this.loopTimer = null;
    this.currentFrequency = null;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(900, this.ctx.currentTime);

      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
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

    const { root, chord, speed, filter, wave } = freqObj.synthParams;

    if (this.filter) {
      this.filter.frequency.setTargetAtTime(filter, this.ctx.currentTime, 0.3);
    }

    // Play recurring ambient pad chords
    const triggerChord = () => {
      if (!this.isPlaying || !this.ctx) return;

      chord.forEach((semitones, idx) => {
        const freq = root * Math.pow(2, semitones / 12);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = wave || "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Soft attack & release envelope
        const now = this.ctx.currentTime;
        const dur = speed * 1.8;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12 / chord.length, now + dur * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        osc.connect(gain);
        gain.connect(this.filter);

        osc.start(now);
        osc.stop(now + dur);

        this.activeOscillators.push(osc);
      });

      this.loopTimer = setTimeout(triggerChord, speed * 1000);
    };

    triggerChord();
  }

  stop() {
    this.isPlaying = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Ignored
      }
    });
    this.activeOscillators = [];
  }
}

export const radioSynth = new AudioSynthesizer();
