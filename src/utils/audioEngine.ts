const NOTE_SEMITONES: Record<string, number> = {
  'C': 0, 'C#': 1, 'DB': 1, 'D': 2, 'D#': 3, 'EB': 3,
  'E': 4, 'F': 5, 'F#': 6, 'GB': 6, 'G': 7, 'G#': 8,
  'AB': 8, 'A': 9, 'A#': 10, 'BB': 10, 'B': 11
};

export type PlayableNote =
  | string
  | number
  | { frequency?: number; pitch?: string; displayName?: string; midiNumber?: number };

export function pitchToFrequency(pitchOrFreq: PlayableNote): number {
  if (typeof pitchOrFreq === 'number') {
    return pitchOrFreq;
  }
  if (typeof pitchOrFreq === 'object' && pitchOrFreq !== null) {
    if (typeof pitchOrFreq.frequency === 'number') return pitchOrFreq.frequency;
    if (pitchOrFreq.pitch) return pitchToFrequency(pitchOrFreq.pitch);
    if (pitchOrFreq.displayName) return pitchToFrequency(pitchOrFreq.displayName);
    if (typeof pitchOrFreq.midiNumber === 'number') {
      return 440 * Math.pow(2, (pitchOrFreq.midiNumber - 69) / 12);
    }
  }
  const clean = String(pitchOrFreq).trim();
  const match = clean.match(/^([A-Ga-g][#bB]?)(-?\d+)$/);
  if (!match) {
    const letterMatch = clean.match(/^([A-Ga-g][#bB]?)$/);
    if (letterMatch) {
      const note = letterMatch[1].toUpperCase();
      const semitone = NOTE_SEMITONES[note] ?? 0;
      const midi = (4 + 1) * 12 + semitone;
      return 440 * Math.pow(2, (midi - 69) / 12);
    }
    return 440;
  }
  const note = match[1].toUpperCase();
  const octave = parseInt(match[2], 10);
  const semitone = NOTE_SEMITONES[note] ?? 0;
  const midi = (octave + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private activeVoices: { stop: () => void }[] = [];

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Generates a warm acoustic piano sound using additive synthesis & filtered envelope
   */
  public playNote(
    pitchOrFreq: PlayableNote,
    duration: number = 1.2,
    startTimeOffset: number = 0,
    velocity: number = 0.35
  ): () => void {
    this.init();
    if (!this.ctx || !this.masterGain) return () => {};

    const freq = pitchToFrequency(pitchOrFreq);
    const ctx = this.ctx;
    const now = ctx.currentTime + startTimeOffset;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 5.5, 7500), now);
    filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 1.4, 1800), now + duration);

    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.9, now + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.4, now + 0.16);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    const harmonics = [
      { ratio: 1.0, gain: 0.65 },
      { ratio: 2.0, gain: 0.28 },
      { ratio: 3.01, gain: 0.12 },
      { ratio: 4.02, gain: 0.05 },
    ];

    const oscs: OscillatorNode[] = [];

    harmonics.forEach(({ ratio, gain }) => {
      const osc = ctx.createOscillator();
      osc.type = ratio === 1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq * ratio, now);

      const hGain = ctx.createGain();
      hGain.gain.setValueAtTime(gain, now);

      osc.connect(hGain);
      hGain.connect(filter);
      osc.start(now);
      osc.stop(now + duration + 0.05);
      oscs.push(osc);
    });

    const stopFn = () => {
      try {
        const stopTime = ctx.currentTime;
        noteGain.gain.cancelScheduledValues(stopTime);
        noteGain.gain.setValueAtTime(noteGain.gain.value, stopTime);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, stopTime + 0.05);
        setTimeout(() => {
          oscs.forEach(o => {
            try { o.stop(); } catch { /* noop */ }
          });
        }, 60);
      } catch {
        // Ignored
      }
    };

    this.activeVoices.push({ stop: stopFn });
    setTimeout(() => {
      const idx = this.activeVoices.findIndex(v => v.stop === stopFn);
      if (idx !== -1) this.activeVoices.splice(idx, 1);
    }, (duration + startTimeOffset + 0.1) * 1000);

    return stopFn;
  }

  public playChord(
    notes: PlayableNote[],
    duration: number | string = 1.6,
    strumDelayOrMode?: number | string,
    velocityOrArpSpeed?: number
  ): void {
    this.init();
    if (!this.ctx || notes.length === 0) return;

    let dur = typeof duration === 'number' ? duration : 1.6;
    let delay = typeof strumDelayOrMode === 'number' ? strumDelayOrMode : 0.03;
    let vel = typeof velocityOrArpSpeed === 'number' ? velocityOrArpSpeed : 0.28;

    // Handle legacy signature playChord(notes, mode: 'block' | 'arpeggio' | 'strum', speed)
    if (typeof duration === 'string' || typeof strumDelayOrMode === 'string') {
      const mode = (typeof duration === 'string' ? duration : strumDelayOrMode) as string;
      if (mode === 'arpeggio') {
        const speed = typeof velocityOrArpSpeed === 'number' ? velocityOrArpSpeed : 180;
        this.playArpeggio(notes, speed);
        return;
      } else if (mode === 'strum') {
        delay = 0.045;
        dur = 2.0;
        vel = 0.35;
      } else {
        delay = 0;
        dur = 2.0;
        vel = 0.35;
      }
    }

    notes.forEach((note, index) => {
      const noteDelay = index * delay;
      this.playNote(note, dur, noteDelay, vel);
    });
  }

  public playArpeggio(
    notes: PlayableNote[],
    speedMs: number = 180,
    duration: number = 1.5
  ): void {
    this.init();
    if (!this.ctx || notes.length === 0) return;

    const stepDelay = speedMs / 1000;
    notes.forEach((note, index) => {
      const delay = index * stepDelay;
      this.playNote(note, duration, delay, 0.35);
    });

    const finalDelay = notes.length * stepDelay + 0.08;
    notes.forEach((note) => {
      this.playNote(note, 2.0, finalDelay, 0.25);
    });
  }

  public stopAll(): void {
    this.activeVoices.forEach(voice => {
      try { voice.stop(); } catch { /* noop */ }
    });
    this.activeVoices = [];
  }
}

export const soundEngine = new AudioEngine();
export const sound = soundEngine;
