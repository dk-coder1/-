// Web Audio API Synthesizer with rich acoustic piano/chime harmonics

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Pitch to Frequency (e.g. "C4" -> 261.63, "F#4" -> 369.99)
  public noteToFreq(note: string): number {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Normalize flats to sharps
    const normalized = note
      .replace('Db', 'C#')
      .replace('Eb', 'D#')
      .replace('Gb', 'F#')
      .replace('Ab', 'G#')
      .replace('Bb', 'A#');

    const match = normalized.match(/^([A-G]#?)(\d)$/);
    if (!match) return 440;

    const pitchName = match[1];
    const octave = parseInt(match[2], 10);
    const semitone = notes.indexOf(pitchName);
    if (semitone === -1) return 440;

    // A4 is semitone 9, octave 4 = 440Hz
    const midi = (octave + 1) * 12 + semitone;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Play a single note with warm bell/piano acoustic harmonics
  public playNote(note: string, duration: number = 1.0, timeOffset: number = 0, volume: number = 0.25) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freq = this.noteToFreq(note);
      const startTime = this.ctx.currentTime + timeOffset;

      // Master gain for this note
      const noteGain = this.ctx.createGain();
      noteGain.connect(this.ctx.destination);

      // Attack - Decay - Sustain - Release curve
      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(volume * 0.45, startTime + 0.18);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      // Multi-harmonic oscillator stack for warm physical piano sound
      const harmonics = [
        { mult: 1, type: 'triangle' as OscillatorType, vol: 0.7 },
        { mult: 2, type: 'sine' as OscillatorType, vol: 0.3 },
        { mult: 3, type: 'sine' as OscillatorType, vol: 0.12 },
        { mult: 4, type: 'triangle' as OscillatorType, vol: 0.05 },
      ];

      harmonics.forEach(h => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const hGain = this.ctx.createGain();

        osc.type = h.type;
        osc.frequency.setValueAtTime(freq * h.mult, startTime);

        hGain.gain.setValueAtTime(h.vol, startTime);

        osc.connect(hGain);
        hGain.connect(noteGain);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    } catch (e) {
      console.error('Audio play error:', e);
    }
  }

  // Play chord notes simultaneously or slightly strummed
  public playChord(notes: string[], duration: number = 1.6, strumDelay: number = 0.025, volume: number = 0.2) {
    notes.forEach((note, index) => {
      this.playNote(note, duration, index * strumDelay, volume);
    });
  }

  // Play arpeggio (broken chord: 쿵-짝-짝)
  public playArpeggio(notes: string[], tempoBpm: number = 90) {
    const beatSec = 60 / tempoBpm;
    notes.forEach((note, index) => {
      this.playNote(note, beatSec * 0.9, index * (beatSec / 2), 0.22);
    });
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }
}

export const soundEngine = new SoundEngine();
