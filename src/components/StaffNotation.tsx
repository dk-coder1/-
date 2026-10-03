import React from 'react';
import { NoteInfo } from '../types/music';

interface StaffNotationProps {
  notes: NoteInfo[];
  title?: string;
  clef?: 'treble' | 'bass';
  showLabels?: boolean;
}

// Map diatonic step to staff vertical position
// In Treble clef, line positions from bottom (E4) to top (F5):
// Position 0 = Middle C (C4) -> 1 ledger line below
// Position 1 = D4
// Position 2 = E4 (Line 1)
// Position 3 = F4 (Space 1)
// Position 4 = G4 (Line 2)
// Position 5 = A4 (Space 2)
// Position 6 = B4 (Line 3)
// Position 7 = C5 (Space 3)
// Position 8 = D5 (Line 4)
// Position 9 = E5 (Space 4)
// Position 10 = F5 (Line 5)
// Position 11 = G5 (Space above)
// Position 12 = A5 (Ledger line 1 above)

const DIATONIC_BASE: Record<string, number> = {
  'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6
};

export const StaffNotation: React.FC<StaffNotationProps> = ({
  notes,
  title,
  clef = 'treble',
  showLabels = true,
}) => {
  // Sort notes by MIDI number
  const sortedNotes = [...notes].sort((a, b) => a.midiNumber - b.midiNumber);

  // SVG dimensions
  const width = 360;
  const height = 180;
  const staffLeft = 20;
  const staffRight = 340;
  
  // 5 lines parameters
  // Line spacing = 12px
  // Line 5 (top) = Y: 60
  // Line 1 (bottom) = Y: 108
  const lineSpacing = 12;
  const topStaffY = 60;
  const staffLinesY = [0, 1, 2, 3, 4].map(i => topStaffY + i * lineSpacing);
  // staffLinesY: [60, 72, 84, 96, 108] (Line 5, Line 4, Line 3, Line 2, Line 1)

  // Step unit in Y = lineSpacing / 2 = 6px
  // Position 2 (E4) = Line 1 = 108px
  // So Y for position p: 108 - (p - 2) * 6 = 120 - p * 6
  const getDiatonicPosition = (note: NoteInfo) => {
    const letter = note.pitchClass[0]; // 'C', 'D', 'E', etc.
    const base = DIATONIC_BASE[letter];
    // Octave 4 is reference
    const octaveDiff = note.octave - 4;
    return base + octaveDiff * 7;
  };

  const getYForPosition = (position: number) => {
    if (clef === 'treble') {
      // E4 (pos 2) is at 108px
      return 120 - position * 6;
    } else {
      // Bass clef: G2 is bottom, C3 is middle line, C4 is 1 ledger line above
      // Middle C (C4, pos 0 from C4 ref) is at 48px
      return 48 - position * 6;
    }
  };

  return (
    <div className="flex flex-col items-center bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 shadow-xl backdrop-blur-md">
      {title && (
        <div className="flex items-center justify-between w-full mb-2 px-1">
          <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
            {title}
          </span>
          <span className="text-xs text-slate-400">
            {clef === 'treble' ? '높은음자리표 (Treble Clef)' : '낮은음자리표 (Bass Clef)'}
          </span>
        </div>
      )}

      <div className="relative w-full overflow-hidden flex justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[420px] h-auto select-none"
        >
          <defs>
            {/* Gradient for note heads */}
            <linearGradient id="noteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="rootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* 5 Staff lines */}
          {staffLinesY.map((y, index) => (
            <line
              key={index}
              x1={staffLeft}
              y1={y}
              x2={staffRight}
              y2={y}
              stroke="#64748b"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ))}

          {/* Left and right bar lines */}
          <line
            x1={staffLeft}
            y1={staffLinesY[0]}
            x2={staffLeft}
            y2={staffLinesY[4]}
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <line
            x1={staffRight}
            y1={staffLinesY[0]}
            x2={staffRight}
            y2={staffLinesY[4]}
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <line
            x1={staffRight - 4}
            y1={staffLinesY[0]}
            x2={staffRight - 4}
            y2={staffLinesY[4]}
            stroke="#64748b"
            strokeWidth="1"
          />

          {/* Clef Sign */}
          {clef === 'treble' ? (
            <g transform="translate(32, 54)">
              {/* Stylized Treble Clef (G-Clef) */}
              <text
                x="0"
                y="52"
                fontSize="56"
                fill="#c7d2fe"
                fontFamily="serif"
                className="select-none"
                style={{ fontStyle: 'italic', fontWeight: 600 }}
              >
                𝄞
              </text>
            </g>
          ) : (
            <g transform="translate(32, 60)">
              <text
                x="0"
                y="42"
                fontSize="50"
                fill="#c7d2fe"
                fontFamily="serif"
                className="select-none"
              >
                𝄢
              </text>
            </g>
          )}

          {/* Render Chord Notes on the Staff */}
          {sortedNotes.map((note, index) => {
            const pos = getDiatonicPosition(note);
            const noteY = getYForPosition(pos);
            // Center the chord notes horizontally
            // If notes are seconds (adjacent), offset slightly to prevent overlap
            const isClustered = index > 0 && Math.abs(sortedNotes[index].midiNumber - sortedNotes[index - 1].midiNumber) <= 2;
            const noteX = 200 + (isClustered && index % 2 === 1 ? 16 : 0);
            const isSharp = note.pitchClass.includes('#');
            const isRoot = index === 0;

            // Check if ledger lines are needed
            // Below staff: pos <= 0 (Middle C is pos 0, pos -2 is A3, etc.)
            // Above staff: pos >= 12 (A5 is pos 12, pos 14 is C6)
            const ledgerLines: number[] = [];
            if (pos <= 0) {
              for (let p = 0; p >= pos; p -= 2) {
                ledgerLines.push(getYForPosition(p));
              }
            } else if (pos >= 12) {
              for (let p = 12; p <= pos; p += 2) {
                ledgerLines.push(getYForPosition(p));
              }
            }

            return (
              <g key={`${note.displayName}-${index}`}>
                {/* Ledger lines */}
                {ledgerLines.map((ly, lIdx) => (
                  <line
                    key={lIdx}
                    x1={noteX - 16}
                    y1={ly}
                    x2={noteX + 16}
                    y2={ly}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Accidental (# Sharp) */}
                {isSharp && (
                  <text
                    x={noteX - 22}
                    y={noteY + 4}
                    fontSize="18"
                    fill="#38bdf8"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="select-none"
                  >
                    ♯
                  </text>
                )}

                {/* Notehead (Rotated ellipse for true musical look) */}
                <ellipse
                  cx={noteX}
                  cy={noteY}
                  rx="7.5"
                  ry="5.2"
                  transform={`rotate(-20 ${noteX} ${noteY})`}
                  fill={isRoot ? 'url(#rootGrad)' : 'url(#noteGrad)'}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  className="filter drop-shadow-sm transition-all duration-300"
                />

                {/* Note stem (only top-most note or right side) */}
                {index === sortedNotes.length - 1 && (
                  <line
                    x1={noteX + 6.8}
                    y1={noteY}
                    x2={noteX + 6.8}
                    y2={Math.min(noteY - 36, 40)}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Note breakdown badges below staff */}
      {showLabels && sortedNotes.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-3 border-t border-slate-800/80 w-full">
          {sortedNotes.map((note, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                idx === 0
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                  : 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
              }`}
            >
              <span className="font-bold">{note.pitchClass}</span>
              <span className="text-slate-400 font-normal">({note.solfege})</span>
              {idx === 0 && (
                <span className="ml-0.5 px-1 py-0.2 text-[10px] rounded bg-sky-500/30 text-sky-200">
                  근음
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
