import React from 'react';
import { NoteInfo, PitchClass } from '../types/music';
import { createNoteInfo, PITCH_CLASSES } from '../utils/musicTheory';
import { sound } from '../utils/audioEngine';

interface PianoKeyboardProps {
  activeNotes?: NoteInfo[];
  rootNote?: PitchClass;
  startOctave?: number;
  endOctave?: number;
  onKeyClick?: (note: NoteInfo) => void;
  interactive?: boolean;
  selectedMidis?: number[];
  showSolfege?: boolean;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  activeNotes = [],
  rootNote,
  startOctave = 4,
  endOctave = 5,
  onKeyClick,
  interactive = true,
  selectedMidis = [],
  showSolfege = true,
}) => {
  // Generate all keys in octave range
  const allKeys: NoteInfo[] = [];
  for (let oct = startOctave; oct <= endOctave; oct++) {
    PITCH_CLASSES.forEach((pc) => {
      allKeys.push(createNoteInfo(pc, oct));
    });
  }
  // Add ending C
  allKeys.push(createNoteInfo('C', endOctave + 1));

  const whiteKeys = allKeys.filter((k) => !k.isBlack);

  const isNoteActive = (note: NoteInfo) => {
    return (
      activeNotes.some((n) => n.midiNumber === note.midiNumber) ||
      selectedMidis.includes(note.midiNumber)
    );
  };

  const isRootNote = (note: NoteInfo) => {
    return rootNote ? note.pitchClass === rootNote && isNoteActive(note) : false;
  };

  const handleKeyPress = (note: NoteInfo) => {
    sound.playNote(note.frequency, 1.5, 0, 0.85);
    if (onKeyClick && interactive) {
      onKeyClick(note);
    }
  };

  // Black keys positions relative to white keys:
  // C# is between C and D
  // D# is between D and E
  // F# is between F and G
  // G# is between G and A
  // A# is between A and B
  const getBlackKeyOffsetLeftPercent = (note: NoteInfo) => {
    // Find the white key index just before this black key
    const letter = note.pitchClass[0]; // 'C', 'D', 'F', 'G', 'A'
    const whiteIndex = whiteKeys.findIndex(
      (wk) => wk.pitchClass === letter && wk.octave === note.octave
    );
    if (whiteIndex === -1) return 0;
    const totalWhite = whiteKeys.length;
    // Each white key is (100 / totalWhite)% wide
    const whiteWidthPercent = 100 / totalWhite;
    // Offset black key to sit over the boundary (approx 65% of the white key)
    return (whiteIndex + 0.65) * whiteWidthPercent;
  };

  const whiteKeyWidthPercent = 100 / whiteKeys.length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Piano Case Container */}
      <div className="w-full max-w-4xl bg-slate-950 p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-300">
              인터랙티브 피아노 건반
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-400 inline-block shadow-sm"></span>
              근음 (Root)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-500 inline-block shadow-sm"></span>
              화음 구성음
            </span>
            <span className="text-slate-500 hidden sm:inline">건반을 직접 눌러보세요!</span>
          </div>
        </div>

        {/* Keyboard Surface */}
        <div className="relative h-44 sm:h-52 w-full select-none overflow-hidden rounded-lg shadow-inner bg-slate-900 border-t-4 border-amber-900/60">
          {/* White keys */}
          <div className="absolute inset-0 flex">
            {whiteKeys.map((note) => {
              const active = isNoteActive(note);
              const root = isRootNote(note);

              return (
                <button
                  key={note.displayName}
                  onClick={() => handleKeyPress(note)}
                  style={{ width: `${whiteKeyWidthPercent}%` }}
                  className={`relative h-full flex flex-col justify-end items-center pb-2 border-r border-slate-300/80 rounded-b transition-colors active:scale-y-[0.98] origin-top ${
                    root
                      ? 'bg-gradient-to-t from-sky-400 to-sky-300 text-slate-950 ring-2 ring-sky-400 ring-offset-1 ring-offset-slate-900 z-10'
                      : active
                      ? 'bg-gradient-to-t from-indigo-400 to-indigo-300 text-slate-950 ring-2 ring-indigo-400 ring-offset-1 ring-offset-slate-900 z-10'
                      : 'bg-gradient-to-b from-slate-100 via-white to-slate-200 hover:from-indigo-50 hover:to-indigo-100 text-slate-700'
                  }`}
                  aria-label={`${note.pitchClass} ${note.octave}`}
                >
                  <div className="flex flex-col items-center pointer-events-none">
                    <span className="text-xs sm:text-sm font-extrabold tracking-tight">
                      {note.pitchClass}
                    </span>
                    {showSolfege && (
                      <span className="text-[10px] sm:text-xs font-medium opacity-80">
                        {note.solfege.replace(/[0-9]/g, '')}
                      </span>
                    )}
                    {note.pitchClass === 'C' && (
                      <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                        {note.octave}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Black keys */}
          {allKeys
            .filter((k) => k.isBlack)
            .map((note) => {
              const active = isNoteActive(note);
              const root = isRootNote(note);
              const leftOffset = getBlackKeyOffsetLeftPercent(note);
              // Width of black key is ~ 65% of white key width
              const blackWidthPercent = whiteKeyWidthPercent * 0.68;

              return (
                <button
                  key={note.displayName}
                  onClick={() => handleKeyPress(note)}
                  style={{
                    left: `${leftOffset}%`,
                    width: `${blackWidthPercent}%`,
                    height: '62%',
                  }}
                  className={`absolute top-0 z-20 flex flex-col justify-end items-center pb-2 rounded-b shadow-xl transition-colors active:scale-y-[0.98] origin-top ${
                    root
                      ? 'bg-gradient-to-t from-sky-500 to-sky-400 text-white ring-2 ring-sky-300'
                      : active
                      ? 'bg-gradient-to-t from-indigo-500 to-indigo-400 text-white ring-2 ring-indigo-300'
                      : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-slate-300'
                  }`}
                  aria-label={`${note.pitchClass} ${note.octave}`}
                >
                  <div className="flex flex-col items-center pointer-events-none">
                    <span className="text-[10px] sm:text-xs font-bold leading-tight">
                      {note.pitchClass}
                    </span>
                    {showSolfege && (
                      <span className="text-[9px] opacity-80">
                        {note.solfege.replace(/[0-9]/g, '')}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
